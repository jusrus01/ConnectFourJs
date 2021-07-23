import { cellCountInCol, cellCountInRow, tileSize } from "../config/config.js";

export class InputHandler {
    constructor(canvas) {
        this.listening = false;
        this.input = null;
        this.mousePos = null;
        this.rect = canvas.getBoundingClientRect();

        canvas.addEventListener('click', (event) => {

            if(this.listening) {

                this.input = {
                    x: Math.trunc((event.clientX - this.rect.left) / tileSize),
                    y: Math.trunc((event.clientY - this.rect.top) / tileSize)
                };
                
                this.listening = false;
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            this.mousePos = {
                x: Math.trunc((event.clientX - this.rect.left) / tileSize),
                y: Math.trunc((event.clientY - this.rect.top) / tileSize)
            };
        });

        canvas.addEventListener("mouseleave", () => {
            this.mousePos = null;
        })
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