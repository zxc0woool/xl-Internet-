
'use strict';
var errors = require('./components/errors');
/**
 * 
 */
module.exports = function (app) {

    //用户
    app.use('/api/user', require('./api/user'));

    //登入
    app.use('/api/login', require('./api/login'));

    

    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    console.log(' app   -----------');


};
