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

const getAverageColor = (imageData: ImageData, points: number[][]): string => {
  let r = 0, g = 0, b = 0;
  const numPoints = points.length;

  points.forEach(([x, y]) => {
    const i = (y * imageData.width + x) * 4;
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  });

  return rgbToHex(
    Math.round(r / numPoints),
    Math.round(g / numPoints),
    Math.round(b / numPoints)
  );
};

// Product recommendation based on color
const recommendProducts = (color: string, category: string): Product[] => {
  // This would typically call an API with a product database
  // For now, returning mock products
  return [
    {
      id: `${category}-1`,
      name: `${category} - Shade Match`,
      brand: 'Luxury Brand',
      category,
      price: 29.99,
      imageUrl: 'https://images.pexels.com/photos/2688992/pexels-photo-2688992.jpeg',
      colors: [color],
      rating: 4.5,
    },
    {
      id: `${category}-2`,
      name: `${category} - Pro Collection`,
      brand: 'Beauty Co',
      category,
      price: 39.99,
      imageUrl: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
      colors: [color],
      rating: 4.8,
    },
  ];
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
  Object.entries(FACIAL_REGIONS).forEach(([regionName, landmarks]) => {
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

    const color = getAverageColor(imageData, points);
    
    regions[regionName] = {
      name: regionName,
      landmarks: Array.isArray(landmarks) ? landmarks : Object.values(landmarks).flat(),
      colors: [color],
      products: recommendProducts(color, regionName),
    };

    products.push(...regions[regionName].products!);
  });

  return {
    regions,
    products,
    confidence: 0.85, // Mock confidence score
  };
};