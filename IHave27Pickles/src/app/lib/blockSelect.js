"use client"

import React from 'react'
import { useMouse } from "../components/MouseProvider";
import { useEffect, useRef, useState } from "react";
import { useCanvas } from "../components/CanvasProvider";
import axios from 'axios';

function blockSelect(mouseRef, currRef, startRef) {
    const FONT_SIZE = 15;
    const HEIGHT = 20;
    const WIDTH = 12; // change...
    let selected;

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

    const isBetween = (num, bound1, bound2) => {
        // if (Math.abs(bound1 - bound2) < 1) {
        //     console.log(bound1, bound2)
        //     return num >= Math.min(bound1, bound2) && num < Math.max(bound1, bound2);

        // }
        return num >= Math.min(bound1, bound2) && num <= Math.max(bound1, bound2)
    };
    const isBetweenExclude = (num, bound1, bound2) => {
        return num >= Math.min(bound1, bound2) && num < Math.max(bound1, bound2)
    };

    const getSelection = (lines, start, end, el) => {
        const textNode = Array.from(el.childNodes).find(n => n.nodeType === 3);
        if (!textNode) return;
        const text = textNode.textContent;
        if (!text) return;

        if (Math.abs(start.y - end.y) > 1) {
            end = { ...end, y: end.y - 1 };
        }

        let clearedText = text.split("");
        let offset = 0;
        let selectedText = [];
        const maxWidth = Math.max(...lines.map(line => line.length));
        for (let i = 0; i < lines.length; i++) {
            let currLine = "";
            for (let j = 0; j < maxWidth; j++) {
                //j = x    i = y
                if (isBetweenExclude(j, start.x, end.x) && isBetween(i, start.y, end.y)) {
                    if (j >= lines[i].length) {
                        currLine += " ";
                    } else {
                        currLine += lines[i][j];
                        if (offset + j < clearedText.length) {
                            clearedText[offset + j] = " ";
                        }
                    }
                }
            }

            offset += lines[i].length;
            if (currLine.length > 0) {
                selectedText.push(currLine);
            }
        }

        el.textContent = clearedText.join("");
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
                const el = document.elementFromPoint(startRef.current.x, startRef.current.y);
                const rect = el.getBoundingClientRect();
                let selectionEnd;
                //edge correction for 1 line
                if (Math.abs(startRef.current.y - currRef.current.y) < (2 * HEIGHT)) {
                    selectionEnd = getCell(currRef.current.x, currRef.current.y, rect);
                    selectionEnd = { ...selectionEnd, y: selectionEnd.y - 1 };
                    console.log(selectionEnd)
                } else {
                    selectionEnd = getCell(currRef.current.x, currRef.current.y, rect);
                }
                let selectionStart = getCell(startRef.current.x, startRef.current.y, rect);


                selected = getSelection(
                    getTextLines(el),
                    selectionStart,
                    selectionEnd,
                    el
                );
                if (!selected) return null;
                selected = selected.filter(s => s.length !== 0);
                if (selected.length === 0) return null;

                // //remove leading blank lines
                // for (let i = 0; i < selected.length; i++) {
                //     if (selected[i].trim().length !== 0) {
                //         break;
                //     } else {
                //         selected.splice(i, 1);
                //     }
                // }
                console.log(selected);
                return selected;
            }

            startRef.current = null;
        }
    }


    if (mouseHandle()) {
        if (selected.length === 0) return;
        return selected;
    }
}

export default blockSelect;
