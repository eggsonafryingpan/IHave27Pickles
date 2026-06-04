"use client";

import { useEffect, useRef } from "react";

export function useMouse() {
    const mouse = useRef({ x: 0, y: 0, isDown: false });

    useEffect(() => {
        const updateMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        }
        const updateMouseDown = () => {
            mouse.current.isDown = true;
        }
        const updateMouseUp = () => {
            mouse.current.isDown = false;
        }
        window.addEventListener("pointermove", updateMouseMove);
        window.addEventListener("pointerdown", updateMouseDown);
        window.addEventListener("pointerup", updateMouseUp);

        return () => {
            window.removeEventListener("pointermove", updateMouseMove);
            window.removeEventListener("pointerdown", updateMouseDown);
            window.removeEventListener("pointerup", updateMouseUp);
        }
    }, []);

    return mouse;
}