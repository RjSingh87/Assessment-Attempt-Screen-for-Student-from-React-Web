import React from 'react'
import MCQ from './MCQ'
import TNF from './TNF'
import DND from './DND'
import Jumble from './Jumble'
import DD from './DD'
import Matching from './Matching'
import FillUp from './FillUp'
import Descriptive from './Descriptive'
import { SWATheam } from '../../constant'
export default function Attempt({
  allAssessmentData,
  prevBtn,
  submitBtn, // just testing not in use
  submitAttem,
  nextBtn,
  currentIndex,
  qNumber,
  totalQuest,
  isDescriptive,
  mcqClicked,
  tnfAction,
  siteUrls,
  currentAns,
  currOption,
  onchangeGetData,
  storeData,
  setDropedData,
  dragDrop,
  dropedData,
  matchLines,
  setMatchLines,
  matchingDataFun,

  selectedTexts,
  setSelectedTexts,
  dropDownList,

  sortedLetters,
  setSortedLetters,
  jumBlePayLoad,

  allNonDescriptiveAttempted// for submit button show

}) {




  return (
    <div className='questionHolder'>
      {/* <div>Current Index No. {currentIndex}</div> */}
      <div className='container ps-1' style={{ paddingBottom: "5.5vh" }}>

        {allAssessmentData[currentIndex]?.activityID === 1 ?
          <MCQ mcqQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} totalQuest={totalQuest} mcqClicked={mcqClicked} siteUrls={siteUrls} currentAns={currentAns} /> :
          allAssessmentData[currentIndex]?.activityID === 2 ?
            <TNF trueNFalseQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} currOption={currOption} tnfAction={tnfAction} currentAns={currentAns} /> :
            allAssessmentData[currentIndex]?.activityID === 3 ?
              <FillUp fillBlanksQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} onchangeGetData={onchangeGetData} storeData={storeData} /> :
              allAssessmentData[currentIndex]?.activityID === 4 ?
                <Matching matchQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} matchLines={matchLines} setMatchLines={setMatchLines} matchingDataFun={matchingDataFun} /> :
                allAssessmentData[currentIndex]?.activityID === 9 ?
                  <DND dragNDropQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} setDropedData={setDropedData} dragDrop={dragDrop} dropedData={dropedData} /> :
                  allAssessmentData[currentIndex]?.activityID === 10 ?
                    <Jumble jumbleQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} sortedLetters={sortedLetters} setSortedLetters={setSortedLetters} jumBlePayLoad={jumBlePayLoad} /> :
                    allAssessmentData[currentIndex]?.activityID === 12 ?
                      <DD dropDownQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} selectedTexts={selectedTexts}
                        setSelectedTexts={setSelectedTexts} dropDownList={dropDownList} /> :
                      allAssessmentData[currentIndex]?.activityID === 15 ?
                        <Descriptive descriptiveQues={allAssessmentData} currentIndex={currentIndex} qNumber={qNumber} siteUrls={siteUrls} /> :
                        null
        }

      </div>

      <div className='btnRow'>
        <button onClick={prevBtn} className='btn' style={{ color: `${SWATheam.SwaWhite}`, backgroundColor: `${SWATheam.SwaBlue}`, display: `${currentIndex === 0 ? "none" : "block"}` }}>Prev</button>

        {allNonDescriptiveAttempted &&
          <button onClick={submitAttem} className='btn' style={{ color: `${SWATheam.SwaWhite}`, backgroundColor: `${SWATheam.SwaGreen}` }}>Submit</button>
        }
        {/* {currentIndex === totalQuest - 1 ?
          <button onClick={submitAttem} className='btn' style={{ color: `${SWATheam.SwaWhite}`, backgroundColor: `${SWATheam.SwaGreen}` }}>Submit</button> : null
        } */}

        <button onClick={nextBtn} className='btn' style={{ color: `${SWATheam.SwaWhite}`, backgroundColor: `${SWATheam.SwaBlue}`, display: `${currentIndex === allAssessmentData.length - 1 ? "none" : "block"}` }}>Next</button>
      </div>

      {isDescriptive &&
        <div>Please upload the descriptive questions....</div>
      }

    </div>
  )
}
