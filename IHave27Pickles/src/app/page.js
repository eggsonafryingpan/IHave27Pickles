"use client";

import Image from "next/image";
import styles from "./page.module.css";
import TextString from "./components/TextString";
import {
  useEffect, useRef, useState, createContext,
  useContext,
} from "react";
import { useMouse } from "./components/MouseProvider";
import blockSelect from "./lib/blockSelect";
import WikiScreen from "./components/WikiScreen";
import axios from "axios";
import { initalizeUser } from "./lib/db/initializeUser";
import { insertWork } from "./lib/db/works";
import { getRandomWork } from "./lib/db/getRandomWork";
import { Vector } from "./lib/Vector";
import Draw from "./components/Draw";



export default function Home() {


  const [textStrings, setTextStrings] = useState([]);
  const mouseRef = useMouse();

  const addTextString = (x = 100, y = 100, text = [], fontSize = 20) => {
    setTextStrings(prev => [...prev, { x: x, y: y, text: text, fontSize: fontSize, id: crypto.randomUUID() }]);
  }

  //saving for export
  const textListRef = useRef([]);

  const updateList = (arr) => {
    textListRef.current = [
      ...textListRef.current,
      arr.map(a => ({
        x: a.curr.x,
        y: a.curr.y,
        letter: a.letter
      }))
    ];
  };

  useEffect(() => {
    addTextString(100, 100, [".selkcip", "72      "]);
    // addTextString(300, 300, "RAHAHHAHAH", 20);
  }, []);

  useEffect(() => {
    updateList
    initalizeUser();
    // insertWork([
    //   [
    //     {
    //       x: 100,
    //       y: 100,
    //       letter: '2',
    //     },
    //     {
    //       x: 120,
    //       y: 100,
    //       letter: '7',
    //     }
    //   ]
    // ])
    getRandomWork().then(res => { console.log(res) });
  }, []);





  return (

    <div className="screen">
      {textStrings.map(ts => <TextString updateList={updateList} key={ts.id} x={ts.x} y={ts.y} text={ts.text} fontSize={ts.fontSize} ></TextString>)}

      <div className="container">
        <div className="fax">
          Fax
        </div>
        <Draw textListRef={textListRef}>
          Draw
        </Draw>
        <WikiScreen textStrings={textStrings} addTextString={addTextString} />
      </div>
    </div>
  );
}
