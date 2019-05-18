
"user strict";
const express=require("express");
const router=express.Router();
const Lndex = require('./index.controller.js');

console.log(Lndex);
router.get('/getUser', Lndex.getUser);


module.exports = router;
