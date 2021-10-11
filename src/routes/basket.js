var express = require("express");
var db = require("../db");
var router = express.Router(); // @brief : express.Router() : router 객체를 생성

// @brief : 장바구니 조회
router.get("/:user_id", function (req, res) {
  var user_id = Number(req.params.user_id);

  var sql =
  "SELECT a.item_id, a.item_image, a.item_name, a.item_price, b.item_count FROM items a JOIN basket b ON a.item_id = b.item_id WHERE b.user_id = ? ORDER BY a.item_id DESC";

  console.log("sql_select : " + sql);

  db.get().query(sql, [user_id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to selected the basket for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully selected data the basket!!");
	res.status(200).json(result);
/*        res.status(200).json({
          success: true,
          message: "장바구니 데이터베이스 접근 성공",
	 // item: result,
  /*        item_image: result[0].item_image,
          item_name: result[0].item_name,
          item_price: result[0].item_price,
          item_count: result[0].item_count, */
 //     });
	      console.log(result);
      }
      db.releaseConn();
    }
  });
});

// @brief : 장바구니 추가
router.post("/", function (req, res) {
  var user_id = Number(req.body.user_id);
  var item_id = Number(req.body.item_id);

  var sql = "INSERT INTO basket (user_id, item_id, item_count) VALUES (?, ?, 1)";
  var params = [user_id, item_id];

  console.log("sql_insert : " + sql);

  db.get().query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to inserted the basket for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully inserted data into the basket!!");
        res.status(200).json({
          success: true,
          message: "장바구니 데이터베이스 추가 성공",
        });
      }
      db.releaseConn();
    }
  });
});

// @brief : 장바구니 삭제
router.delete("/", function (req, res) {
  var user_id = Number(req.body.user_id);
  var item_id = Number(req.body.item_id);

  console.log(user_id + " " + item_id);

  var sql = "DELETE FROM basket WHERE user_id = ? AND item_id = ?";
  var params = [user_id, item_id];

  console.log("sql_delete : " + sql);

  db.get().query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to deleted the basket for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully deleted data into the basket!!");
        res.status(200).json({
          success: true,
          message: "장바구니 데이터베이스 삭제 성공",
        });
      }
      db.releaseConn();
    }
  });
});
// @brief : 장바구니 수정
router.put("/", function (req, res) {
  console.log(req.body);

  for (var i = 0; i < req.body.length; i++) {
    console.log(
      req.body[i].user_id +
        " " +
        req.body[i].item_id +
        " " +
        req.body[i].item_count +
        " "
    );
  }
  var user_id = req.body[0].user_id; // @prams: user_id는 한 명이므로
 
  var sqls = "UPDATE basket SET item_count = CASE ";
  var params = [];

  for (var i = 0; i < req.body.length; i++) {
    sqls += "WHEN item_id = ? then ? ";
    params.push(req.body[i].item_id);
    params.push(req.body[i].item_count);
    if (i == req.body.length - 1) {  //마지막 원소라면
      sqls += "ELSE item_count END WHERE user_id = ?";
      params.push(user_id);
    }
  }

  console.log("sqls : " + sqls + "\nparams : " + params);

  db.get().query(sqls, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to updated the basket for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully updated data into the basket!!");
        res.status(200).json({
          success: true,
          message: "장바구니 데이터베이스 수정 성공",
        });
      }
      db.releaseConn();
    }
  });
});
module.exports = router;
