const { Client, Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: '192.168.10.84',
  database: 'ui001',
  port: 5432,
  idleTimeoutMillis: 1000, // 连接最大空闲时间 1s
  // connectionTimeoutMillis: 10000 // 当因为连接数太多导致timeout时，可以尝试打开这个配置参数
  // max: 20, // 最大连接数，默认为10
});

pool.connect();

module.exports = pool;