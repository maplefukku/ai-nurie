'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
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
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval)
            return 90
          }
          return prevProgress + 10
        })
      }, 300)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      clearInterval(interval)
      setProgress(100)

      if (data.id) {
        // Automatically start download after upload is complete
        await handleDownload(data.id)
        router.push(`/coloring/${data.id}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/generate-pdf?id=${id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `coloring-page-${id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  useEffect(() => {
    if (file && !uploading) {
      handleUpload()
    }
  }, [file])

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
        <p className="mt-4 text-center text-sm text-gray-600">
          {uploading ? '画像をアップロード中...' : '画像を選択するとアップロードが開始されます'}
        </p>
      </div>
    </div>
  )
}