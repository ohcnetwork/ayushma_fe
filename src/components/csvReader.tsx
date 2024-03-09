import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCSVReader } from "react-papaparse";

export default function CSVReader(props: any) {
  const { CSVReader } = useCSVReader();
  const [rawData, setRawData] = useState<Array<any>>([]);
  const parseCSVData = () => {
    if (
      rawData.length > 0 &&
      (rawData[0][0] != "question" ||
        rawData[0][1] != "human_answer" ||
        rawData[0][2] != "language")
    )
      return toast.error("Upload Correct CSV File");
    else {
      const parsedData = [];
      for (let i = 1; i < rawData.length; i++) {
        var obj = {};
        obj = {
          question: rawData[i][0],
          human_answer: rawData[i][1],
          language: rawData[i][2],
        };
        parsedData.push(obj)
      }
      if(parsedData.length > 0){
        props.setCSVFileData(parsedData);
      }
      return;
    }
  };
  useEffect(() => {
    parseCSVData();
  }, [rawData]);
  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setRawData(results.data);
      }}
    >
      {({ getRootProps }: any) => (
        <>
          <div className="flex justify-center text-white dark:text-black h-[40px] bg-[#22C55E] rounded-[10px] items-center">
            <button type="button" {...getRootProps()}>
              Import from CSV
            </button>
          </div>
        </>
      )}
    </CSVReader>
  );
}
