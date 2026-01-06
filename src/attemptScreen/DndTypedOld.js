import React, { useState, useRef, useContext, useMemo, useEffect } from "react";
import { SWATheam } from "../../constant";

const converIntoMathJax = (data) => {
  return <span dangerouslySetInnerHTML={{ __html: data ?? "" }} />;
};

const styles = {
  qNumber: { fontWeight: "bold", width: "30px", color: SWATheam.SwaBlack },
  container2: { display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, position: "sticky", top: "5px" },
  item: { margin: 0, zIndex: 9999 },
  draggable: {
    padding: "6px 10px",
    margin: 3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#979494ff",
    backgroundColor: "#fff",
    borderRadius: 5,
    cursor: "grab",
    display: "inline-flex",
    alignItems: "center",
  },

  optImg: { maxWidth: 130, height: 80, objectFit: "contain" },
};

export default function DND({ dratNDropQues, currentIndex, qNumber, siteUrls, setDropedData }) {

  const tagsStyles = useMemo(
    () => ({
      body: { fontSize: 15, color: SWATheam.SwaBlack },
      p: { fontSize: 15, color: SWATheam.SwaBlack },
      u: { textDecorationLine: "underline", textDecorationStyle: "solid" },
    }),
    []
  );

  const width = typeof window !== "undefined" ? window.innerWidth : 800;

  const questionData = dratNDropQues?.[currentIndex] ?? {};
  const qDataAccordingToSubActType = questionData ? filterDndQData(questionData) : { question: "", options: [] };

  // target texts from original
  const tarGetText_1 = dratNDropQues[currentIndex]?.targetText1;
  const tarGetText_2 = dratNDropQues[currentIndex]?.targetText2;
  const tarGetText_3 = dratNDropQues[currentIndex]?.targetText3;
  const tarGetText_4 = dratNDropQues[currentIndex]?.targetText4;
  const tarGetText_5 = dratNDropQues[currentIndex]?.targetText5;
  const tarGetText_6 = dratNDropQues[currentIndex]?.targetText6;
  const tarGetText_7 = dratNDropQues[currentIndex]?.targetText7;
  const tarGetText_8 = dratNDropQues[currentIndex]?.targetText8;

  // droppedItems structure: { [questionIndex]: { droppable1: [], droppable2: [], ... } }
  const [droppedItems, setDroppedItems] = useState({});

  // ensure MathJax typeset when question or droppedItems changes
  useEffect(() => {
    if (window?.MathJax?.Hub) {
      try {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      } catch (e) {
        // ignore
      }
    }
  }, [qDataAccordingToSubActType, currentIndex, droppedItems]);

  // HTML5 drag start
  const onDragStart = (e, payload) => {
    // payload can be string or object
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    // show ghost
    try {
      e.dataTransfer.effectAllowed = "move";
    } catch (err) { }
  };

  const handleDropWeb = (droppableId, index, e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
    // parsed may be { text } or string
    const text = parsed?.text ?? parsed;
    setDroppedItems((prev) => {
      const current = { ...(prev[currentIndex] || {}) };
      const arr = current[droppableId] ? [...current[droppableId]] : [];
      arr[index] = text;
      const next = { ...prev, [currentIndex]: { ...(prev[currentIndex] || {}), [droppableId]: arr } };
      return next;
    });
    // update global dropped data similarly to RN version
    setDropedData?.((prev) => (prev ? [...prev, text] : [text]));
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Render draggable item replaced for web
  const renderDraggableItem = (text) => {
    // console.log({ text })
    if (!text) return null;
    let netext = text.replace(/&sbquo;/g, ",");
    netext = netext.replace(/<MTECHO>/g, "`");
    netext = netext.replace(/<\/MTECHO>/g, "`");

    // check if image file name
    const isImg = typeof netext === "string" && /\.(png|PNG|jpg|JPG|jpeg|gif|web)$/i.test(netext);
    if (isImg) {
      const src = `${dratNDropQues.siteUtls}${dratNDropQues.questions[currentIndex]?.imagePath}${netext}`;
      return (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, { text: `<img src="${src}" style="max-width:130px;height:80px;object-fit:contain;" />` })}
          style={styles.draggable}
        >
          <img src={src} alt="" style={styles.optImg} />
        </div>
      );
    }
    // plain text / html
    return (
      <div draggable onDragStart={(e) => onDragStart(e, { text: netext })} style={styles.draggable}>
        <span style={{ color: SWATheam.SwaBlack }}>{netext}</span>
      </div>
    );
  };

  // Generic function to render a value string containing '__________' placeholders.
  // droppableKey is something like 'droppable1'
  const renderWithDroppables = (value, droppableKey) => {
    if (value == null) return null;
    const parts = String(value).split("__________").map(p => p.trim());
    // console.log({ "trim": parts })

    return parts.map((part, idx) => {
      const isLast = idx === parts.length - 1;
      return (
        <span key={idx} style={{ display: "inline-flex", alignItems: "center" }}>
          {/* Dragable part (HTML) */}
          <span style={{ marginRight: "6px" }}>{converIntoMathJax(part)}</span>

          {/* if not last part, render droppable placeholder */}
          {!isLast && (
            <span
              onDragOver={allowDrop}
              onDrop={(e) => handleDropWeb(droppableKey, idx, e)}
              className="droppable"
            >
              {/* show dropped item if exists */}
              <span style={{ color: SWATheam.SwaBlack }}>
                {droppedItems[currentIndex]?.[droppableKey]?.[idx]
                  ? // if dropped item is HTML string (starts with "<"), render as HTML
                  (droppedItems[currentIndex][droppableKey][idx].startsWith?.("<")
                    ? <span dangerouslySetInnerHTML={{ __html: droppedItems[currentIndex][droppableKey][idx] }} />
                    : <span>{droppedItems[currentIndex][droppableKey][idx]}</span>)
                  : null}
              </span>
            </span>
          )}
        </span>
      );
    });
  };

  /* ---------------------------
     Reuse original formatter functions strings will be rendered using converIntoMathJax
     --------------------------- */

  function isImageName(fileName) {
    if (!fileName) return false;
    return /\.(png|PNG|jpg|JPG|jpeg|gif|web)$/i.test(fileName);
  }

  function filterDndQData(questionDataParam) {
    if (!questionDataParam) return { question: "", options: [] };
    const sid = questionDataParam.subActivityID;
    if (sid === 1) return getDndQuesFormateOne(questionDataParam);
    if (sid === 2) return getDndQuesFormateTwo(questionDataParam);
    if (sid === 3) return getDndQuesFormateThree(questionDataParam);
    if (sid === 4 || sid === 5 || sid === 6) return getDNDFormateFourFiveSix(questionDataParam);
    if (sid === 7) return getDNDFormateSeven(questionDataParam);
    return { question: "", options: [] };
  }

  function getDndQuesFormateOne(DndData) {
    let question = "";
    let options = [];
    let target = [];
    let images = [];
    for (let j = 0; j < 4; j++) {
      let quesPart = DndData[`questionPart${j + 1}`];
      if (quesPart != "" && quesPart != null) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        let imgPart = quesPart.split(".");
        if (imgPart[1] !== undefined && isImageName(quesPart)) {
          let imgPath = `${siteUrls}${DndData.imagePath}${quesPart}`;
          question += `<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:250px;' src='${imgPath}' /></div>`;
        } else {
          question += quesPart;
        }
      } else break;
    }

    for (let i = 0; i < 8; i++) {
      let optionsId = DndData[`optionID${i + 1}`];
      let allDndData = "";
      if (optionsId != 0) {
        let optionsData = DndData[`optionText${i + 1}`] || "";
        optionsData = optionsData.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        let optionsImg = DndData[`optionImage${i + 1}`] || "";

        if (optionsData !== "" && optionsImg !== "") {
          let ext1 = optionsData.split(".");
          if (ext1[1] !== undefined && isImageName(optionsData)) {
            let imgPath = `${siteUrls}${DndData.imagePath}${optionsData}`;
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:230px;' src='${imgPath}' /></div>`;
          } else {
            allDndData += optionsData.replace(/#/g, "__________");
          }

          let ext2 = optionsImg.split(".");
          if (ext2[1] !== undefined && isImageName(optionsImg)) {
            let imgPath = `${siteUrls}${DndData.imagePath}${optionsImg}`;
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:230px;' src='${imgPath}' /></div>`;
          } else {
            allDndData += optionsImg.replace(/#/g, "__________");
          }
        } else if (optionsData === "" && optionsImg !== "") {
          let ext2 = optionsImg.split(".");
          if (ext2[1] !== undefined && isImageName(optionsImg)) {
            let imgPath = `${siteUrls}${DndData.imagePath}${optionsImg}`;
            allDndData += `<div style='text-align:center'><img style='height:${DndData.optionImageHight}px; max-width:230px;' src='${imgPath}' /></div>`;
          }
        } else if (optionsData !== "" && optionsImg === "") {
          allDndData += optionsData.replace(/#/g, "__________");
        }
        options.push(allDndData);
      }
    }

    for (let k = 0; k < 8; k++) {
      let targetText = DndData[`targetText${k + 1}`] || "";
      targetText = targetText.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
      if (targetText !== "") {
        if (isImageName(targetText)) {
          let imgPath = `${siteUrls}${DndData.imagePath}${targetText}`;
          target.push(`<div style='text-align:center'><img style='height:${DndData.questionImageHight}px; max-width:250px;' src='${imgPath}' /></div>`);
        } else {
          target.push(targetText);
        }
      } else break;
    }

    for (let l = 0; l < 8; l++) {
      let image = DndData[`optionImage${l + 1}`];
      let optionsId = DndData[`optionID${l + 1}`];
      if (optionsId != 0 && image) {
        let Imagepath = `${siteUrls}${DndData.imagePath}${image}`;
        images.push(Imagepath);
      } else break;
    }

    return { question, options, target, images };
  }

  function getDndQuesFormateTwo(dndData2) {
    let question = "";
    let options = [];
    let targerTXT = [];
    let quesHead = dndData2[`questionHeading`];
    if (quesHead != undefined) {
      quesHead = quesHead.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
      if (quesHead !== "") {
        if (isImageName(quesHead)) {
          question += `&nbsp; &nbsp;<img style=" height:${dndData2["questionImageHight"]}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${quesHead}'/> &nbsp;`;
        } else question += quesHead;
      }
    }
    for (let j = 0; j < 4; j++) {
      let quesPart = dndData2[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        if (quesPart !== "") {
          if (isImageName(quesPart)) {
            question += `&nbsp; &nbsp;<img style=" height:${dndData2["questionImageHight"]}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${quesPart}'/> &nbsp;`;
          } else question += quesPart;
        }
      }
    }

    for (let i = 0; i < 8; i++) {
      let optionsId = dndData2[`optionID${i + 1}`];
      if (optionsId != 0) {
        let targetBlank = (dndData2[`optionText${i + 1}`] || "").replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        let optionImage = dndData2[`optionImage${i + 1}`] || "";
        let finalFillup = "";
        if (targetBlank !== "") finalFillup = targetBlank.replace(/#/g, "__________");
        if (optionImage !== "") {
          finalFillup += `&nbsp; &nbsp;<img style="height:${dndData2["optionImageHight"]}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${optionImage}'/> &nbsp;`;
        }
        options.push(finalFillup);
      }
    }

    let targetText = (dndData2[`answerText`] || "").replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
    if (targetText) {
      const targetPart = targetText.split(",");
      targetPart.forEach((tp) => {
        const trgtArry = tp.split("???");
        trgtArry.forEach((t) => targerTXT.push(t));
      });
    }

    return { question, options, targerTXT };
  }

  function getDndQuesFormateThree(dndData3) {
    let question = "";
    let options = [];
    let targerTXT = [];
    for (let j = 0; j < 4; j++) {
      let quesPart = dndData3[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        if (quesPart !== "") {
          if (isImageName(quesPart)) {
            question += `&nbsp; &nbsp;<img style=" height:${dndData3["questionImageHight"]}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData3["imagePath"]}${quesPart}'/> &nbsp;`;
          } else question += quesPart;
        }
      }
    }

    for (let i = 0; i < 8; i++) {
      let optionsId = dndData3[`optionID${i + 1}`];
      if (optionsId != 0) {
        let targetBlank = (dndData3[`optionText${i + 1}`] || "").replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        let optionImage = dndData3[`optionImage${i + 1}`] || "";
        let finalFillup = "";
        if (targetBlank !== "") finalFillup = targetBlank.replace(/#/g, "__________");
        if (optionImage !== "") {
          finalFillup += `&nbsp; &nbsp;<img style="height:${dndData3["optionImageHight"]}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData3["imagePath"]}${optionImage}'/> &nbsp;`;
        }
        options.push(finalFillup);
      }
    }

    let targetText = (dndData3[`answerText`] || "").replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
    if (targetText) {
      const targetPart = targetText.split(",");
      targetPart.forEach((tp) => {
        const trgtArry = tp.split("???");
        trgtArry.forEach((t) => targerTXT.push(t));
      });
    }

    return { question, options, targerTXT };
  }

  function getDNDFormateFourFiveSix(DndData) {
    let question = "";
    let allData = "";
    let target = [];
    let images = [];
    let options = [];

    for (let j = 0; j < 4; j++) {
      let quesPart = DndData[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        const quesArray = quesPart.split(".");
        if (quesArray != "") {
          if (quesArray[1] != undefined && isImageName(quesPart)) {
            allData += `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px; max-width:250px; margin-top:10px; display: table-cell; vertical-align: middle;" src='${siteUrls}${DndData.imagePath}${quesPart}'/> &nbsp;`;
          } else allData += quesPart;
        }
      }
    }

    const allDataArray = allData.split("???");
    question = (allDataArray[0] || "").trim();

    const arr = question.split("~~");
    if (arr[1] != undefined) {
      question = arr[0] + "<br/>" + `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px;" src='${siteUrls}${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`;
    }

    for (let a = 1; a < allDataArray.length; a++) {
      let data = allDataArray[a];
      let dataArray = "";
      let data1 = data.split("<");
      let data2 = data.split(",");
      let data3 = data.split(">");

      if (data1[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {
        data1.forEach((dnd) => {
          dataArray += dnd.replace(/#/g, "__________");
        });
      } else if (data2[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {
        let len = data2[1].split("#").length;
        for (let i = 0; i <= len; i++) {
          dataArray += data2[i] ? data2[i].replaceAll(/#/g, "") + "__________" + "," : "";
        }
      } else if (data3[1] != undefined && (DndData.subActivityID == 5 || DndData.subActivityID == 6)) {
        data3.forEach((dnd) => {
          dataArray += dnd.replace(/#/, "__________");
        });
      } else {
        dataArray = data.replace(/#/g, "__________");
      }

      let img1 = dataArray.includes(".png") || dataArray.includes(".jpg");
      let optionData = "";
      if (img1) {
        let imagePart = dataArray.split(".");
        if (imagePart[1] != undefined) {
          let imgExt = imagePart[1].substring(0, 3);
          let imagName = imagePart[0] + "." + imgExt;
          let op = imagePart[1].substring(4);
          optionData = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px;" src='${siteUrls}${DndData.imagePath}${imagName.trim()}'/>${op}`;
        }
      } else {
        optionData = dataArray;
      }

      options.push(optionData);
    }

    for (let k = 0; k < 8; k++) {
      let targetText = DndData[`targetText${k + 1}`];
      if (targetText != 0 && targetText != undefined) {
        targetText = targetText.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        target.push(targetText);
      } else break;
    }

    return { question, options, targetTXT: target };
  }

  function getDNDFormateSeven(DndData) {
    let question = "";
    let allData = "";
    let target = [];
    let images = [];
    let options = [];

    for (let j = 0; j < 4; j++) {
      let quesPart = DndData[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        if (quesPart !== "") {
          if (isImageName(quesPart)) {
            allData += `&nbsp; &nbsp;<div style='text-align:center;'><span style='display:flex;'><img style="height:${DndData.question_image_height}px; max-width:250px; margin-top:10px;" src='${siteUrls}${DndData.image_path}${quesPart}'/></span></div> &nbsp;`;
          } else allData += quesPart;
        }
      }
    }

    const allDataArray = allData.split("???");
    question = (allDataArray[0] || "").trim();

    const arr = question.split("~~");
    if (arr[1] != undefined) {
      question = arr[0] + "<br/>" + `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px;" src='${siteUrls}${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`;
    }

    for (let a = 1; a < allDataArray.length; a++) {
      let data = (allDataArray[a] || "").trim();
      let optionDataArray = data.replace(/#/g, "__________");
      let optionData = "";
      let optImage = optionDataArray.includes(".png") || optionDataArray.includes(".jpg") || optionDataArray.includes(".JPG");
      if (optImage) {
        let imagePart = optionDataArray.split(".");
        if (imagePart[1] != undefined) {
          let imgExt = imagePart[1].substring(0, 3);
          let imagName = imagePart[0] + "." + imgExt;
          imagName = imagName.trim().replace("__________", "");
          optionData = `&nbsp; &nbsp;<img style="height:${DndData.questionImageHight}px;max-width:250px; margin-top:10px;" src='${siteUrls}${DndData.imagePath}${imagName.trim()}'/>__________`;
        }
      } else optionData = optionDataArray;

      options.push(optionData);
    }

    for (let k = 0; k < 8; k++) {
      let targetText = DndData[`targetText${k + 1}`];
      if (targetText != undefined) {
        targetText = targetText.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        if (targetText != 0) target.push(targetText);
        else break;
      }
    }

    return { question, options, targetTXT: target, images };
  }

  /* ---------------------------
     Render block
     --------------------------- */
  return (
    <div className="row">
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col px-1'>
        <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(qDataAccordingToSubActType.question)}</div>
        {/* Target draggable items */}
        <div style={styles.container2}>
          <div className="rowMcq" style={{ flexWrap: "wrap", justifyContent: "center", }}>
            {tarGetText_1 ? <div style={styles.item}>{renderDraggableItem(tarGetText_1)}</div> : null}
            {tarGetText_2 ? <div style={styles.item}>{renderDraggableItem(tarGetText_2)}</div> : null}
            {tarGetText_3 ? <div style={styles.item}>{renderDraggableItem(tarGetText_3)}</div> : null}
            {tarGetText_4 ? <div style={styles.item}>{renderDraggableItem(tarGetText_4)}</div> : null}
            {tarGetText_5 ? <div style={styles.item}>{renderDraggableItem(tarGetText_5)}</div> : null}
            {tarGetText_6 ? <div style={styles.item}>{renderDraggableItem(tarGetText_6)}</div> : null}
            {tarGetText_7 ? <div style={styles.item}>{renderDraggableItem(tarGetText_7)}</div> : null}
            {tarGetText_8 ? <div style={styles.item}>{renderDraggableItem(tarGetText_8)}</div> : null}
          </div>
        </div>

        {/* Options / target areas */}
        <div >



          {qDataAccordingToSubActType.options?.[0] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>a.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[0], "droppable1")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[1] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>b.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[1], "droppable2")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[2] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>c.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[2], "droppable3")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[3] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>d.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[3], "droppable4")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[4] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>e.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[4], "droppable5")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[5] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>f.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[5], "droppable6")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[6] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>g.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[6], "droppable7")}
                </div>
              </div>
            </div>
          ) : null}

          {qDataAccordingToSubActType.options?.[7] ? (
            <div className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
              <div className="row">
                <div style={{ fontWeight: 700, width: 45 }}>h.</div>
                <div className={'col d-flex align-items-center flex-wrap g-0'}>
                  {renderWithDroppables(qDataAccordingToSubActType.options[7], "droppable8")}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
