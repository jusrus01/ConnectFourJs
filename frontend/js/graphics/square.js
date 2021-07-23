import { Utils } from '../utils/utils.js';

export class Square {
    constructor(pos, color, size) {
        this.pos = pos;
        this.color = color;
        this.size = size;

        this.isDrawn = false;
        this.lastPos = this.pos;
    }    

    draw(ctx) {
        if((this.isDrawn && !Utils.arePositionsEqual(this.pos, this.lastPos)) || !this.isDrawn) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
            this.lastPos = this.pos;

        }
    }
}