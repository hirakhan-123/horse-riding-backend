const multer = require('multer');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path')
// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../uploads/horses'); 
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
        cb(null, uploadPath); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only images are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
