'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const Index = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [progress, setProgress] = useState(0)

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

  const handleUpload = () => {
    if (!file) return
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 10
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">画像をアップロード</h2>
        <div
          {...getRootProps()}
          className={`border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-purple-400 bg-purple-100' : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
          ) : (
            <p className="text-gray-500">ここにファイルをドラッグ&ドロップするか、クリックしてファイルを選択してください</p>
          )}
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
        <button
          onClick={handleUpload}
          disabled={!file || progress === 100}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
            !file || progress === 100
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
          }`}
        >
          {progress === 100 ? '送信完了' : '送信'}
        </button>
      </div>
    </div>
  )
}

export default Index