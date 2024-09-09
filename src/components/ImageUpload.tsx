'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.id) {
        router.push(`/coloring/${data.id}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
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
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
          !file || uploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
        }`}
      >
        {uploading ? '送信中...' : '送信'}
      </button>
    </div>
  )
}