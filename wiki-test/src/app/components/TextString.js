"use client"
import { useMouse } from "./MouseProvider";
import { useEffect, useRef, useState } from "react";
import { Connection } from "../lib/Connection";
import { Vector } from "../lib/Vector";
import { Point } from "../lib/Point";
import { useCanvas } from "./CanvasProvider";

const TextString = ({ x, y, text = "", pointsLength, spread = 20, fontSize = 20, direction = "down" }) => {
    const numPoints = pointsLength ?? text.length;
    let sentence = text;

    const mouseRef = useMouse();
    let mouse = mouseRef.current;


    const makePoints = () => {
        let arr = [];
        switch (direction) {
            case "down":
                for (let i = 0; i < numPoints; i++) {
                    arr = [...arr, new Point(x + i * spread, y)];
                }
                break;
            //add direction TODO
            default:
                for (let i = 0; i < numPoints; i++) {
                    arr = [...arr, new Point(x + i * spread, y)];
                }
        }

        return arr;
    }





    const pointsRef = useRef(makePoints());
    let points = pointsRef.current;

    const makeConnections = () => {
        let connections = [];
        for (let i = 0; i < points.length - 1; i++) {
            connections.push(new Connection(points[i], points[i + 1]));
        }
        return connections;
    }

    const connectionsRef = useRef(makeConnections());
    let connections = connectionsRef.current;

    const getClosest = () => {
        let minP = points[0];
        points.forEach(p => {
            if (p.curr.getDist(mouseV) < minP.curr.getDist(mouseV)) {
                minP = p;
            }
        });
        return minP;
    }

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
    // const circle = (x, y, radius) => {
    //     ctx.beginPath();
    //     ctx.arc(x, y, radius, 0, 2 * Math.PI);
    //     ctx.fillStyle = "black";
    //     ctx.fill();
    // }

    useCanvas((ctx) => {
        let mouseV = new Vector(mouse.x, mouse.y);

        ctx.font = `${fontSize}px Arial`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";

        if (isInline()) {
            makeInline();
        }

        //Dragging logic
        // console.log(points[0].curr.getDist(mouseV) < 100);
        if (mouse.isDown && points[0].curr.getDist(mouseV) < 100) {
            points[0].isDragging = true;
        } else if (!mouse.isDown) {
            points[0].isDragging = false;
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
            //   circle(p.getX(), p.getY(), 4);
            ctx.fillText(sentence[index % sentence.length], p.curr.x, p.curr.y);
        });

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