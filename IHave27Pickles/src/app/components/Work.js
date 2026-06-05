import React, { useEffect, useState } from 'react'
import { useCanvas } from './CanvasProvider'
import { useRef } from 'react';
const SCALE = 0.7;


const Work = ({ x, y, letterList, question }) => {
    const divRef = useRef(null);
    const [pos, setPos] = useState({ x: x, y: y });

    useCanvas(ctx => {
        // const rect = divRef.current.getBoundingClientRect();
        // if (!rect) return;

        const offsetX = x;
        const offsetY = y;

        ctx.fillStyle = "white";
        // ctx.fillRect(offsetX, offsetY, 600 * SCALE, 500 * SCALE);
        letterList.forEach(p => {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.font = `${20 * SCALE}px Courier New`;
            // ctx.strokeText(p.getLetter(), p.curr.x, p.curr.y);
            ctx.fillText(p.letter, offsetX + p.x * SCALE, offsetY + p.y * SCALE);
        });
    })

    return (
        <>
            <div className="work" ref={divRef} style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: 600 * SCALE,
                height: 500 * SCALE
            }}>
                {question && <h3>{question}</h3>}
                <div className='lines'>
                </div>
            </div>
        </>
    )
}

export default Work