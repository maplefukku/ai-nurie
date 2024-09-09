import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

export default function ImageUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

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

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a random ID for the coloring page
      const id = Math.random().toString(36).substr(2, 9)
      
      // Navigate to the coloring page with the generated ID
      navigate(`/coloring/${id}`)
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