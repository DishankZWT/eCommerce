const multer = require("multer");
// const storage = multer.memoryStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./media");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpg",
      "image/png",
      "image/jpeg",
      "image/img",
      "image/gif",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.status = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { upload };
