const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const fileWithoutExtension = path.basename(file.originalname, path.extname(file.originalname));
            const fileName = `${fileWithoutExtension.toLowerCase().split(' ').join('-')}-${Date.now()}${path.extname(file.originalname)}`;
            cb(null, fileName);
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 //Maximum file size is 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv" || file.mimetype == "application/vnd.ms-excel" || file.originalname.match(/\.(csv)$/i)) {
            cb(null, true);
        } else {
            cb({ message: 'Only Csv file format allowed!', fileName: file.originalname, field: file.fieldname }, false);
        }
    }
})
    .single('csvFile');

/*
 |--------------------------------------------------------------------------
 | Middleware Products FileUpload
 |--------------------------------------------------------------------------
 */
exports.fileUpload = function (req, res, next) {
    upload(req, res, err => {
        // if ( err instanceof multer.MulterError ) { }
        if (err) {
            req.fileError = { value: '', msg: err.message, param: err.field, location: 'body' };
        }
        next();
    });
};
