import { cellCountInRow } from "../config/config.js";

export class Board {
    constructor(boardState) {
        this.board = boardState;
    }

    set(x, y, state) {

        let index = y * cellCountInRow + x;

        if(index > this.board.length) {
            console.assert("Failed to set new state in board.");
            return;
        }

        this.board = this.board.substring(0, index) +
            state.toString() + this.board.substring(index + 1, this.board.length);
    }

    get(x, y) {
        return this.board[index = y * cellCountInRow + x];
    }

    get() {
        return this.board;
    }

    overrideBoard(newBoardState) {
        this.board = newBoardState;
    }
}