import { Square } from "./square.js";
import { canvasHeight, canvasWidth, cellCountInCol, cellCountInRow, tileSize } from "../config/config.js";

// NOTE: can just make this not update unmodified values
export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;

        this.items = [];
    }

    draw() {
        this.items.forEach(item => item.draw(this.ctx));
    }

    addItem(square) {
        this.items.push(square);
    }

    addSquare(pos, color) {
        this.items.push(new Square({ x: pos.x * tileSize, y: pos.y * tileSize }, color, tileSize));
    }
    
    addBackground() {
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    drawBoard(boardState, cellsCount) {

        this.items = [];

        let y = 0;
        let x = 0;

        let color = 0;

        let counter = 0;

        for(let i = 1; i < cellsCount + 1; i++) {

            if(counter == 7) {
                y += tileSize;
                x = 0;
                counter = 0;
            }

            switch(boardState[i - 1]) {
                case '1':
                    color = 'yellow';
                    break;

                case '2':
                    color = 'red';
                    break;

                case '0':
                    x += tileSize;
                    counter++;
                    continue;

                default:
                    break;
            }
            // this is not a smart way to do things...
            this.addItem(new Square({ x: x, y: y }, color, tileSize));

            x += tileSize;
            counter++;
        }
    }

    addGrid(color = 'red') {

        for(let x = 0; x < cellCountInRow; x++) {
            this.ctx.moveTo(x * tileSize, 0);
            this.ctx.lineTo(x * tileSize, canvasHeight);
        }

        for(let y = 0; y < cellCountInCol; y++) {
            this.ctx.moveTo(0, y * tileSize);
            this.ctx.lineTo(canvasWidth, y * tileSize);
        }
        
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();
    }

    drawWin() {
        let msg = document.createElement('p');
        msg.innerText = "You won!";

        document.getElementById("info").appendChild(msg);
    }

    drawLost() {
        let msg = document.createElement('p');
        msg.innerText = "You lost :(";

        document.getElementById("info").appendChild(msg);
    }

    showId(id) {
        let msg = document.createElement('p');
        msg.innerText = "Share this id with a friend: " + id;

        document.getElementById("info").appendChild(msg);
    }

    drawTie() {
        let msg = document.createElement('p');
        msg.innerText = "Tied. Better luck next time!";

        document.getElementById("info").appendChild(msg);
    }
}