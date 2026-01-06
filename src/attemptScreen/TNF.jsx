import React, { useEffect } from 'react'
import { SWATheam } from '../../constant';

export default function TNF({ trueNFalseQues, currentIndex, qNumber, siteUrls, currOption, tnfAction, currentAns }) {

  useEffect(() => {
    window.MathJax.Hub.Typeset();
  },)


  const converIntoMathJax = (data) => (<div dangerouslySetInnerHTML={{ __html: data }} />);


  const question = trueNFalseQues[currentIndex] // all TNF assessment questions with current index
  const { questionImageHight, optionImageHight } = question || {} // dynamic question and option image height.

  const questionParts = [
    question?.questionPart1,
    question?.questionPart2,
    question?.questionPart3,
    question?.questionPart4,
  ];

  const options = [
    { optionText: question?.optionText1, optionImage: question.optionImage1, optionID: question?.optionID1, label: 'a.' },
    { optionText: question?.optionText2, optionImage: question.optionImage2, optionID: question?.optionID2, label: 'b.' },
    { optionText: question?.optionText3, optionImage: question.optionImage3, optionID: question?.optionID3, label: 'c.' },
    { optionText: question?.optionText4, optionImage: question.optionImage4, optionID: question?.optionID4, label: 'd.' },
    { optionText: question?.optionText5, optionImage: question.optionImage5, optionID: question?.optionID5, label: 'e.' },
    { optionText: question?.optionText6, optionImage: question.optionImage6, optionID: question?.optionID6, label: 'f.' },
    { optionText: question?.optionText7, optionImage: question.optionImage7, optionID: question?.optionID7, label: 'g.' },
    { optionText: question?.optionText8, optionImage: question.optionImage8, optionID: question?.optionID8, label: 'h.' },
  ];

  const Option = ({ optionText, optionID, optionImage, questionID, currentAns, optionLabel, index }) => {
    if (!optionText && !optionImage) return null;

    if (optionText) optionText = optionText.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');

    const isImage = optionImage && /\.(png|jpg|jpeg)$/i.test(optionImage);
    const uri = `${siteUrls}${question?.imagePath}${optionImage}`;

    // const isSelected = currOption[String(index + 1)]
    const isSelected = currOption[String(optionID)]
    // const isSelected = currentAns?.quesID === questionID && currentAns?.queOptionsID === optionID;

    return (
      <div className='rowMcq' >
        <div >

          <div className='row'>
            <div style={{ fontWeight: "bold", color: SWATheam.SwaBlack, width: "30px", textAlign: "center" }}>{optionLabel}</div>
            <div className='col' style={{ color: SWATheam.SwaBlack }}>{converIntoMathJax(optionText)}
              {isImage && (
                <img draggable={false} src={uri} style={{ width: "auto", maxWidth: "100%", maxHeight: `${optionImageHight}px`, objectFit: "contain" }} />
              )}
              <div className='rowButtTNF'>
                <div onClick={() => handleOptionPress(optionID, 1, questionID)} style={{ backgroundColor: isSelected == 1 ? SWATheam.SwaGreen : SWATheam.SwaWhite, borderColor: isSelected == 1 ? SWATheam.SwaGreen : SWATheam.SwaBlue, color: isSelected == 1 ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>{trueNFalseQues[currentIndex]?.targetText1}</div>
                <div onClick={() => handleOptionPress(optionID, 2, questionID)} style={{ backgroundColor: isSelected == 2 ? SWATheam.SwaRed : SWATheam.SwaWhite, borderColor: isSelected == 2 ? SWATheam.SwaRed : SWATheam.SwaBlue, color: isSelected == 2 ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>{trueNFalseQues[currentIndex]?.targetText2}</div>
              </div>
            </div>



          </div>
        </div>
      </div>

    );
  };


  const handleOptionPress = (optionID, value, questionID) => {
    tnfAction(optionID, value, questionID);// Perform the action with immediate effect
  };



  return (
    <div className='row'>
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col'>

        {/* -------------------------------question heading -------------------------------------------------*/}
        {questionParts.map((part, index) => {
          if (!part) return null;
          const isImage = /\.(png|jpg|jpeg)$/i.test(part);
          const uri = `${siteUrls}${question?.imagePath}${part}`;

          part = part.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');


          return (
            <div key={index}>
              {isImage ?
                <div className='my-2'> <img style={{ width: "auto", maxWidth: "100%", maxHeight: `${questionImageHight}px`, objectFit: "contain" }} src={uri} alt='swaadhyayan' /></div> :
                <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(part)}</div>
              }
            </div>
          )
        })}
        {/* -----------------------------------question heading----------------------------------------------- */}

        {/* ------------------------------questions options -------------------*/}
        <div>
          {options.map((option, index) => (
            <Option
              key={index}
              optionText={option.optionText}
              optionImage={option.optionImage}
              optionID={option.optionID}
              questionID={question?.questionID}
              currentAns={currentAns}
              optionLabel={option.label}
              index={index}
            />
          ))}
        </div>
        {/* ------------------------------questions options -------------------*/}
      </div>

    </div>
  )
}
