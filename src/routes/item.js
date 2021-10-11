var express = require('express');
var db = require('../db');
var router = express.Router(); // @brief : express.Router() : router 객체를 생성

//router.get('/', function(req, res, next) {
//  res.send('item!!');
//});

// @brief '/' : 함수가 적용되는 경로(라우트)
//router.get('/new', (req, res) => res.send('item!'));

// /item/new
router.post('/', function(req, res, next) {
    if(!req.body.item_image){
//	return console.log("400 : 정보가 없습니다.")
        return res.status(400).send("정보가 없습니다");
    }
//    var item_id = req.body.item_id;
    var user_id = Number(req.body.user_id);
    var folder_id = req.body.folder_id;
    
    if(folder_id != undefined){
        folder_id = Number(req.body.folder_id);
    }
    //var folder_id = Number(req.body.folder_id);
    var item_image = req.body.item_image;
    var item_name = req.body.item_name;
    var item_price = req.body.item_price;
    var item_url = req.body.item_url;
    var item_memo = req.body.item_memo;
    var sql_insert =  "INSERT INTO items (user_id, folder_id, item_image, item_name, item_price, item_url, item_memo) VALUES(?,?,?,?,?,?,?)";

    var params = [user_id, folder_id, item_image, item_name, item_price, item_url, item_memo];

    console.log("sql_insert : " + sql_insert);

    db.get().query(sql_insert, params, function(err, result){
        if(err) {
            console.log(err);
        } else {
          res.status(200).send(''+result.insertId); // @brief insertId : INSERT 문이 실행됐을 때, 삽입된 데이터의 id를 얻음, 폴더 ID 받아올 때 참고하기
         // db.releaseConn();
	}
          db.releaseConn();
    });
});

//item/home/:user_id
router.get('/home/:user_id', function(req, res, next) {
    // @brief : express 모듈을 사용하면 /:를 통해서 클라이언트에서 주소를 통해 요청한 값을 params로 가져올 수 있다
    var user_id = req.params.user_id;
    console.log("user_id : " + user_id);

    // @brief : 요청한 사용자 아이디로 서버에서 해당 사용자의 item을 select한다.

    var sql = "SELECT i.item_id, i.user_id, i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, b.item_id cart_item_id FROM items i left outer join basket b on i.item_id = b.item_id WHERE i.user_id = ? ORDER BY i.create_at DESC";
    //var sql = "SELECT item_id, user_id, folder_id, item_image, item_name, item_price, item_url, item_memo FROM items WHERE user_id = ? ORDER BY item_id DESC"; //@TODO : user_id 지우기, 해당 주석 지우지 말기
    
    console.log("sql : " + sql);

    db.get().query(sql, [user_id], function (err, rows) {
          if (err) {
               console.log(err);
               res.sendStatus(400);
             } else {
               if (rows.length === 0) { //@brief : 가져온 아이템 정보가 없다면 에러를 띄운다.
                 console.log("Failed to select item data.");
                 res.status(500).json({
                   success: false,
                   message: "wish boarad 서버 에러",
                 });
               } else {
                 console.log("rows : " + JSON.stringify(rows));
		 res.status(200).json(rows);
               }
             }
         db.releaseConn(); //@brief : err가 떠도 conn은 반드시 release() 해주어야한다.
    });
});

//item/detail/:user_id
router.get('/detail/:item_id', function(req, res, next) {
    // @brief : express 모듈을 사용하면 /:를 통해서 클라이언트에서 주소를 통해 요청한 값을 params로 가져올 수 있다
    var item_id = Number(req.params.item_id);
    console.log("item_id : " + item_id);

    // @brief : 요청한 아이템 아이디로 서버에서 해당 item을 select한다.
    //var sql = "SELECT folder_id, item_image, item_name, item_price, item_url, item_memo FROM items WHERE item_id = ?";
   // var sql = "SELECT i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, n.item_notification_type, n.item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id WHERE i.item_id = ?";
   
   // @brief : 요청한 아이템 아이디로 서버에서 해당 item과 folder_name을 select
   var sql = `SELECT i.folder_id, f.folder_name, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id  LEFT OUTER JOIN (SELECT DISTINCT folder_id, folder_name FROM folders) f ON i.folder_id = f.folder_id WHERE i.item_id = ?;`;
	// 아래코드가 원래코드
   // var sql = "SELECT i.folder_id, i.item_image, i.item_name, i.item_price, i.item_url, i.item_memo, CAST(i.create_at AS CHAR(10)) create_at, n.item_notification_type, CAST(n.item_notification_date AS CHAR(16)) item_notification_date FROM items i LEFT OUTER JOIN notification n ON i.item_id = n.item_id WHERE i.item_id = ?";
    console.log("sql : " + sql);
    db.get().query(sql, [item_id], function (err, rows) {
          if (err) {
               console.log(err);
               res.sendStatus(400);
             } else {
               if (rows.length > 0) { //@brief : 가져온 아이템 정보가 존재한다면
                 console.log("rows : " + JSON.stringify(rows));
                 res.status(200).json(rows[0]);
               } else {
                 console.log("Failed to select item data.");
                 res.status(500).json({
                    success: false,
                    message: "wish boarad 서버 에러",
                 });
               }
             }
         db.releaseConn(); //@brief : err가 떠도 conn은 반드시 release() 해주어야한다.
    });
});


//item/detail/:item_id
router.put('/detail/:item_id', function(req, res){
  var item_id = Number(req.params.item_id);
  var folder_id = Number(req.body.folder_id); // @todo : 폴더 연동 시 사용
  var item_name = req.body.item_name;
  var item_image = req.body.item_image;
  var item_price = req.body.item_price;
  var item_url = req.body.item_url;
  var item_memo = req.body.item_memo;

  console.log("item_id : " + item_id)

  var sql = "UPDATE items SET folder_id = ?, item_name = ?, item_image = ?, item_price = ?, item_url = ?, item_memo = ? WHERE item_id = ?";
  var params = [folder_id, item_name, item_image, item_price, item_url, item_memo, item_id];
  console.log("sql_update : " + sql);

  db.get().query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to updated the items for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully updated data into the items!!");
        res.status(200).json({
          success: true,
          message: "아이템 수정 성공",
        });
      }
    }
    db.releaseConn();
  });
});


//item/detail/:item_id
router.delete('/detail/:item_id', function(req, res){
  var item_id = Number(req.params.item_id);
  console.log("item_id : " + item_id)

  var sql = "DELETE FROM items WHERE item_id = ?";

  console.log("sql_delete : " + sql);

  db.get().query(sql, [item_id], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        console.log("Failed to deleted the items for data.");
        res.status(500).json({
          success: false,
          message: "wish boarad 서버 에러",
        });
      } else {
        console.log("Successfully deleted data into the items!!");
        res.status(200).json({
          success: true,
          message: "아이템 삭제 성공",
        });
      }
    }
    db.releaseConn();
  });
});

module.exports = router;
