const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploadedImages');
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        var filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, filename);
    }
});

var uploadFiles = multer({ storage: storage }).array("image", 5);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;