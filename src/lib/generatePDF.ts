import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'

export async function generatePDF(id: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])

  const imagePath = path.join(process.cwd(), 'public', 'processed_images', `${id}.png`)
  const imageBytes = await fs.readFile(imagePath)
  const image = await pdfDoc.embedPng(imageBytes)

  const { width, height } = image.scale(0.5)
  page.drawImage(image, {
    x: page.getWidth() / 2 - width / 2,
    y: page.getHeight() / 2 - height / 2,
    width,
    height,
  })

  page.drawText('AIオーダーメイド〜世界に一つだけのぬりえ〜', {
    x: 50,
    y: page.getHeight() - 50,
    size: 20,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}