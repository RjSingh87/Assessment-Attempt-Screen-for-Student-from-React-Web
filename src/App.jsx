import { useState, useEffect, useRef } from 'react';
import './App.css';
import { apiRoot } from '../constant';
import Services from '../Services';
import Attempt from './attemptScreen/Attempt';
import Loader from './attemptScreen/Loader';
import Swal from 'sweetalert2'
import AssessmentTimer from './AssessmentTimer';
import Instruction from './Instruction';


function App() {
	const [nativeData, setNativeData] = useState(null);
	const [userDetails, setUserDetails] = useState({ "classID": null, "schoolCode": null, "userRefID": null, "assessmentID": null })
	const [allAssessmentData, setAllAssessmentData] = useState({ status: false, AssName: null, questions: [], qNumber: 1, siteUrls: null, totalQuest: null, totalMks: null, userTypeID: null, userRefID: null, sectionID: null, totalTime: null })
	const [currentIndex, setCurrentIndex] = useState(0)
	const [loader, setLoader] = useState(false)
	const [isDescriptive, setIsDescriptive] = useState(false)
	const [finalPost, setFinalPost] = useState([]);
	const [storeData, setStoreData] = useState([])
	const [attemptStore, setattemptStore] = useState({ assMentIds: "", assName: "", sujectIds: "" });
	const [finalArrayData, setFinalArray] = useState([])
	const [dropedData, setDropedData] = useState({});
	const [matchLines, setMatchLines] = useState({});
	const [selectedTexts, setSelectedTexts] = useState({});
	const [sortedLetters, setSortedLetters] = useState({})

	const [showDescModal, setShowDescModal] = useState(false);
	const [descFile, setDescFile] = useState(null);



	//for submit button showing when all question attempted atleast one with descriptive.
	const nonDescriptiveQuestions = allAssessmentData.questions.filter(q => q.activityID !== 15);
	const attemptedIds = new Set(finalPost.map(item => item.quesID));
	const allNonDescriptiveAttempted = nonDescriptiveQuestions.every(q => attemptedIds.has(q.questionID));
	const isDescriptiveAvailable = allAssessmentData?.questions?.some(q => q.activityID == 15);
	// ------------------------------

	//for attempted question counting
	const attemptedSet = new Set(finalPost.map(fp => fp.quesID));
	const attemptedCount = allAssessmentData.questions.filter(q => attemptedSet.has(q.questionID)).length;
	// ------------------------------


	//for unattemptedQuestions question counting
	const unattemptedQuestions = allAssessmentData.questions.map((q, index) => ({ quesID: q.questionID, qNo: index + 1 })).filter(q => !attemptedIds.has(q.quesID));
	// ------------------------------



	useEffect(() => {
		getAssQuest()
	}, [])



	useEffect(() => {
		const value = storeData?.[currentIndex];
		// Ignore agar storeData null, undefined, ya "" to function call na ho
		if (!value || (typeof value === "object" && Object.keys(value).length === 0) || value === "") return
		FinalSubmitData();  // jab fill ups ke input me value enter karne par function call hota hai.
	}, [storeData]);






	// useEffect(() => {
	// 	const handleMessage = (event) => {
	// 		alert("-----")
	// 		try {
	// 			const data = JSON.parse(event.data);
	// 			setNativeData(data);
	// 			if(data.userData!=undefined){
	// 				alert('hello')
	// 				getAssQuest(data)
	// 			}else{
	// 				alert('not data')
	// 			}
	// 		} catch (err) {
	// 			console.error("JSON parse error:", err);
	// 		}
	// 	};
	// 	window.addEventListener("message", handleMessage);
	// 	return () => window.removeEventListener("message", handleMessage);
	// },[]);

	// ✅ React Web to React-Native data transfer.
	const sendToReactNative = () => {
		if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
			window.ReactNativeWebView.postMessage("Hello from Web!");
		}
	};




	const userData = nativeData?.userData?.data
	// const {classID, schoolCode, userRefID,  } = data.userData.data || {}
	// const {assessmentID  } = nativeData?.allAssessmentData?.questions[0] || {}


	let currentAns = finalPost.filter(item => item.quesID == allAssessmentData?.questions[currentIndex]?.questionID)[0];
	let currOption = {};
	if (currentAns != undefined && allAssessmentData?.questions[currentIndex].activityID == 2) {
		let ansArray = currentAns.queOptionsID.split(",");
		for (let ans of ansArray) {
			let arr = ans.split("-");
			currOption[arr[0]] = arr[1];
		}
	}




	const getAssQuest = async (data) => {
		setLoader(true)
		const payload = {
			"assessmentID": 9140,//9002,//8862, //<= all type assessment //8571, //8512,//8466,//8079,//8148,//8186,//8101,//8079, //5845, //data?.allAssessmentData?.questions[0]?.assessmentID,
			"classID": 5,//2, //data?.userData?.data?.classID,
			"schoolCode": "B2BUSRSCH01", //data?.userData?.data?.schoolCode,
			"userRefID": 50645 //data?.userData?.data?.userRefID
		}
		try {
			const result = await Services.post(apiRoot.getAssessmentQuestion, payload)
			if (result.status === "success") {
				const assData = result?.assessmentQues;
				const totalQuest = assData.length;
				const totalMks = result?.totalMarks;
				const userTypeID = result?.userTypeID;
				const sectionID = result?.sectionID;
				const userRefID = result?.userRefID;
				const siteUrls = result?.siteUrl;
				const totalTime = result?.totalTime

				setUserDetails((prev) => { return { ...prev, classID: payload.classID, schoolCode: payload.schoolCode, userRefID: payload.userRefID, assessmentID: payload.assessmentID } }) //userDetails data...

				setAllAssessmentData((prev,) => { return { ...prev, status: true, questions: assData, totalQuest: totalQuest, totalMks: totalMks, siteUrls: siteUrls, totalTime: totalTime, userTypeID, sectionID, userRefID } })

				let dd = result.assessmentQues;
				let ans = Array(dd.length);
				for (let i = 0; i < ans.length; i++) {
					ans[i] = {};
				}
				setStoreData(ans)

			} else if (result.status === "error") {
				alert(JSON.stringify(result?.message))
			}
		} catch (error) {
			if (error.message == "TypeError: Network request failed") {
				alert("Network Error", `Please try again.`)
			}
		} finally {
			setLoader(false)
		}
	}




	const prevBtn = () => {
		setCurrentIndex(currentIndex - 1)// current question index.
		setAllAssessmentData((prev) => { return { ...prev, qNumber: prev.qNumber - 1 } }) // set current question ques no.
		console.log("From app.js PREV", currentIndex)
	}

	const submitBtn = () => {
		if (allAssessmentData?.questions[currentIndex]?.activityID === 15) {
			console.log("Yes Decreptive Questions.....")
			Swal.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, delete it!"
			}).then((result) => {
				if (result.isConfirmed) {
					setIsDescriptive(true)
				}
			});
		}
	}

	const nextBtn = () => {
		// console.log(allAssessmentData.questions[currentIndex + 1].activityID, "Next function")		
		setCurrentIndex(currentIndex + 1) // current question index.
		setAllAssessmentData((prev) => { return { ...prev, qNumber: prev.qNumber + 1 } }) // set current question ques no.
		console.log("From app.js NEXT", currentIndex)
	}


	// this function update and replace value, agar first time value enter karta hai to update agar pahle se value hai to replace.
	const attemptData = (assessmentQues) => {
		// console.log({ assessmentQues })
		const thisData = [];
		const prevData = finalPost;
		prevData.map((item) => {
			thisData.push(item);
		});

		let reAttempt = 0;
		thisData.map((item, index) => {
			if (assessmentQues.quesID == item.quesID) {
				reAttempt = 1;
				thisData[index] = assessmentQues;
			}
		});

		if (!reAttempt) {
			thisData.push(assessmentQues);
		}
		// console.log(thisData, 'thisdata')
		setFinalPost(thisData);
		// console.log(finalPost, 'final')
	}

	function mcqClicked(optIds, quetIds, OptText) {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]
		// alert(OptText)
		const mcqContainer = {
			"quesID": quetIds,
			"totalMarks": allAssessmentData.totalMks,
			"assessmentID": assessmentID,
			"classID": classID,
			"subjectID": subjectID,
			"queOptionsID": optIds,
			"quesOptionText": OptText,
			"StudentResult": "-1",
			"marks": marksPerQuestion,
			"rightAnsText": answerText,
			"rightAnsID": answerIDs,
			"QueSubCatagory": "1-1",
			"pendingTime": "01:04:46",
			"eidID": eadID,
			"mID": miID
		}
		console.log({ "MCQ": mcqContainer })
		attemptData(mcqContainer)
	}

	function tnfAction(optID, answer, crtq) {

		const currentAns = finalPost.find(item => item.quesID === crtq);

		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData.questions[currentIndex];

		const allTNFoptinIDs = [
			allAssessmentData?.questions[currentIndex]?.optionID1,
			allAssessmentData?.questions[currentIndex]?.optionID2,
			allAssessmentData?.questions[currentIndex]?.optionID3,
			allAssessmentData?.questions[currentIndex]?.optionID4,
			allAssessmentData?.questions[currentIndex]?.optionID5,
			allAssessmentData?.questions[currentIndex]?.optionID6,
			allAssessmentData?.questions[currentIndex]?.optionID7,
			allAssessmentData?.questions[currentIndex]?.optionID8,
		].filter(Boolean).map(String);

		let tnfArray = allTNFoptinIDs.map(() => "0");

		if (currentAns?.queOptionsID) {
			currentAns.queOptionsID.split(",").forEach((val, idx) => {
				if (val !== "0") tnfArray[idx] = val;
			});
		}

		const alreadySelectedValue = currentAns?.queOptionsID?.includes(`${optID}-${answer}`) // prevent multiple click
		if (alreadySelectedValue) return;

		const targetIndex = allTNFoptinIDs.indexOf(String(optID));
		if (targetIndex !== -1) {
			tnfArray[targetIndex] = `${optID}-${answer}`;
		}


		const quesOptionText = tnfArray
			.map(val => {
				if (val === "0") return "null";
				const answer = val.split("-")[1];
				const { targetText1, targetText2, targetText3 } = allAssessmentData?.questions[currentIndex]

				if (answer === "1") return targetText1;
				if (answer === "2") return targetText2;
				return "null";

			}).join(",");


		const TnfPayLoad = {
			"quesID": questionID,
			"totalMarks": allAssessmentData.totalMks,
			"assessmentID": assessmentID,
			"classID": classID,
			"subjectID": subjectID,
			"queOptionsID": tnfArray.join(","),
			"quesOptionText": quesOptionText,
			"StudentResult": "-1",
			"marks": marksPerQuestion,
			'rightAnsText': answerText,
			"rightAnsID": answerIDs,
			"QueSubCatagory": "2-2",
			"pendingTime": "01:03:57",
			"eidID": eadID,
			"mID": miID
		};

		console.log("TNF PAYLOAD", JSON.stringify(TnfPayLoad));
		attemptData(TnfPayLoad);
	}


	// old function tnfAction
	// function tnfAction(optIDS, answer, crtq) {
	// 	let currentAns = finalPost.filter(item => item.quesID == crtq)[0];
	// 	const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]

	// 	const newData = `${optIDS}-${answer}`;
	// 	let selectedOption = newData;
	// 	if (currentAns != undefined) {
	// 		let tnfArray = currentAns.queOptionsID.split(",");
	// 		// let currOpt = optIDS;
	// 		let index = -1;
	// 		for (let i = 0; i < tnfArray.length; i++) {
	// 			let optId = tnfArray[i].split("-")[0];
	// 			if (optId == optIDS) {
	// 				index = i;
	// 				break;
	// 			}
	// 		}
	// 		if (index != -1) {
	// 			tnfArray[index] = newData;
	// 		} else {
	// 			tnfArray.push(newData);
	// 		}
	// 		selectedOption = tnfArray.sort().join(",");
	// 	}

	// 	const TnfPayLoad = {
	// 		"quesID": questionID,
	// 		"totalMarks": allAssessmentData?.totalMks,
	// 		"assessmentID": assessmentID,
	// 		"classID": classID,
	// 		"subjectID": subjectID,
	// 		"queOptionsID": selectedOption,
	// 		"quesOptionText": "0",
	// 		"StudentResult": "-1",
	// 		"marks": marksPerQuestion,
	// 		"rightAnsText": answerText,
	// 		"rightAnsID": answerIDs,
	// 		"QueSubCatagory": "2-2",
	// 		"pendingTime": "01:03:57",
	// 		"eidID": eadID,
	// 		"mID": miID
	// 	}
	// 	console.log({ "True and False": TnfPayLoad })
	// 	attemptData(TnfPayLoad)
	// }

	function dragDrop(data) {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]

		const totalBlanks = answerText ? answerText.replaceAll("???", ",").split(",").filter(v => v.trim() !== "").length : 0;

		const queOptionsArr = Array(totalBlanks).fill("0");
		const quesOptionTextArr = Array(totalBlanks).fill("null");

		// Object.entries(data || {}).forEach(([droppableKey, arr]) => {
		// 	if (!Array.isArray(arr)) return;

		// 	const droppableIdx = Number(droppableKey.replace("droppable", "")) - 1;

		// 	//CASE 1: single blank per droppable (old behaviour)
		// 	if (arr.length === 1 && arr[0]) {
		// 		const { text, optionIndex } = arr[0];
		// 		const targetID = optionIndex + 1;

		// 		queOptionsArr[droppableIdx] = `${droppableIdx + 1}-${targetID}`;
		// 		quesOptionTextArr[droppableIdx] = text;
		// 	}
		// 	//CASE 2: multiple blanks in same droppable
		// 	else {
		// 		arr.forEach((item, idx) => {
		// 			if (!item) return;

		// 			const { text, optionIndex } = item;
		// 			const targetID = optionIndex + 1;

		// 			queOptionsArr[idx] = `${idx + 1}-${targetID}`;
		// 			quesOptionTextArr[idx] = text;
		// 		});
		// 	}
		// });



		const answerMap = {};
		answerIDs?.split(",").forEach(part => {
			const [drop, ids] = part.trim().split("-");
			answerMap[Number(drop) - 1] = ids.split(".").map(i => Number(i) - 1);
		});

		Object.entries(data || {}).forEach(([droppableKey, arr]) => {
			if (!Array.isArray(arr)) return;
			const droppableIdx = Number(droppableKey.replace("droppable", "")) - 1;
			// CASE 1: single blank (Type 1 & 2)
			if (arr.length === 1 && arr[0]) {
				const globalIndex = droppableIdx;
				quesOptionTextArr[globalIndex] = arr[0].text;
			}

			// CASE 2: multiple blanks (Type 3 FIX)
			else {
				const globalIndexes = answerMap[droppableIdx] || [];
				arr.forEach((item, idx) => {
					if (!item || globalIndexes[idx] === undefined) return;
					const gIdx = globalIndexes[idx];
					quesOptionTextArr[gIdx] = item.text;
				});
			}
		});




		const xdata = {
			"quesID": questionID,
			"totalMarks": allAssessmentData.totalMks,
			"assessmentID": assessmentID,
			"classID": classID,
			"subjectID": subjectID,
			"queOptionsID": queOptionsArr.join(","),
			"quesOptionText": quesOptionTextArr.join(','),
			"StudentResult": "-1",
			"marks": marksPerQuestion,
			"rightAnsText": answerText,
			"rightAnsID": answerIDs,
			"QueSubCatagory": "9-1",
			"pendingTime": '0',
			"eidID": eadID,
			"mID": miID
		}
		console.log({ "Drag and Drop": JSON.stringify(xdata) })
		attemptData(xdata)
	}





	// function dragDrop(data) {
	// 	const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]

	// 	const totalBlanks = answerText ? answerText.split(",").filter(v => v.trim() !== "").length : 0;

	// 	const queOptionsArr = Array(totalBlanks).fill("0");
	// 	const quesOptionTextArr = Array(totalBlanks).fill("null");

	// 	Object.entries(data || {}).forEach(([droppableKey, arr]) => {
	// 		const idx = Number(droppableKey.replace("droppable", "")) - 1;
	// 		if (!Array.isArray(arr) || !arr[0]) return;

	// 		const { text, optionIndex } = arr[0];
	// 		const targetID = optionIndex + 1;

	// 		queOptionsArr[idx] = `${idx + 1}-${targetID}`;
	// 		quesOptionTextArr[idx] = text;
	// 	});
	// 	// console.log({ queOptionsArr, quesOptionTextArr })

	// 	const xdata = {
	// 		"quesID": questionID,
	// 		"totalMarks": allAssessmentData.totalMks,
	// 		"assessmentID": assessmentID,
	// 		"classID": classID,
	// 		"subjectID": subjectID,
	// 		"queOptionsID": queOptionsArr.join(","),
	// 		"quesOptionText": quesOptionTextArr.join(','),
	// 		"StudentResult": "-1",
	// 		"marks": marksPerQuestion,
	// 		"rightAnsText": answerText,
	// 		"rightAnsID": answerIDs,
	// 		"QueSubCatagory": "9-1",
	// 		"pendingTime": '0',
	// 		"eidID": eadID,
	// 		"mID": miID
	// 	}
	// 	console.log({ "Drag and Drop": JSON.stringify(xdata) })
	// 	attemptData(xdata)
	// }

















	const onchangeGetData = (qInd, userValue, optSet, inputIndex) => {
		// console.log({ qInd, userValue, optSet, inputIndex })
		setStoreData(prev => {
			const copy = [...prev]
			if (!copy[qInd]) { copy[qInd] = {} }
			if (!copy[qInd][optSet]) { copy[qInd][optSet] = [] }
			copy[qInd][optSet][inputIndex] = userValue
			return copy
		})
		// FinalSubmitData()
	}

	function FinalSubmitData() {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]
		// auto merge all optionText arrays
		const currentObj = storeData[currentIndex] || {}


		const allAnsText = answerText?.replaceAll("???", ",").split(",").map(item => item.trim())?.filter(Boolean)?.length || 0

		const queOptionsID = answerText?.replaceAll("???", ",").split(",").map((item, index) => { return `${index + 1}` }).join(",")

		let fillArray = Array(allAnsText).fill("null");

		Object.values(currentObj).forEach(arr => {
			if (Array.isArray(arr)) {
				arr.forEach((val, idx) => {
					if (val && val.trim() !== "") {
						fillArray[idx] = val.trim();
					}
				});
			}
		});
		const valuesOfUser = fillArray.join(", ");

		const Fdata = {
			quesID: questionID,
			totalMarks: allAssessmentData.totalMks,
			assessmentID: assessmentID,//attemptStore.assMentIds,
			classID: classID,
			subjectID: subjectID,
			queOptionsID: queOptionsID, //"Not required",    // server side
			quesOptionText: valuesOfUser,    // this is correct method of send user answer.
			StudentResult: "-1",
			marks: marksPerQuestion,
			rightAnsText: answerText,
			rightAnsID: answerIDs,
			QueSubCatagory: "3-1",
			pendingTime: "00:59:35",
			eidID: eadID,
			mID: miID
		};
		console.log("Fill Ups", JSON.stringify(Fdata))
		attemptData(Fdata)
	}

	function matchingDataFun(rawPairs, currentIndex) {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerText, answerIDs } = allAssessmentData?.questions[currentIndex]

		const totalLeft = answerText?.split(",").map(v => v.trim()).filter(Boolean).length || 0;

		const queOptionsArr = Array(totalLeft).fill("0");
		const quesOptionTextArr = Array(totalLeft).fill("null");

		rawPairs.forEach(pair => {
			const [left, right] = pair.split("-");
			const leftIndex = Number(left.replace("L", "")) - 1;
			const rightNum = right.replace("R", "");

			if (leftIndex >= 0 && leftIndex < totalLeft) {
				const val = `${leftIndex + 1}-${rightNum}`;
				queOptionsArr[leftIndex] = val;
				quesOptionTextArr[leftIndex] = val;
			}
		});

		// let matchData = convertRowData.sort().join(",");

		const matchPayLoad = {
			"quesID": questionID,
			"totalMarks": allAssessmentData.totalMks,
			"assessmentID": assessmentID,
			"classID": classID,
			"subjectID": subjectID,
			"queOptionsID": queOptionsArr.join(","),
			"quesOptionText": quesOptionTextArr.join(","),
			"StudentResult": "-1",
			"marks": marksPerQuestion,
			"rightAnsText": answerText,
			"rightAnsID": answerIDs,
			"QueSubCatagory": "4-1",
			"pendingTime": '0',
			"eidID": eadID,
			"mID": miID
		}
		console.log(JSON.stringify(matchPayLoad), "MathPaylaoed..")
		attemptData(matchPayLoad)
	}




	function dropDownList(studenAsnwer, queOptionsID) {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerIDs, answerText } = allAssessmentData?.questions[currentIndex]
		const drpPayLoad = {
			"quesID": questionID,
			"totalMarks": allAssessmentData.totalMks,
			"assessmentID": assessmentID,
			"classID": classID,
			"subjectID": subjectID,
			"queOptionsID": queOptionsID, //0
			"quesOptionText": studenAsnwer,
			"StudentResult": "-1",
			"marks": marksPerQuestion,
			"rightAnsID": answerIDs,
			"rightAnsText": answerText,
			"QueSubCatagory": "12-2",
			"pendingTime": "01:04:32",
			"eidID": eadID,
			"mID": miID
		}

		console.log(JSON.stringify(drpPayLoad), "drpPayLoad?")
		attemptData(drpPayLoad)
	}



	function jumBlePayLoad(studentAnswer) {
		const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerIDs, answerText, } = allAssessmentData.questions[currentIndex];

		const perOption = studentAnswer[currentIndex] || {};

		const totalOptions = answerText.split(",").length; // total options right answer jo backend se liya gaya hai.

		const finalAnswers = Array.from({ length: totalOptions }, (_, idx) => {
			const opt = perOption[idx];

			if (opt?.touched && Array.isArray(opt.letters)) {
				return opt.letters.join("");
			}
			return "null";
		});

		const jmplPaydata = {
			quesID: questionID,
			totalMarks: allAssessmentData.totalMks,
			assessmentID,
			classID,
			subjectID,
			queOptionsID: 0,
			quesOptionText: finalAnswers.join(","),
			StudentResult: "-1",
			marks: marksPerQuestion,
			rightAnsText: answerText,
			rightAnsID: answerIDs,
			QueSubCatagory: "10-1",
			pendingTime: "0",
			eidID: eadID,
			mID: miID
		};

		console.log("FINAL PAYLOAD", jmplPaydata);
		attemptData(jmplPaydata);
	}



	// without null sending function intial useless 
	// function jumBlePayLoad(studentAnswer) {
	// 	const { questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerIDs, answerText } = allAssessmentData?.questions[currentIndex];
	// 	const perOption = studentAnswer[currentIndex] || {};
	// 	const finalAnswers = Object.keys(perOption).map(optIdx => perOption[optIdx].join("")).filter(ans => ans.trim());
	// 	const merged = finalAnswers.join(",");
	// 	const jmplPaydata = {
	// 		"quesID": questionID,
	// 		"totalMarks": allAssessmentData.totalMks,
	// 		"assessmentID": assessmentID,
	// 		"classID": classID,
	// 		"subjectID": subjectID,
	// 		"queOptionsID": 0,
	// 		"quesOptionText": merged,
	// 		"StudentResult": "-1",
	// 		"marks": marksPerQuestion,
	// 		"rightAnsText": answerText,
	// 		"rightAnsID": answerIDs,
	// 		"QueSubCatagory": "10-1",
	// 		"pendingTime": "0",
	// 		"eidID": eadID,
	// 		"mID": miID
	// 	};
	// 	console.log(jmplPaydata, "jmplPaydata");
	// 	attemptData(jmplPaydata);
	// }




	const getDescriptivePayloads = () => { return allAssessmentData.questions.filter(q => q.activityID == 15).map(q => buildDescriptivePayload(q)); };

	const buildDescriptivePayload = (q) => ({
		quesID: q.questionID,
		totalMarks: allAssessmentData.totalMks,
		assessmentID: q.assessmentID,
		classID: q.classID,
		subjectID: q.subjectID,
		queOptionsID: 0,
		quesOptionText: 0,
		StudentResult: "-1",
		marks: q.marksPerQuestion,
		rightAnsID: q.answerIDs,
		rightAnsText: q.answerText,
		QueSubCatagory: "12-2",
		pendingTime: "00:00:00",
		eidID: q.eadID,
		mID: q.miID
	});


	const mergeFinalPostWithDescriptive = () => {
		const descriptivePayloads = getDescriptivePayloads();
		const existingIds = new Set(finalPost.map(p => p.quesID));
		const filtered = descriptivePayloads.filter(p => !existingIds.has(p.quesID));
		return [...finalPost, ...filtered];
	};


	const submitAttem = () => {
		console.log(finalPost, "call function...")

		if (attemptedCount) {
			console.log("call Rajfunction...")
			Swal.fire({
				title: "Are you sure?",
				text: "Once Submit, your will not be able to Attempt Again!",
				icon: "warning",
				showCancelButton: true,
				cancelButtonColor: "#d33",
				confirmButtonColor: "#3085d6",
				confirmButtonText: "OK"
			}).then(async (result) => {
				if (!result.isConfirmed) return
				try {
					setLoader(true)
					const { schoolCode, academicYear, questionID, assessmentID, classID, subjectID, miID, eadID, marksPerQuestion, answerIDs, answerText, } = allAssessmentData?.questions[currentIndex]
					const attemptData = mergeFinalPostWithDescriptive()
					const payloadOfFinalSubmit = {
						"schoolCode": schoolCode,
						"userRefID": allAssessmentData.userRefID,
						"academicYear": academicYear,
						"userTypeID": allAssessmentData.userTypeID,
						"classID": classID,
						"sectionID": allAssessmentData.sectionID,
						"attemptData": attemptData
					}
					console.log(payloadOfFinalSubmit, "payloadOfFinalSubmit????")
					const assResult = await Services.post(apiRoot.submitAssessment, payloadOfFinalSubmit)
					if (assResult.status === "success") {
						Swal.fire("Congratulations!", `${assResult?.message}`, "success");
						if (isDescriptiveAvailable) {
							openDescriptiveUploadModal()
						} else {
							navigate(-1);
						}
						console.log(assResult, "assResult????")
					} else if (assResult.status === "error") {
						Swal.fire(`${assResult?.status}`, `${assResult?.message}`, "error");
						console.log(assResult, "elseIfassResult????")
					}

				} catch (error) {
					if (error.message == "TypeError: Network request failed") {
						alert("Network Error", `Please try again.`)
						console.log(error, "elseIfassResult????")
					}
				}
				finally { setLoader(false) }
			});
		}
	}



	const openDescriptiveUploadModal = () => {
		setShowDescModal(true);
	};





	return (
		<div className="App">

			<div className='p-1 assDetailContainer'>

				<div className='d-flex justify-content-between align-items-center'>
					<div className='hr'>{`Asse. Name: ${allAssessmentData?.questions[0]?.assessmentName ?? "N/A"}`}</div>
					<Instruction />
				</div>
				<hr className='my-1'></hr>

				<div className='d-flex justify-content-between'>
					<div>{`Subject: ${allAssessmentData?.questions[0]?.subjectName ?? "N/A"}`}</div>
					<div>{`Total Marks: ${allAssessmentData?.totalMks ?? "0"}`}</div>
				</div>


				<div className='d-flex justify-content-between'>
					<div>{`Attempted Ques: ${attemptedCount ?? "0"} / ${allAssessmentData?.totalQuest ?? "0"}`}</div>
					<div>
						<AssessmentTimer
							totalTime={allAssessmentData?.totalTime}
							unattemptedQuesCount={unattemptedQuestions}
						/>
					</div>
				</div>
			</div>


			{/* data prop drilling.... */}
			{allAssessmentData?.questions?.length > 0 ?
				<Attempt
					allAssessmentData={allAssessmentData?.questions} // all assessment questions array.
					prevBtn={prevBtn} //Prev button
					submitBtn={submitBtn} // Submit button
					nextBtn={nextBtn} // Next button
					currentIndex={currentIndex} // page index
					qNumber={allAssessmentData?.qNumber} // assessment question number.
					totalQuest={allAssessmentData?.totalQuest} // total assessment questions
					siteUrls={allAssessmentData?.siteUrls} // base urls
					isDescriptive={isDescriptive} // Descriptive type question popup
					mcqClicked={mcqClicked} // MCQ attempt data store
					tnfAction={tnfAction} //TNF attempt data store
					currentAns={currentAns} // current answer
					currOption={currOption}// current options
					onchangeGetData={onchangeGetData} // FillUp option data store
					storeData={storeData} // FillUp option stored data


					dropedData={dropedData}//user drop data for DND
					setDropedData={setDropedData} //Drag and Drop DND store data
					dragDrop={dragDrop} // for drag and drop collect data function


					matchLines={matchLines}//for match lines state
					setMatchLines={setMatchLines}//for set match lines state function
					matchingDataFun={matchingDataFun}//for matching question data function

					selectedTexts={selectedTexts} //for DD selected text state
					setSelectedTexts={setSelectedTexts} // for DD selected text set function
					dropDownList={dropDownList} // drop down list function

					sortedLetters={sortedLetters}
					setSortedLetters={setSortedLetters}
					jumBlePayLoad={jumBlePayLoad}




					submitAttem={submitAttem} // submit attempt function
					allNonDescriptiveAttempted={allNonDescriptiveAttempted}//for submit button show
					attemptedCount={attemptedCount}//attempted counting
					unattemptedQuestions={unattemptedQuestions}//unattempted counting
				/>
				: <Loader />
			}


			{/* {userData ? (
        <ul>
          <li>👤 Name: {userData.fullname}</li>
          <li>📧 Email: {userData.emailID}</li>
          <li>🏫 School: {userData.schoolName}</li>
          <li>🎓 Class: {userData.className}</li>
          <li>📞 Father's Contact: {userData.fatherContact}</li>
        </ul>
      ) : (
        <p>⏳ Waiting for data from React Native...</p>
      )} */}

			{/* <button onClick={sendToReactNative}>Send Data to RN</button> */}


		</div>
	);
}

export default App;
