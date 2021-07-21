import { cellCountInCol, cellCountInRow } from "../config/config.js";

export class Board {
    constructor(boardState) {
        this.board = boardState;
        this.lastBoard = this.board.slice();
    }

    set(x, y, state) {

        if(x < 0 || x > cellCountInRow || y < 0 || y > cellCountInRow) {
            console.assert("Failed to set new cell in board");
            return;
        }

        let index = y * cellCountInRow + x;

        this.board = this.board.substring(0, index) +
            state.toString() + this.board.substring(index + 1, this.board.length);
    }

    getAt(x, y) {

        if(x < 0 || x > cellCountInRow || y < 0 || y > cellCountInRow) {
            console.assert("Failed to get cell in board");
            return -1;
        }

        return this.board.charAt(y * cellCountInRow + x);
    }

    get() {
        return this.board;
    }

    overrideBoard(newBoardState) {
        this.board = newBoardState;
    }

    checkWiningPositions(x, y, player) {
        
        let str = player.toString();
        // checking vertical
        if(
            this.getAt(x, y) === str && this.getAt(x, y + 1) === str &&
            this.getAt(x, y + 2) === str && this.getAt(x, y + 3) === str
        ) {
            return player;
        } 
        // checking horizontal
        else if(
            this.getAt(x, y) === str && this.getAt(x + 1, y) === str &&
            this.getAt(x + 2, y) === str && this.getAt(x + 3, y) === str
        ) {
            return player;
        } 
        // checking left to right diagonal
        else if(
            this.getAt(x, y) === str && this.getAt(x + 1, y + 1) === str &&
            this.getAt(x + 2, y + 2) === str && this.getAt(x + 3, y + 3) === str
        ) {
            return player;
        }
        // checking right to left diagonal
        else if(
            this.getAt(x, y) === str && this.getAt(x - 1, y + 1) === str &&
            this.getAt(x - 2, y + 2) === str && this.getAt(x - 3, y + 3) === str
        ) {
            return player;
        } else {
            return -1;
        }
    }

    isMatch() {
        // check if we already checked win/lose/tie state
        if(this.board == this.lastBoard) {
            return -1;
        }
        // copy the board we are checking
        this.lastBoard = this.board.slice();

        let tie = true;
        let x = 0, y = 1;

        for(let i = 0; i < cellCountInRow * cellCountInCol; i++) {

            if(this.getAt(x, y) === '0' && tie) {
                tie = false;
            }

            if(this.checkWiningPositions(x, y, 1) != -1) {
                return 1;
            } else if(this.checkWiningPositions(x, y, 2) != -1) {
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