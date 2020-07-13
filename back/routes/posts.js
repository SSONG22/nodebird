const express = require("express");

const { Post, User, Image } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    //GET /posts
    const posts = await Post.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]], //2차원배열인 이유는 여러 기준으로 정렬할 수 있기 때문
      include: [
        {
          model: User,
        },
        {
          model: Image,
        },
      ],
    });
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
