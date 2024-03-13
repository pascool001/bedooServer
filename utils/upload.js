const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const DB_URL = process.env.DB_URL || "";


const storage = new GridFsStorage({
  url: DB_URL,
  file: (req, file) => {
  return new Promise((resolve, _reject) => {
    const fileInfo = { filename: file.originalname, bucketName: "uploads" };
    resolve(fileInfo);
  });
  },
});

module.exports = multer({storage})