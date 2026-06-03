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
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;

            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

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
            <canvas ref={canvasRef} id="canvas"></canvas>
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
