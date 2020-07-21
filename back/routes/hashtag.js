const express = require("express");
const { Op } = require("sequelize");

const { Hashtag, Post, User, Image, Comment } = require("../models");
const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  //GET/hashtag/태그내용
  // console.log(User, Image);
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //보다 작은
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]], //2차원배열인 이유는 여러 기준으로 정렬할 수 있기 때문
      include: [
        {
          model: Hashtag,
          //include 한에서 조건을 적용할 수 있다
          where: { name: req.params.hashtag },
        },
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
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
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
