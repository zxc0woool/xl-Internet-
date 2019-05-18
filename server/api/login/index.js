"user strict";
const express=require("express");
const router=express.Router();
const LoginCtrl = require('./login.controller.js');


router.get('/doLogin', LoginCtrl.doLogin);
router.post('/doLogin', LoginCtrl.doLogin);

module.exports = router;
