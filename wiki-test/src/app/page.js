"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { CanvasProvider } from "./components/CanvasProvider";
import TextString from "./components/TextString";
import {
  useEffect, useRef, useState, createContext,
  useContext,
} from "react";
import { useMouse } from "./components/MouseProvider";
import blockSelect from "./lib/blockSelect";
import WikiScreen from "./components/WikiScreen";
import axios from "axios";



export default function Home() {


  const [textStrings, setTextStrings] = useState([]);

  const addTextString = (x = 100, y = 100, text = [], fontSize = 20) => {
    setTextStrings(prev => [...prev, { x: x, y: y, text: text, fontSize: fontSize, id: crypto.randomUUID() }]);
  }


  useEffect(() => {
    addTextString(100, 100, [".selkcip", "72      "]);
    // addTextString(300, 300, "RAHAHHAHAH", 20);
  }, []);





  return (
    <div className={styles.page}>
      <CanvasProvider>
        {textStrings.map(ts => <TextString key={ts.id} x={ts.x} y={ts.y} text={ts.text} fontSize={ts.fontSize} ></TextString>)}
        <WikiScreen textStrings={textStrings} addTextString={addTextString}></WikiScreen>
      </CanvasProvider>
    </div>
  );
}
