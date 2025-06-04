import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Camera, Link, ImagePlus, Trash2, Share2, AlertCircle, Search, Film, Instagram } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradientText from '../components/common/GradientText';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CameraView from '../components/beauty/CameraView';
import FaceMeshRenderer from '../components/beauty/FaceMeshRenderer';
import MakeupAnalysisOverlay from '../components/beauty/MakeupAnalysisOverlay';
import { MakeupAnalysis } from '../types';

type ScanMethod = 'upload' | 'camera' | 'url' | 'search' | null;
type ContentType = 'image' | 'instagram' | 'video' | 'search';

const ScanLook: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<ScanMethod>(null);
  const [contentType, setContentType] = useState<ContentType>('image');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MakeupAnalysis | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        startAnalysis(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraCapture = useCallback((imageSrc: string) => {
    setImageUrl(imageSrc);
    setActiveMethod(null);
    startAnalysis(imageSrc);
  }, []);

  const isValidImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    try {
      const parsedUrl = new URL(url);
      return imageExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
    } catch {
      return false;
    }
  };

  const isInstagramUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname === 'www.instagram.com' || parsedUrl.hostname === 'instagram.com';
    } catch {
      return false;
    }
  };

  const handleUrlSubmit = useCallback(async () => {
    setUrlError(null);
    setAnalysisError(null);

    if (!urlInput.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    setIsAnalyzing(true);

    try {
      if (contentType === 'instagram') {
        if (!isInstagramUrl(urlInput)) {
          setUrlError('Please enter a valid Instagram post URL');
          return;
        }
        // Here we would call our edge function to handle Instagram scraping
        const response = await fetch('/api/instagram-scraper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput })
        });
        
        if (!response.ok) throw new Error('Failed to fetch Instagram content');
        
        const data = await response.json();
        setImageUrl(data.imageUrl);
        startAnalysis(data.imageUrl);
      } else if (contentType === 'video') {
        // Handle video URL analysis
        const response = await fetch('/api/video-analyzer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput })
        });
        
        if (!response.ok) throw new Error('Failed to analyze video');
        
        const data = await response.json();
        setImageUrl(data.thumbnailUrl);
        startAnalysis(data.thumbnailUrl);
      } else {
        if (!isValidImageUrl(urlInput)) {
          setUrlError('Please enter a direct link to an image file (ending in .jpg, .png, etc.)');
          return;
        }
        setImageUrl(urlInput);
        startAnalysis(urlInput);
      }
    } catch (error) {
      console.error('URL processing failed:', error);
      setUrlError(error instanceof Error ? error.message : 'Failed to process URL');
      setIsAnalyzing(false);
    }
  }, [urlInput, contentType]);

  const handleSearchSubmit = useCallback(async () => {
    setUrlError(null);
    setAnalysisError(null);

    if (!searchInput.trim()) {
      setUrlError('Please enter a search query');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call our AI search edge function
      const response = await fetch('/api/search-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchInput })
      });

      if (!response.ok) throw new Error('Failed to process search');

      const data = await response.json();
      setImageUrl(data.imageUrl);
      startAnalysis(data.imageUrl);
    } catch (error) {
      console.error('Search failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to process search');
      setIsAnalyzing(false);
    }
  }, [searchInput]);

  const startAnalysis = useCallback(async (imageSource: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image. Please make sure the URL is accessible and points to a valid image file.'));
        img.src = imageSource;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not initialize image processing');
      }
      
      ctx.drawImage(img, 0, 0);
      
      const faceMesh = await import('@mediapipe/face_mesh');
      const detector = new faceMesh.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });
      
      detector.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      const results = await detector.send({ image: img });
      
      const { analyzeMakeup } = await import('../utils/makeupDetection');
      const analysis = await analyzeMakeup(canvas, results);
      
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze the image. Please try again.');
      setImageUrl(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetScan = useCallback(() => {
    setImageUrl(null);
    setAnalysisResult(null);
    setActiveMethod(null);
    setSelectedRegion(null);
    setUrlError(null);
    setAnalysisError(null);
    setUrlInput('');
    setSearchInput('');
    setContentType('image');
  }, []);

  const handleRegionClick = useCallback((regionName: string) => {
    setSelectedRegion(regionName);
  }, []);

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <div className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img 
            src={imageUrl!} 
            alt="Analyzed look" 
            className="w-full h-full object-cover"
          />
          <MakeupAnalysisOverlay 
            analysis={analysisResult}
            onRegionClick={handleRegionClick}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detected Colors */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Detected Colors</h3>
            <div className="space-y-4">
              {Object.entries(analysisResult.regions).map(([name, region]) => (
                <div 
                  key={name}
                  className={`p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedRegion === name ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleRegionClick(name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{name}</span>
                    <div className="flex space-x-2">
                      {region.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Products */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Recommended Products</h3>
            <div className="space-y-4">
              {selectedRegion && analysisResult.regions[selectedRegion]?.products?.map((product, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {!selectedRegion && (
                <p className="text-gray-600 text-center py-4">
                  Select a region to see product recommendations
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {/* Handle try look */}}
          >
            Try This Look
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={resetScan}
            icon={<Trash2 size={18} />}
          >
            Start Over
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {/* Handle share */}}
            icon={<Share2 size={18} />}
          >
            Share
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          <GradientText>Scan Any Look</GradientText>
        </h1>
        
        {analysisError && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="text-red-500 flex-shrink-0 mr-3" size={20} />
              <div>
                <h3 className="text-red-800 font-medium">Analysis Failed</h3>
                <p className="text-red-600 mt-1">{analysisError}</p>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={resetScan}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!imageUrl && !analysisError ? (
          <Card className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">
              How would you like to scan a look?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Button
                variant={activeMethod === 'upload' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => {
                  setActiveMethod('upload');
                  setContentType('image');
                }}
              >
                <UploadCloud size={32} className="mb-2" />
                <span>Upload Image</span>
              </Button>
              
              <Button
                variant={activeMethod === 'camera' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => {
                  setActiveMethod('camera');
                  setContentType('image');
                }}
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

              <Button
                variant={activeMethod === 'search' ? 'primary' : 'secondary'}
                className="flex flex-col items-center py-6"
                fullWidth
                onClick={() => {
                  setActiveMethod('search');
                  setContentType('search');
                }}
              >
                <Search size={32} className="mb-2" />
                <span>Search Look</span>
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {activeMethod === 'upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                >
                  <label className="cursor-pointer flex flex-col items-center">
                    <UploadCloud size={48} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium mb-2">Drop your image here</span>
                    <span className="text-gray-500 mb-4">or click to browse</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <Button variant="primary">
                      Choose File
                    </Button>
                  </label>
                </motion.div>
              )}
              
              {activeMethod === 'camera' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <CameraView onCapture={handleCameraCapture} />
                </motion.div>
              )}
              
              {activeMethod === 'url' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-gray-300 rounded-lg p-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">What type of content?</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant={contentType === 'image' ? 'primary' : 'secondary'}
                        onClick={() => setContentType('image')}
                        icon={<ImagePlus size={18} />}
                      >
                        Image
                      </Button>
                      <Button
                        variant={contentType === 'instagram' ? 'primary' : 'secondary'}
                        onClick={() => setContentType('instagram')}
                        icon={<Instagram size={18} />}
                      >
                        Instagram Post
                      </Button>
                      <Button
                        variant={contentType === 'video' ? 'primary' : 'secondary'}
                        onClick={() => setContentType('video')}
                        icon={<Film size={18} />}
                      >
                        Video
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {contentType === 'image' && 'Enter direct image URL'}
                        {contentType === 'instagram' && 'Enter Instagram post URL'}
                        {contentType === 'video' && 'Enter video URL'}
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => {
                            setUrlInput(e.target.value);
                            setUrlError(null);
                          }}
                          placeholder={
                            contentType === 'image' 
                              ? "https://example.com/image.jpg"
                              : contentType === 'instagram'
                              ? "https://instagram.com/p/..."
                              : "https://youtube.com/watch?v=..."
                          }
                          className={`flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink ${
                            urlError ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        <Button 
                          variant="primary"
                          className="rounded-l-none"
                          onClick={handleUrlSubmit}
                        >
                          Analyze
                        </Button>
                      </div>
                      {urlError && (
                        <p className="text-red-600 text-sm flex items-center mt-2">
                          <AlertCircle size={16} className="mr-2" />
                          {urlError}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {contentType === 'image' && 'Please provide a direct link to an image file (e.g., ending in .jpg, .png)'}
                        {contentType === 'instagram' && 'Enter the URL of any public Instagram post'}
                        {contentType === 'video' && 'Enter the URL of any YouTube, TikTok, or other video'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMethod === 'search' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-2 border-gray-300 rounded-lg p-6"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the look you want to analyze
                  </label>
                  <div className="space-y-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setUrlError(null);
                        }}
                        placeholder="E.g., Emma Stone's makeup in La La Land opening scene"
                        className={`flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-chairismatic-pink ${
                          urlError ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <Button 
                        variant="primary"
                        className="rounded-l-none"
                        onClick={handleSearchSubmit}
                      >
                        Search
                      </Button>
                    </div>
                    {urlError && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {urlError}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Describe any celebrity look, movie scene, or specific makeup style you want to analyze
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ) : isAnalyzing ? (
          <Card className="max-w-2xl mx-auto p-6">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-6 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Processing" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <LoadingSpinner size="lg" />
              
              <h2 className="text-xl font-semibold mt-6 mb-2">
                Analyzing Your Look
              </h2>
              <p className="text-gray-600 text-center">
                Our AI is detecting makeup colors, products, and techniques...
              </p>
            </div>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {renderAnalysisResults()}
          </div>
        )}
      </main>
    </div>
  );
};

export default ScanLook;