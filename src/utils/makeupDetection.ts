import * as tf from '@tensorflow/tfjs';
import { MakeupAnalysis, MakeupRegion, Product } from '../types';

// Define facial feature regions and their corresponding landmarks
const FACIAL_REGIONS = {
  eyes: {
    left: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    right: [362, 382, 381, 380, 374, 373, 390, 249, 263],
  },
  lips: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375],
  cheeks: [116, 123, 147, 187, 207, 216, 212, 202],
  eyebrows: [70, 63, 105, 66, 107, 336, 296, 334, 293, 300],
};

// Color analysis functions
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const getAverageColor = async (imageData: ImageData, points: number[][]): Promise<string> => {
  // Convert ImageData to tensor
  const tensor = tf.browser.fromPixels(imageData);
  
  // Create a mask for the region
  const mask = tf.zeros([imageData.height, imageData.width]);
  const updates = tf.ones([points.length]);
  const indices = tf.tensor2d(points, [points.length, 2], 'int32');
  const regionMask = tf.scatter(mask, indices, updates);
  
  // Apply mask to image
  const maskedImage = tf.mul(tensor, tf.stack([regionMask, regionMask, regionMask], -1));
  
  // Calculate average color
  const meanColor = tf.mean(maskedImage, [0, 1]);
  const colorValues = await meanColor.array();
  
  // Cleanup
  tensor.dispose();
  mask.dispose();
  updates.dispose();
  indices.dispose();
  regionMask.dispose();
  maskedImage.dispose();
  meanColor.dispose();
  
  return rgbToHex(
    Math.round(colorValues[0]),
    Math.round(colorValues[1]),
    Math.round(colorValues[2])
  );
};

// Color similarity calculation
const getColorSimilarity = (color1: string, color2: string): number => {
  const rgb1 = color1.match(/[0-9a-f]{2}/gi)!.map(hex => parseInt(hex, 16));
  const rgb2 = color2.match(/[0-9a-f]{2}/gi)!.map(hex => parseInt(hex, 16));
  
  const rmean = (rgb1[0] + rgb2[0]) / 2;
  const r = rgb1[0] - rgb2[0];
  const g = rgb1[1] - rgb2[1];
  const b = rgb1[2] - rgb2[2];
  
  return 1 - Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8)) / 764.8333151739665;
};

// Product recommendation based on color
const recommendProducts = async (color: string, category: string): Promise<Product[]> => {
  // This would typically call an API with a product database
  // For now, returning mock products with color matching
  const productDatabase: Product[] = [
    {
      id: `${category}-1`,
      name: `${category} - Natural Glow`,
      brand: 'Luxury Brand',
      category,
      price: 29.99,
      imageUrl: 'https://images.pexels.com/photos/2688992/pexels-photo-2688992.jpeg',
      colors: ['#FFD5C2', '#F8B195', '#D1A08F'],
      rating: 4.5,
    },
    {
      id: `${category}-2`,
      name: `${category} - Bold Statement`,
      brand: 'Beauty Co',
      category,
      price: 39.99,
      imageUrl: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
      colors: ['#D35D6E', '#FF5964', '#B31E2F'],
      rating: 4.8,
    },
    {
      id: `${category}-3`,
      name: `${category} - Neutral Basics`,
      brand: 'Essentials',
      category,
      price: 24.99,
      imageUrl: 'https://images.pexels.com/photos/2639947/pexels-photo-2639947.jpeg',
      colors: ['#E5C7B5', '#C5A898', '#8C7266'],
      rating: 4.3,
    },
  ];
  
  // Sort products by color similarity
  return productDatabase
    .map(product => ({
      ...product,
      similarity: Math.max(...(product.colors || []).map(c => getColorSimilarity(color, c))),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(({ similarity, ...product }) => product);
};

// Main analysis function
export const analyzeMakeup = async (
  canvas: HTMLCanvasElement,
  faceMeshResults: any
): Promise<MakeupAnalysis> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const regions: Record<string, MakeupRegion> = {};
  const products: Product[] = [];

  // Analyze each facial region
  for (const [regionName, landmarks] of Object.entries(FACIAL_REGIONS)) {
    const points = Array.isArray(landmarks) 
      ? landmarks.map(i => [
          Math.round(faceMeshResults.multiFaceLandmarks[0][i].x * canvas.width),
          Math.round(faceMeshResults.multiFaceLandmarks[0][i].y * canvas.height),
        ])
      : Object.values(landmarks).flatMap(subLandmarks => 
          subLandmarks.map(i => [
            Math.round(faceMeshResults.multiFaceLandmarks[0][i].x * canvas.width),
            Math.round(faceMeshResults.multiFaceLandmarks[0][i].y * canvas.height),
          ])
        );

    const color = await getAverageColor(imageData, points);
    const recommendedProducts = await recommendProducts(color, regionName);
    
    regions[regionName] = {
      name: regionName,
      landmarks: Array.isArray(landmarks) ? landmarks : Object.values(landmarks).flat(),
      colors: [color],
      products: recommendedProducts,
    };

    products.push(...recommendedProducts);
  }

  return {
    regions,
    products,
    confidence: 0.85, // Mock confidence score
  };
};