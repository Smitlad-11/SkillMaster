// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require('path');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Ensure upload directories exist
// ['uploads', 'uploads/videos', 'uploads/thumbnails', 'uploads/pdfs', 'uploads/avatars', 'uploads/assignments', 'uploads/certificates'].forEach(dir => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder = 'uploads/';
//     if (req.originalUrl && req.originalUrl.includes('/assignments')) folder = 'uploads/assignments/';
//     else if (file.mimetype.startsWith('video')) folder = 'uploads/videos/';
//     else if (file.mimetype === 'application/pdf') folder = 'uploads/pdfs/';
//     else if (file.mimetype.startsWith('image')) folder = 'uploads/thumbnails/';
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${unique}${path.extname(file.originalname)}`);
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "skillmaster";

    if (req.originalUrl.includes("/assignments")) {
      folder = "skillmaster/assignments";
    } else if (file.mimetype.startsWith("video")) {
      folder = "skillmaster/videos";
    } else if (file.mimetype === "application/pdf") {
      folder = "skillmaster/pdfs";
    } else if (file.mimetype.startsWith("image")) {
      folder = "skillmaster/thumbnails";
    }

    return {
      folder,
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp4|mkv|webm|pdf|zip|rar/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB limit
});

module.exports = upload;
