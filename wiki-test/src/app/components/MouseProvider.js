"use client";

import {
    useEffect, useRef, createContext,
    useContext,
} from "react";

const MouseContext = createContext(null);

export function MouseProvider({ children }) {
    const mouseRef = useRef({
        x: 0,
        y: 0,
        isDown: false,
        isDragging: false,
    });

    useEffect(() => {
        const updateMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        }
        const updateMouseDown = () => {
            mouseRef.current.isDown = true;
        }
        const updateMouseUp = () => {
            mouseRef.current.isDown = false;
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

    return (
        <MouseContext.Provider value={mouseRef}>
            {children}
        </MouseContext.Provider>
    )
}

export function useMouse() {
    return useContext(MouseContext);
}
