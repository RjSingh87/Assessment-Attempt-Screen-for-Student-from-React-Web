import React, { useState } from "react";
import Services from "../Services";
import Swal from "sweetalert2";
import { apiRoot, SWATheam } from "../constant";
import Loader from "./attemptScreen/Loader";




export default function DescriptiveTypeUploadFile({ setShowDescModal, allAssessmentData }) {

  const [loader, setLoader] = useState(false);
  const [descFile, setDescFile] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (descFile.length + files.length > 10) {
      Swal.fire("Limit Reached", "Maximum 10 files allowed.", "warning");
      return;
    }

    const newFiles = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return {
          file,
          preview: URL.createObjectURL(file),
          uploadedName: null
        };
      }
      return {
        file,
        preview: null,
        uploadedName: null
      };
    });

    setDescFile(prev => [...prev, ...newFiles]);
  };

  const notifyRNSubmit = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("ASSESSMENT_SUBMITTED");
    }
  };


  const handleDescFinalSubmit = async () => {
    if (!descFile.length) {
      Swal.fire("Error", "Please upload at least one file.", "error");
      return;
    }

    try {
      setLoader(true);
      const q = allAssessmentData.questions[0];
      if (!q) return;


      // clone array
      const updatedFiles = [...descFile];

      for (let i = 0; i < updatedFiles.length; i++) {
        const item = updatedFiles[i];
        if (item.uploadedName) continue;


        const formData = new FormData();
        formData.append("schoolCode", q.schoolCode);
        formData.append("userRefID", allAssessmentData.userRefID);
        formData.append("classID", q.classID);
        formData.append("assessmentID", q.assessmentID);
        formData.append("subjectID", q.subjectID);
        formData.append("descImage", item.file);

        const res = await Services.formMethod(apiRoot.uploadDescExamImage, formData);

        if (!res || res.status !== "success") {
          throw new Error("Upload failed");
        }

        updatedFiles[i] = {
          ...item,
          uploadedName: res.fileName
        };
      }

      setDescFile(updatedFiles); // update state once
      Swal.fire("Success", "All files uploaded.", "success");
      setShowDescModal(false);
      setTimeout(() => {
        notifyRNSubmit();
      }, 2000)

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Upload failed. Try again.", "error");
    } finally {
      setLoader(false);
    }
  };



  const handleDescCancel = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text:
        "If you close now, you will not be able to upload descriptive answers again and no marks will be awarded.",
      confirmButtonText: "Close Anyway",
      cancelButtonText: "Upload Now",
      showCancelButton: true
    }).then((res) => {
      if (res.isConfirmed) setShowDescModal(false);
    });
  };


  const removeItemImg = async (index) => {
    const item = descFile[index];

    if (item?.uploadedName) {
      try {
        setLoader(true);

        const q = allAssessmentData.questions[0];
        if (!q) return;

        await Services.post(apiRoot.deleteDescExamImage, {
          schoolCode: q.schoolCode,
          userRefID: allAssessmentData.userRefID,
          classID: q.classID,
          assessmentID: q.assessmentID,
          subjectID: q.subjectID,
          solutionSheet: item.uploadedName
        });

      } catch (err) {
        Swal.fire("Error", "Failed to delete image from server", "error");
        return;
      } finally {
        setLoader(false);
      }
    }

    setDescFile(prev => prev.filter((_, i) => i !== index)); // Always remove from UI
  };



  if (loader) {
    return (
      <div style={{ backgroundColor: SWATheam.SwaWhite + 4, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
        <Loader />
      </div>
    );
  }





  return (
    <div className="baseModel">
      <div className="innerBox">
        <div className="headerModel">
          <div className="instText">Upload Descriptive Answer</div>
          <button onClick={handleDescCancel} className="btn btn-danger btn-sm">Close</button>
        </div>

        <div className="mt-4 px-2">
          <input
            className="form-control"
            type="file"
            accept=".pdf,.jpg,.png,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <div style={{ overflow: "auto", paddingBottom: "25px", width: "340px", margin: "0 auto" }}>
          <div
            className="d-flex mt-3 px-2"
            style={{
              // overflowX: "auto",
              gap: 10,
              WebkitOverflowScrolling: "touch"
            }}
          >
            {descFile?.map((item, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  minWidth: 100,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  padding: 5
                }}
              >
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt="preview"
                    style={{ width: 90, height: 90, objectFit: "cover" }}
                  />
                ) : (
                  <p style={{ width: 90 }}>{item.file.name}</p>
                )}

                <button
                  onClick={() => removeItemImg(index)}
                  className="trashIcon"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-center mb-3">
          <button onClick={handleDescFinalSubmit} className="btn btn-primary">
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );
}
