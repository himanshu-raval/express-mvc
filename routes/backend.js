var express = require('express')
  , router = express.Router()

// Load Your Cutom Middlewares
var auth = require("../security/middlewares/authenticate");
var middlewares = require("../security/middlewares/mycustom");


router.get('/', async function(req, res) {
	if(req.session.isLogin){
		res.redirect('/dashboard');
	}
	res.render('backend/login.html');
});

router.get('/dashboard', async function(req, res) {
	let data = {};
	 data.profile = 'abc.png';
	res.render('backend/dashboard.html',data);
});




router.post('/authenticate',  async function(req, res) {

		if(req.body.email == 'himanshu@hr.com' && req.body.password == "123456"){
			req.session.isLogin = true;
			req.session.myData = {
				name : 'Himanshu',
				email : req.body.email
			};
			res.redirect('/dashboard');
		}else{
			res.redirect('/');
			//res.render('backend/login.html',{error:"Invalid U & P"});
		}


	//res.render('backend/login.html');
});


router.get('/dashboard',auth.authenticateUser,  async function(req, res) {
	res.send('this is dashboard');
	//res.render('backend/login.html');
});












// router.get('/backend',middlewares.cutomCheck, function(req, res) {

	
//   res.send('This is Backend')
// })

module.exports = router