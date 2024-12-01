const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const predictionsRef = firestore.collection('predictions');

exports.savePrediction = async (predictionId, predictionResult, predictionSuggestion, createdAt) => {
  await predictionsRef.doc(predictionId).set({
    id: predictionId,
    result: predictionResult,
    suggestion: predictionSuggestion,
    createdAt: createdAt,
  });
};

exports.getPredictionHistories = async () => {
  const predictionsSnapshot = await predictionsRef.get();
  return predictionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    history: doc.data(),
  }));
};