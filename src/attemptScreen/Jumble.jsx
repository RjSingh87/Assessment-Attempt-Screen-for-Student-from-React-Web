import React, { useEffect, useState, useRef } from 'react'
import { SWATheam } from '../../constant'



export default function Jumble({ jumbleQues, currentIndex, qNumber, siteUrls, sortedLetters, setSortedLetters, jumBlePayLoad }) {
  const data = jumbleQues?.[currentIndex] || {}
  const { questionImageHight, optionImageHight } = data // dynamic question and option image height.


  useEffect(() => {
    window.MathJax?.Hub?.Typeset();
  }, [data]);

  useEffect(() => {
    const opts = GetQuestionAndOption(data);
    if (!sortedLetters[currentIndex]) {
      const initForThisQuestion = {};
      opts.forEach((opt, idx) => {
        initForThisQuestion[idx] = [...opt.jumbleLetters];
      });
      setSortedLetters(prev => ({
        ...prev,
        [currentIndex]: initForThisQuestion
      }));
    }
  }, [currentIndex, data, setSortedLetters, sortedLetters]);



  const converIntoMathJax = (data) => {
    if (!data) return null
    data = data.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
    return <span dangerouslySetInnerHTML={{ __html: data }} />;
  };

  const GetQuestionAndOption = (queNOption) => {
    const allTypeQueOption = []
    for (let i = 1; i <= 8; i++) {
      const quesHeading = queNOption[`questionHeading`] || ""
      const quesPart = queNOption[`questionPart${i}`] || ""
      const optText = queNOption[`optionText${i}`] || ""
      const optImage = queNOption[`optionImage${i}`] || ""
      const targetTxt = queNOption[`targetText${i}`] || ""
      const jumbleLetters = targetTxt ? targetTxt.split(",").map(v => v.trim()) : [];
      if (quesHeading || quesPart || optText || optImage) allTypeQueOption.push({ quesHeading, quesPart, optText, optImage, jumbleLetters })
    }
    return allTypeQueOption
  }


  const LetterSortableRow = ({ optionIndex, letters, currentIndex, optionImage }) => {

    const [localLetters, setLocalLetters] = useState(letters);
    const [activeIndex, setActiveIndex] = useState(null);
    const [dragClone, setDragClone] = useState(null);

    const liveLetters = useRef(letters);
    const dragIndex = useRef(null);
    const hoverIndex = useRef(null);
    const longPressTimer = useRef(null);
    const lastMove = useRef(0);
    const isDragging = useRef(false);

    // sync from parent only when not dragging
    useEffect(() => {
      if (!isDragging.current) {
        setLocalLetters(letters);
        liveLetters.current = letters;
      }
    }, [letters]);

    // start drag
    const startDrag = (index, touch) => {
      const rect = touch.target.getBoundingClientRect();

      isDragging.current = true;
      dragIndex.current = index;
      hoverIndex.current = index;
      setActiveIndex(index);

      setDragClone({
        letter: liveLetters.current[index],
        x: rect.left,
        y: rect.top,
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      });
    };

    const handleTouchStart = (index, e) => {
      longPressTimer.current = setTimeout(() => {
        startDrag(index, e.touches[0]);
      }, 180);
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();

      const touch = e.touches[0];

      // move clone
      setDragClone(prev => ({
        ...prev,
        x: touch.clientX - prev.offsetX,
        y: touch.clientY - prev.offsetY,
      }));

      const now = Date.now();
      if (now - lastMove.current < 70) return;
      lastMove.current = now;

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!el) return;

      //ROW LOCK
      const row = el.closest("[data-row]");
      if (!row || row.dataset.row !== String(optionIndex)) return;

      const targetIndex = Number(el.dataset.index);
      if (isNaN(targetIndex) || targetIndex === hoverIndex.current) return;

      // OPTION-B
      const arr = [...liveLetters.current];
      const [moved] = arr.splice(hoverIndex.current, 1);
      arr.splice(targetIndex, 0, moved);

      hoverIndex.current = targetIndex;
      liveLetters.current = arr;
      setLocalLetters(arr);
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer.current);

      if (isDragging.current) {
        setSortedLetters(prev => {
          const copy = {
            ...prev,
            [currentIndex]: {
              ...(prev[currentIndex] || {}),
              [optionIndex]: {
                letters: liveLetters.current,
                touched: true,
              }
            }
          };

          jumBlePayLoad(copy);
          return copy;
        });
      }

      isDragging.current = false;
      dragIndex.current = null;
      hoverIndex.current = null;
      setActiveIndex(null);
      setDragClone(null);
    };

    return (
      <div
        className="d-flex flex-wrap py-2"
        data-row={optionIndex}
        style={{ touchAction: "none", position: "relative" }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating clone */}
        {dragClone && (
          <div
            style={{
              position: "fixed",
              left: dragClone.x,
              top: dragClone.y,
              width: 52,
              height: 52,
              background: "#0047FF",
              color: "#fff",
              borderRadius: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              transform: "scale(1.25)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            {dragClone.letter}
          </div>
        )}

        {localLetters.map((letter, idx) => {
          const isHidden = idx === activeIndex;

          return (
            <div
              key={idx}
              data-index={idx}
              onTouchStart={(e) => handleTouchStart(idx, e)}
              style={{
                width: "45px",
                height: "45px",
                marginRight: 8,
                marginTop: 8,
                borderRadius: 6,
                background: isHidden ? "transparent" : "#0047FF",
                color: isHidden ? "transparent" : "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
                transition: "transform 0.25s ease",
              }}
            >
              {letter}
            </div>
          );
        })}
        {optionImage && (
          <img
            draggable={false}
            src={`${siteUrls}${data?.imagePath}${optionImage}`}
            style={{
              width: "auto",
              maxWidth: "100%",
              maxHeight: `${optionImageHight}px`,
              objectFit: "contain",
              marginTop: "5px"
            }}
          />
        )}
      </div>
    );
  };



  // const LetterSortableRow = ({ optionIndex, letters, currentIndex }) => {
  //   const [localLetters, setLocalLetters] = useState(letters);
  //   const liveLetters = useRef(letters);
  //   const dragFrom = useRef(null);
  //   const dragTo = useRef(null);
  //   const lastMoveTime = useRef(0);

  //   const [activeIndex, setActiveIndex] = useState(null);
  //   const longPressTimer = useRef(null);

  //   useEffect(() => {
  //     setLocalLetters(letters);
  //     liveLetters.current = letters;
  //   }, [letters]);


  //   const handleTouchStart = (index) => {
  //     dragFrom.current = index;
  //     dragTo.current = index;

  //     longPressTimer.current = setTimeout(() => {
  //       setActiveIndex(index);
  //     }, 180);
  //   };


  //   const handleTouchMove = (e) => {
  //     e.preventDefault();

  //     const now = Date.now();

  //     if (now - lastMoveTime.current < 50) return;
  //     lastMoveTime.current = now;

  //     const touch = e.touches[0];
  //     const elem = document.elementFromPoint(touch.clientX, touch.clientY);
  //     if (!elem) return;

  //     const idx = Number(elem.dataset.index);
  //     if (!isNaN(idx)) {
  //       dragTo.current = idx;
  //     }
  //   };


  //   const handleTouchEnd = () => {
  //     clearTimeout(longPressTimer.current);

  //     const from = dragFrom.current;
  //     const to = dragTo.current;

  //     setActiveIndex(null);

  //     if (from == null || to == null || from === to) {
  //       dragFrom.current = null;
  //       dragTo.current = null;
  //       return;
  //     }


  //     const updated = [...liveLetters.current];
  //     const [item] = updated.splice(from, 1);
  //     updated.splice(to, 0, item);

  //     liveLetters.current = updated;
  //     setLocalLetters(updated);

  //     // Update parent payload jumBlePayLoad()
  //     setSortedLetters(prev => {
  //       const copy = {
  //         ...prev,
  //         [currentIndex]: {
  //           ...(prev[currentIndex] || {}),
  //           [optionIndex]: updated
  //         }
  //       };
  //       jumBlePayLoad(copy);
  //       return copy;
  //     });

  //     dragFrom.current = null;
  //     dragTo.current = null;
  //   };


  //   return (
  //     <div
  //       className="d-flex flex-wrap py-2"
  //       style={{ touchAction: "none" }}
  //       onTouchMove={handleTouchMove}
  //       onTouchEnd={handleTouchEnd}
  //     >
  //       {localLetters.map((letter, idx) => {
  //         const isActive = idx === activeIndex;
  //         return (
  //           <div
  //             key={idx}
  //             data-index={idx}
  //             onTouchStart={() => handleTouchStart(idx)}
  //             style={{
  //               padding: "5px",
  //               width: "52px",
  //               height: "52px",
  //               background: isActive ? "#0047FF" : SWATheam.SwaBlue,
  //               color: "#fff",
  //               borderRadius: "5px",
  //               display: "flex",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               marginRight: "8px",
  //               marginTop: "8px",
  //               fontSize: "20px",
  //               transform: isActive ? "scale(1.22)" : "scale(1)",
  //               boxShadow: isActive
  //                 ? "0px 6px 18px rgba(0,0,0,0.25)"
  //                 : "0 0 0 rgba(0,0,0,0)",

  //               transition: "0.15s ease-out",
  //             }}
  //           >
  //             {letter}
  //           </div>
  //         )
  //       })}
  //     </div>
  //   );
  // };



  return (
    <div className='row'>
      <div style={{ width: "40px", textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col'>

        {GetQuestionAndOption(data).map((val, index) => {
          // console.log(val, "value..")
          if (!val) return null;
          const isImage = /\.(png|jpg|jpeg)$/i.test(val.quesPart);
          const uri = `${siteUrls}${data?.imagePath}${val.quesPart}`;
          const optionData = sortedLetters[currentIndex]?.[index];
          const letters = Array.isArray(optionData) ? optionData : optionData?.letters || [];


          return (
            <div key={index}>
              {/* questionpart */}
              {isImage ?
                <div className='my-2'>
                  <img className='my-2 mx-auto d-block' draggable={false} src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain" }} alt='swaadhyayan' />
                </div> :
                <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}`, }}>{converIntoMathJax(val.quesPart)}</div>
              }

              {/* option */}
              <div className='rowDD'>
                <div style={{ fontWeight: 700, width: 30 }}>{String.fromCharCode(97 + index)}.</div>
                <div className='col'>
                  <div>{converIntoMathJax(val?.optText)}</div>
                  <div className='d-flex flex-wrap py-2'>
                    <LetterSortableRow
                      optionIndex={index}
                      letters={letters}
                      currentIndex={currentIndex}
                      optionImage={val?.optImage}
                    />
                  </div>

                </div>
              </div>
            </div>
          )
        })}

      </div>


    </div>
  )
}
