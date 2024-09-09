import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Component() {
  const [imageSrc, setImageSrc] = useState('/placeholder.svg');
  const [date, setDate] = useState({ year: '', month: '', day: '' });
  const pageRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white" ref={pageRef}>
      <h1 className="text-2xl font-bold text-center mb-4">
        AIオーダーメイド〜世界に一つだけのぬりえ〜
      </h1>
      <div className="w-full aspect-square border-2 border-black mb-4">
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
      <div className="mt-4 flex justify-between">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button
          onClick={handleDownloadPDF}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          PDFをダウンロード
        </button>
      </div>
    </div>
  );
}