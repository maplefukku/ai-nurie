import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Component() {
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('coloring-page');
  const pageRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setFileName(selectedFile.name.split('.')[0] || 'coloring-page');
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
    
    // Simulate upload process
    setTimeout(() => {
      handleDownloadPDF();
    }, 1000);
  }, [file]);

  const handleDownloadPDF = async () => {
    if (!pageRef.current) return;

    const canvas = await html2canvas(pageRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}-coloring.pdf`);
  };

  useEffect(() => {
    if (file) {
      handleUploadAndDownload();
    }
  }, [file, handleUploadAndDownload]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-[600px] bg-white shadow-lg rounded-lg overflow-hidden" ref={pageRef}>
        <h1 className="text-3xl font-bold text-center my-6 px-4">
          AIオーダーメイド〜世界に一つだけのぬりえ〜
        </h1>
        <div
          {...getRootProps()}
          className={`w-[560px] h-[560px] mx-auto border-2 border-black mb-6 cursor-pointer ${
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
        <div className="w-[560px] h-[120px] mx-auto border-2 border-black p-4 flex flex-col justify-end mb-6">
          <div className="flex justify-end items-center">
            <input
              type="text"
              placeholder="年"
              value={date.year}
              onChange={(e) => setDate({ ...date, year: e.target.value })}
              className="w-[80px] h-[40px] text-center mr-4 text-black placeholder-black text-2xl"
            />
            <input
              type="text"
              placeholder="月"
              value={date.month}
              onChange={(e) => setDate({ ...date, month: e.target.value })}
              className="w-[60px] h-[40px] text-center mr-4 text-black placeholder-black text-2xl"
            />
            <input
              type="text"
              placeholder="日"
              value={date.day}
              onChange={(e) => setDate({ ...date, day: e.target.value })}
              className="w-[60px] h-[40px] text-center mr-[60px] text-black placeholder-black text-2xl"
            />
            <span className="text-2xl">より</span>
          </div>
        </div>
      </div>
    </div>
  );
}