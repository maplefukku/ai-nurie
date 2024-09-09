import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { processImage } from '@/lib/processImage';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const id = uuidv4();
  const buffer = await file.arrayBuffer();
  const processedImagePath = await processImage(Buffer.from(buffer), id);

  return NextResponse.json({ id, imagePath: processedImagePath });
}