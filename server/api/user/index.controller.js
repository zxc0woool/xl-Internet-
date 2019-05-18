

var models = require('../db');
let api = {
  //查询所有用户
  getUser: function (req, res) {

    console.log('getUser----->', req.query);

    var sql = 'select * from xinlaiuser ORDER BY id';
    var params = req.body;
    console.log(params);
    models.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }

      if (typeof result === 'undefined') {

        return res.json({
          state: false,
          message: '操作失败'
        });
      } else {
        return res.status(200).send(result);
      }
    })
  }
}

// // 登入用户
// router.post('/logUser', (req, res) => {
//   var sql = 'select id, userName from user WHERE userName=? AND password=?';
//   var params = req.body;
//   console.log(params);
//   models.query(sql, [params.username, params.age], function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     if (typeof result === 'undefined') {
//       res.json({
//         state: false,
//         message: '操作失败'
//       });
//     } else {
//       res.json(result);
//     }
//   })
// });

// // 增加用户接口
// router.post('/addUser', (req, res) => {
//   var sql = 'INSERT INTO user (userName,password)VALUES(?,?)'
//   var params = req.body;
//   console.log(params);
//   models.query(sql, [params.username, params.age], function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     if (typeof result === 'undefined') {
//       res.json({
//         state: false,
//         message: '操作失败'
//       });
//     } else {
//       res.json({
//         state: true,
//         message: '操作成功'
//       });
//     }
//   })
// });

// // 删除用户
// router.post('/deleteUser', (req, res) => {
//   var sql = 'DELETE FROM user WHERE userName = ?';
//   var params = req.body;
//   console.log(params);
//   models.query(sql, [params.username], function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     if (typeof result === 'undefined') {
//       res.json({
//         state: false,
//         message: '操作失败'
//       });
//     } else {
//       res.json({
//         state: true,
//         message: '操作成功'
//       });
//     }
//   })
// });

// // 修改用户密码
// router.post('/upUser', (req, res) => {
//   var sql = 'UPDATE user SET password = ? WHERE userName = ?';
//   var params = req.body;
//   console.log(params);
//   models.query(sql, [params.age, params.username], function (err, result) {
//     if (err) {
//       console.log(err);
//     }
//     if (typeof result === 'undefined') {
//       res.json({
//         state: false,
//         message: '操作失败'
//       });
//     } else {
//       res.json({
//         state: true,
//         message: '操作成功'
//       });
//     }
//   })
// });

module.exports = api;