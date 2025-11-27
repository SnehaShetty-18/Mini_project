const express = require('express');
const { uploadFile } = require('../controllers/fileUploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);

module.exports = router;