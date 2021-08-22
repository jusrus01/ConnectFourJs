import { cellCountInCol, cellCountInRow } from "../config/config.js";

export class InputHandler {
    constructor(canvas) {
        this.listening = false;
        this.input = null;
        this.mousePos = null;
        this.rect = canvas.getBoundingClientRect();
        this.canvas = canvas;
        this.defaultTileSize = parseInt(this.canvas.clientWidth / cellCountInRow);

        this.canvas.addEventListener('click', (event) => {

            if(this.listening) {

                this.input = {
                    x: Math.trunc((event.clientX - this.rect.left) / this.defaultTileSize),
                    y: Math.trunc((event.clientY - this.rect.top) / this.defaultTileSize)
                };
                
                this.listening = false;
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = {
                x: Math.trunc((event.clientX - this.rect.left) / this.defaultTileSize),
                y: Math.trunc((event.clientY - this.rect.top) / this.defaultTileSize)
            };
        });

        this.canvas.addEventListener("mouseleave", () => {
            this.mousePos = null;
        });


        window.onresize = () => {
            this.rect = canvas.getBoundingClientRect();
            this.defaultTileSize = parseInt(this.canvas.clientWidth / cellCountInRow);
        }
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

        if(x != null) {
            for(let i = cellCountInCol - 1; i >= 0; i--) {
                if(boardState[i * cellCountInRow + x] == '0') {
                    return i;
                }
            }
        }
        return -1;
    }
}