import React, { useEffect } from 'react'
import { SWATheam } from '../../constant'

export default function Descriptive({ descriptiveQues, currentIndex, qNumber, siteUrls }) {
  // console.log(descriptiveQues?.[currentIndex]?.questionPart1, "descriptiveQues")
  const data = descriptiveQues?.[currentIndex] || {}

  useEffect(() => {
    window.MathJax.Hub.Typeset();
  },)

  const { questionImageHight, optionImageHight } = descriptiveQues?.[currentIndex] || {} // dynamic question and option image height.


  const converIntoMathJax = (data) => {
    if (!data) return null
    data = data.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
    return <span dangerouslySetInnerHTML={{ __html: data }} />;
  };


  const GetQuestionAndOption = (val) => {
    const allPart = []
    for (let i = 1; i <= 4; i++) {
      const questionPart = val[`questionPart${i}`] || ""
      if (questionPart != null) {
        allPart.push({ questionPart })
      }
    }
    for (let i = 1; i <= 8; i++) {
      const optionText = val[`optionText${i}`] || ""
      const optionImage = val[`optionImage${i}`] || ""
      const targetText = val[`targetText${i}`] || ""
      if (optionText != null || optionImage != null || targetText != null) {
        allPart.push({ optionText, optionImage, targetText, })
      }
    }
    return allPart
  }



  return (
    <div className='row'>
      <div style={{ width: 35, textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col'>
        <div style={{ flexWrap: "wrap", justifyContent: "center", }}>
          {GetQuestionAndOption(data).map((item, index) => {
            if (!item || !item.questionPart) return null;
            const isImage = /\.(png|jpg|jpeg)$/i.test(item.questionPart);
            const uri = `${siteUrls}${data?.imagePath}${item.questionPart}`;
            return (
              <div key={index}>
                {isImage ?
                  <div className='my-2'> <img className='my-2 mx-auto d-block' draggable="false" src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain" }} alt='swaadhyayan' /></div> :
                  <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(item?.questionPart)}</div>
                }
              </div>
            )
          })}


          {/* {Object.entries(descriptiveQues?.[currentIndex] ?? {})
            .filter(([key, value]) => key.startsWith("questionPart") && value)
            .map(([key, value]) => {
              if (!value) return null;
              const isImage = /\.(png|jpg|jpeg)$/i.test(value);
              const uri = `${siteUrls}${descriptiveQues?.[currentIndex]?.imagePath}${value}`;
              if (!isImage) value = value.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
              return (
                <div key={key}>
                  {isImage ?
                    <div className='my-2'> <img className='my-2 mx-auto d-block' draggable={false} src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain" }} alt='swaadhyayan' /></div> :
                    <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{converIntoMathJax(value)}</div>
                  }
                </div>
              )
            }
            )
          } */}

        </div>

        <div className='description'>
          <div style={{ fontWeight: "bold", color: SWATheam.SwaBlack }}>
            Descriptive Question :
          </div>
          <div style={{ color: SWATheam.SwaBlack }}>
            You have to write down your answer on paper and later you have to upload it.
          </div>
        </div>

      </div>
    </div>
  )
}
