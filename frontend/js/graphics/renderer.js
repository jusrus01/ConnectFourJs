import { Square } from "./square.js";
import {
    canvasHeight,
    canvasWidth,
    cellCountInCol,
    cellCountInRow,
    playerOneColor,
    playerTwoColor,
    tileSize,
} from "../config/config.js";
import { Circle } from "./circle.js";

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;

        this.items = [];
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    draw() {
        this.items.forEach((item) => item.draw(this.ctx));
    }

    addItem(square) {
        this.items.push(square);
    }

    addSquare(pos, color) {
        this.items.push(
            new Square(
                { x: pos.x * tileSize, y: pos.y * tileSize },
                color,
                tileSize
            )
        );
    }

    addCircle(pos, color) {
        this.items.push(
            new Circle(
                { x: pos.x * tileSize, y: pos.y * tileSize },
                color,
                tileSize
            )
        );
    }

    addBackground() {
        this.ctx.fillStyle = "#E2EAE6";
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    drawBoard(boardState) {
        this.items = [];

        if (boardState === "" || boardState == undefined) {
            return;
        }

        let y = 0;
        let x = 0;

        let color = 0;

        let counter = 0;

        for (let i = 1; i < cellCountInRow * cellCountInCol + 1; i++) {
            if (counter == cellCountInRow) {
                y += tileSize;
                x = 0;
                counter = 0;
            }

            switch (boardState[i - 1]) {
                case "1":
                    color = playerOneColor;
                    break;

                case "2":
                    color = playerTwoColor;
                    break;

                case "0":
                    x += tileSize;
                    counter++;
                    continue;

                default:
                    break;
            }

            this.addItem(new Circle({ x: x, y: y }, color, tileSize));

            x += tileSize;
            counter++;
        }
    }

    addGrid(color = "#2C272E") {
        this.ctx.beginPath();

        for (let x = 0; x < cellCountInRow; x++) {
            this.ctx.moveTo(x * tileSize, 0);
            this.ctx.lineTo(x * tileSize, canvasHeight);
        }

        for (let y = 0; y < cellCountInCol; y++) {
            this.ctx.moveTo(0, y * tileSize);
            this.ctx.lineTo(canvasWidth, y * tileSize);
        }

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    showId(id) {
        let msg = document.createElement("p");
        msg.innerHTML =
            "Share this ID with a friend: <span class='id-text'>" +
            id +
            "</span>";

        document.getElementById("info").appendChild(msg);
    }

    setStatus(status) {
        const state = document.getElementById("status");

        if (state.innerText === status) {
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

    showInputHolder() {
        const holder = document.getElementById("inputHolder");
        holder.setAttribute("style", "");
    }

    addAreaHighlight(mousePos) {
        if (mousePos == null) {
            return;
        }

        if (mousePos.x >= 0 && mousePos.x < cellCountInRow) {
            this.ctx.fillStyle = "rgba(44, 39, 46, 0.5)";
            this.ctx.fillRect(mousePos.x * tileSize, 0, tileSize, canvasHeight);
        }
    }
}
