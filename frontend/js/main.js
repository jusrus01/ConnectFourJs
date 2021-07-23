import { InputHandler } from "./handlers/inputHandler.js";
import { StateHandler, states } from "./handlers/stateHandler.js";
import { DataService } from "./services/dataService.js";
import { Renderer } from "./graphics/renderer.js";
import { Board } from "./models/board.js";
import { playerOneColor, playerTwoColor } from "./config/config.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Game {
    constructor() {
        this.board = new Board(''); // game board

        this.player = 0; // defines whether player is defined as player1 or player2
        this.id = '';
        this.partnerId = ''; // unique id used to connect to clients with each other
        
        this.color = ''; // square color

        this.running = true; // game state

        this.inputHandler = new InputHandler(canvas);
        this.stateHandler = new StateHandler();
        this.renderer = new Renderer(ctx);

        this.dataService = new DataService();

        // keeping track of score
        this.score = 0;
        this.foeScore = 0;

        // connecting to server
        this.dataService.connect(this.update);

        // hide retry button
        this.renderer.hideRetryBtn();
    }

    update = (event) => {
        const values = JSON.parse(event.data.replace(/&quot;/ig,'"'));

        if(values.BoardState) {
            this.board.overrideBoard(values.BoardState);
            // this.renderer.drawBoard(this.board.get());

            this.stateHandler.setState(states.Turn);
        }

        if(values.Id) {
            this.id = values.Id;
            this.renderer.showId(this.id);
        }

        if(values.PartnerId) {
            this.partnerId = values.PartnerId;
            this.renderer.hideInputHolder();
        }
        
        // set color based on your turn
        if(values.Player) {
            this.player = values.Player;
            if(this.player == 1) {
                this.stateHandler.setState(states.Turn);
                this.color = playerOneColor;
            } else if(this.player == 2) {
                this.stateHandler.setState(states.Wait);
                this.color = playerTwoColor;
            }
        }
    }

    run() {
        // checking if someone won/lost/tied
        if(!this.stateHandler.currentState != states.Disconnected) {
            let playerWon = this.board.isMatch();
            if(playerWon > 0 && playerWon != 0) {
                if(playerWon == this.player) {
                    this.stateHandler.setState(states.Win);
                    
                } else { 
                    this.stateHandler.setState(states.Lost);
                }
            } else if(playerWon == 0) {
                this.stateHandler.setState(states.Tie);
            }
        }

        switch(this.stateHandler.currentState) {
            case states.Disconnected:
                this.score = 0;
                this.foeScore = 0;

                this.renderer.setStatus('Disconnected');
                this.renderer.addBackground();
                this.renderer.addGrid();
                break;

            case states.Turn:
                
                this.renderer.setStatus("Waiting for your turn...");

                if(this.inputHandler.listening) {

                    let pos = this.inputHandler.input;
                    // position was set
                    if(pos != null) {

                        let finalY = this.inputHandler.findFinalY(pos.x, this.board.get());

                        if(finalY >= 0) {

                            // this.renderer.addCircle({ x: pos.x, y: finalY }, this.color);
    
                            this.board.set(pos.x, finalY, this.player);
    
                            this.dataService.sendMessage({
                                "BoardState" : this.board.get(),
                                "PartnerId" : this.partnerId
                            });

                            this.inputHandler.clear();
                            this.stateHandler.setState(states.Wait);
                        }
                    }
                } else {
                    this.inputHandler.listen();
                }
                break;

            case states.Tie:
                this.score++;
                this.foeScore++;
                this.renderer.setScore(this.score, this.foeScore);

                this.renderer.setStatus("Tied.");

                this.renderer.drawTie();
                this.stateHandler.setState(states.None);
                break;

            case states.Win:
                this.score++;
                this.renderer.setScore(this.score, this.foeScore);

                this.renderer.setStatus("You won!");
                this.renderer.drawWin();
                this.stateHandler.setState(states.None);
                break;

            case states.Lost:
                this.foeScore++;
                this.renderer.setScore(this.score, this.foeScore);

                this.renderer.setStatus("You lost!");

                this.renderer.drawLost();
                this.stateHandler.setState(states.None);
                break;

            case states.Wait:
                this.renderer.setStatus("Waiting for your friend's turn...");

                this.inputHandler.stopListening();
                this.inputHandler.clear();
                break;

            case states.None:
                // might be wrong
                this.renderer.addBackground();
                this.renderer.addGrid();
                this.board.overrideBoard('');
                this.renderer.showRetryBtn();
                break;
            default:
                break;
        }

        // temp
        if(this.stateHandler.currentState !== states.None) {
            this.renderer.hideRetryBtn();
        }

        this.renderer.addBackground();
        this.renderer.addGrid();

        this.renderer.addAreaHighlight(this.inputHandler.mousePos);
        this.renderer.drawBoard(this.board.get());
        this.renderer.draw();
    }
}

// temp
const partnerIdInput = document.getElementById("partnerId");

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();

    // temp
    const btn = document.getElementById("partnerIdBtn");
    btn.addEventListener('click', () => {
        const value = partnerIdInput.value;

        game.dataService.sendMessage({
            "PartnerId": value
        });

        partnerIdInput.value = '';
    });

    // temp
    const retryBtn = document.getElementById("retryBtn");
    retryBtn.addEventListener('click', () => {

        if(game.stateHandler.currentState == states.None) {
            game.dataService.sendMessage({
                "PartnerId": game.partnerId,
                "Retry" : true
            });
            game.renderer.hideRetryBtn();
        }
    });

    window.main = function() {
        window.requestAnimationFrame(main);
        game.run();
    }
    main();
});
