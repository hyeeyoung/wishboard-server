// @brief 1.Express app을 생성
var express = require("express");
var app = express();
var bodyParser = require("body-parser"); // @brief bodyParse : 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어
var db = require("./db"); // @brief : db pool 사용하기
var path = require("path");
var port = 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// // @brief 2.라우트할 모듈
var root_router = require("./routes/root");
var item = require("./routes/item");
var user = require("./routes/user");
var basket = require("./routes/basket");
var folder = require("./routes/folder");

app.set("port", port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * @ brief 3.별도 파일에서 라우트 함수를 작성할 때는 express.Router() 함수를통해 호출
 * module.exports = router 을 해주면 해당 파일에서 선언한 함수를 router를 통해서 사용할 수 있다.
 */
app.use("/", root_router);
app.use("/item", item); //@ brief /new_item : 안드로이드에서 작성한 경로
app.use("/user", user);
app.use("/basket", basket);
app.use("/folder", folder);
app.use(express.static(path.join(__dirname, "public")));

// @brief 4.데이터베이스 연결
db.connect(function (err) {
  if (err) {
    console.log("데이터베이스에 접속할 수 없습니다");
    process.exit(1);
  }
});

// @brief catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// @brief error handler
app.use(function (err, req, res, next) {
  // @brief set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // @brief render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
