"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { CanvasProvider } from "./components/CanvasProvider";
import TextString from "./components/TextString";
import { MouseProvider } from "./components/MouseProvider";
import {
  useEffect, useRef, useState, createContext,
  useContext,
} from "react";
import { useMouse } from "./components/MouseProvider";
import BlockSelect from "./components/BlockSelect";



export default function Home() {

  const [wikiData, setWikiData] = useState(null);

  //temp for testing
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [textStrings, setTextStrings] = useState([]);

  const addTextString = (x = 100, y = 100, text = "", fontSize = 20) => {
    setTextStrings(prev => [...prev, { x: x, y: y, text: text, fontSize: fontSize, id: crypto.randomUUID() }]);
  }

  useEffect(() => {
    if (title) {
      fetch("/api/wiki?url=" + encodeURIComponent("https://en.wikipedia.org/api/rest_v1/page/summary/" + title))
        .then(r => r.json())
        .then(data => {
          setWikiData(data);
          console.log("Data: ", data);
        });
    }
  }, [title]);

  useEffect(() => {
    addTextString(100, 100, ".selkcip 72 evah I", 30);
    addTextString(300, 300, "RAHAHHAHAH", 20);
  }, []);





  return (
    <div className={styles.page}>
      <MouseProvider>
        <CanvasProvider>
          {textStrings.map(ts => <TextString key={ts.id} x={ts.x} y={ts.y} text={ts.text} fontSize={ts.fontSize} ></TextString>)}
        </CanvasProvider>


        <form onSubmit={(e) => {
          e.preventDefault();
          setTitle(newTitle);
        }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}></input>
          <button type="submit">Submit</button>
        </form>
        <img src={wikiData?.thumbnail?.source}></img>
        <br></br>
        {wikiData && <a href={wikiData?.content_urls?.desktop?.page}>{wikiData?.content_urls?.desktop?.page}</a>}
        <p>{wikiData?.extract}</p>
        <BlockSelect />
      </MouseProvider>
    </div>
  );
}
