const express = require("express");

const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // console.log(User, Image);
  try {
    //GET /posts
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
      ],
    });
    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
