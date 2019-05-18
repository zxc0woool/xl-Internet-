
let api = {

  //登入
  doLogin : function(req,res){

    console.log('doLogin----->',req.query);
  
    return res.status(200).send({success: true, data: req.query});
  }
  
};


module.exports = api; 