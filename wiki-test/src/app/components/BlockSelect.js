"use client"

import React from 'react'
import { useMouse } from "./MouseProvider";
import { useEffect, useRef, useState } from "react";
import { useCanvas } from "./CanvasProvider";

const BlockSelect = () => {
    const FONT_SIZE = 14;

    const mouseRef = useMouse();
    let mouse = mouseRef.current;

    const mStartRef = useRef(null);
    let mStart = mStartRef.current;
    const mCurrRef = useRef(null);
    let mCurr = mCurrRef.current;

    const linesRef = useRef([]);
    let lines = linesRef.current;

    useEffect(() => {




        // const prevTopRef = useRef(null);
        // const prevTop = prevTopRef.current;



        const el = document.elementFromPoint(mCurr.x, mCurr.y);

        if (mouse.isDown) {
            if (mStart === null) {
                if (el && el.textContent.trim().length > 0) {
                    mStart = { x: mouse.x, y: mouse.y };
                }
            }
            mCurr = { x: mouse.x, y: mouse.y };
        } else { //mouse up
            if (mStart) {
                const textNode = el.childNodes.find(n => n.nodeType === 3);
                const text = textNode.textContent;
                const elRect = el.getBoundingClientRect();
                const elTop = elRect.top;

                //seperate element
                let currLine = "";
                for (let i = 0; i < text.length - 1; i++) {
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    range.setStart(el, i);
                    range.setEnd(el, i + 1);

                    const currTop = range.getBoundingClientRects().top;
                    if (Math.abs(currTop - elTop) > 1) {
                        lines.push(currLine);
                        currLine = "";
                    }
                    currLine += text[i];
                }

                //selected rect relative to text grid
                //INCLUSIVE
                const startI = { x: Math.round((mStart.x - elRect.left) / FONT_SIZE), y: Math.round((mStart.y - elRect.top) / FONT_SIZE) };
                const endI = { x: Math.round((mCurr.x - elRect.left) / FONT_SIZE) - 1, y: Math.round((mCurr.y - elRect.top) / FONT_SIZE) - 1 };

                if (startI.x < 0 || startI.y < 0 || endI.x < 0 || endI.y < 0) {
                    return;
                }

                const isBetween = (num, bound1, bound2) => {
                    return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2);
                };

                let selectedText = "";

                for (let i = 0; i < lines.length; i++) {
                    for (let j = 0; j < Math.max(...lines.map(line => line.length)); j++) {
                        //j = x    i = y
                        if (isBetween(j, startI.x, endI.x) && isBetween(i, startI.y, endI.y)) {
                            if (j >= lines[i].length) {
                                selectedText += " ";
                            } else {
                                selectedText += lines[i][j];
                            }
                        }
                    }
                }

                console.log("lines ", lines);
                console.log("selectedText ", selectedText);



                // const range = document.createRange();
                // range.selectNodeContents(el);

                // const rects = range.getBoundingClientRects();

                // rects.top



            }
            mStart = null;
        }
    }, [mouse])





    return (<></>);
}

//.top



// useCanvas((ctx) => {

// })



export default BlockSelect