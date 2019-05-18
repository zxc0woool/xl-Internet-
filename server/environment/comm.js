const ip = process.env.IP || '127.0.0.1';
const isDev = process.env.NODE_ENV == 'development';

module.exports = {
    SERVER_IP: '127.0.0.1',
    // SERVER_PORT: process.env.PORT || 8001,
    SERVER_PORT: 8080,

    MONGODB_IP: '192.168.100.4',

    IS_DEV: isDev,
    
    SERVER_ADDRESS: '192.168.100.4:8080'
    
};