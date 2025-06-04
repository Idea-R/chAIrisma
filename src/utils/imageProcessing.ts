import { createClient } from '@supabase/supabase-js';

interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const validateImage = async (file: File): Promise<ImageValidationResult> => {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file format. Please upload a JPG, PNG, GIF, or TIFF image.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }

  return { isValid: true };
};

export const processImage = async (file: File): Promise<ProcessedImage> => {
  try {
    const validation = await validateImage(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Create a unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('makeup-images')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('makeup-images')
      .getPublicUrl(data.path);

    // Load image to get dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = publicUrl;
    });

    return {
      url: publicUrl,
      width: img.width,
      height: img.height,
      format: file.type,
      size: file.size,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image. Please try again.');
  }
};

export const processImageUrl = async (url: string): Promise<ProcessedImage> => {
  try {
    // Fetch image from URL
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });

    return await processImage(file);
  } catch (error) {
    console.error('Error processing image URL:', error);
    throw new Error('Failed to process image from URL. Please try again.');
  }
};

export const extractImagesFromHtml = async (html: string, baseUrl: string): Promise<string[]> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images = Array.from(doc.getElementsByTagName('img'));
  
  return images
    .map(img => {
      const src = img.getAttribute('src');
      if (!src) return null;
      
      try {
        return new URL(src, baseUrl).href;
      } catch {
        return null;
      }
    })
    .filter((url): url is string => url !== null);
};