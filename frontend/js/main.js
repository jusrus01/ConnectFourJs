import { InputHandler } from "./handlers/inputHandler.js";
import { StateHandler, states } from "./handlers/stateHandler.js";
import { DataService } from "./services/dataService.js";
import { Renderer } from "./graphics/renderer.js";
import { Board } from "./models/board.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// game is updateHandler
class Game {
    constructor() {
        // this.boardState = '';
        this.board = new Board('');
        this.player = 0;
        this.partnerId = '';

        this.running = true;
        this.color = 'green';

        this.inputHandler = new InputHandler(canvas);
        this.stateHandler = new StateHandler();
        this.renderer = new Renderer(ctx);

        this.dataService = new DataService();
        // connect to server
        this.dataService.connect(this.update);
    }

    update = (event) => {
        console.log("Received data ", event.data);

        const values = JSON.parse(event.data.replace(/&quot;/ig,'"'));

        if(values.BoardState) {
            this.board.overrideBoard(values.BoardState);
            this.renderer.drawBoard(this.board.get(), 64);
            this.stateHandler.currentState = states.Turn;
            console.log("Received board state, allowing turn");
        }

        if(values.PartnerId) {
            this.partnerId = values.PartnerId;
        }
        
        if(values.Player) {
            this.player = values.Player;
            if(this.player == 1) {
                this.stateHandler.currentState = states.Turn;
                this.color = "yellow";
                // console.log("State switched to Turn");
            } else if(this.player == 2) {
                this.stateHandler.currentState = states.Wait;
                this.color = "red";
                // console.log("State switched to Wait");
            }
        }
    }

    run() {
        
        console.log("Current state: ", this.stateHandler.currentState);
            
        switch(this.stateHandler.currentState) {
            case states.Disconnected:
                this.renderer.addBackground();
                this.renderer.addGrid();
                break;

            case states.Turn:
                // input was processed
                if(this.inputHandler.listening) {
                    // put piece in
                    let pos = this.inputHandler.input;
                    console.log("Position received from inputHandler: ", pos);
                    if(pos != null) {
                        let finalY = this.inputHandler.findFinalY(pos.x, this.board.get());

                        if(finalY >= 0) {
                            let finalPos = {
                                x: pos.x,
                                y: finalY
                            }
    
                            this.renderer.addSquare(finalPos, this.color);
    
                            // this.boardState[(pos.x + 1) * (pos.y + 1)] = this.player.toString();
                            
                            // 8 -> cel count
                            this.board.set(pos.x, finalY, this.player);
    
                            this.dataService.sendMessage({
                                "BoardState" : this.board.get(),
                                "PartnerId" : this.partnerId
                            });
                            this.inputHandler.input = null;
    
                            this.stateHandler.currentState = states.Wait;
                            console.log("Sending state and changing state to Wait");
                        }
                    }
                } else {
                    this.inputHandler.listen();
                    console.log("Input handler started to listen...");
                }
                break;

            case states.Win:
            case states.Lose:
                // show
                // show retry
                break;

            case states.Wait:
                // should just wait until data service
                // provices another state
                this.inputHandler.listening = false;
                this.inputHandler.input = null;
            default:
                break;
        }
        
        this.renderer.draw();

        // check state
        // listen for input
        // update values while checking state ? 
        // render
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
    });


    window.main = function() {
        window.requestAnimationFrame(main);
        game.run();
    }
    main();
});
