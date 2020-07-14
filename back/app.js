const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");

const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3060", //true 해도됨
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express!");
});

app.use("/post", postRouter); //중복된 것을 앞으로 빼줌 //prefix
app.use("/posts", postsRouter);
app.use("/user", userRouter);

//기본적인 에러처리 미들웨어 변경
// app.use((err, req, res, next) => {
// });

app.listen(3065, () => {
  console.log("서버실행중");
});