import React, { useEffect, useState } from 'react'
import { useCanvas } from './CanvasProvider'
import { useRef } from 'react';




const Work = ({ x, y, letterList, question, trigger, removeWork, id, workAnimatingRef, faxref }) => {
    let SCALE = 0.62;
    // let faxWidth = faxref.current.offsetWidth;
    // SCALE = 0.62 * (faxWidth / 400);

    // useEffect(() => {
    //     const faxWidth = faxref.current.offsetWidth;
    //     SCALE = 0.62 * (faxWidth / 400);
    //     console.log('sdflkj');
    // }, [faxref])


    const divRef = useRef(null);
    const [pos, setPos] = useState({ x: x, y: y });
    const animRef = useRef(null);

    useEffect(() => {
        if (trigger === 0) {
            return;
        }
        anim();
    }, [trigger])

    function anim() {
        workAnimatingRef.current = true;
        const targetY = pos.y + 500 * SCALE;

        function frame() {

            setPos(prev => {
                workAnimatingRef.current = true;
                const newY = prev.y + 4;

                if (prev.y > window.innerHeight) {
                    cancelAnimationFrame(animRef.current);
                    removeWork(id);
                    return prev;
                }

                if (newY >= targetY) {
                    workAnimatingRef.current = false;
                    cancelAnimationFrame(animRef.current);
                    return { ...prev, y: targetY }
                }

                return { ...prev, y: newY };
            })

            animRef.current = requestAnimationFrame(frame);
        }

        cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(frame);
    }

    useCanvas(ctx => {
        // const rect = divRef.current.getBoundingClientRect();
        // if (!rect) return;

        const offsetX = pos.x;
        const offsetY = pos.y;

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
                {question && <h3 className='work-title'>{question}</h3>}
                <div className='lines'>
                </div>
            </div>
        </>
    )
}

export default Work