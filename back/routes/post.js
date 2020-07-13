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
              model: User, //댓글 작성자
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, //좋아요 누른 사람
          attributes: ["id", "nickname"],
          as: "Likers",
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(err);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  //DELETE /post/1
  try {
    await Post.destroy({
      where: { id: req.params.postId },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
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

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  //PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => {
  //DELETE /post/1/unlike
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
