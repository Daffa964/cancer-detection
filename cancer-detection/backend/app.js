const express = require('express');
const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

const app = express();
const port = process.env.PORT || 8080;

// Configure Multer for file upload
const upload = multer({
  limits: {
    fileSize: 1000000, // 1MB
  },
});

// Initialize Firestore
admin.initializeApp();
const firestore = admin.firestore();
const predictionsRef = firestore.collection('predictions');

// API endpoint for prediction
app.post('/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'No image file provided',
    });
  }

  if (req.file.size > 1000000) {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
  }

  try {
    // TODO: Implement model inference logic here
    // Call the machine learning model and get the prediction result

    const predictionResult = 'Cancer';
    const predictionId = '77bd90fc-c126-4ceb-828d-f048dddff746';
    const createdAt = new Date().toISOString();
    const predictionSuggestion = predictionResult === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    // Save prediction result to Firestore
    await predictionsRef.doc(predictionId).set({
      id: predictionId,
      result: predictionResult,
      suggestion: predictionSuggestion,
      createdAt: createdAt,
    });

    const responseData = {
      status: 'success',
      message: 'Model is predicted successfully',
      data: {
        id: predictionId,
        result: predictionResult,
        suggestion: predictionSuggestion,
        createdAt: createdAt,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error during prediction:', error);
    return res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
});

// API endpoint for prediction histories
app.get('/predict/histories', async (req, res) => {
  try {
    const predictionsSnapshot = await predictionsRef.get();
    const predictions = predictionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    return res.status(200).json({
      status: 'success',
      data: predictions,
    });
  } catch (error) {
    console.error('Error retrieving prediction histories:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to retrieve prediction histories',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});