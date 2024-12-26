// const ensureAuthenticated = require('../middlewares/Auth');
const router = require('express').Router();
const ort = require('onnxruntime-node'); // Ensure ONNX Runtime is properly imported
const sharp = require('sharp'); // For image manipulation

// Path to SAR colorization ONNX model
const pix2pixmodelPath = "./models/dl-models/sar2rgb.onnx";

let sarSession;

async function loadSarModel() {
  try {
    sarSession = await ort.InferenceSession.create(pix2pixmodelPath);
    console.log("SAR colorization model loaded successfully"); // This will log when the model is loaded
  } catch (error) {
    console.error("Error loading SAR model:", error);
  }
}

// loadSarModel(); // Load the model when the server starts
async function destroySarModel() {
  try {
    if (sarSession) {
      sarSession = null; // Set the session to null for garbage collection
      console.log("SAR colorization model unloaded successfully");
    }
  } catch (error) {
    console.error("Error unloading SAR model:", error);
  }
}


async function preprocessSarImage(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(256, 256) // Resize image to 256x256
      .raw() // Keep the image in its original format (no color space conversion)
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    // Ensure the input is in the shape [1, 3, H, W]
    const chwData = new Float32Array(width * height * channels);
    const mean = [0.5, 0.5, 0.5]; // Pix2Pix normalization (mean and std are 0.5)
    const std = [0.5, 0.5, 0.5];

    for (let c = 0; c < channels; c++) {
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          const hwcIndex = h * width * channels + w * channels + c; // Index in HWC format
          const chwIndex = c * width * height + h * width + w;      // Index in CHW format
          const value = data[hwcIndex] / 255.0; // Scale pixel to [0, 1]
          chwData[chwIndex] = (value - mean[c]) / std[c]; // Normalize
        }
      }
    }

    // Create a tensor in the shape [1, 3, 256, 256]
    const tensor = new ort.Tensor('float32', chwData, [1, 3, height, width]);
    return tensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Preprocessing failed');
  }
}

async function postprocessSarImage(outputTensor) {
  const [_, channels, height, width] = outputTensor.dims;
  const data = outputTensor.data; // Flattened output array

  const chwData = new Uint8Array(width * height * channels);

  for (let c = 0; c < channels; c++) {
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const chwIndex = c * width * height + h * width + w;
        const hwcIndex = h * width * channels + w * channels + c;
        // Denormalize pixel values and clip to [0, 255]
        chwData[hwcIndex] = Math.min(
          Math.max(((data[chwIndex] * 0.5) + 0.5) * 255, 0),
          255
        );
      }
    }
  }

  // Convert to an image buffer
  const imageBuffer = Buffer.from(chwData);
  const image = await sharp(imageBuffer, {
    raw: { width, height, channels },
  })
    .toFormat('png') // Convert to PNG
    .toBuffer();

  return image;
}

router.post("/colorize" ,async (req, res) => {
  const base64Image = req.body.image;
  if (!base64Image) {
    return res.status(400).send("No image provided");
  }
  loadSarModel(); // Load the model for each request

  try {
    const imageBuffer = Buffer.from(base64Image, "base64");
    console.log("SAR image received, processing...");

    // Preprocess the SAR image
    const imageTensor = await preprocessSarImage(imageBuffer); // Adjust size as needed
    const feeds = { [sarSession.inputNames[0]]: imageTensor };

    // Run inference
    const output = await sarSession.run(feeds);
    const sarOutputTensor = output[sarSession.outputNames[0]];

    // Postprocess the output to get Base64 image
    const colorizedImage = await postprocessSarImage(sarOutputTensor); // Use actual dimensions

    const colorizedBase64 = colorizedImage.toString('base64');
    res.status(200).send({ colorizedImage: colorizedBase64 });
  } catch (error) {
    console.error("Error in /colorize route:", error);
    res.status(500).send({ error: error.message });
  }
  finally {
    destroySarModel(); // Unload the model after each request
  }
});

module.exports = router;
