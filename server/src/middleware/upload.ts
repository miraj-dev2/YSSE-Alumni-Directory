import multer from 'multer';
import { AppError } from '../lib/AppError.js';

// Use memory storage so sharp can inspect file buffer directly
const storage = multer.memoryStorage();

export const uploadPhoto = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.mimetype)) {
      return cb(
        AppError.badRequest(
          'Only JPEG, PNG, and WebP images are allowed',
          'INVALID_FILE_TYPE'
        )
      );
    }
    cb(null, true);
  }
}).single('photo');

export const uploadCsv = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const isCsv =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.csv');
    if (!isCsv) {
      return cb(
        AppError.badRequest('Only CSV files are allowed', 'INVALID_FILE_TYPE')
      );
    }
    cb(null, true);
  }
}).single('file');
