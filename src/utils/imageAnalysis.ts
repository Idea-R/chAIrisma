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
    if (!response.ok) {
      throw new Error(`Failed to extract images: ${response.status} ${response.statusText}`);
    }
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
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If error response isn't JSON, use the default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Empty response from server');
    }

    return data;
  } catch (error) {
    console.error('Error analyzing makeup:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze makeup in image');
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
    
    if (!response.ok) {
      throw new Error(`Failed to find products: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error finding similar products:', error);
    return [];
  }
}