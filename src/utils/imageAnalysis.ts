import { createWorker } from 'tesseract.js';
import { MakeupAnalysis } from '../types';

interface ImageInfo {
  url: string;
  alt?: string;
  text?: string;
}

export async function extractImagesFromUrl(url: string): Promise<ImageInfo[]> {
  try {
    const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error extracting images:', error);
    return [];
  }
}

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  
  const { data: { text } } = await worker.recognize(imageUrl);
  await worker.terminate();
  
  return text;
}

export async function analyzeMakeupInImage(imageUrl: string): Promise<MakeupAnalysis> {
  try {
    const response = await fetch('/api/analyze-makeup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing makeup:', error);
    throw new Error('Failed to analyze makeup in image');
  }
}

export async function findSimilarProducts(colors: string[], category: string) {
  try {
    const response = await fetch('/api/find-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ colors, category }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error finding similar products:', error);
    return [];
  }
}