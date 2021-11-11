const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // @brief bodyParse : 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
const db = require("./config/db"); // @brief : db pool 사용하기
const path = require("path");
const port = 3000;

//기본 설정
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

app.get("/", (req, res) => res.send("Welcome to WishBoard!!"));

app.set("port", port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//router 설정
const userRouter = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");
const basketRouter = require("./routes/basketRoutes");
const folderRouter = require("./routes/folderRoutes");
const notiRouter = require("./routes/notiRoutes");
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/basket", basketRouter);
app.use("/folder", folderRouter);
app.use("/noti", notiRouter);

//db 설정
db.connect(function (err) {
  if (err) {
    console.log("데이터베이스에 접속할 수 없습니다.");
    process.exit(1);
  }
});

//에러페이지 설정
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  // @brief set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // @brief render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
