"use client"

import React from 'react'
import { useMouse } from "../components/MouseProvider";
import { useEffect, useRef, useState } from "react";
import { useCanvas } from "../components/CanvasProvider";

function blockSelect(mouseRef, currRef, startRef) {
    const FONT_SIZE = 15;
    const HEIGHT = 18;
    const WIDTH = 9; // change...

    const getCell = (x, y, rect) => {
        return { x: Math.floor((x - rect.left) / WIDTH), y: Math.floor((y - rect.top) / HEIGHT) };
    }

    const getAligned = (x, y, rect) => {
        return { x: Math.floor(x - rect.left), y: Math.floor(y - rect.top) };
    }

    const getTextLines = (el) => {
        const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
        if (!textNode) return [];
        const text = textNode.textContent;
        if (!text) return [];
        const lines = [];

        let currLine = "";
        const range = document.createRange();

        let prevTop = null;

        for (let i = 0; i < text.length; i++) {
            range.setStart(textNode, i);
            range.setEnd(textNode, i + 1);

            const rect = range.getBoundingClientRect();
            const currTop = rect.top;

            if (prevTop === null) prevTop = currTop;

            if (Math.abs(currTop - prevTop) > 0.5) {
                lines.push(currLine);
                currLine = "";
                prevTop = currTop;
            }
            currLine += text[i];
        }
        if (currLine.length > 0) {
            lines.push(currLine);
        }
        return lines;
    }

    const getSelection = (lines, start, end) => {
        const isBetween = (num, bound1, bound2) => {
            return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2);
        };
        let selectedText = "";

        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < Math.max(...lines.map(line => line.length)); j++) {
                //j = x    i = y
                if (isBetween(j, start.x, end.x) && isBetween(i, start.y, end.y)) {
                    if (j >= lines[i].length) {
                        selectedText += " ";
                    } else {
                        selectedText += lines[i][j];
                    }
                }
            }
        }
        return selectedText;
    }

    const drawSelect = (x, y) => {
        //TODO
        console.log(x, y);
        useCanvas((ctx) => {
            ctx.strokeRect(x, y, width, height);
        })
    }

    const mouseHandle = () => {
        if (!mouseRef.current) return;
        const mouse = mouseRef.current;

        if (mouse.isDown) {
            if (!startRef.current) {
                startRef.current = { x: mouse.x, y: mouse.y };
            }
            currRef.current = { x: mouse.x, y: mouse.y };
        } else {
            if (startRef.current && currRef.current && !mouse.isDown) {
                console.log(startRef.current, currRef.current)
                const el = document.elementFromPoint(startRef.current.x, startRef.current.y);
                console.log(el);
                const rect = el.getBoundingClientRect();
                let selectionStart = getAligned(startRef.current.x, startRef.current.y, rect);
                let selectionEnd = getAligned(currRef.current.x, currRef.current.y, rect);
                console.log(getCell(startRef.current.x, startRef.current.y, rect),
                    getCell(currRef.current.x, currRef.current.y, rect))
                const selected = getSelection(
                    getTextLines(el),
                    getCell(startRef.current.x, startRef.current.y, rect),
                    getCell(currRef.current.x, currRef.current.y, rect) //+1 for inclusive end
                );

                console.log(selected);

                drawSelect(selectionStart, selectionEnd);
            }

            startRef.current = null;
        }
    }


    mouseHandle();
}

export default blockSelect;










// const lines = [];

// let currentTop = null;
// let currentLine = [];

// for (let i = 0; i < text.length; i++) {
//   range.setStart(textNode, i);
//   range.setEnd(textNode, i + 1);

//   const rect = range.getBoundingClientRect();

//   if (currentTop === null) currentTop = rect.top;

//   if (Math.abs(rect.top - currentTop) > 1) {
//     lines.push(currentLine.join(""));
//     currentLine = [];
//     currentTop = rect.top;
//   }

//   currentLine.push(text[i]);
// }

// lines.push(currentLine.join(""));


// // const prevTopRef = useRef(null);
// // const prevTop = prevTopRef.current;
// if (!mouse) return;
// if (!mCurr.current) return;
// const el = document.elementFromPoint(mCurr.current.x, mCurr.current.y);

// if (mouse.isDown) {
//     if (mStart.current === null) {
//         if (el && el.textContent.trim().length > 0) {
//             mStart.current = { x: mouse.x, y: mouse.y };
//         }
//     }
//     mCurr.current = { x: mouse.x, y: mouse.y };
// } else { //mouse up
//     if (mStart.current) {
//         const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
//         const text = textNode.textContent;
//         const elRect = el.getBoundingClientRect();
//         const elTop = elRect.top;

//         //seperate element
//         let currLine = "";
//         for (let i = 0; i < text.length - 1; i++) {
//             const range = document.createRange();
//             range.selectNodeContents(el);
//             range.setStart(textNode, i);
//             range.setEnd(textNode, i + 1);

//             const currTop = range.getBoundingClientRects().top;
//             if (Math.abs(currTop - elTop) > 1) {
//                 lines.current.push(currLine);
//                 currLine = "";
//             }
//             currLine += text[i];
//         }

//         //selected rect relative to text grid
//         //INCLUSIVE
//         const startI = { x: Math.round((mStart.current.x - elRect.left) / FONT_SIZE), y: Math.round((mStart.current.y - elRect.top) / FONT_SIZE) };
//         const endI = { x: Math.round((mCurr.current.x - elRect.left) / FONT_SIZE) - 1, y: Math.round((mCurr.current.y - elRect.top) / FONT_SIZE) - 1 };

//         if (startI.x < 0 || startI.y < 0 || endI.x < 0 || endI.y < 0) {
//             return;
//         }

//         const isBetween = (num, bound1, bound2) => {
//             return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2);
//         };

//         let selectedText = "";

//         for (let i = 0; i < lines.current.length; i++) {
//             for (let j = 0; j < Math.max(...lines.current.map(line => line.length)); j++) {
//                 //j = x    i = y
//                 if (isBetween(j, startI.x, endI.x) && isBetween(i, startI.y, endI.y)) {
//                     if (j >= lines.current[i].length) {
//                         selectedText += " ";
//                     } else {
//                         selectedText += lines.current[i][j];
//                     }
//                 }
//             }
//         }

//         console.log("lines.current ", lines.current);
//         console.log("selectedText ", selectedText);



//         // const range = document.createRange();
//         // range.selectNodeContents(el);

//         // const rects = range.getBoundingClientRects();

//         // rects.top



//     }
//     mStart.current = null;
//     lines.current = [];
// }