const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const musicRoutes = require("./routes/music");
const multer = require("multer");
const path = require("path");

// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../music"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"], // Địa chỉ của ứng dụng React
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Welcome to the MP3 backend!");
});

// Sử dụng routes cho Music
app.use("/api/music", musicRoutes);

// Thêm route để xử lý upload file
app.post("/upload", upload.single("music"), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ message: "Không có file nào được tải lên." });
    }
    res.json({ message: "File đã được tải lên thành công." });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
