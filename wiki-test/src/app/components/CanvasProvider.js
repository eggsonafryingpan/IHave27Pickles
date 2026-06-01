"use client";

import {
    useEffect, useRef, createContext,
    useContext,
} from "react";

const CanvasContext = createContext();

export function CanvasProvider({ children }) {
    const canvasRef = useRef(null);

    const renderList = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let animationFrame;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            renderList.current.forEach(draw => {
                draw(ctx);
            });

            animationFrame = requestAnimationFrame(render);
        }

        render();

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    function addRender(draw) {
        renderList.current.push(draw);

        return () => {
            renderList.current = renderList.current.filter(d => d !== draw);
        }
    }
    return (
        <CanvasContext.Provider value={addRender}>
            <canvas ref={canvasRef} id="canvas" width="900" height="1000"></canvas>
            {children}
        </CanvasContext.Provider>
    )
}

export function useCanvas(draw) {
    const addRender = useContext(CanvasContext);

    useEffect(() => {
        return addRender(draw);
    }, [draw]);
}
