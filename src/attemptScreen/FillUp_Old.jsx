import React, { useEffect, useState } from 'react'
import { SWATheam } from '../../constant';
import { Alert } from 'bootstrap';

export default function FillUp({ fillBlanksQues, currentIndex, qNumber, siteUrls, storeData, onchangeGetData }) {
  useEffect(() => {
    window.MathJax.Hub.Typeset();
  }, [currentIndex])




  const converIntoMathJax = (data) => (<span dangerouslySetInnerHTML={{ __html: data }} />);

  const question = fillBlanksQues[currentIndex] // all FillUp assessment questions with current index
  const questionParts = [
    question?.questionPart1,
    question?.questionPart2,
    question?.questionPart3,
    question?.questionPart4,
    question?.questionPart5,
  ];

  const options = [
    { optionText: question?.optionText1, optionID: question?.optionID1, optionImg: question.optionImage1, label: '(a)' },
    { optionText: question?.optionText2, optionID: question?.optionID2, optionImg: question.optionImage2, label: '(b)' },
    { optionText: question?.optionText3, optionID: question?.optionID3, optionImg: question.optionImage3, label: '(c)' },
    { optionText: question?.optionText4, optionID: question?.optionID4, optionImg: question.optionImage4, label: '(d)' },
    { optionText: question?.optionText5, optionID: question?.optionID5, optionImg: question.optionImage5, label: '(e)' },
    { optionText: question?.optionText6, optionID: question?.optionID6, optionImg: question.optionImage6, label: '(f)' },
    { optionText: question?.optionText7, optionID: question?.optionID7, optionImg: question.optionImage7, label: '(g)' },
    { optionText: question?.optionText8, optionID: question?.optionID8, optionImg: question.optionImage8, label: '(h)' },
  ];

  const Option = ({ optionText, optionID, optionImg, questionID, currentAns, optionLabel, index }) => {
    if (!optionText) return null;
    optionText = optionText.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
    const isImage = /\.(png|jpg|jpeg)$/i.test(optionImg);
    const uri = `${siteUrls}${question?.imagePath}${optionImg}`;
    const findHastag = (optionText.match(/#/g) || []).length;
    const key = `optionText${index + 1}`//`${questionID}_${optionID}`;
    if (findHastag > 0) {
      const partsOfOptions = optionText.split(/(#)/g).filter(Boolean);
      let blankIndex = -1;
      return (
        <div className='rowMcq'>
          <div>
            <div className='row'>
              <div style={{ fontWeight: "bold", color: SWATheam.SwaBlack, width: "45px" }}>{optionLabel}</div>
              <div className='col' style={{ color: SWATheam.SwaBlack, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {partsOfOptions.map((part, pIndex) => {
                  if (part === '#') {
                    blankIndex += 1;
                    return (
                      <input
                        key={`${currentIndex}-${pIndex}`}
                        type='text'
                        value={storeData[currentIndex]?.[key]?.[pIndex] ?? ""}
                        onChange={(e) => onchangeGetData(currentIndex, e.target.value, key, pIndex)}
                        style={{ width: "80px", height: "40px", margin: '0 6px' }}
                      />
                    );
                  }
                  return <span key={`t_${pIndex}`} dangerouslySetInnerHTML={{ __html: part }} />;
                })}
                {isImage && (
                  <div >
                    <img src={uri} alt='swaadhyayan' style={{ width: 50, height: 50 }} />
                  </div>
                )
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  };



  return (
    <div className='row'>
      <div style={{ width: 35, textAlign: "center" }}>{qNumber}.</div>
      <div className='col px-1'>
        {questionParts.map((part, index) => {
          if (!part) return null;
          const isImage = /\.(png|jpg|jpeg)$/i.test(part);
          const uri = `${siteUrls}${question?.imagePath}${part}`;
          part = part.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
          return (
            <div key={index}>
              {isImage ?
                <div className='my-2'> <img className='w-100' src={uri} alt='swaadhyayan' /></div> :
                <div>{converIntoMathJax(part)}</div>
              }
            </div>
          )
        })}

        <div>
          {options.map((option, index) => (
            <Option
              key={index}
              optionText={option?.optionText}
              optionID={option?.optionID}
              optionImg={option?.optionImg}
              questionID={question?.questionID}
              optionLabel={option.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
