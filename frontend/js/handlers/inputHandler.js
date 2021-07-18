import { tileSize } from "../config/config.js";

export class InputHandler {
    constructor(canvas) {
        this.listening = false;
        this.input = null;

        canvas.addEventListener('click', (event) => {

            if(this.listening) {
                console.log(event);

                // process the input (will need to do a lot of checks)
                // will need to calculate the offset later too

                // temp implementation

                // find square in between
                this.input = {
                    x: Math.trunc(event.clientX / tileSize),
                    y: Math.trunc(event.clientY / tileSize)
                };

                // hopefully state will change
                // and we will be on another switch
                // so this would not be hit again
                this.listening = false;
            }
        });
    }

    listen() {
        if(!this.listening) {
            this.listening = true;
        }
    }
}