import React, { useEffect, useCallback } from 'react';
import { SWATheam } from '../../constant';

export default function MCQ({ mcqQues, indexNo, currentIndex, qNumber, mcqClicked, siteUrls, currentAns }) {

  useEffect(() => {
    window.MathJax.Hub.Typeset();
  },)


  const converIntoMathJax = (data) => (<div dangerouslySetInnerHTML={{ __html: data }} />);



  const question = mcqQues[currentIndex] // all assessment questions with current index
  const { questionImageHight, optionImageHight } = question || {} // dynamic question and option image height.





  const questionParts = [
    question?.questionPart1,
    question?.questionPart2,
    question?.questionPart3,
    question?.questionPart4,
  ];

  const options = [
    { optionText: question?.optionText1, optionImage: question?.optionImage1, optionID: question?.optionID1, label: 'a.' },
    { optionText: question?.optionText2, optionImage: question?.optionImage2, optionID: question?.optionID2, label: 'b.' },
    { optionText: question?.optionText3, optionImage: question?.optionImage3, optionID: question?.optionID3, label: 'c.' },
    { optionText: question?.optionText4, optionImage: question?.optionImage4, optionID: question?.optionID4, label: 'd.' },
    { optionText: question?.optionText5, optionImage: question?.optionImage5, optionID: question?.optionID5, label: 'e.' },
    { optionText: question?.optionText6, optionImage: question?.optionImage6, optionID: question?.optionID6, label: 'f.' },
    { optionText: question?.optionText7, optionImage: question?.optionImage7, optionID: question?.optionID7, label: 'g.' },
    { optionText: question?.optionText8, optionImage: question?.optionImage8, optionID: question?.optionID8, label: 'h.' },
  ];

  const handleMcqClick = useCallback((optionID, questionID, optionText) => {
    mcqClicked(optionID, questionID, optionText);
  }, [mcqClicked]);


  const Option = ({ optionText, optionID, optionImage, questionID, currentAns, optionLabel }) => {
    if (!optionText && !optionImage) return null;

    if (optionText) optionText = optionText.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`'); // convert mathjax tags

    const isImage = optionImage && /\.(png|jpg|jpeg)$/i.test(optionImage); // check option is image or not
    const uri = `${siteUrls}${question?.imagePath}${optionImage}`;
    const isSelected = currentAns?.quesID === questionID && currentAns?.queOptionsID === optionID;

    const textOrImage = isImage ? optionImage : optionText;

    return (
      <div onClick={() => handleMcqClick(optionID, questionID, textOrImage)} className='rowMcq' style={{ backgroundColor: isSelected ? SWATheam.SwaBlue : SWATheam.SwaWhite }} >

        {/* -----------radio button------------- */}
        {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, width: "20px", height: "20px", borderRadius: 20 / 2, backgroundColor: isSelected ? SWATheam.SwaBlue : SWATheam.SwaGray }}>
          <div style={{ width: "8px", height: "8px", borderRadius: 8 / 2, backgroundColor: SWATheam.SwaWhite }}></div>
        </div> */}
        {/* -----------radio button------------- */}

        <div style={{ fontWeight: "bold", width: "30px", color: isSelected ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>{optionLabel}</div>
        <div className='col' style={{ marginLeft: "0px" }}  >
          {isImage &&
            <img draggable={false} src={uri} style={{ width: "auto", maxWidth: "100%", maxHeight: `${optionImageHight}px`, objectFit: "contain", }} />
          }
          <div className='childMargin' style={{ color: isSelected ? SWATheam.SwaWhite : SWATheam.SwaBlack }}>{converIntoMathJax(optionText)}</div>

        </div>
      </div>

    );
  };


  return (
    <div className='row'>
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>

      <div className='col px-1'>
        {/* -------------------------------question heading -------------------------------------------------*/}
        {questionParts.map((part, index) => {
          if (!part) return null;
          const isImage = /\.(png|jpg|jpeg)$/i.test(part);
          const uri = `${siteUrls}${question?.imagePath}${part}`;

          if (!isImage) part = part.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`').trim();


          return (
            <div key={index}>
              {isImage ?
                <div className='my-2'> <img className='my-2 mx-auto d-block' draggable={false} src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain", border: `1px solid ${SWATheam.SwaLightBlue}`, borderRadius: "5px" }} alt='swaadhyayan' /></div> :
                <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(part)}</div>
              }
            </div>
          )
        })}
        {/* -----------------------------------question heading----------------------------------------------- */}


        {/* ------------------------------questions options -------------------*/}
        <div className='my-3'>
          {options.map((option, index) => (
            <Option
              key={index}
              optionText={option.optionText}
              optionImage={option.optionImage}
              optionID={option.optionID}
              questionID={question?.questionID}
              currentAns={currentAns}
              optionLabel={option.label}
            />
          ))}
        </div>
        {/* ------------------------------questions options -------------------*/}
      </div>
    </div>
  );
}
