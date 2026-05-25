const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "delicious-food", // The folder in cloudinary where images will be stored
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // basic transformation
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
