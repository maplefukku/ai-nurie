'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ColoringPage({ params }: { params: { id: string } }) {
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [date, setDate] = useState({ year: '', month: '', day: '' })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/generate-pdf?id=${params.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `coloring-page-${params.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold text-center mb-4">
        AIオーダーメイド〜世界に一つだけのぬりえ〜
      </h1>
      <div className="w-full aspect-square border-2 border-black mb-4">
        {imagePath ? (
          <Image
            src={imagePath}
            alt="Coloring page"
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
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
      <Button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isGenerating ? 'PDFを生成中...' : 'PDFをダウンロード'}
      </Button>
    </div>
  )
}