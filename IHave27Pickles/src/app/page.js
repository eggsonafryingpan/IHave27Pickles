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
import Scroll from "./components/Scroll";

import { CanvasProvider } from "./components/CanvasProvider";

export default function Home() {

  //axios failure fix?
  //empty textstring fix
  //text moving around fix

  const [trigger, setTrigger] = useState(0);




  const [textStrings, setTextStrings] = useState([]);
  const mouseRef = useMouse();

  const [works, setWorks] = useState([]);

  const workAnimatingRef = useRef(false);

  const faxref = useRef(null);

  const removeWork = (workId) => {
    setWorks(works.filter(w => w.workId !== workId));
  }

  const addTextString = (x = 100, y = 100, text = [], fontSize = 20) => {
    setTextStrings(prev => [...prev, { x: x, y: y, text: text, fontSize: fontSize, id: crypto.randomUUID() }]);
  }

  //saving for export
  const textListRef = useRef([]);

  const clearTextString = (clearIdList) => {
    setTextStrings(textStrings.filter(ts => !clearIdList.includes(ts.id)))
    textListRef.current = textListRef.current.filter(ts => !clearIdList.includes(ts.id))
  }

  // console.log(textListRef.current)


  const removeFromList = (id) => {
    textListRef.current = textListRef.current.filter(ts => ts.id !== id);
    setTextStrings(textStrings.filter(ts => ts.id !== id));
  }

  const updateList = (arr, id) => {
    const mapped = arr.map(a => ({
      x: a.curr.x,
      y: a.curr.y,
      letter: a.letter,
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
    getRandomWork().then(res => {
      printWork()
    })
  }, []);

  function createWork(data) {

    setWorks([...works, { x: window.innerWidth * 0.03, y: -130, workId: data.workId, letterList: data.letterList, question: data.question }])
  }

  const printWork = () => {
    if (workAnimatingRef.current) {
      return;
    }
    getRandomWork().then(res => {
      if (works.some(w => w.workId === res.workId)) {
        printWork();
        return;
      }
      createWork(res);
      // console.log(res);
      setTrigger(trigger + 1);
    })
  }




  return (
    <div className="crt">
      <div className="screen">

        <CanvasProvider>
          <Scroll />
          {textStrings.map(ts => <TextString updateList={updateList} removeFromList={removeFromList} key={ts.id} x={ts.x} y={ts.y} text={ts.text} fontSize={ts.fontSize} id={ts.id} ></TextString>)}
          <div className="cover">
            <button className="print" onClick={printWork}>Print</button>
          </div>
          {works.map(w => <Work x={w.x} y={w.y} key={w.workId} letterList={w.letterList} question={w.question} trigger={trigger} removeWork={removeWork} id={w.workId} workAnimatingRef={workAnimatingRef} faxref={faxref}></Work>)}
          <div className="container">
            <div className="fax" ref={faxref}>
            </div>

            <Draw textListRef={textListRef} clearTextString={clearTextString}>
            </Draw>
            <WikiScreen textStrings={textStrings} addTextString={addTextString} />
          </div>
        </CanvasProvider>

      </div>
    </div>
  );
}
