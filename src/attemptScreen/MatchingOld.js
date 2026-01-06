import React, { useEffect, useState } from "react";
import { SWATheam } from "../../constant";

export default function Matching({ matchQues, currentIndex, qNumber, siteUrls, matchLines, setMatchLines, connections, setConnections, }) {
  useEffect(() => {
    window.MathJax?.Hub?.Typeset();
  });

  const data = matchQues?.[currentIndex] || {};

  const converIntoMathJax = (data) => {
    return <span dangerouslySetInnerHTML={{ __html: data ?? "" }} />;
  };

  // ---------- CREATE OPTION/TARGET ELEMENT ----------
  const createBox = (value, imgHeight) => {
    if (!value) return null;

    const isImage = /\.(png|jpg|jpeg)$/i.test(value);
    const uri = `${siteUrls}${data.imagePath}${value}`;

    return isImage ? (
      <img
        draggable={false}
        src={uri}
        alt="match-option"
        style={{
          height: imgHeight,
          width: "auto",
          objectFit: "contain",
        }}
      />
    ) : (
      <span>{converIntoMathJax(value)}</span>
    );
  };

  // ----------- COL A (options) -----------
  const leftItems = Object.entries(data)
    .filter(([k, v]) => k.startsWith("optionText") && v)
    .map(([k, v], i) => ({
      id: `L${i + 1}`,
      label: createBox(v, data.optionImageHight),
      side: "left",
      y: (i + 1) * 80,
    }));

  // ----------- COL B (Targets) -----------
  const rightItems = Object.entries(data)
    .filter(([k, v]) => k.startsWith("targetText") && v)
    .map(([k, v], i) => ({
      id: `R${i + 1}`,
      label: createBox(v, data.optionImageHight),
      side: "right",
      y: (i + 1) * 80,
    }));

  const allPoints = [...leftItems, ...rightItems];

  const [selected, setSelected] = useState(null);

  // ---------------- HANDLE CLICK ----------------
  const handleSelect = (pt) => {
    if (!selected) {
      if (pt.side === "left") setSelected(pt);
      return;
    }

    if (selected.side === "left" && pt.side === "right") {
      const newLine = { start: selected, end: pt };

      const updatedLines = {
        ...matchLines,
        [currentIndex]: [
          ...(matchLines[currentIndex] || []).filter(
            (x) =>
              x.start.id !== selected.id && x.end.id !== pt.id
          ),
          newLine,
        ],
      };

      setMatchLines(updatedLines);

      const newConn = [
        ...((connections[currentIndex] || []).filter(
          (c) => !c.startsWith(selected.id)
        )),
        `${selected.id}-${pt.id}`,
      ];

      setConnections((prev) => ({
        ...prev,
        [currentIndex]: newConn,
      }));

      setSelected(null);
      return;
    }

    setSelected(null);
  };

  const linesToDraw = matchLines[currentIndex] || [];

  return (
    <div className="mt-3">

      {/* ---------- Question Heading (your UI) ---------- */}
      <div className="row">
        <div
          style={{
            width: 35,
            textAlign: "center",
            fontWeight: "bold",
            color: SWATheam.SwaBlue,
          }}
        >
          {qNumber}.
        </div>

        <div className="col">
          {/* Heading */}
          <div>{data?.questionHeading}</div>

          {/* questionPart 1..5 */}
          <div className="row text-center g-0 my-3">
            {Object.entries(data)
              .filter(([key, val]) => key.startsWith("questionPart") && val)
              .map(([key, value]) => {
                const isImg = /\.(png|jpg|jpeg)$/i.test(value);
                const uri = `${siteUrls}${data.imagePath}${value}`;
                if (!isImg)
                  value = value.replace(/<MTECHO>/g, "`").replace(/<\/MTECHO>/g, "`");

                return (
                  <div
                    key={key}
                    className="col border"
                    style={{
                      background: SWATheam.SwaBlue,
                      padding: 5,
                    }}
                  >
                    {isImg ? (
                      <img
                        draggable={false}
                        src={uri}
                        style={{
                          maxHeight: data.questionImageHight,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div style={{ color: SWATheam.SwaWhite }}>
                        {converIntoMathJax(value)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ---------- Column Labels ---------- */}
      <div className="row text-center fw-bold mt-2">
        <div className="col" style={{ color: SWATheam.SwaBlue }}>
          Column A
        </div>
        <div className="col" style={{ color: SWATheam.SwaBlue }}>
          Column B
        </div>
      </div>

      {/* ---------- Matching UI ---------- */}
      <div
        style={{
          position: "relative",
          height: 500,
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
          }}
        >
          {linesToDraw.map((line, i) => (
            <line
              key={i}
              x1={150}
              y1={line.start.y}
              x2={450}
              y2={line.end.y}
              stroke="black"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Render Points */}
        {allPoints.map((pt) => (
          <div
            key={pt.id}
            onClick={() => handleSelect(pt)}
            style={{
              position: "absolute",
              left: pt.side === "left" ? 100 : 500,
              top: pt.y,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background:
                  selected?.id === pt.id
                    ? "green"
                    : pt.side === "left"
                      ? "blue"
                      : "orange",
              }}
            ></div>

            <div style={{ width: 200 }}>{pt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
