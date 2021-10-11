var express = require("express");
var db = require("../db");
var router = express.Router(); // @brief : express.Router() : router 객체를 생성

// @brief : 폴더 조회
router.get("/:user_id", function (req, res) {
  var user_id = Number(req.params.user_id);

  // @TODO : 임시 sql. item_count가 현재 이상하게 보임. 수정해야 할 부분
  var select_sql = `select f.user_id, f.folder_name, f.folder_image, f.folder_id, ifnull(i.item_count, 0) item_count from folders f left outer join (select folder_id, count(*) item_count from items group by folder_id) i 
on f.folder_id = i.folder_id where f.user_id = ?`;

  console.log(select_sql, user_id);

  db.get().query(select_sql, user_id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to selected the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully selected data into the folders!!");
        res.status(200).json(result);
        console.log(result);
      }
      db.releaseConn();
    }
  });
});

// @brief : 폴더 리스트 조회
router.get("/list/:user_id", function (req, res) {
  var user_id = Number(req.params.user_id);
 
 // var select_sql = `SELECT folder_id, folder_name, folder_image FROM folders WHERE user_id = ?`;

  var select_sql = `SELECT f.folder_id, f.folder_name, f.folder_image, ifnull(i.item_count, 0) item_count FROM folders f LEFT OUTER JOIN (SELECT folder_id, count(*) item_count FROM items GROUP BY folder_id) i ON f.folder_id = i.folder_id WHERE f.user_id = ?`;

  console.log(select_sql);

  db.get().query(select_sql, [user_id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to selected the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully selected data into the folders list!!");
        res.status(200).json(result);
        console.log(result);
      }
      db.releaseConn();
    }
  });
});


//@brief : 폴더 내 아이템 상세 조회
router.get("/item/:user_id/:folder_id", function (req, res) {
  var user_id = Number(req.params.user_id);
  var folder_id = Number(req.params.folder_id);

  var select_sql = `SELECT i.item_id, i.user_id, i.item_image, i.item_name,
  i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id
  FROM items i left outer join basket b ON i.item_id = b.item_id
  WHERE i.user_id = ? AND i.folder_id = ?
  ORDER BY i.create_at DESC`;

  var parmas = [user_id, folder_id];

  console.log(select_sql);

  db.get().query(select_sql, parmas, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to selected the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully selected data into the folders in items!!");
        res.status(200).json(result);
        console.log(result);
      }
      db.releaseConn();
    }
  });
});

// @brief : 폴더 추가
router.post("/", function (req, res) {
  var folder_name = req.body.folder_name;
  var folder_image = req.body.folder_image; //@TODO : varchar니까 그대로. 수정?
  var user_id = Number(req.body.user_id);

  var insert_sql =
  `insert into folders(folder_name, folder_image, user_id) values (?, ?, ?)`;

  var params = [folder_name, folder_image, user_id];

  console.log(insert_sql);

  db.get().query(insert_sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to inserted the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully inserted data into the folders!!");
        res.status(200).json({
          success: true,
          message: "폴더 데이터베이스 추가 성공",
        });
      }
      db.releaseConn();
    }
  });
});

// @brief : 폴더명 수정
router.put("/", function (req, res) {
  var user_id = Number(req.body.user_id); 
  var folder_name = req.body.folder_name;
  var folder_image = req.body.folder_image;
  var folder_id = Number(req.body.folder_id);
  
  var update_sql = `UPDATE folders SET folder_name = ?, folder_image = ? WHERE folder_id = ? and user_id = ?`;	

  var params = [folder_name, folder_image, folder_id, user_id];
  console.log(update_sql);

  db.get().query(update_sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to updated the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully updated data into the folders!!");
        res.status(200).json({
          success: true,
          message: "폴더 데이터베이스의 값 수정 성공",
        });
      }
      db.releaseConn();
    }
  });
});

// @brief : 폴더 삭제
router.delete("/", function (req, res) {
  var folder_id = Number(req.body.folder_id);

  //@see : folder_id는pk 값이니까 이거 하나로 충분히 삭제 ok
  var delete_sql = `DELETE FROM folders WHERE folder_id = ?`;	

  console.log("delete_sql : " + delete_sql);	

  db.get().query(delete_sql, folder_id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to deleted the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully deleted data into the folders!!");
        res.status(200).json({
          success: true,
          message: "폴더 데이터베이스의 값 삭제 성공",
        });
      }
      db.releaseConn();
    }
  });
});

//@brief : 아이템 수정에서 폴더이미지 수정
router.put("/item/image", function (req, res) {
  var folder_id = Number(req.body.folder_id);
  var folder_image = req.body.folder_image; //@TODO : varchar니까 그대로. 수정?

  var update_sql =`UPDATE folders SET folder_image = ? WHERE folder_id = ?`;
  var params = [folder_image, folder_id];

  console.log(update_sql);

  db.get().query(update_sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to inserted the folders for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully updated data into the folders!!");
        res.status(200).json({
          success: true,
          message: "폴더 이미지 수정 성공",
        });
      }
      db.releaseConn();
    }
  });
});

module.exports = router;
