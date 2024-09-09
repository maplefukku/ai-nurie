import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Component() {
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const pageRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target.result);
    reader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleUploadAndDownload = useCallback(async () => {
    if (!file) return;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      handleDownloadPDF();
    }, 3000);
  }, [file]);

  const handleDownloadPDF = async () => {
    if (!pageRef.current) return;

    const canvas = await html2canvas(pageRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('coloring-page.pdf');
  };

  useEffect(() => {
    if (file) {
      handleUploadAndDownload();
    }
  }, [file, handleUploadAndDownload]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white" ref={pageRef}>
      <h1 className="text-2xl font-bold text-center mb-4">
        AIオーダーメイド〜世界に一つだけのぬりえ〜
      </h1>
      <div
        {...getRootProps()}
        className={`w-full aspect-square border-2 border-black mb-4 cursor-pointer ${
          isDragActive ? 'bg-gray-100' : ''
        }`}
      >
        <input {...getInputProps()} />
        <img
          src={imageSrc}
          alt="Coloring page"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full h-24 border-2 border-black p-2 flex flex-col justify-end">
        <div className="flex justify-end items-center">
          <input
            type="text"
            placeholder="年"
            value={date.year}
            onChange={(e) => setDate({ ...date, year: e.target.value })}
            className="w-16 text-center mr-4 text-black placeholder-black"
          />
          <input
            type="text"
            placeholder="月"
            value={date.month}
            onChange={(e) => setDate({ ...date, month: e.target.value })}
            className="w-12 text-center mr-4 text-black placeholder-black"
          />
          <input
            type="text"
            placeholder="日"
            value={date.day}
            onChange={(e) => setDate({ ...date, day: e.target.value })}
            className="w-12 text-center mr-[4rem] text-black placeholder-black"
          />
          <span>より</span>
        </div>
      </div>
      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">{file.name}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}