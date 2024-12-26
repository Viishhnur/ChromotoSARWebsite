import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { Upload, Loader2, Waves } from "lucide-react";

function FloodDetectionPage() {
  const [uploadedImage, setUploadedImage] = useState('');
  const [predictedMask, setPredictedMask] = useState('');
  const [floodDetectedImage, setFloodDetectedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (base64) => {
    setUploadedImage(base64);
    setPredictedMask('');
    setFloodDetectedImage('');
  };

  const handleDetection = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://192.168.29.196:8080/flood-api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: uploadedImage }),
      });
      
      const data = await response.json();
      if (data.predicted_mask && data.result_image) {
        setPredictedMask(data.predicted_mask);
        setFloodDetectedImage(data.result_image);
      }
    } catch (error) {
      console.error('Detection error:', error);
      alert("Error processing the image: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const ImageCard = ({ label, image }) => (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-blue-600">{label}</h3>
      <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        {image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt={label}
            className="w-full h-full object-contain object-center"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Waves className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Flood Area Detection
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Upload an image to detect flood risks using Unet-R model 
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                <Upload className="mr-3 h-6 w-6" />
                Upload Image
              </button>
              <button
                onClick={handleDetection}
                disabled={loading || !uploadedImage}
                className={`
                  flex items-center px-8 py-4 rounded-xl
                  ${loading || !uploadedImage 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 transition-transform transform hover:scale-105'}
                  text-white
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Detect Flood
                  </>
                )}
              </button>
            </div>

            <div className="hidden">
              <ImageUpload onFileUpload={handleFileUpload} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <ImageCard label="Uploaded Image" image={uploadedImage} />
              <ImageCard label="Predicted Mask" image={predictedMask} />
              <ImageCard label="Flood Detected Image" image={floodDetectedImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloodDetectionPage;
