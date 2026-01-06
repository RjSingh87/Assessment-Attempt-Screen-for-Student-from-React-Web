import React, { useEffect, useState } from 'react'
import { SWATheam } from '../../constant'


export default function DD({ dropDownQues, currentIndex, qNumber, siteUrls, selectedTexts, setSelectedTexts, dropDownList }) {
  const data = dropDownQues?.[currentIndex] || {}
  const { questionImageHight, optionImageHight } = data // dynamic question and option image height.

  useEffect(() => {
    window.MathJax.Hub.Typeset();
  },)

  const converIntoMathJax = (data) => {
    if (!data) return null
    data = data.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`');
    return <span dangerouslySetInnerHTML={{ __html: data }} />;
  };


  const ConvertToOption = (question) => {
    // console.log(question[`optionText1`], "optineNEW")
    const options = [];
    for (let i = 1; i <= 8; i++) {
      const text = (question[`optionText${i}`] || "").trim();
      const img = question[`optionImage${i}`] || "";
      const target = question[`targetText${i}`] || "";

      // console.log({ text, img, target })
      if (text || img || target) {
        const targetGroups = target
          .split("???")
          .map(t => t.split(",").map(x => x.trim()));

        options.push({
          text,
          img,
          targetGroups,
          index: i
        });
      }
    }
    // console.log(options, "OptionArray")
    return options;
  }

  // const getUserAnswersDropdown = (e, idx, i) => {
  //   const val = e.target.value;
  //   setSelectedTexts(prev => {
  //     const copy = { ...prev };
  //     if (!copy[currentIndex]) copy[currentIndex] = {};
  //     if (!copy[currentIndex][idx]) copy[currentIndex][idx] = [];

  //     copy[currentIndex][idx][i] = val; // set the selected value replace if already selected

  //     const values = Object.values(copy[currentIndex]).flat().filter(v => v && v.trim()); // remove empty values
  //     const finalString = values.join(", ");
  //     dropDownList(finalString);
  //     return copy;
  //   });
  // };


  const getUserAnswersDropdownWithOptID = (e, optIdx, blankIdx) => {
    const val = e.target.value;

    setSelectedTexts(prev => {
      const copy = { ...prev };
      if (!copy[currentIndex]) copy[currentIndex] = {};
      if (!copy[currentIndex][optIdx]) copy[currentIndex][optIdx] = [];
      copy[currentIndex][optIdx][blankIdx] = val; // set/replace the exact blank value


      const optionKeysSorted = Object.keys(copy[currentIndex]).map(Number).sort((a, b) => a - b);

      const allValuesFlat = [];
      for (const k of optionKeysSorted) {
        const arr = copy[currentIndex][k] || [];
        arr.forEach(v => {
          if (v && String(v).trim()) allValuesFlat.push(String(v).trim());
        });
      }
      const finalAnswerString = allValuesFlat.join(", ");

      // --- build queOptionsID string ---
      const queParts = [];
      for (const k of optionKeysSorted) {
        const selArr = copy[currentIndex][k] || [];
        const optDef = optionsForQuestion[k];
        if (!optDef) continue;

        const positions = [];
        for (let b = 0; b < selArr.length; b++) {
          const selVal = selArr[b];
          if (!selVal || !optDef.targetGroups) continue;
          const group = optDef.targetGroups[b] || [];
          const foundIndex = group.findIndex(x => String(x).trim() === String(selVal).trim());
          const pos = foundIndex >= 0 ? foundIndex + 1 : 0;
          if (pos > 0) positions.push(pos);
          else positions.push(0);
        }

        if (positions.length > 0) {
          const filtered = positions.filter(p => p > 0);
          if (filtered.length > 0) {
            queParts.push(`${Number(k) + 1}-${filtered.join('.')}`);
          }
        }
      }
      const queOptionsID = queParts.join(',');
      dropDownList(finalAnswerString, queOptionsID);

      return copy;
    });
  };

  const optionsForQuestion = ConvertToOption(data); // call where data is the current question object

  const getUserAnswersDropdownWithOptIDUnattemptedCount = (e, optIdx, blankIdx) => {
    const val = e.target.value;

    setSelectedTexts(prev => {
      const copy = { ...prev };
      if (!copy[currentIndex]) copy[currentIndex] = {};
      if (!copy[currentIndex][optIdx]) copy[currentIndex][optIdx] = [];
      copy[currentIndex][optIdx][blankIdx] = val; // set/replace the exact blank value

      const finalAnswerArr = [];
      const queParts = [];

      for (let k = 0; k < optionsForQuestion.length; k++) {
        const selArr = copy[currentIndex][k];
        const optDef = optionsForQuestion[k];

        // if option not attempted at all
        if (!selArr || selArr.filter(v => v).length === 0) {
          queParts.push("0");
          finalAnswerArr.push("null");
          continue;
        }

        // if option attempted
        const positions = [];
        const valuesForText = [];

        for (let b = 0; b < selArr.length; b++) {
          const selVal = selArr[b];
          const group = optDef?.targetGroups?.[b] || [];

          const foundIndex = group.findIndex(
            x => String(x).trim() === String(selVal).trim()
          );

          if (foundIndex >= 0) {
            positions.push(foundIndex + 1);
            valuesForText.push(selVal);
          }
        }

        if (positions.length > 0) {
          queParts.push(`${k + 1}-${positions.join('.')}`);
          finalAnswerArr.push(valuesForText.join(", "));
        } else {
          queParts.push("0");
          finalAnswerArr.push("null");
        }
      }

      //FINAL STRINGS
      const queOptionsID = queParts.join(",");
      const finalAnswerString = finalAnswerArr.join(",");

      dropDownList(finalAnswerString, queOptionsID);

      return copy;
    });
  };



  // const newObject = [
  //   {
  //     "questionID": 2400,
  //     "questionText": "Fill in the blanks by selecting the correct option.",
  //     "questionImages": [
  //       "q1_img1.png",
  //       "q1_img2.png"
  //     ],

  //     "options": [
  //       {
  //         "id": 1,
  //         "text": "76 + 4 = 80 ⇒ _ − _ = 76",
  //         "image": "mt_tnf_gr2_ch4_act20a_img.png",

  //         "dropdowns": [
  //           ["4", "80", "76"],
  //           ["4", "80", "76"]
  //         ],

  //         "correctIndices": [2, 1]   // 1st blank = option index 2 , 2nd blank = index 1
  //       },

  //       {
  //         "id": 2,
  //         "text": "60 + 25 = 85 ⇒ _ − 25 = _",
  //         "image": "mt_tnf_gr2_ch4_act20b_img.png",

  //         "dropdowns": [
  //           ["60", "25", "85"],
  //           ["60", "25", "85"]
  //         ],

  //         "correctIndices": [3, 1]
  //       }
  //     ]
  //   }
  // ]








  return (
    <div className='row'>
      <div style={{ width: "40px", textAlign: "center", fontWeight: "bold", color: `${SWATheam.SwaBlue}` }}>{qNumber}.</div>
      <div className='col'>
        {/* --------//render questions heading only ----------*/}
        {Object.entries(data)
          .filter(([key, value]) => /^questionPart\d+$/.test(key) && value) // filter question parts only
          .map(([key, value]) => {
            if (!value) return null;
            const isImage = /\.(png|jpg|jpeg)$/i.test(value);
            const uri = `${siteUrls}${dropDownQues?.[currentIndex]?.imagePath}${value}`;
            if (!isImage) value = value.replace(/<MTECHO>/g, '`').replace(/<\/MTECHO>/g, '`').trim();
            return (
              <div key={key} className='col'>
                {isImage ?
                  <div className='my-2'>
                    <img className='my-2 mx-auto d-block' draggable={false} src={uri} style={{ maxHeight: `${questionImageHight}px`, width: "auto", maxWidth: "100%", objectFit: "contain" }} alt='swaadhyayan' />
                  </div> :
                  <div style={{ fontWeight: "bold", color: `${SWATheam.SwaBlue}`, }}>{converIntoMathJax(value)}</div>
                }
              </div>
            )
          })
        }
        {/* --------//render questions heading only ----------*/}

        {/* {newObject.map((item, index) => (
          <div key={index}>

            <div>{item.questionText}</div>

            {item.options.map((op, optIndex) => {
              const blanks = (op.text.match(/_/g) || []).length;
              const parts = op.text.split("_");

              return (
                <div key={optIndex} style={{ marginTop: 10 }}>

                  {parts.map((p, i) => (
                    <span key={i}>
                      {p}

                      {i < blanks && (
                        <select>
                          <option disabled value="">Select</option>
                          {op.dropdowns[i].map((v, ii) => (
                            <option key={ii} value={v}>{v}</option>
                          ))}
                        </select>
                      )}
                    </span>
                  ))}

                  {op.image && (
                    <img
                      src={op.image}
                      alt=""
                      style={{
                        maxHeight: 60,
                        marginLeft: 10
                      }}
                    />
                  )}
                </div>
              );

            })}
          </div>
        ))} */}



        {/* --------//render options only ----------*/}
        {ConvertToOption(data)?.map((opt, idx) => {
          const dropdownValues = opt.targetGroups;
          const blanksCount = (opt.text.match(/#/g) || []).length;
          const parts = opt.text.split("#");
          return (
            <div key={idx} className='rowDD'>
              <div style={{ fontWeight: 700, width: "30px" }}>{String.fromCharCode(97 + idx)}.</div>
              <div className='col d-flex flex-wrap g-0'>
                {parts.map((p, i) => {
                  return (
                    <div key={i}>
                      <span> {converIntoMathJax(p)}  </span>
                      {i < blanksCount && (
                        <select
                          value={selectedTexts[currentIndex]?.[idx]?.[i] || ""}
                          onChange={(e) => {
                            getUserAnswersDropdownWithOptIDUnattemptedCount(e, idx, i)
                          }}
                        >
                          <option disabled value="">Select</option>
                          {dropdownValues[i]?.map((op, ii) => (
                            <option key={ii} value={op}>{op}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )
                })}

                {opt?.img && (
                  <img
                    draggable={false}
                    src={`${siteUrls}${data?.imagePath}${opt?.img}`}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
