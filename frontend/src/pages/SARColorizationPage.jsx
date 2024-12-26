import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

function SARColorizationPage() {
  const [imageBase64, setImageBase64] = useState('');
  const [colorizedImage, setColorizedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (base64) => {
    setImageBase64(base64);
    setColorizedImage('');
  };

  const handleImageSubmission = async () => {
    if (!imageBase64) {
      alert("Please upload an image first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://192.168.29.196:8080/sar-api/colorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await response.json();
      if (data.colorizedImage) {
        const colorizedImage = `data:image/png;base64,${data.colorizedImage}`;
        setColorizedImage(colorizedImage);
      }
    } catch (error) {
      console.log(error);
      alert("Error colorizing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              SAR Image Colorization
            </h1>
            <p className="mt-2 text-gray-600">
              Transform your SAR images with AI-powered colorization
            </p>
          </div>

          <div className="space-y-8">
            {/* Upload Section */}
            <div className="flex justify-center">
              <ImageUpload onFileUpload={handleFileUpload} />
            </div>
            
            {/* Image Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Original Image */}
              {imageBase64 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Original Image</h3>
                    <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={`data:image/png;base64,${imageBase64}`}
                        alt="Original"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Colorized Image */}
              <div className="space-y-4">
                {colorizedImage ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Colorized Result</h3>
                    <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={colorizedImage}
                        alt="Colorized"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                  </div>
                ) : imageBase64 && (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">Colorized image will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Colorize Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleImageSubmission}
                disabled={loading || !imageBase64}
                className={`
                  flex items-center justify-center px-6 py-3 rounded-lg
                  ${loading || !imageBase64 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transition-colors'}
                  text-white font-medium w-48
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Colorize Image
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

export default SARColorizationPage;