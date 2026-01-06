import React, { useEffect } from 'react'
import { SWATheam } from '../../constant';

export default function FillUp({ fillBlanksQues, currentIndex, qNumber, siteUrls, storeData, onchangeGetData }) {

  useEffect(() => {
    window.MathJax?.Hub?.Queue(["Typeset", window.MathJax.Hub]);
  }, [fillBlanksQues, currentIndex]);


  const converIntoMathJax = (data) => (<span dangerouslySetInnerHTML={{ __html: data }} />);

  const question = fillBlanksQues[currentIndex]; // get all fillups questions.
  const { questionImageHight, optionImageHight } = question || {} // dynamic question and option image height.

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


  // all question ka answer input wise by Rj 6 Nov 2025
  const allAnswers = question?.answerText?.replaceAll("???", ",")?.split(',')?.map((a) => a.trim()).filter(Boolean) || [];
  let answerIndex = 0;
  const queTyped = question?.subActivityID
  let blankIndex = 0;





  return (
    <div className='row'>
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>

      <div className='col'>

        {questionParts.map((part, idx) => {
          if (!part) return null;
          const isImg = /\.(png|jpg|jpeg)$/i.test(part);
          const uri = `${siteUrls}${question?.imagePath}${part}`;
          part = part.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');



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

        <div style={{ backgroundColor: queTyped !== 1 ? "#e8e8e8" : null, borderRadius: "10px", }}>
          {options.map((o, i) => {
            if (!o.text) return null;
            o.text = o.text.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
            const partsOfOptions = o.text.split(/(#)/g).filter(p => p.trim() !== "");

            return (
              <div className={queTyped === 1 ? "rowMcq" : "rowMcq2"} key={i}>
                <div className='row'>
                  {queTyped === 1 &&
                    <div style={{ fontWeight: 700, width: "40px", }}>{o.label.replace(/\(([a-z])\)/gi, "$1.")}</div>
                  }

                  <div className={queTyped === 1 ? 'col d-flex align-items-center flex-wrap g-0' : 'col align-items-center flex-wrap'}>

                    {partsOfOptions.map((part, idx2) => {
                      // console.log({ part, idx2 })
                      part = part.replace(/&nbsp;/g, "").trim()
                      if (part === "#") {
                        const currentAnswer = allAnswers[answerIndex++] || "";
                        const answerLength = currentAnswer.length || 1;
                        const inputWidth = 20
                        let width = 40
                        if (answerLength > 1) {
                          width = (answerLength * inputWidth) + 6
                        }
                        const realIndex = blankIndex;
                        blankIndex++;

                        return (
                          <input
                            key={idx2}
                            maxLength={answerLength}
                            style={{ width: `${width}px`, height: 40, margin: "2px 6px", borderRadius: 4, textAlign: "center", border: `1px solid ${SWATheam.SwaGray}` }}
                            value={storeData[currentIndex]?.[o.key]?.[realIndex] || ""}
                            onChange={(e) => onchangeGetData(currentIndex, e.target.value, o.key, realIndex)}
                          />
                        );
                      }
                      return <span key={idx2} dangerouslySetInnerHTML={{ __html: part }} />;
                    })}

                    {o.img && (
                      <img draggable={false} src={`${siteUrls}${question?.imagePath}${o.img}`} style={{ maxWidth: "100%", maxHeight: `${optionImageHight}px`, objectFit: "contain", width: "auto", margin: "10px", padding: "2px", border: "1px solid", borderRadius: "8px", borderColor: "#817a7aff" }} />
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
