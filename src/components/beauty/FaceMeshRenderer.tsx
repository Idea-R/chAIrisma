import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { analyzeMakeup } from '../../utils/makeupDetection';
import { MakeupAnalysis } from '../../types';

interface FaceMeshRendererProps {
  onResults?: (results: any) => void;
  onMakeupAnalysis?: (analysis: MakeupAnalysis) => void;
}

const FaceMeshRenderer: React.FC<FaceMeshRendererProps> = ({ 
  onResults,
  onMakeupAnalysis,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let faceMesh: FaceMesh | null = null;
    let camera: Camera | null = null;

    const initializeFaceMesh = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        if (videoRef.current!.readyState >= 2) {
          resolve();
        } else {
          videoRef.current!.onloadedmetadata = () => resolve();
        }
      });

      // Wait for video dimensions to be available
      await new Promise<void>((resolve) => {
        const checkDimensions = () => {
          if (videoRef.current?.videoWidth && videoRef.current?.videoHeight) {
            resolve();
          } else {
            requestAnimationFrame(checkDimensions);
          }
        };
        checkDimensions();
      });

      faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(async (results) => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the video frame
        if (results.image) {
          canvas.width = results.image.width;
          canvas.height = results.image.height;
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
        }

        // Analyze makeup if landmarks are detected
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const analysis = await analyzeMakeup(canvas, results);
          if (onMakeupAnalysis) {
            onMakeupAnalysis(analysis);
          }
        }

        // Call original callback if provided
        if (onResults) {
          onResults(results);
        }
      });

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceMesh && videoRef.current) {
            await faceMesh.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });

      camera.start();
    };

    initializeFaceMesh();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [onResults, onMakeupAnalysis]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        width={1280}
        height={720}
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        width={1280}
        height={720}
      />
    </div>
  );
};

export default FaceMeshRenderer;