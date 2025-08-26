import { useState, useEffect, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import "./styleDropAndDrag.css";
import Check from "./assets/ok.svg";
import Download from "./assets/download.svg";
import type { Response } from "./response/response.ts";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Index() {
  useEffect(() => {
    document.title = "SVG to PDF";
  }, []);

  const [file, setFile] = useState(null);
  function HandleSubmit(file: any) {
    setFile(file);
  }
  const watermarkerInputRef = useRef<HTMLInputElement>(null);
  const [Watermarker, setWatermarker] = useState("");

  const sendData = async () => {
    if (!file) {
      alert("Загрузите SVG файл");
      return;
    }

    if (Watermarker.length == 0) {
      watermarkerInputRef?.current?.focus();
      alert("Введите watermarker");
      return;
    }

    if (file && Watermarker) {
      const formData = new FormData();
      formData.append("svg", file);
      formData.append("watermarker", Watermarker);
      try {
        const response = await fetch(`${apiUrl}/api/v1/pdfs`, {
          method: "POST",
          body: formData,
        });
        const result: Response = await response.json();
        const fileUrl = result.url;
        const link = document.createElement("a");
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Ошибка:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-300 p-4 flex flex-col justify-center items-center">
          <div className="text-[20px] mb-3">Generate PDF from SVG</div>
          <div className="mb-5">
            {file ? (
              <div className="border-solid border-2 w-[322px] h-[200px] border-[#808080] flex justify-center items-center">
                <img src={Check} alt="ok" className="w-[140px] h-[140px]" />
              </div>
            ) : (
              <FileUploader
                handleChange={HandleSubmit}
                name="file"
                types={["SVG"]}
                classes="custom-uploader"
                uploadedLabel="SVG file uploaded!"
              />
            )}
          </div>
          <input
            type="text"
            value={Watermarker}
            ref={watermarkerInputRef}
            onChange={(e) => setWatermarker(e.target.value)}
            placeholder="Введите Watermarker"
            className="border p-2 mb-5"
          />
          <button
            className="bg-black cursor-pointer rounded-[5px] mb-3 p-2 text-white flex items-center"
            onClick={sendData}
          >
            <img className="w-[30px] h-[30px] mr-2" src={Download} />
            Export PDF
          </button>
        </div>
      </div>
    </>
  );
}
