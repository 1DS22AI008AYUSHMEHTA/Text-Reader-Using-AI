
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios"; 
import { jsPDF } from "jspdf"; 

const MyPlugin = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ocrText, setOcrText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  
  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsProcessing(true);
    setOcrText(""); 

    try {
      let combinedText = "";
      for (const file of selectedFiles) {
        const result = await Tesseract.recognize(file, "eng", {
          logger: (info) => console.log(info), 
        });
        combinedText += result.data.text + "\n";
      }

      
      setOcrText(combinedText);

      await axios.post("http://localhost:5000/ocr", { text: combinedText });

      alert("OCR text has been successfully saved.");
    } catch (error) {
      console.error("Error performing OCR or saving text:", error);
      alert("Something went wrong during the OCR process.");
    } finally {
      setIsProcessing(false);
    }
  };

  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(ocrText || "No OCR result available.", 10, 10); 
    doc.save("ocr-result.pdf"); 
  };

  return (
    <div id="webcrumbs">
      <div className="w-[1200px] bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-title text-neutral-950 text-center">MyScanner</h1>
          <div className="grid grid-cols-2 gap-6">
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-neutral-950">Upload Images for OCR</h2>
              <div className="flex flex-col items-center border border-neutral-300 p-4 rounded-md">
                <p className="text-neutral-500">Choose images to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mt-4"
                />
                <button
                  onClick={handleProcessFiles}
                  className="bg-primary-500 text-primary-50 p-2 rounded-md mt-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Convert to Text"}
                </button>
              </div>
            </section>
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-neutral-950">OCR Results</h2>
              <div className="flex flex-col items-start border border-neutral-300 p-4 rounded-md h-60 overflow-y-auto">
                {ocrText ? (
                  <pre className="text-neutral-500 text-sm">{ocrText}</pre>
                ) : (
                  <p className="text-neutral-500">OCR results will appear here.</p>
                )}
              </div>
            </section>
          </div>
          {}
          {ocrText && (
            <div className="mt-4 text-center">
              <button
                onClick={downloadPDF}
                className="bg-primary-500 text-primary-50 p-2 rounded-md"
              >
                Download as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlugin;












