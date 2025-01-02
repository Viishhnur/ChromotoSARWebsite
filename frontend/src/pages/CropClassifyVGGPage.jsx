import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { Upload, Loader2, Leaf } from "lucide-react";

function CropClassifyVGGPage() {
  const [imageBase64, setImageBase64] = useState('');
  const [classificationResult, setClassificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (base64) => {
    setImageBase64(base64);
    setClassificationResult(null);
  };

  const handleClassification = async () => {
    if (!imageBase64) {
      alert("Please upload an image first.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://18.232.96.25:80/vgg-api/predictVGG', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      
      const data = await response.json();
      if (data.crop) {
        setClassificationResult({
          cropType: data.crop,
          // Backend doesn't provide confidence, so we won't display it
        });
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Classification error:', error);
      alert("Error classifying the image: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Function to capitalize the crop name
  const formatCropName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Crop Classification with VGG-16
            </h1>
            <p className="mt-2 text-gray-600">
              Upload a crop image to classify it using VGG-16 model
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported crops: Jute, Maize, Rice, Sugarcane, Wheat
            </p>
          </div>

          <div className="space-y-8">
            {/* Upload Section */}
            <div className="flex justify-center">
              <ImageUpload onFileUpload={handleFileUpload} />
            </div>
            
            {/* Image and Result Display */}
            <div className="space-y-6">
              {imageBase64 && (
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Uploaded Image</h3>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-200 max-w-md">
                    <img
                      src={`data:image/png;base64,${imageBase64}`}
                      alt="Uploaded crop"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Classification Result */}
              {classificationResult && (
                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Classification Result</h3>
                  <div className="space-y-2">
                    <p className="text-green-700 text-xl font-medium">
                      Predicted Crop: {formatCropName(classificationResult.cropType)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Classify Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleClassification}
                disabled={loading || !imageBase64}
                className={`
                  flex items-center justify-center px-6 py-3 rounded-lg
                  ${loading || !imageBase64 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 transition-colors'}
                  text-white font-medium w-48
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Classify Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropClassifyVGGPage;   