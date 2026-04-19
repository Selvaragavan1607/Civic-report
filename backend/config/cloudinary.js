// Optional Cloudinary cloud-storage adapter. Falls back to local disk when env vars are missing.
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (useCloudinary) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'civic_complaints', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
  });
  upload = multer({ storage });
  console.log('☁️  Cloudinary storage enabled');
} else {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) =>
      cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
  });
  upload = multer({ storage });
  console.log('💾 Local /uploads storage enabled (Cloudinary not configured)');
}

module.exports = { upload, useCloudinary };
