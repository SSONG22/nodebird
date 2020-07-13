const passport = require("passport");
//local 로그인 전략
const { Strategy: LocalStrategy } = require("passport-local"); //구조분해 문법
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        //1 객체 2 함수
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            //done 이 콜백같은 거임
            return done(null, false, { reason: "존재하지 않는이메일 입니다!" }); //순서 -> 서버에러, 성공, 클라이언트 에러
          }
          const result = await bcrypt.compare(password, user.password); // db pw와 사용자가 입력한 pw를 비교

          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다!" });
        } catch (error) {
          console.error(error());
          return done(error);
        }
      }
    )
  );
};
