import { Utils } from "../utils/utils.js";

export class Circle {
    constructor(pos, color, size) {
        this.pos = pos;
        this.color = color;
        this.size = size;

        this.isDrawn = false;
        this.lastPos = this.pos;
        this.padding = 2;

        this.circle = new Path2D();
        this.halfSize = this.size / 2;
        this.r = 2 * Math.PI;
    }

    draw(ctx) {
        if((this.isDrawn && !Utils.arePositionsEqual(this.pos, this.lastPos)) || !this.isDrawn) {
            ctx.fillStyle = this.color;

            this.circle.arc(this.pos.x + this.halfSize, this.pos.y + this.halfSize, this.halfSize - this.padding, 0, this.r);

            ctx.fill(this.circle);

            this.lastPos = this.pos;
        }
    }
}