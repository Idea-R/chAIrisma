import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { processImage, processImageUrl, validateImage } from '../../utils/imageProcessing';
import Button from '../common/Button';
import Card from '../common/Card';

interface ImageUploaderProps {
  onImageProcessed: (processedImage: { url: string; width: number; height: number }) => void;
  onError: (error: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageProcessed, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const validation = await validateImage(file);
      
      if (!validation.isValid) {
        onError(validation.error || 'Invalid file');
        return;
      }

      const processedImage = await processImage(file);
      onImageProcessed(processedImage);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <Card
      className={`p-6 ${isDragging ? 'border-chairismatic-pink' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="text-center">
        <Upload
          size={48}
          className={`mx-auto mb-4 ${
            isDragging ? 'text-chairismatic-pink' : 'text-gray-400'
          }`}
        />
        <h3 className="text-lg font-medium mb-2">
          {isProcessing ? 'Processing...' : 'Drop your image here'}
        </h3>
        <p className="text-gray-500 mb-4">
          or click to browse
        </p>

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <Button
            variant="primary"
            className="pointer-events-none"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Choose File'}
          </Button>
        </label>

        <div className="mt-4 text-sm text-gray-500">
          <p>Supported formats: JPG, PNG, GIF, TIFF</p>
          <p>Maximum size: 10MB</p>
        </div>
      </div>
    </Card>
  );
};

export default ImageUploader;