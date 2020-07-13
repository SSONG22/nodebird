const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");

const router = express.Router();

//GET /user
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"], //비밀번호만 빼겠다.
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error("get user error", error);
    next(error);
  }
});

//POST /user/login
router.post("/login", isNotLoggedIn, (req, res, next) => {
  //미들웨어 확장 방법
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      //401: 허가되지 않음
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      //passport에서 로그인 할 수 있게 하는 함수
      if (loginErr) {
        //혹시나 passport 로그인에서 에러가 나면 (우리서비스 로그인이 아님, 자체 로그인 후 passport 로그인을 함)
        console.error(loginErr);
        return next(loginErr);
      } //살면서 본적이 없음
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ["id", "nickname", "email"], // 이정보를 포함하겠다
        attributes: {
          exclude: ["password"], //비밀번호만 빼겠다.
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.json(fullUserWithoutPassword); // user 가 me가 된다.
    });
  })(req, res, next);
}); //전략이 실행됨

//POST /user
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    //중복검사
    // console.log(req);
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다"); //응답은 1번만
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //해시화

    await User.create({
      //테이블안에 데이터 삽입
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send("ok"); //생략 안하는 것을 추천
  } catch (error) {
    console.error(error);
    //status 500
    next(error); //next 로 에러를 보낸다 express 가 브라우저로 error 보냄
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        //조건
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
