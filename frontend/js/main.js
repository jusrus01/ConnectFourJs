import { InputHandler } from "./handlers/inputHandler.js";
import { StateHandler, states } from "./handlers/stateHandler.js";
import { DataService } from "./services/dataService.js";
import { Renderer } from "./graphics/renderer.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// game is updateHandler
class Game {
    constructor() {
        this.running = true;

        this.inputHandler = new InputHandler(canvas);
        this.stateHandler = new StateHandler();
        this.dataService = new DataService();
        this.renderer = new Renderer(ctx);
    }

    run() {
        
        switch(this.stateHandler.currentState) {

            case states.Disconnected:
                // cosntruct url
                // wait for connection
                    // if we get connection construct game window


                // temp
                this.stateHandler.currentState = states.Turn;
                this.renderer.addBackground();
                this.renderer.addSquare({x: 12, y: 20}, 'red');
                this.renderer.addGrid();

                this.stateHandler.currentState = states.Turn;
                break;

            case states.Turn:
                // input was processed
                if(!this.inputHandler.listening) {
                    // put piece in
                    let pos = this.inputHandler.input;
                    if(pos != null) {
                        this.renderer.addSquare(pos, 'green');
                        // temp
                        // this.stateHandler.currentState = states.Wait;
                    }
                }

                this.inputHandler.listen();
                break;

            case states.Win:
            case states.Lose:
                // show
                // show retry
                break;

            case states.Wait:
                // should just wait until data service
                // provices another state
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

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();

    // temp
    game.dataService.connect();

    // NOTE: should try to understand what the fuck is going on here lul
    window.main = function() {
        window.requestAnimationFrame(main);
        game.run();
    }
    main();
});