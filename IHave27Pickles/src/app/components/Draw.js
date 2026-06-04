import React from 'react'
import { Vector } from '../lib/Vector';
import { useMouse } from './MouseProvider';
import { insertWork } from '../lib/db/works';
import { useRef, useEffect, useState } from 'react';

const Draw = ({ textListRef }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
    const mouseRef = useMouse();


    useEffect(() => {
        const handleResize = () => {
            const rect = ref.current.getBoundingClientRect();
            setPos({
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            });
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // const flattenTextStrings = () => {
    //     const flatten = textStrings.map((ts => {

    //     }))
    // }
    const isBetween = (num, bound1, bound2) => {
        return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2)
    };



    const confirmWork = () => {
        console.log(pos.left, pos.right)
        console.log("jlsfd", textListRef.current)
        const filteredList = textListRef.current
            .map(s =>
                s.filter(p =>
                    isBetween(p.x, pos.left, pos.right) &&
                    isBetween(p.y, pos.top, pos.bottom)
                )
            )
            .filter(s => s.length > 0);

        const relTextList = filteredList.map((s) => (
            s.map(p => (
                {
                    ...p,
                    x: p.x - pos.left,
                    y: p.y - pos.top,
                }
            ))
        ))
        console.log(filteredList)
        // insertWork(relTextList.current);
    }


    return (
        <div>
            <button onClick={confirmWork}>Insert Work</button>
            <div ref={ref} className="draw"></div>
        </div>
    )
}

export default Draw