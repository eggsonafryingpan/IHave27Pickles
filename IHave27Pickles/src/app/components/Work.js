import React, { useEffect } from 'react'
import { useCanvas } from './CanvasProvider'

const Work = ({ x, y, letterList }) => {
    const SCALE = 0.7;
    useCanvas(ctx => {
        ctx.fillStyle = "grey";

        const offsetX = x;
        const offsetY = y;

        // Draw filled rectangle
        ctx.fillRect(x, y, 600 * SCALE, 500 * SCALE);
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
        <></>
    )
}

export default Work