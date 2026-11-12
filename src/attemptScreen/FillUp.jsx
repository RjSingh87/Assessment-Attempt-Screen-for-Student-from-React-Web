import React, { useEffect } from 'react';
import { SWATheam } from '../../constant';

// Clean math and HTML formatting helper
const cleanAndFormatMath = (data) => {
  if (!data) return '';
  let str = String(data);

  // Fix malformed closing </br> tags to standard <br/>
  str = str.replace(/<\/\s*br\s*>/gi, '<br/>');

  // Collapse multiple &nbsp; or non-breaking spaces into a single space
  str = str.replace(/(&nbsp;|&#160;|&#xA0;)+/gi, ' ');
  str = str.replace(/[ \t\u00A0]{2,}/g, ' ');

  // Convert mixed fractions e.g. <MTECHO>4 7/8</MTECHO> or `4 7/8` to HTML
  str = str.replace(/(?:<MTECHO>|`)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*(?:<\/MTECHO>|`)/gi, (_, w, n, d) => {
    return `<span class="tex2jax_ignore" style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 2px;line-height:1;"><span style="margin-right:4px;font-weight:600;">${w}</span><span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;text-align:center;"><span style="border-bottom:1.5px solid currentColor;padding:0 3px 1px 3px;font-size:0.85em;line-height:1.1;">${n}</span><span style="padding:1px 3px 0 3px;font-size:0.85em;line-height:1.1;">${d}</span></span></span>`;
  });

  // Convert simple fractions e.g. <MTECHO>1/6</MTECHO> or `1/6` to HTML
  str = str.replace(/(?:<MTECHO>|`)\s*(-?\d+)\s*\/\s*(\d+)\s*(?:<\/MTECHO>|`)/gi, (_, n, d) => {
    return `<span class="tex2jax_ignore" style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;text-align:center;margin:0 2px;line-height:1;"><span style="border-bottom:1.5px solid currentColor;padding:0 3px 1px 3px;font-size:0.85em;line-height:1.1;">${n}</span><span style="padding:1px 3px 0 3px;font-size:0.85em;line-height:1.1;">${d}</span></span>`;
  });

  // Remaining MTECHO tags replaced with backticks for MathJax
  str = str.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');

  return str;
};

export default function FillUp({ fillBlanksQues, currentIndex, qNumber, siteUrls, storeData, onchangeGetData }) {

  useEffect(() => {
    if (window?.MathJax?.Hub) {
      try {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      } catch (e) {
        // ignore
      }
    }
  }, [currentIndex]);

  const converIntoMathJax = (data) => (
    <span dangerouslySetInnerHTML={{ __html: cleanAndFormatMath(data) }} />
  );

  const question = fillBlanksQues[currentIndex]; // get all fillups questions.
  const { questionImageHight, optionImageHight } = question || {};

  const questionParts = [
    question?.questionPart1,
    question?.questionPart2,
    question?.questionPart3,
    question?.questionPart4,
    question?.questionPart5,
  ];

  const options = [
    { text: question?.optionText1, img: question?.optionImage1, label: '(a)', key: "optionText1" },
    { text: question?.optionText2, img: question?.optionImage2, label: '(b)', key: "optionText2" },
    { text: question?.optionText3, img: question?.optionImage3, label: '(c)', key: "optionText3" },
    { text: question?.optionText4, img: question?.optionImage4, label: '(d)', key: "optionText4" },
    { text: question?.optionText5, img: question?.optionImage5, label: '(e)', key: "optionText5" },
    { text: question?.optionText6, img: question?.optionImage6, label: '(f)', key: "optionText6" },
    { text: question?.optionText7, img: question?.optionImage7, label: '(g)', key: "optionText7" },
    { text: question?.optionText8, img: question?.optionImage8, label: '(h)', key: "optionText8" },
  ];

  const allAnswers = question?.answerText?.replaceAll("???", ",")?.split(',')?.map((a) => a.trim()).filter(Boolean) || [];
  let answerIndex = 0;
  const queTyped = question?.subActivityID;
  let blankIndex = 0;

  return (
    <div className='row' style={{ margin: 0 }}>
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}`, padding: 0 }}>{qNumber}.</div>

      <div className='col' style={{ padding: "0 4px" }}>
        {questionParts.map((part, idx) => {
          if (!part) return null;
          const isImg = /\.(png|jpg|jpeg)$/i.test(part);
          const uri = `${siteUrls}${question?.imagePath}${part}`;
          part = part.replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/#/g, '..................').trim();

          return (
            <div key={idx}>
              {isImg ? (
                <img draggable={false} className='my-2 mx-auto d-block' style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: '100%' }} src={uri} alt='' />
              ) : (
                <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(part)}</div>
              )}
            </div>
          );
        })}

        <div style={{ backgroundColor: queTyped !== 1 ? "#e8e8e8" : null, borderRadius: "10px" }}>
          {options.map((o, i) => {
            if (!o.text) return null;
            const formattedOption = cleanAndFormatMath(o.text);
            const partsOfOptions = formattedOption.split(/(#)/g).filter(p => p !== "");

            return (
              <div
                className={queTyped === 1 ? "rowMcq" : "rowMcq2"}
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  boxSizing: "border-box",
                  width: "100%",
                  padding: "10px 10px"
                }}
              >
                {queTyped === 1 && (
                  <div
                    style={{
                      fontWeight: 700,
                      width: "28px",
                      flexShrink: 0,
                      color: SWATheam.SwaBlack,
                      paddingTop: "6px"
                    }}
                  >
                    {o.label.replace(/\(([a-z])\)/gi, "$1.")}
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    wordBreak: "break-word",
                    lineHeight: "42px"
                  }}
                >
                  {partsOfOptions.map((part, idx2) => {
                    if (part === "#") {
                      const currentAnswer = allAnswers[answerIndex++] || "";
                      const answerLength = currentAnswer.length || 1;
                      const realIndex = blankIndex++;
                      const userValue = storeData[currentIndex]?.[o.key]?.[realIndex] || "";

                      // Width set according to answerLength with ample space so text never cuts
                      const width = Math.min(200, Math.max(48, answerLength * 15 + 26));

                      return (
                        <input
                          key={idx2}
                          maxLength={answerLength}
                          style={{
                            width: `${width}px`,
                            minWidth: "45px",
                            maxWidth: "100%",
                            height: 38,
                            margin: "2px 4px",
                            padding: "4px 8px",
                            borderRadius: 6,
                            textAlign: "center",
                            fontSize: "17px", // Prevents iOS Safari auto-zoom (< 16px zooms)
                            fontWeight: "600",
                            // color: SWATheam.SwaBlue,
                            border: `1.5px solid ${SWATheam.SwaGray}`,
                            outline: "none",
                            verticalAlign: "middle"
                          }}
                          value={userValue}
                          onChange={(e) => onchangeGetData(currentIndex, e.target.value, o.key, realIndex)}
                        />
                      );
                    }
                    return (
                      <span
                        key={idx2}
                        style={{ verticalAlign: "middle" }}
                        dangerouslySetInnerHTML={{ __html: part }}
                      />
                    );
                  })}

                  {o.img && (
                    <img
                      draggable={false}
                      src={`${siteUrls}${question?.imagePath}${o.img}`}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: `${optionImageHight}px`,
                        objectFit: "contain",
                        width: "auto",
                        margin: "10px 0",
                        padding: "2px",
                        border: "1px solid",
                        borderRadius: "8px",
                        borderColor: "#817a7aff"
                      }}
                      alt=""
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
