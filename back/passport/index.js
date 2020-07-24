const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log(user.id);
    done(null, user.id); //유저 정보중 쿠키랑 묶어줄 1번만 저장한다는 뜻
    //첫번째 인자 서버에러, 두번째 인자 성공
  });

  //그반대
  passport.deserializeUser(async (id, done) => {
    try {
      //복원
      const user = await User.findOne({ where: { id } });
      console.log(user);
      done(null, user); //(서버에러, 성공) db에서 유저 복구, req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
