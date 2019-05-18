var mysql = require('mysql');

var models = {

    mysql: {

        host: '192.168.2.128', 
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'xinlai'

    }

}

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

module.exports = conn;
console.log('add --- db.js');