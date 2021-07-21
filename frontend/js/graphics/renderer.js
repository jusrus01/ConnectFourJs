import { Square } from "./square.js";
import { canvasHeight, canvasWidth, cellCountInCol, cellCountInRow, tileSize } from "../config/config.js";
import { states } from "../handlers/stateHandler.js";

// NOTE: can just make this not update unmodified values
// when animating drop down
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

    drawBoard(boardState) {

        this.items = [];

        let y = 0;
        let x = 0;

        let color = 0;

        let counter = 0;

        for(let i = 1; i < cellCountInRow * cellCountInCol + 1; i++) {

            if(counter == cellCountInRow) {
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
        // let msg = document.createElement('p');
        // msg.innerText = "You won!";

        // document.getElementById("info").appendChild(msg);
    }

    drawLost() {
        // let msg = document.createElement('p');
        // msg.innerText = "You lost :(";

        // document.getElementById("info").appendChild(msg);
    }

    showId(id) {
        let msg = document.createElement('p');
        msg.innerHTML = "Share this id with a friend: <span class='id-text'>" +
            id + "</span>";

        document.getElementById("info").appendChild(msg);
    }

    drawTie() {
        // let msg = document.createElement('p');
        // msg.innerText = "Tied. Better luck next time!";

        // document.getElementById("info").appendChild(msg);
    }

    setStatus(status) {

        const state = document.getElementById("status");

        if(state.innerText === status) {
            return;
        }

        state.innerText = status;
    }

    setScore(score, foeScore) {
        document.getElementById("myScore").innerText = score;
        document.getElementById("foeScore").innerText = foeScore;
    }

    showRetryBtn() {
        const retryBtn = document.getElementById("retryBtn");
        retryBtn.setAttribute("style", "visibility: visible;");
    }

    hideRetryBtn() {
        const retryBtn = document.getElementById("retryBtn");
        retryBtn.setAttribute("style", "visibility: hidden;");
    }

    hideInputHolder() {
        const holder = document.getElementById("inputHolder");
        holder.setAttribute("style", "visibility: hidden;");
    }
}