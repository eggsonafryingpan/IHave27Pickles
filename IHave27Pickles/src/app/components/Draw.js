import React from 'react'
import { Vector } from '../lib/Vector';
import { useMouse } from './MouseProvider';
import { insertWork } from '../lib/db/works';
import { useRef, useEffect, useState } from 'react';
import bin from '../assets/bin.png';
import Image from "next/image";

const Draw = ({ textListRef, clearTextString }) => {
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

    const isBetween = (num, bound1, bound2) => {
        return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2)
    };

    const confirmWork = () => {
        const filteredList = textListRef.current
            .map(ts =>
            (
                {
                    id: ts.id,
                    points: ts.points.filter(p =>
                        isBetween(p.x, pos.left, pos.right) &&
                        isBetween(p.y, pos.top, pos.bottom)
                    )
                }
            )

            )
            .filter(ts => ts.points.length > 0);

        const relTextList = filteredList.map(ts =>
            ts.points.map(p => ({
                ...p,
                x: p.x - pos.left,
                y: p.y - pos.top,
            }))
        );

        insertWork(relTextList);

        const clearIdList = filteredList.map(ts => ts.id);
        clearTextString(clearIdList);
    };


    return (
        <div>
            <button onClick={confirmWork}>Insert Work</button>
            <Image src={bin} alt='bin' id='bin'></Image>
            <div ref={ref} className="draw"></div>
        </div>
    )
}

export default Draw