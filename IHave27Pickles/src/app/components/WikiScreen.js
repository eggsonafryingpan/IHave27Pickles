import React from 'react'
import blockSelect from '../lib/blockSelect'
import { useMouse } from './MouseProvider'
import { useRef } from 'react'
import { useCanvas } from './CanvasProvider'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { getRandomWikiTitle } from '../lib/getRandomWiki'

const WikiScreen = ({ textStrings, addTextString }) => {
    const [wikiData, setWikiData] = useState(null);

    const [title, setTitle] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const FONT_WIDTH = 12;
    const FONT_HEIGHT = 20;
    const mouseRef = useMouse();
    const startRef = useRef(null);
    const currRef = useRef(null);
    const selectedRef = useRef(null);

    useEffect(() => {
        if (title) {
            setLoading(true);
            setWikiData(null);
            axios.get("/api/wiki?url=" + encodeURIComponent("https://en.wikipedia.org/api/rest_v1/page/summary/" + title))
                .then(res => {
                    setWikiData(res.data);
                    console.log("Data: ", res.data);
                    setLoading(false);
                });

        }
    }, [title]);

    const getRandom = () => {
        setLoading(true);
        setWikiData(null);
        getRandomWikiTitle().then((res) => {
            const { data, title } = res.data
            setWikiData(data)
            setTitle(title);
            setLoading(false);
        })
    }


    useCanvas((ctx) => {
        if (!startRef.current || !currRef.current || mouseRef.current.isDragging) return;
        const el = document.elementFromPoint(startRef.current.x, startRef.current.y);
        const rect = el.getBoundingClientRect();

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const left = Math.min(startRef.current.x, currRef.current.x);
        const leftCell = Math.floor((left - rect.left) / FONT_WIDTH);
        const top = Math.min(startRef.current.y, currRef.current.y);
        const topCell = Math.floor((top - rect.top) / FONT_HEIGHT);
        const right = Math.max(startRef.current.x, currRef.current.x);
        const rightCell = Math.floor((right - rect.left) / FONT_WIDTH);
        const bottom = Math.max(startRef.current.y, currRef.current.y);
        const bottomCell = Math.floor((bottom - rect.top) / FONT_HEIGHT);
        ctx.strokeRect(
            leftCell * FONT_WIDTH + rect.left,
            topCell * FONT_HEIGHT + rect.top,
            (rightCell - leftCell) * FONT_WIDTH,
            (bottomCell - topCell) * FONT_HEIGHT
        );
        // //get rect
        // const getAligned = (x, y, rect) => {
        //     return { x: Math.floor((x - rect.left) / WIDTH) * WIDTH, y: Math.floor((y - rect.top) / HEIGHT) * HEIGHT };
        // }
        // getAligned(startRef.current.x, startRef.current.y, rect);


    })

    const handleMouseMove = () => {
        if (mouseRef.current.isDragging) {
            startRef.current = null;
            return;
        }
        const select = blockSelect(mouseRef, startRef, currRef);
        if (!startRef.current || !currRef.current) return;
        if (select) {
            selectedRef.current = select;
            const minCorner = { x: Math.min(startRef.current.x, currRef.current.x), y: Math.min(startRef.current.y, currRef.current.y) };
            const maxCorner = { x: Math.max(startRef.current.x, currRef.current.x), y: Math.max(startRef.current.y, currRef.current.y) };
            addTextString(minCorner.x, minCorner.y, selectedRef.current);
            selectedRef.current = null;
            startRef.current = null;
        }
    }

    const handleMouseLeave = () => {
        startRef.current = null;
    }

    return (
        <div className='wiki-screen'>
            <div className='top-bar'><button className='next-button' onClick={getRandom}>Next</button></div>
            {/* <form onSubmit={(e) => {
                e.preventDefault();
                setTitle(newTitle);
            }}>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}></input>
                <button type="submit">Submit</button>
            </form> */}
            {loading && (
                <div>Loading...</div>
            )}

            {wikiData &&
                <div>
                    <h2>{wikiData?.title}</h2>
                    <img src={wikiData?.thumbnail?.source}></img>
                    <br></br>
                    {/* <a href={wikiData?.content_urls?.desktop?.page}>{wikiData?.content_urls?.desktop?.page}</a>} */}

                    <div className='wiki-text' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <p className='wiki-text'>{wikiData?.extract}</p>
                    </div >
                </div>}
        </div >
    )
}

export default WikiScreen


/* <p>The sea is calm tonight.
                    The tide is full, the moon lies fair
                    Upon the straits; on the French coast the light
                    Gleams and is gone; the cliffs of England stand,
                    Glimmering and vast, out in the tranquil bay.
                    Come to the window, sweet is the night-air!
                    Only, from the long line of spray
                    Where the sea meets the moon-blanched land,
                    Listen! you hear the grating roar
                    Of pebbles which the waves draw back, and fling,
                    At their return, up the high strand,
                    Begin, and cease, and then again begin,
                    With tremulous cadence slow, and bring
                    The eternal note of sadness in.
                </p>
                <p>
                    Sophocles long ago
                    Heard it on the Ægean, and it brought
                    Into his mind the turbid ebb and flow
                    Of human misery; we
                    Find also in the sound a thought,
                    Hearing it by this distant northern sea.
                </p>
                <p>
                    The Sea of Faith
                    Was once, too, at the full, and round earth’s shore
                    Lay like the folds of a bright girdle furled.
                    But now I only hear
                    Its melancholy, long, withdrawing roar,
                    Retreating, to the breath
                    Of the night-wind, down the vast edges drear
                    And naked shingles of the world.
                </p>
                <p>
                    Ah, love, let us be true
                    To one another! for the world, which seems
                    To lie before us like a land of dreams,
                    So various, so beautiful, so new,
                    Hath really neither joy, nor love, nor light,
                    Nor certitude, nor peace, nor help for pain;
                    And we are here as on a darkling plain
                    Swept with confused alarms of struggle and flight,
                    Where ignorant armies clash by night.
                </p> */