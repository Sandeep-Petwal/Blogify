const multer = require('multer');
const path = require('path');


// Set up multer for file storage
exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //upload directory
    },
    filename: (req, file, cb) => {
        // unique filename by  timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
 

exports.imageFileFilter = (req, file, cb) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (validImageTypes.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false); // reject file
    }
};
