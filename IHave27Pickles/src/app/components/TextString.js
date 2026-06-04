"use client"
import { useMouse } from "./MouseProvider";
import { useEffect, useRef, useState } from "react";
import { Connection } from "../lib/Connection";
import { Vector } from "../lib/Vector";
import { Point } from "../lib/Point";
import { useCanvas } from "./CanvasProvider";

const TextString = ({ x, y, text, pointsLength, spread = 12, fontSize = 20, updateList }) => {
    // const numPoints = pointsLength ?? text.length;
    // let sentence = text;//CHANGE


    //     export const getClosest = () => {
    //     let closest = null;
    //     let minDistance = Infinity;
    //     for (const ts of textStrings) {
    //         const tsV = new Vector(ts.x, ts.y);
    //         const dist = tsV.getDist(new Vector(mouseRef.current.x, mouseRef.current.y))

    //         if (dist < minDistance) {
    //             minDistance = distance;
    //             closest = ts;
    //         }
    //     }
    //     return closest;
    // }
    const mouseRef = useMouse();
    let mouse = mouseRef.current;

    const makePoints = () => {
        // for (let i = 0; i < numPoints; i++) {
        //     arr.push(new Point(x + i * spread, y, ' '));
        // }
        const height = text.length;
        const width = text[0].length;
        let arr = [];
        if (height === 1) { //one line horizontal
            for (let i = 0; i < width; i++) {
                arr.push(new Point(x + i * spread, y, text[0][i]));
            }
        } else if (width === 1) { // one line vertical
            for (let i = 0; i < height; i++) {
                arr.push(new Point(x, y + i * fontSize, text[i][0]));
            }
        } else if (height > width) {
            for (let i = 0; i < width; i++) {
                if (i % 2 === 0) {
                    for (let j = 0; j < height; j++) {
                        arr.push(new Point(x + i * spread, y + j * fontSize, text[j][i]));

                    }
                } else {
                    for (let j = height - 1; j >= 0; j--) {
                        arr.push(new Point(x + i * spread, y + j * fontSize, text[j][i]));

                    }
                }
            }
            //  1  6
            //  2  5
            //  3  4
        } else if (width >= height) {
            // 1 2 3
            // 6 5 4
            for (let j = 0; j < height; j++) {
                if (j % 2 === 0) {
                    for (let i = 0; i < width; i++) {
                        arr.push(new Point(x + i * spread, y + j * fontSize, text[j][i]));
                    }
                } else {
                    for (let i = width - 1; i >= 0; i--) {
                        arr.push(new Point(x + i * spread, y + j * fontSize, text[j][i]));
                    }
                }
            }
        }
        updateList(arr);
        return arr;
    }





    const pointsRef = useRef(null);
    if (pointsRef.current === null) {
        pointsRef.current = makePoints();
    }
    let points = pointsRef.current;

    const makeConnections = () => {
        let connections = [];
        for (let i = 0; i < points.length - 1; i++) {
            connections.push(new Connection(points[i], points[i + 1]));
        }
        return connections;
    }

    const connectionsRef = useRef(null);
    if (connectionsRef.current === null) {
        connectionsRef.current = makeConnections();
    }
    let connections = connectionsRef.current;

    //TODO
    // const getClosest = () => {
    //     let minP = points[0];
    //     points.forEach(p => {
    //         if (p.curr.getDist(mouse) < minP.curr.getDist(mouse)) {
    //             minP = p;
    //         }
    //     });
    //     return minP;
    // }

    const isInline = () => {
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i].curr.x > points[i + 1].curr.x) {
                return false;
            }
            if (Math.abs(points[i].curr.y - points[i + 1].curr.y) > 20) {
                return false;
            }
        }
        return true;
    }

    //always check for isInline
    const makeInline = (spread = 20) => {
        let anchorX = points[0].curr.x;
        let anchorY = points.reduce((sum, p) => { return sum + p.curr.y; }, 0) / points.length;

        for (let i = 0; i < points.length; i++) {
            let end = new Vector(anchorX + i * spread, anchorY);
            let mid = points[i].curr.getAdd((points[i].curr.getSubtract(end)).getScale(0.2)); //speed of correction
            points[i].curr = mid > 0.01 ? mid : mid;
            points[i].prev = points[i].curr.clone(); //cancel vel
        }
    }


    //unused


    useCanvas((ctx) => {
        let mouseV = new Vector(mouse.x, mouse.y);

        ctx.font = `${fontSize}px Courier New`;
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.textAlign = "center";

        const circle = (x, y, radius) => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "grey";
            ctx.fill();
        }

        // if (isInline()) {
        //     makeInline();
        // }

        //Dragging logic
        // console.log(points[0].curr.getDist(mouseV) < 100);
        if (!mouse.isDragging && mouse.isDown && points[0].curr.getDist(mouseV) < 50) {
            points[0].isDragging = true;
            mouse.isDragging = true;
        } else if (!mouse.isDown) {
            points[0].isDragging = false;
            mouse.isDragging = false;
        }

        //first point
        points.forEach(p => {
            if (p.isDragging) {
                p.curr = new Vector(mouse.x, mouse.y);
                p.prev = new Vector(mouse.x, mouse.y);
            }
        });

        //physics
        const iterationCount = 15;
        for (let n = 0; n < iterationCount; n++) {
            for (let i = 0; i < connections.length; i++) {
                let p1 = connections[i].p1;
                let p2 = connections[i].p2;
                let p1Pos = p1.curr;
                let p2Pos = p2.curr;

                let delta = p1Pos.getSubtract(p2Pos);
                let dist = delta.getLength();
                if (dist < 0.01) continue;

                let dir = delta.normalize();

                let diff = connections[i].getLength() - dist;

                let correction = dir.getScale(diff * 0.5);
                correction = correction.getScale(1 - connections[i].give);
                // correction = correction.getScale(0.5);
                if (!p2.isLocked && !p2.isDragging) {
                    connections[i].p2.curr.add(correction);
                }
            }
        }

        for (let i = 0; i < points.length; i++) {
            points[i].update();
        }



        points.forEach((p, index) => {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.strokeText(p.getLetter(), p.curr.x, p.curr.y);
            ctx.fillText(p.getLetter(), p.curr.x, p.curr.y);
            if (index === 0) {
                circle(p.curr.x, p.curr.y - 15, 3);
            }
        });
        updateList(points);

        //text styling


        //connections.forEach((c, index) => {

        //unused
        // ctx.beginPath();
        // ctx.moveTo(c.p1.curr.x, c.p1.curr.y);
        // ctx.lineTo(c.p2.curr.x, c.p2.curr.y);
        // ctx.lineWidth = 2;
        // ctx.stroke();
        //});
    });
}

export default TextString;