import { Vector } from "./Vector";

export class Point {
    constructor(x, y, letter) {
        this.prev = new Vector(x, y);
        this.curr = new Vector(x, y);
        this.isLocked = false;
        this.isDragging = false;
        this.friction = 0.90;
        this.letter = letter;
        this.WIND = 0;
        this.GRAVITY = 0;
    }

    getLetter() {
        return this.letter;
    }

    getX() {
        return this.curr.x;
    }

    getY() {
        return this.curr.y;
    }

    update() {
        if (this.isLocked || this.isDragging) {
            return;
        }

        //apply velocity  
        let prevSaved = this.curr.clone();
        let vel = new Vector(this.curr.x - this.prev.x, this.curr.y - this.prev.y);
        const newVectGravity = new Vector(0, this.GRAVITY);
        const newVectWind = new Vector(Math.random() * this.WIND, 0);
        vel.add(newVectGravity);
        vel.add(newVectWind);

        this.prev = prevSaved;
        this.curr = this.curr.getAdd(vel);
        this.applyFriction();


        // if (this.curr.x < 0) {
        //     this.curr.x = 110;
        // } else if (this.curr.x > 800) {
        //     this.curr.x = 780;
        // } else if (this.curr.y < 0) {
        //     this.curr.y = 10;
        // } else if (this.curr.y > 800) {
        //     this.curr.y = 780;
        // }

        // if (this.curr.x < 0) {
        //     this.curr.x = 10;
        // } else if (this.curr.x > 800) {
        //     this.curr.x = 780;
        // } else if (this.curr.y < 0) {
        //     this.curr.y = 10;
        // } else if (this.curr.y > 800) {
        //     this.curr.y = 780;
        // }

    }

    applyFriction() {
        this.curr = new Vector(
            this.mix(this.curr.x, this.prev.x, this.friction),
            this.mix(this.curr.y, this.prev.y, this.friction),
        )
    }

    mix(x, y, a) {
        return y * a + x * (1 - a);
    }

}