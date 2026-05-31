import React from 'react'
import { Vector } from './Vector';
import { Point } from './Point';

export class Connection {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.give = 0.3;
        this.length = Math.sqrt((this.p2.curr.x - this.p1.curr.x) ** 2 + (this.p2.curr.y - this.p1.curr.y) ** 2);

    }

    getCenter() {
        return this.p1.curr.getAdd(this.p2.curr).getScale(0.5);
    }
    getLength() {
        return this.length;
    }

    getAngle() {
        let connectVector = this.p2.curr.getSubtract(this.p1.curr);
        return connectVector.getAngle();
    }

}