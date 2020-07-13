const express = require("express");
const router = express.Router();
const { Post, User, Image, Comment } = require("../models");
const { isLoggedIn } = require("./middleware");
//post가 공통적
router.post("/", isLoggedIn, async (req, res, next) => {
  //POST / post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    await console.log(fullPost);
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(err);
  }
});

router.delete("/", isLoggedIn, (req, res) => {
  //DELETE /post
  res.json({ id: 1 });
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  //POST /post/1/comment
  try {
    //존재하지 않는 게시글에 댓글을 달때
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) return res.status(403).send("존재하지 않는 게시글입니다"); //응답 1번이어야 해서 return 붙여야함
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    next(err);
  }
});

module.exports = router;
