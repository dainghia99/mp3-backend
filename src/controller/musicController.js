const prisma = require("../database/db");
const multer = require("multer");
const path = require("path");

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

const musicController = {
    getAllMusic: async (req, res) => {
        try {
            const music = await prisma.music.findMany();
            const musicWithRelativeUrls = music.map((track) => ({
                ...track,
                url: `/api/music/files/${path.basename(track.url)}`,
            }));
            res.json(musicWithRelativeUrls);
        } catch (error) {
            res.status(400).json({
                error: "Không thể lấy danh sách bản ghi Music",
            });
        }
    },
    createMusic: async (req, res) => {
        try {
            const { title, author, album, year, genre } = req.body;
            const file = req.file;

            if (!file) {
                return res
                    .status(400)
                    .json({ error: "Không có file được upload" });
            }

            // Sử dụng đường dẫn tương đối
            const relativePath = `/api/music/files/${file.filename}`;

            const music = await prisma.music.create({
                data: {
                    title,
                    author,
                    url: relativePath, // Lưu đường dẫn tương đối
                    album,
                    year: parseInt(year),
                    genre,
                },
            });
            res.status(201).json(music);
        } catch (error) {
            res.status(400).json({ error: "Không thể tạo bản ghi Music" });
        }
    },
    updateMusic: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, url, album, year, genre } = req.body;
            const updatedMusic = await prisma.music.update({
                where: { id: String(id) },
                data: {
                    title,
                    author,
                    url,
                    album,
                    year,
                    genre,
                },
            });
            res.json(updatedMusic);
        } catch (error) {
            res.status(400).json({ error: "Không thể cập nhật bản ghi Music" });
        }
    },
    deleteMusic: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.music.delete({
                where: { id: String(id) },
            });
            res.status(204).end();
        } catch (error) {
            res.status(400).json({ error: "Không thể xóa bản ghi Music" });
        }
    },
};

module.exports = musicController;
