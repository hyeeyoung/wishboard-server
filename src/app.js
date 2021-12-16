const express = require("express");
const app = express();
const morgan = require("morgan");
const logger = require("./config/winston");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: "../.env" });
const port = process.env.PORT || 3000;

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");
const cartRouter = require("./routes/cartRoutes");
const folderRouter = require("./routes/folderRoutes");
const notiRouter = require("./routes/notiRoutes");

const passport = require("passport");
const passportConfig = require("./config/passport");
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined"; // NOTE: morgan 출력 형태

const handleErrors = require("./middleware/handleError");
const { NotFound } = require("./utils/errors");

//기본 설정
app.use(morgan(morganFormat, { stream: logger.stream }));

app.listen(port, () => logger.info(`Server start listening on port ${port}`));

app.get("/", (req, res) => res.send("Welcome to WishBoard!!"));

app.set("port", port || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
passportConfig();

//router 설정
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/cart", cartRouter);
app.use("/folder", folderRouter);
app.use("/noti", notiRouter);

//에러페이지 설정
app.use((req, res, next) => {
  throw new NotFound("API URL is invalid");
});
app.use(handleErrors);

module.exports = app;
