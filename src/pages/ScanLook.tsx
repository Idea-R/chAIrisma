import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Camera, Link, ImagePlus } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CameraView from '../components/beauty/CameraView';
import ImageUploader from '../components/beauty/ImageUploader';
import { analyzeMakeupInImage } from '../utils/imageAnalysis';
import { extractImagesFromUrl } from '../utils/imageAnalysis';
import { processImageUrl } from '../utils/imageProcessing';

interface AnalysisResult {
  imageUrl: string;
  regions: {
    name: string;
    colors: string[];
    confidence: number;
  }[];
  products: {
    name: string;
    brand: string;
    imageUrl: string;
    price: number;
    category: string;
  }[];
}

const ScanLook: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<'upload' | 'camera' | 'url' | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImageProcessed = async (processedImage: { url: string }) => {
    setImageUrl(processedImage.url);
    setActiveMethod(null);
    await startAnalysis(processedImage.url);
  };

  const handleCameraCapture = async (imageSrc: string) => {
    try {
      setImageUrl(imageSrc);
      setActiveMethod(null);
      await startAnalysis(imageSrc);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process camera image');
    }
  };

  const handleUrlSubmit = async () => {
    try {
      setIsAnalyzing(true);
      const images = await extractImagesFromUrl(urlInput);
      
      if (images.length === 0) {
        throw new Error('No valid images found at the provided URL');
      }

      const processedImage = await processImageUrl(images[0].url);
      setImageUrl(processedImage.url);
      setUrlInput('');
      await startAnalysis(processedImage.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process URL');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeMakeupInImage(imageUrl);
      setAnalysisResult(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImageUrl(null);
    setAnalysisResult(null);
    setActiveMethod(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <GradientText>Scan Any Look</GradientText>
        </h1>
        
        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="flex items-center text-red-700">
              <AlertCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {!imageUrl ? (
          <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">
              How would you like to scan a look?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button
                variant={activeMethod === 'upload' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => setActiveMethod('upload')}
              >
                <UploadCloud size={32} className="mb-2" />
                <span>Upload Image</span>
              </Button>
              
              <Button
                variant={activeMethod === 'camera' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => setActiveMethod('camera')}
              >
                <Camera size={32} className="mb-2" />
                <span>Use Camera</span>
              </Button>
              
              <Button
                variant={activeMethod === 'url' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => setActiveMethod('url')}
              >
                <Link size={32} className="mb-2" />
                <span>Enter URL</span>
              </Button>
            </div>
            
            {activeMethod === 'upload' && (
              <ImageUploader
                onImageProcessed={handleImageProcessed}
                onError={setError}
              />
            )}
            
            {activeMethod === 'camera' && (
              <CameraView onCapture={handleCameraCapture} />
            )}
            
            {activeMethod === 'url' && (
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter image URL or social media post
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://instagram.com/p/..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink"
                  />
                  <Button 
                    variant="primary"
                    className="rounded-l-none"
                    onClick={handleUrlSubmit}
                    disabled={isAnalyzing}
                  >
                    Analyze
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ) : isAnalyzing ? (
          <Card className="max-w-2xl mx-auto p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Analyzing Your Look
            </h2>
            
            <div className="w-64 h-64 mb-6 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Uploaded look" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mb-4">
              <LoadingSpinner size="lg" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                AI is working its magic...
              </p>
              <p className="text-gray-600">
                Identifying products, colors, and techniques
              </p>
            </div>
          </Card>
        ) : analysisResult ? (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={analysisResult.imageUrl} 
                      alt="Analyzed look" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-xl font-semibold mb-4">
                    Look Analysis Results
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Detected Colors</h3>
                    <div className="space-y-3">
                      {analysisResult.regions.map((region, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-24 text-gray-600">{region.name}</span>
                          <div className="flex space-x-2 mr-4">
                            {region.colors.map((color, i) => (
                              <div 
                                key={i} 
                                className="w-6 h-6 rounded-full shadow-sm" 
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round(region.confidence * 100)}% match
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="primary" fullWidth>
                      Try This Look
                    </Button>
                    <Button variant="secondary" fullWidth onClick={resetScan}>
                      Scan Another
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.products.map((product, index) => (
                <Card key={index} hoverEffect>
                  <div className="h-36 -mx-4 -mt-4 mb-3 relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ScanLook;