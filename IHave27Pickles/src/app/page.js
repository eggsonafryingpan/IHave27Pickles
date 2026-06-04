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
import Work from "./components/Work";



export default function Home() {

  //link overflow -overflow in general
  //empty textstring fix
  //text moving around fix


  const [textStrings, setTextStrings] = useState([]);
  const mouseRef = useMouse();

  const [works, setWorks] = useState([]);

  const addTextString = (x = 100, y = 100, text = [], fontSize = 20) => {
    setTextStrings(prev => [...prev, { x: x, y: y, text: text, fontSize: fontSize, id: crypto.randomUUID() }]);
  }

  //saving for export
  const textListRef = useRef([]);

  const clearTextString = (clearIdList) => {
    setTextStrings(textStrings.filter(ts => !clearIdList.includes(ts.id)))
  }

  const removeFromList = (id) => {
    textListRef.current = textListRef.current.filter((ts) => ts.id !== id);
    setTextStrings(textStrings.filter(ts => ts.id !== id));
  }

  const updateList = (arr, id) => {
    const mapped = arr.map(a => ({
      x: a.curr.x,
      y: a.curr.y,
      letter: a.letter
    }));

    const index = textListRef.current.findIndex(item => item.id === id);

    if (index === -1) {
      textListRef.current.push({
        id,
        points: mapped
      });
    } else {
      textListRef.current[index].points = mapped;
    }
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
    let data;
    getRandomWork().then(res => {

      //ADD THE WORK TO A USEREF ARRAY WITH ID PLZPLZPZLPZL
      //MAKE A NEW COMPONENT TOO
      createWork(res);
    })
  }, []);

  function createWork(data) {
    setWorks([...works, { x: 0, y: 0, workId: data.workId, letterList: data.letterList }])
  }




  return (

    <div className="screen">
      {textStrings.map(ts => <TextString updateList={updateList} removeFromList={removeFromList} key={ts.id} x={ts.x} y={ts.y} text={ts.text} fontSize={ts.fontSize} id={ts.id} ></TextString>)}
      {works.map(w => <Work x={w.x} y={w.y} key={w.workId} letterList={w.letterList}></Work>)}
      <div className="container">
        <div className="fax">
        </div>
        <Draw textListRef={textListRef} clearTextString={clearTextString}>
          Draw
        </Draw>
        <WikiScreen textStrings={textStrings} addTextString={addTextString} />
      </div>
    </div>
  );
}
