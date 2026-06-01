"use client"

import React from 'react'
import { useMouse } from "../components/MouseProvider";
import { useEffect, useRef, useState } from "react";
import { useCanvas } from "../components/CanvasProvider";

function blockSelect(mouseRef, currRef, startRef) {
    const FONT_SIZE = 15;
    const HEIGHT = 20;
    const WIDTH = 12; // change...

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
                //let selectionStart = getAligned(startRef.current.x, startRef.current.y, rect);
                //let selectionEnd = getAligned(currRef.current.x, currRef.current.y, rect);
                console.log(getCell(startRef.current.x, startRef.current.y, rect),
                    getCell(currRef.current.x, currRef.current.y, rect))
                const selected = getSelection(
                    getTextLines(el),
                    getCell(startRef.current.x, startRef.current.y, rect),
                    getCell(currRef.current.x, currRef.current.y, rect) //+1 for inclusive end
                );

                console.log(selected);

                // drawSelect(selectionStart, selectionEnd);
            }

            startRef.current = null;
        }
    }


    mouseHandle();
}

export default blockSelect;
