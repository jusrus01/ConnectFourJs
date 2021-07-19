import { cellCountInCol, cellCountInRow, tileSize } from "../config/config.js";

export class Board {
    constructor(boardState) {
        this.board = boardState;
        this.lastBoard = this.board.slice();
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

    getAt(x, y) {
        let index = y * cellCountInRow + x;

        if(index > this.board.length || x > cellCountInRow || x < 0 || y > cellCountInRow || y < 0) {
            return -1;
        }

        return this.board.charAt(index);
    }

    get() {
        return this.board;
    }

    overrideBoard(newBoardState) {
        this.board = newBoardState;
    }

    isMatch() {
        // check if we already check win/lose/tie state
        if(this.board == this.lastBoard) {
            return -1;
        }

        this.lastBoard = this.board.slice();

        let tie = true;

        // check
        let x = 0, y = 0;
        for(let i = 0; i < cellCountInRow * cellCountInCol; i++) {


            if(this.getAt(x, y) === '0' && tie) {
                tie = false;
            }
            // console.log({x: x, y: y});
            // check vertical
            if(
                this.getAt(x, y) === '1' && this.getAt(x, y + 1) === '1' &&
                this.getAt(x, y + 2) === '1' && this.getAt(x, y + 3) === '1'
            ) {
                return 1;
            }

            if(
                this.getAt(x, y) === '2' && this.getAt(x, y + 1) === '2' &&
                this.getAt(x, y + 2) === '2' && this.getAt(x, y + 3) === '2'
            ) {
                return 2;
            }

            // check horizontal
            if(
                this.getAt(x, y) === '1' && this.getAt(x + 1, y) === '1' &&
                this.getAt(x + 2, y) === '1' && this.getAt(x + 3, y) === '1'
            ) {
                return 1;
            }

            console.log("Horizontal, ", this.getAt(x, y), this.getAt(x + 1, y),
            this.getAt(x + 2, y), this.getAt(x + 3, y));

            if(
                this.getAt(x, y) === '2' && this.getAt(x + 1, y) === '2' &&
                this.getAt(x + 2, y) === '2' && this.getAt(x + 3, y) === '2'
            ) {
                return 2;
            }

            // check left to right
            if(
                this.getAt(x, y) === '1' && this.getAt(x + 1, y + 1) === '1' &&
                this.getAt(x + 2, y + 2) === '1' && this.getAt(x + 3, y + 3) === '1'
            ) {
                return 1;
            }

            if(
                this.getAt(x, y) === '2' && this.getAt(x + 1, y + 1) === '2' &&
                this.getAt(x + 2, y + 2) === '2' && this.getAt(x + 3, y + 3) === '2'
            ) {
                return 2;
            }

            // check right to left
            if(
                this.getAt(x, y) === '1' && this.getAt(x - 1, y + 1) === '1' &&
                this.getAt(x - 2, y + 2) === '1' && this.getAt(x - 3, y + 3) === '1'
            ) {
                return 1;
            }

            if(
                this.getAt(x, y) === '2' && this.getAt(x - 1, y + 1) === '2' &&
                this.getAt(x - 2, y + 2) === '2' && this.getAt(x - 3, y + 3) === '2'
            ) {
                return 2;
            }

            if(x + 1 > cellCountInRow) {
                x = 0;
                y++;
            } else {
                x++;
            }
        }
        
        if(tie) {
            return 0;
        }

        return -1;
    }
}