const multer = require('multer');
const path = require('path');


// Set up multer for file storage
exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename by appending a timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
