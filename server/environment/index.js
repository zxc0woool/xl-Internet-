'use strict';
const comm = require('./comm');


//process.env.IP = '192.168.2.200';
// All configurations will extend these options
// ============================================
var all = {
  //指定模式（1-->部署模式(esql->es)，2-->演示模式(config/**.json),...）
  devmode : 1,

  client: process.env.NODE_ENV==='production'?'client':'dist',
  env: process.env.NODE_ENV,


  // Server port
  port: comm.SERVER_PORT,

  // Server IP
  ip: comm.SERVER_IP,

  // ip: '192.168.2.41' || '127.0.0.1',

  // Should we populate the DB with sample data?
  seedDB: true,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'prison-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = all