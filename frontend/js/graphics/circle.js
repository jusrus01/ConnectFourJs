import { Utils } from "../utils/utils.js";

export class Circle {
    constructor(pos, color, size) {
        this.pos = pos;
        this.color = color;
        this.size = size;

        this.isDrawn = false;
        this.lastPos = this.pos;
        this.padding = 2;
    }

    draw(ctx) {
        if(this.isDrawn && !Utils.arePositionsEqual(this.pos, this.lastPos)) {
            ctx.fillStyle = this.color;

            // creating circle
            let circle = new Path2D();
            let halfSize = this.size / 2;
            circle.arc(this.pos.x + halfSize, this.pos.y + halfSize, halfSize - this.padding, 0, 2 * Math.PI)

            ctx.fill(circle);

            this.lastPos = this.pos;

        } else if(!this.isDrawn) {
            ctx.fillStyle = this.color;

            // creating circle
            let circle = new Path2D();
            let halfSize = this.size / 2;
            circle.arc(this.pos.x + halfSize, this.pos.y + halfSize, halfSize - this.padding, 0, 2 * Math.PI)
            
            ctx.fill(circle);

            this.isDrawn = true;
        }
    }
}