import React, { useState, useRef, useContext, useMemo, useEffect } from "react";
import { SWATheam } from "../../constant";

const converIntoMathJax = (data) => {
  return <span dangerouslySetInnerHTML={{ __html: data ?? "" }} />;
};

export default function DND({ dragNDropQues, currentIndex, qNumber, siteUrls, dropedData, setDropedData, dragDrop }) {
  // const [droppedItems, setDroppedItems] = useState({});
  const questionData = dragNDropQues?.[currentIndex] ?? {};
  const qDataAccordingToSubActType = questionData ? filterDndQData(questionData) : { question: "", options: [] };



  useEffect(() => {
    const all = dropedData[currentIndex];
    if (!all || Object.keys(all).length === 0) return;
    // const merged = Object.values(all).flat();
    // if (merged.length === 0) return
    dragDrop(all);
  }, [dropedData[currentIndex]]);


  // ensure MathJax typeset when question or dropedData changes
  useEffect(() => {
    if (window?.MathJax?.Hub) {
      try {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      } catch (e) {
        // ignore
      }
    }
  }, [qDataAccordingToSubActType, currentIndex, dropedData]);

  // HTML5 drag start
  const onDragStart = (e, payload) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    try {
      e.dataTransfer.effectAllowed = "move";
    } catch (err) { }
  };

  const handleDropWeb = (droppableId, index, e) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    const parsed = JSON.parse(raw); // { text, optionIndex }

    setDropedData(prev => {
      const current = { ...(prev[currentIndex] || {}) };
      const arr = current[droppableId] ? [...current[droppableId]] : [];

      arr[index] = parsed;

      return {
        ...prev,
        [currentIndex]: {
          ...(prev[currentIndex] || {}),
          [droppableId]: arr
        }
      };
    });


    // setDropedData?.((prev) => (prev ? [...prev, text] : [text]));
    // setDropedData(prev => {
    //   const curr = prev[currentIndex] || [];
    //   // const updated = [...curr, text];
    //   const updated = [...curr];
    //   updated[index] = text;
    //   return { ...prev, [currentIndex]: updated };
    // });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Render draggable item replaced for web
  const renderDraggableItem = (text, tarIdx) => {
    // console.log({ text })
    if (!text) return null;
    let netext = text.replace(/&sbquo;/g, ",");
    netext = netext.replace(/<MTECHO>/g, "`");
    netext = netext.replace(/<\/MTECHO>/g, "`");

    let letterLength = netext.length
    let width = "auto"
    if (letterLength <= 3) width = "45px"


    // check if image file name
    const isImg = typeof netext === "string" && /\.(png|PNG|jpg|JPG|jpeg|gif|web)$/i.test(netext);
    if (isImg) {
      const src = `${siteUrls}${dragNDropQues[currentIndex]?.imagePath}${netext}`;
      return (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, { text: `<img src="${src}" style="max-width:130px;height:80px;object-fit:contain;" />`, optionIndex: tarIdx })}
          className="draggable"
        >
          <img src={src} alt="" className="optImg" />
        </div>
      );
    }
    // plain text / html
    return (
      <div draggable onDragStart={(e) => onDragStart(e, { text: netext, optionIndex: tarIdx })} className="draggable" style={{ width: `${width}`, justifyContent: "center" }}>
        <span style={{ color: SWATheam.SwaBlack }}>{converIntoMathJax(netext)}</span>
      </div>
    );
  };

  // Generic function to render a value string containing '__________' placeholders. droppableKey is something like 'droppable1'
  const renderWithDroppables = (value, droppableKey) => {
    if (!value) return null;
    const parts = String(value).split("__________").map(part => part.trim());
    return (
      <span style={{ display: "inline", lineHeight: "26px", paddingRight: "10px" }}>
        {parts?.map((part, idx) => {
          const isLast = idx === parts.length - 1;
          const droppedObj = dropedData[currentIndex]?.[droppableKey]?.[idx];
          return (
            <React.Fragment key={idx}>
              <span style={{ display: "inline", marginRight: 4 }}>{converIntoMathJax(part)}</span>
              {!isLast &&
                (
                  <span
                    onDragOver={allowDrop}
                    onDrop={(e) => handleDropWeb(droppableKey, idx, e)}
                    className="droppable"
                  >

                    {droppedObj ?
                      <span dangerouslySetInnerHTML={{ __html: droppedObj.text }} /> :
                      <span style={{ opacity: 0.2, fontSize: "15px" }}>Drop here</span>
                    }

                    {/* {dropedData[currentIndex]?.[droppableKey]?.[idx] ?
                      dropedData[currentIndex][droppableKey][idx].startsWith?.("<") ?
                        (<span dangerouslySetInnerHTML={{ __html: dropedData[currentIndex][droppableKey][idx].text, }} />) :
                        dropedData[currentIndex][droppableKey][idx].text
                      : <span style={{ opacity: 0.2, fontSize: "15px" }}>Drop here</span>
                    } */}
                  </span>
                )
              }
            </React.Fragment>
          )
        })}
      </span>
    )
  }


  function isImageName(fileName) {
    if (!fileName) return false;
    return /\.(png|PNG|jpg|JPG|jpeg|gif|web)$/i.test(fileName);
  }

  function filterDndQData(questionDataParam) {
    // console.log(questionDataParam, "questionDataParam")
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
          question += `<div style='text-align:center'><img draggable="false" style='height:${DndData.questionImageHight}px; max-width:100%;' src='${imgPath}' /></div>`;
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
            allDndData += `<div style='text-align:center'><img draggable="false" style='height:${DndData.optionImageHight}px; max-width:100%;' src='${imgPath}' /></div>`;
          } else {
            allDndData += optionsData.replace(/#/g, "__________");
          }

          let ext2 = optionsImg.split(".");
          if (ext2[1] !== undefined && isImageName(optionsImg)) {
            let imgPath = `${siteUrls}${DndData.imagePath}${optionsImg}`;
            allDndData += `<div style='text-align:center'><img draggable="false" style='height:${DndData.optionImageHight}px; max-width:100%;' src='${imgPath}' /></div>`;
          } else {
            allDndData += optionsImg.replace(/#/g, "__________");
          }
        } else if (optionsData === "" && optionsImg !== "") {
          let ext2 = optionsImg.split(".");
          if (ext2[1] !== undefined && isImageName(optionsImg)) {
            let imgPath = `${siteUrls}${DndData.imagePath}${optionsImg}`;
            allDndData += `<div style='text-align:center'><img draggable="false" style='height:${DndData.optionImageHight}px; max-width:100%;' src='${imgPath}' /></div>`;
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
          target.push(`<div style='text-align:center'><img draggable="false" style='height:${DndData.questionImageHight}px; max-width:100%;' src='${imgPath}' /></div>`);
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
          question += `<img draggable="false" style="height:${dndData2["questionImageHight"]}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${quesHead}'/> &nbsp;`;
        } else question += quesHead;
      }
    }
    for (let j = 0; j < 4; j++) {
      let quesPart = dndData2[`questionPart${j + 1}`];
      if (quesPart != undefined) {
        quesPart = quesPart.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");
        if (quesPart !== "") {
          if (isImageName(quesPart)) {
            question += `<img draggable="false" style=" height:${dndData2["questionImageHight"]}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${quesPart}'/> &nbsp;`;
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
          finalFillup += `<img draggable="false" style="height:${dndData2["optionImageHight"]}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData2["imagePath"]}${optionImage}'/> &nbsp;`;
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
            question += `<img draggable="false" style=" height:${dndData3["questionImageHight"]}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData3["imagePath"]}${quesPart}'/> &nbsp;`;
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
          finalFillup += `<img draggable="false" style="height:${dndData3["optionImageHight"]}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${dndData3["imagePath"]}${optionImage}'/> &nbsp;`;
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
    // console.log({ DndData })
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
            allData += `<img draggable="false" style="height:${DndData.questionImageHight}px; max-width:100%; margin-top:0px; display: table-cell; vertical-align: middle;" src='${siteUrls}${DndData.imagePath}${quesPart}'/> &nbsp;`;
          } else allData += quesPart;
        }
      }
    }

    const allDataArray = allData.split("???");
    question = (allDataArray[0] || "").trim();

    const arr = question.split("~~");
    if (arr[1] != undefined) {
      question = arr[0] + "<br/>" + `<img draggable="false" style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:0px;" src='${siteUrls}${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`;
    }

    for (let a = 1; a < allDataArray.length; a++) {
      let data = allDataArray[a];
      let dataArray = "";
      let data1 = data.split("");
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
          optionData = `<img draggable="false" style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:0px;" src='${siteUrls}${DndData.imagePath}${imagName.trim()}'/>${op}`;
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
            allData += `<div style='text-align:center;'><span style='display:flex;'><img style="height:${DndData.questionImageHight}px; max-width:100%; margin-top:0px;" src='${siteUrls}${DndData.image_path}${quesPart}'/></span></div> &nbsp;`;
          } else allData += quesPart;
        }
      }
    }

    const allDataArray = allData.split("???");
    question = (allDataArray[0] || "").trim();

    const arr = question.split("~~");
    if (arr[1] != undefined) {
      question = arr[0] + "<br/>" + `<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:0px;" src='${siteUrls}${DndData.imagePath}${arr[1].trim()}'/> &nbsp;`;
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
          optionData = `<img style="height:${DndData.questionImageHight}px;max-width:100%; margin-top:0px;" src='${siteUrls}${DndData.imagePath}${imagName.trim()}'/>__________`;
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

  /* ---------------------------Render block--------------------------- */
  return (
    <div className="row">
      <div style={{ width: "40px", textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col'>
        <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(qDataAccordingToSubActType.question)}</div>
        <div className="container2">
          <div className="rowMcq" style={{ flexWrap: "wrap", justifyContent: "center", width: "100%", backgroundColor: "#d2d2d2" }}>
            {Object.entries(questionData)
              .filter(([key, value]) => key.startsWith("targetText") && value)
              .map(([key, value], tarIdx) => {
                return (
                  <div key={key} className="item">{renderDraggableItem(value, tarIdx)}</div>
                )
              }
              )}
          </div>
        </div>

        {/* Options / target areas */}
        <div>
          {qDataAccordingToSubActType.options.map((part, index) => {
            return (
              <div key={index} className="rowMcq" style={{ background: `${SWATheam.SwaWhite}` }}>
                <div className="row">
                  <div style={{ fontWeight: 700, width: 40 }}>{`${String.fromCharCode(`${97 + index}`)}.`}</div>
                  <div className={'col d-flex align-items-center flex-wrap g-0'}>{renderWithDroppables(part, `droppable${index + 1}`)}</div>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  );
};
