const router = require('express').Router();
const ort = require('onnxruntime-node'); // Ensure ONNX Runtime is properly imported
const { Buffer } = require('buffer');
const sharp = require('sharp');  // For image processing

let Cropsession;

// Load ONNX model
const vit_model_path = './models/dl-models/vit.onnx' // Path to ONNX model




async function loadViTModel() {
  try {
    Cropsession = await ort.InferenceSession.create(vit_model_path);
    console.log('VIT model loaded successfully');
  } catch (error) {
    console.error('Error loading ONNX model:', error);
  }
}
loadViTModel();


async function preprocessImage(imageBuffer) {
  try {
    // Load the image and resize it to 224x224 pixels
    const { data, info } = await sharp(imageBuffer)
      .resize(224, 224)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    if (channels !== 3) {
      throw new Error('Image must have 3 channels (RGB)');
    }

    // Define normalization parameters (same as in PyTorch)
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    // Create a Float32Array to hold the normalized data
    const chwData = new Float32Array(width * height * channels);

    // Rearrange and normalize the data from HWC to CHW format
    for (let c = 0; c < channels; c++) {
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const hwcIndex = h * width * channels + w * channels + c; // Index in HWC format
          const chwIndex = c * width * height + h * width + w;      // Index in CHW format

          // Normalize the pixel value
          const value = data[hwcIndex] / 255.0; // Scale to [0, 1]
          chwData[chwIndex] = (value - mean[c]) / std[c]; // Apply normalization
        }
      }
    }

    // Create the tensor with the correct shape [1, 3, 224, 224]
    const tensor = new ort.Tensor('float32', chwData, [1, 3, height, width]);

    return tensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Image preprocessing failed');
  }
}


// Inference function
async function runModel(imageTensor) {
  try {
    const feeds = { [Cropsession.inputNames[0]]: imageTensor }; // Use actual input name
    const output = await Cropsession.run(feeds);
    const outputTensor = output[Cropsession.outputNames[0]];    // Use actual output name

    // Get the predicted class index
    const scores = outputTensor.data;
    const predictedIndex = scores.indexOf(Math.max(...scores));

    const crops = ['jute', 'maize', 'rice', 'sugarcane', 'wheat'];
    return crops[predictedIndex];
  } catch (error) {
    console.error('Error running model:', error);
    throw new Error('Model inference failed');
  }
}


router.post('/predictVit', async (req, res) => {
  const base64Image = req.body.image;
  if (!base64Image) {
    return res.status(400).send('No image provided');
  }

  try {
    // Decode Base64 image
    const imageBuffer = Buffer.from(base64Image, 'base64');
    console.log('Crop image received, processing using ViT model...'); // Debugging line

    // Preprocess image and run model
    const imageTensor = await preprocessImage(imageBuffer);
    const prediction = await runModel(imageTensor);

    // Return prediction
    res.status(200).send({ crop: prediction });
  } catch (error) {
    console.error('Error in /predict route:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;