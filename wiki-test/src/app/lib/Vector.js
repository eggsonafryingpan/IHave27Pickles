
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    add(v) {
        this.x = v.x + this.x;
        this.y = v.y + this.y;
        return this;
    }

    normalize() {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = this.x / mag;
            this.y = this.y / mag;
        }
        return this;
    }

    scale(s) {
        this.x = s * this.x;
        this.y = s * this.y;
        return this;
    }

    getScale(s) {
        return new Vector(this.x * s, this.y * s);
    }


    getAdd(v) {
        return new Vector(v.x + this.x, v.y + this.y);
    }

    getSubtract(v) {
        return new Vector(v.x - this.x, v.y - this.y);
    }

    getDot(v) {
        return v.x * this.x + v.y * this.y;

    }

    getMultiply(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    }

    //just return new norm vector
    getNorm() {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag == 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / mag, this.y / mag);
    }


    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    getLength() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    getDist(v) {
        return this.getSubtract(v).getLength();
    }
}