import React, { useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose?: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get data URL from canvas
      const imageSrc = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageSrc);
    }
    
    setIsCapturing(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md rounded-xl overflow-hidden bg-black">
        {!capturedImage ? (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured"
            className="w-full h-full object-cover" 
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        {!isCameraReady && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <p>Loading camera...</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        {!capturedImage ? (
          <Button
            variant="primary"
            onClick={handleCapture}
            disabled={!isCameraReady || isCapturing}
            icon={<Camera size={18} />}
          >
            {isCapturing ? 'Capturing...' : 'Take Photo'}
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={handleRetake}
              icon={<RotateCcw size={18} />}
            >
              Retake
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              icon={<CheckCircle size={18} />}
            >
              Use Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraView;