import React, { useEffect, useState, useRef } from 'react'
import { SWATheam } from '../../constant'


export default function Matching({ matchQues, currentIndex, qNumber, siteUrls, matchLines, setMatchLines, matchingDataFun }) {
  const linesToDraw = matchLines[currentIndex] || [];
  const data = matchQues?.[currentIndex] || {};
  const [selected, setSelected] = useState(null);
  const { questionImageHight, optionImageHight } = matchQues?.[currentIndex] || {} // dynamic question and option image height.
  const circleRefs = useRef({});
  const svgWrapperRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);





  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handleChange = () => setIsPortrait(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // useEffect(() => {
  //   if (isPortrait) document.body.style.overflow = "hidden"
  //   else document.body.style.overflow = "auto"
  // }, [isPortrait])



  useEffect(() => {
    window.MathJax.Hub.Typeset();
  },)

  useEffect(() => {
    setSelected(null); // Clear selection on question change
  }, [currentIndex]);


  const converIntoMathJax = (data) => {
    if (!data) return null
    data = data.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
    return <span dangerouslySetInnerHTML={{ __html: data }} />;
  };



  const renderMatchContent = (value, imgHeight) => {
    if (!value || value === "") return null;

    const imageExtensions = /\.(png|jpg|jpeg|gif|webp|svg)$/i;
    const isImage = imageExtensions.test(value);
    const uri = `${isImage}` ? `${siteUrls}${data.imagePath}${value}` : null;

    return isImage ? (
      <img
        draggable={false}
        src={uri}
        alt="match-item"
        style={{
          height: imgHeight,
          width: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    ) : (
      <span>{converIntoMathJax(value)}</span>
    );
  };


  const leftItems = [];

  for (let i = 1; i <= 20; i++) {
    const text = data[`optionText${i}`];
    const image = data[`optionImage${i}`];

    if (!text && !image) continue;  // skip empty

    const value = text || image;  // whichever is available

    leftItems.push({
      id: `L${i}`,
      label: renderMatchContent(value, data.optionImageHight),
      side: "left",
      y: i * 80,
    });
  }


  const rightItems = [];

  for (let i = 1; i <= 20; i++) {
    const target = data[`targetText${i}`];

    if (!target) continue;

    rightItems.push({
      id: `R${i}`,
      label: renderMatchContent(target, data.optionImageHight),
      side: "right",
      y: i * 80,
    });
  }

  const allPoints = [...leftItems, ...rightItems];



  const handleSelect = (point) => {
    // Only LEFT (blue) can be selected first
    if (!selected) {
      if (point.side === "left") {
        setSelected(point);
      }
      return;
    }

    if (selected.side === "left" && point.side === "left") {
      setSelected(point);
      return
    }

    // Blue → Orange allowed
    if (selected.side === "left" && point.side === "right") {

      const leftPoint = selected;
      const rightPoint = point;

      let updatedLines = matchLines[currentIndex] || [];

      updatedLines = updatedLines.filter(line => line.leftId !== leftPoint.id);// Remove previous connection of this LEFT
      updatedLines = updatedLines.filter(line => line.rightId !== rightPoint.id);// Remove previous connection of this RIGHT

      // Draw line
      const start = getCircleXY(leftPoint.id);
      const end = getCircleXY(rightPoint.id);

      const newLine = {
        leftId: leftPoint.id,
        rightId: rightPoint.id,
        start,
        end
      };

      const finalData = [...updatedLines, newLine];

      setMatchLines(prev => ({
        ...prev,
        [currentIndex]: finalData
      }));
      const pairsLeftRight = finalData.map(line => `${line.leftId}-${line.rightId}`).filter(line => line !== null);
      matchingDataFun(pairsLeftRight, currentIndex);
      setSelected(null);
      return;
    }
    // Any invalid click pattern
    setSelected(null);
  };




  const getCircleXY = (id) => {
    const el = circleRefs.current[id];
    const svgWrapper = svgWrapperRef.current;

    if (!el || !svgWrapper) return null;

    const elRect = el.getBoundingClientRect();
    const wrapRect = svgWrapper.getBoundingClientRect();

    return {
      x: elRect.left - wrapRect.left + elRect.width / 2,
      y: elRect.top - wrapRect.top + elRect.height / 2,
    };
  };


  const rows = [];

  allPoints.forEach(pt => {
    if (pt.side === "left") {
      const right = allPoints.find(r => r.side === "right" && r.y === pt.y);
      rows.push({ left: pt, right });
    }
  });

  const isMatched = (id) => {
    const lines = matchLines[currentIndex] || [];
    return lines.some(line => line.leftId === id || line.rightId === id);
  };



  return (
    <div className='row'>

      {/* detect portrait mode  */}
      {isPortrait && (
        <div >
          <div className='overlay'>
            <div className='text'>Rotate to Landscape</div>
            <div className='subtext'>{`This activity works best in landscape mode.`}</div>
          </div>
        </div>
      )}

      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>

      <div className='col'>
        <div>{matchQues?.[currentIndex]?.questionHeading}</div>
        <div className='row text-center g-0 my-3' >
          {Object.entries(matchQues?.[currentIndex] ?? {})
            .filter(([key, value]) => /^questionPart\d+$/.test(key) && value) // Filter questionPart1...questionPart5
            .map(([key, value]) => {
              if (!value) return null;
              const isImage = /\.(png|jpg|jpeg)$/i.test(value);
              const uri = `${siteUrls}${matchQues?.[currentIndex]?.imagePath}${value}`;
              if (!isImage) value = value.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
              return (
                <div key={key} className='col border' style={{ backgroundColor: `${SWATheam.SwaBlue}`, padding: "5px" }}>
                  {isImage ?
                    <div className='my-2'> <img className='my-2 mx-auto d-block' draggable={false} src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain" }} alt='swaadhyayan' /></div> :
                    <div style={{ fontWeight: "400", color: `${SWATheam.SwaWhite}`, }}>{converIntoMathJax(value)}</div>
                  }
                </div>
              )
            })
          }
        </div>



        <div
          ref={svgWrapperRef}
          style={{
            position: "relative",
            marginTop: 20,
          }}
        >
          {/* SVG LINES */}
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              // background: "#e1e1e1",
            }}
          >
            {linesToDraw.map((line, i) => (
              <line
                key={i}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke={`${SWATheam.SwaBlue}`}
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Render Points */}
          {rows.map((row, index) => (
            <div
              key={index}
              className="row g-0 my-2"
              style={{
                position: "relative",
                // zIndex: 1,
              }}
            >

              {/* LEFT DATA */}
              <div onClick={() => handleSelect(row.left)} className="col-4 d-flex justify-content-center align-items-center p-3">
                {row.left.label}
              </div>

              {/* RADIO CIRCLES  */}
              <div
                className="col-4 d-flex align-items-center p-3"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: 40,
                  paddingRight: 40,
                }}
              >
                {/* LEFT SIDE CIRCLE (BLUE) */}
                <div
                  ref={(el) => circleRefs.current[row.left.id] = el}
                  onClick={() => handleSelect(row.left)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: isMatched(row.left.id) ? "0px solid transparent" : `1.5px solid ${SWATheam.SwaBlue}`,
                    background: isMatched(row.left.id) ? `${SWATheam.SwaBlue}` : row.left.id === selected?.id ? `${SWATheam.SwaBlue}` : `${SWATheam.SwaWhite}`,
                    cursor: "pointer"
                  }}
                />

                {/* RIGHT SIDE CIRCLE (ORANGE) */}
                <div
                  ref={(el) => circleRefs.current[row.right.id] = el}
                  onClick={() => handleSelect(row.right)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: isMatched(row.right.id) ? "0px solid transparent" : `1.5px solid ${SWATheam.SwaBlue}`,
                    background: isMatched(row.right.id) ? `${SWATheam.SwaBlue}` : row.right.id === selected?.id ? `${SWATheam.SwaBlue}` : `${SWATheam.SwaWhite}`,
                    cursor: "pointer"
                  }}
                />
              </div>

              {/* RIGHT DATA */}
              <div onClick={() => handleSelect(row.right)} className="col-4 d-flex justify-content-center align-items-center p-3">
                {row.right.label}
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
