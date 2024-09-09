import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadImage(file: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const filePath = path.join(uploadDir, filename)

  await writeFile(filePath, file)

  return `/uploads/${filename}`
}