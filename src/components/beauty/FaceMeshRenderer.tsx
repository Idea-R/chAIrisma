import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface FaceMeshRendererProps {
  onResults?: (results: any) => void;
}

const FaceMeshRenderer: React.FC<FaceMeshRendererProps> = ({ onResults }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let faceMesh: FaceMesh | null = null;
    let camera: Camera | null = null;

    const initializeFaceMesh = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {
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

        // Draw face mesh
        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            // Draw landmarks
            drawLandmarks(ctx, landmarks);
          }
        }

        // Call callback if provided
        if (onResults) {
          onResults(results);
        }
      });

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceMesh) {
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
  }, [onResults]);

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Define makeup regions with different colors
    const regions = {
      lips: { color: 'rgba(255, 107, 157, 0.5)', indices: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375] },
      leftEye: { color: 'rgba(196, 78, 255, 0.5)', indices: [33, 7, 163, 144, 145, 153, 154, 155, 133] },
      rightEye: { color: 'rgba(78, 154, 255, 0.5)', indices: [362, 382, 381, 380, 374, 373, 390, 249, 263] },
      eyebrows: { color: 'rgba(255, 193, 7, 0.5)', indices: [70, 63, 105, 66, 107, 336, 296, 334, 293, 300] },
      cheeks: { color: 'rgba(233, 30, 99, 0.3)', indices: [116, 123, 147, 187, 207, 216, 212, 202] }
    };

    // Draw regions with semi-transparent colors
    Object.values(regions).forEach(region => {
      if (region.indices.length > 2) {
        ctx.beginPath();
        ctx.moveTo(
          landmarks[region.indices[0]].x * ctx.canvas.width,
          landmarks[region.indices[0]].y * ctx.canvas.height
        );
        
        for (let i = 1; i < region.indices.length; i++) {
          ctx.lineTo(
            landmarks[region.indices[i]].x * ctx.canvas.width,
            landmarks[region.indices[i]].y * ctx.canvas.height
          );
        }
        
        ctx.closePath();
        ctx.fillStyle = region.color;
        ctx.fill();
      }
    });

    // Draw all landmarks as small dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    landmarks.forEach(landmark => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

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