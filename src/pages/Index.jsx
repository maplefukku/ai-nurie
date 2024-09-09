'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ImageUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('/placeholder.svg')
  const [date, setDate] = useState({ year: '', month: '', day: '' })
  const pageRef = useRef(null)

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleDownloadPDF = async () => {
    if (!pageRef.current) return

    const canvas = await html2canvas(pageRef.current)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('coloring-page.pdf')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl" ref={pageRef}>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AIオーダーメイド〜世界に一つだけのぬりえ〜
        </h1>
        <div
          {...getRootProps()}
          className={`border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-purple-400 bg-purple-100' : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          <input {...getInputProps()} />
          <Image
            src={preview}
            alt="Coloring page"
            width={600}
            height={600}
            className="mx-auto object-cover"
          />
          {!file && (
            <p className="text-gray-500 mt-4">ここにファイルをドラッグ&ドロップするか、クリックしてファイルを選択してください</p>
          )}
        </div>
        <div className="w-full h-24 border-2 border-black p-2 flex flex-col justify-end mt-4">
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
        <button
          onClick={handleDownloadPDF}
          className="w-full mt-6 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        >
          PDFをダウンロード
        </button>
      </div>
    </div>
  )
}