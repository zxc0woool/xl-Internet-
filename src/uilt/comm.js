const ip = process.env.IP || '127.0.0.1';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    SERVER_IP: '192.168.2.199', //147
    // SERVER_PORT: process.env.PORT || 8001,
    SERVER_PORT: 8080,

    MONGODB_IP: ip,

    IS_SERVER_IP: false,

    IS_DEV: isDev,

    SERVER_ADDRESS: '192.168.2.116:8080'

};