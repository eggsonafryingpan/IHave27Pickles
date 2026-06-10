import React from 'react'
import { Vector } from '../lib/Vector';
import { useMouse } from './MouseProvider';
import { insertWork } from '../lib/db/works';
import { useRef, useEffect, useState } from 'react';
import bin from '../assets/bin.png';
import Image from "next/image";
import { getRandomQuestion } from '../lib/db/getRandomQuestion';
import { load } from 'cheerio';

const Draw = ({ textListRef, clearTextString }) => {
    const ref = useRef(null);
    const [pos, setPos] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
    const mouseRef = useMouse();
    const [question, setQuestion] = useState({ question: "", id: null });
    const [loadingStep, setLoadingStep] = useState(false);
    const timerRef = useRef(null);


    useEffect(() => {
        getRandomQuestion().then(res => {
            setQuestion(res);
        })
    }, [])


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

        setLoadingStep(1);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

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



        const clearIdList = filteredList.map(ts => ts.id);
        clearTextString(clearIdList);

        insertWork(relTextList, question.id);
        getRandomQuestion().then(res => {
            setQuestion(res);
        })






        timerRef.current = setTimeout(() => {
            setLoadingStep(2);

            timerRef.current = setTimeout(() => {
                setLoadingStep(3);
                timerRef.current = setTimeout(() => {
                    setLoadingStep(null);
                }, 700);
            }, 700);

        }, 700);
    };


    return (
        <div>
            <div className='top-bar'>

                <Image src={bin} alt='bin' id='bin'></Image>
            </div>
            <div ref={ref} className="draw">
                {loadingStep === 1 && <h3 className='draw-loading'>Evaluating...</h3>}
                {loadingStep === 2 && <h3 className='draw-loading' >Sending...</h3>}
                {loadingStep === 3 && <h3 className='draw-loading'>Submitted</h3>}
                {!loadingStep && question && <>
                    <h3 className='draw-question'>{question.question}</h3>
                    <div className='lines'></div>
                </>
                }
            </div>

            <div className='bottom-bar'><button className='insert' onClick={confirmWork}>Submit</button></div>

        </div>
    )
}

export default Draw