import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { MakeupAnalysis, Product } from '../../types';

interface ImageAnalysisResultProps {
  imageUrl: string;
  analysis: MakeupAnalysis;
  onClose: () => void;
  onTryLook: () => void;
}

const ImageAnalysisResult: React.FC<ImageAnalysisResultProps> = ({
  imageUrl,
  analysis,
  onClose,
  onTryLook,
}) => {
  return (
    <Card className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Analyzed look" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Detected Makeup</h3>
            <div className="space-y-3">
              {Object.entries(analysis.regions).map(([name, region]) => (
                <div key={name} className="flex items-center">
                  <span className="w-24 text-gray-600 capitalize">{name}</span>
                  <div className="flex space-x-2 mr-4">
                    {region.colors.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-6 h-6 rounded-full shadow-sm" 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center text-sm">
                    <Check size={16} className="text-green-500 mr-1" />
                    <span>Detected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="primary" fullWidth onClick={onTryLook}>
              Try This Look
            </Button>
            <Button variant="secondary" fullWidth onClick={onClose}>
              Scan Another
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.products.map((product: Product, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
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
    </Card>
  );
};

export default ImageAnalysisResult;