const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const musicController = require("../controller/musicController");

// Cấu hình multer (copy từ server.js)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../music")); // Điều chỉnh đường dẫn nếu cần
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Thêm middleware để phục vụ file tĩnh
router.use("/files", express.static(path.join(__dirname, "../../music")));

// [GET] /api/music
router.get("/", musicController.getAllMusic);

// [POST] /api/music
router.post("/", upload.single("file"), musicController.createMusic);

// [PUT] /api/music/:id
router.put("/:id", musicController.updateMusic);

// [DELETE] /api/music/:id
router.delete("/:id", musicController.deleteMusic);

module.exports = router;
