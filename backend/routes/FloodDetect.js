const router = require('express').Router();
const ort = require('onnxruntime-node');
const { Buffer } = require('buffer');
const sharp = require('sharp');  // For image processing
const cv = require("@techstark/opencv-js");

let floodSession;
const floodModelPath = './models/dl-models/unetr.onnx'; // Path to flood detection ONNX model


async function loadFloodModel() {
  try {
    floodSession = await ort.InferenceSession.create(floodModelPath);
    console.log("Flood detection model loaded successfully");
  } catch (error) {
    console.error("Error loading flood detection model:", error);
  }
}
loadFloodModel();



async function preprocessImageForFloodDetection(imageBuffer) {
  try {
    console.log("Input buffer length:", imageBuffer.length);

    // Resize image to 256x256 and get both data and info
    const { data: resizedImage, info } = await sharp(imageBuffer)
      .resize(256, 256)
      .raw() // Get raw pixel data
      .toBuffer({ resolveWithObject: true });

    console.log("Resized image buffer length:", resizedImage.length);
    console.log("Resized image dimensions:", info.width, "x", info.height);

    // Convert to float32 normalized tensor
    const float32Data = new Float32Array(resizedImage.length);
    for (let i = 0; i < resizedImage.length; i++) {
      float32Data[i] = resizedImage[i] / 255.0; // Normalize pixel values
    }

    console.log("Float32 data length:", float32Data.length);

    // Create patches of size 16x16 directly from the resized image data
    const patchSize = 16;
    const numPatchesPerRow = info.width / patchSize; // Number of patches per row
    const numPatchesPerColumn = info.height / patchSize; // Number of patches per column
    const totalPatches = numPatchesPerRow * numPatchesPerColumn; // Total number of patches

    const patches = new Float32Array(totalPatches * patchSize * patchSize * 3); // Assuming 3 channels (RGB)

    let patchIndex = 0;
    for (let row = 0; row < numPatchesPerColumn; row++) {
      for (let col = 0; col < numPatchesPerRow; col++) {
        const left = col * patchSize;
        const top = row * patchSize;

        // Extract and flatten the patch directly from resizedImage
        for (let y = 0; y < patchSize; y++) {
          for (let x = 0; x < patchSize; x++) {
            const pixelIndex = ((top + y) * info.width + (left + x)) * 3; // RGB channels
            const patchPixelIndex =
              patchIndex * patchSize * patchSize * 3 + (y * patchSize + x) * 3;
            patches[patchPixelIndex] = float32Data[pixelIndex]; // R
            patches[patchPixelIndex + 1] = float32Data[pixelIndex + 1]; // G
            patches[patchPixelIndex + 2] = float32Data[pixelIndex + 2]; // B
          }
        }
        patchIndex++;
      }
    }

    // Hard-code the tensor shape to [1, 256, 768]
    const tensorShape = [1, 256, 768]; // Assuming this is the expected input shape

    // Create an ONNX Runtime tensor from the patches with hard-coded dimensions
    const tensor = new ort.Tensor(
      "float32", // Data type
      patches.slice(0, tensorShape[1] * tensorShape[2]), // Data (ensure it fits expected size)
      tensorShape // Dimensions: [batch_size=1, height=256, width=768]
    );

    return tensor;
  } catch (error) {
    console.error("Preprocessing error:", error);
    throw error;
  }
}

router.post("/detect", async (req, res) => {
  try {
    // Check for base64 image in request body
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Decode base64 image
    const imageBuffer = Buffer.from(image, "base64");
    // Convert input image to raw pixels using Sharp
    const inputImageMetadata = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Create OpenCV matrix from the raw pixel data
    const resultMat = cv.matFromArray(
      inputImageMetadata.info.height,
      inputImageMetadata.info.width,
      cv.CV_8UC3,
      inputImageMetadata.data
    );

    // Preprocess image (assuming this function is already defined)
    const processedImage = await preprocessImageForFloodDetection(imageBuffer);

    // Run inference
    const feeds = {};
    feeds[floodSession.inputNames[0]] = processedImage;
    const results = await floodSession.run(feeds);

    // Get output tensor (adjust the key based on your model's output)
    const outputTensor = results[floodSession.outputNames[0]];
    const predictionArray = outputTensor.data;

    // Denormalize prediction and convert to Uint8Array
    const denormalizedPrediction = new Uint8Array(predictionArray.length);
    for (let i = 0; i < predictionArray.length; i++) {
      denormalizedPrediction[i] = predictionArray[i] > 0.5 ? 255 : 0; // Convert to binary mask
    }

    // Create OpenCV Mat from Uint8Array directly for the mask
    const maskMat = cv.matFromArray(
      256,
      256,
      cv.CV_8UC1,
      denormalizedPrediction
    );

    // Find contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
      maskMat,
      contours,
      hierarchy,
      cv.RETR_CCOMP,
      cv.CHAIN_APPROX_SIMPLE
    );

    cv.drawContours(resultMat, contours, -1, new cv.Scalar(255, 0, 0), 2);
    // Convert mask Mat to base64 using Buffer
    const maskBuffer = Buffer.from(maskMat.data);
    const maskImageBuffer = await sharp(maskBuffer, {
      raw: { width: maskMat.cols, height: maskMat.rows, channels: 1 }, // Grayscale channel
    })
      .toFormat("png") // Convert to PNG format
      .toBuffer();

    const maskBase64 = maskImageBuffer.toString("base64");

    // Convert result image Mat to base64 using Buffer
    const resultBuffer = Buffer.from(resultMat.data);

    const resultImageBuffer = await sharp(resultBuffer, {
      raw: { width: resultMat.cols, height: resultMat.rows, channels: 3 }, // RGB channels
    })
      .toFormat("png") // Convert to PNG format
      .toBuffer();

    const resultBase64 = resultImageBuffer.toString("base64");

    // Clean up memory
    maskMat.delete();
    resultMat.delete();
    contours.delete();
    hierarchy.delete();

    // Return results including both mask and result images in base64 format and flood detection status
    res.json({
      predicted_mask: maskBase64,
      result_image: resultBase64,
      flood_detected: denormalizedPrediction.some((val) => val > 0),
    });
  } catch (error) {
    console.error("Flood Detection Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      error: "Flood detection failed",
      details: error.message,
    });
  }
});

module.exports = router;