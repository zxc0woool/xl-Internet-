const path = require('path');
const express = require('express');
const app = express();
const args = process.argv.splice(2)
const models = require('./api/db');
const routes = require('./routes');
process.env.NODE_ENV = "production";
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const config = require('./environment');
//获取传递IP地址
if(args[0] === 'IP'){
  config.ip = args[1];
  if(args[2]){
    config.port = args[2];
  }
}

console.log("process.env.NODE_ENV >>>>>>>>>>>", process.env.NODE_ENV);
if(process.env.NODE_ENV === "production"){
  app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
  })
}

routes(app);

// 监听端口
// app.listen(config.port);
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
console.log('success listen at ip:'+config.ip+':'+ config.port + '......');

module.exports = app;
