const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

// Tentukan bucket dan path file model
const bucketName = 'nama-bucket-anda';
const filePath = 'path/ke/model.json';

// Unggah file model ke Cloud Storage
exports.uploadModel = async () => {
  await storage.bucket(bucketName).upload(filePath, {
    public: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  console.log(`Model telah diunggah ke ${bucketName}/${filePath}`);
};

// Muat model dari Cloud Storage
exports.loadModel = async () => {
  const [modelBuffer] = await storage.bucket(bucketName).file(filePath).download();
  const model = await tf.loadLayersModel(tf.io.fromMemory(modelBuffer));
  return model;
};