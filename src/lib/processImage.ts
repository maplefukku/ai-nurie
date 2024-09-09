import sharp from 'sharp'
import path from 'path'

export async function processImage(buffer: Buffer, id: string): Promise<string> {
  const processedDir = path.join(process.cwd(), 'public', 'processed_images')
  const outputPath = path.join(processedDir, `${id}.png`)

  await sharp(buffer)
    .resize(600, 600, { fit: 'inside' })
    .png()
    .toFile(outputPath)

  return `/processed_images/${id}.png`
}