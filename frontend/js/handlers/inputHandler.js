import { cellCountInCol, cellCountInRow, tileSize } from "../config/config.js";

export class InputHandler {
    constructor(canvas) {
        this.listening = false;
        this.input = null;

        canvas.addEventListener('click', (event) => {

            if(this.listening) {

                this.input = {
                    x: Math.trunc(event.clientX / tileSize),
                    y: Math.trunc(event.clientY / tileSize)
                };

                this.listening = false;
            }
        });
    }

    clear() {
        this.input = null;
    }

    stopListening() {
        if(this.listening) {
            this.listening = false;
        }
    }

    listen() {
        if(!this.listening) {
            this.listening = true;
        }
    }

    findFinalY(x, boardState) {

        for(let i = cellCountInCol - 1; i >= 0; i--) {
            if(boardState[i * cellCountInRow + x] == '0') {
                return i;
            }
        }
        return -1;
    }
}