const express = require("express");
const multer = require("multer");
const path = require("path"); //node module
const fs = require("fs");

const { Post, User, Image, Comment } = require("../models");
const { isLoggedIn } = require("./middleware");
const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성");
  fs.mkdirSync("uploads");
}

//GET /posts
router.get("/", async (req, res, next) => {
  // console.log(User, Image);
  try {
    const where = {};
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]], //2차원배열인 이유는 여러 기준으로 정렬할 수 있기 때문
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
      ],
    });
    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출 .png
      const basename = path.basename(file.originalname, ext); // 파일 이름

      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  // POST /post/images
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

module.exports = router;
