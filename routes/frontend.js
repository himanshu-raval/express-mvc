'use strict';


var Coinpayments = require('coinpayments');
 
var options = {
	'key' : 'bdb559cadbc6e06d7dd38de5c2213e873345cb52a2237ad5c60bec7684d6bb46',
	 'secret' :'0cF5263D459A81364398e77e8b9b12005EefFB73a0d64524C7E38dEcDe713bc8'
};
let client = new Coinpayments(options); 

var express = require('express')
  , router = express.Router()

const mongoose = require('mongoose');
const User = mongoose.model('user');
const Room = mongoose.model('room');
// Load Controllers  
var mycont = require('../controllers/mycontroller');
  



router.get('/coinpayment', async function(req, res) {
  client.createTransaction({
				'currency1' : 'LTC',
				'currency2' : 'LTC',
				'amount' : 2.123
	 }, await function(err,result){
					if(err) {
							console.log(err); 
					}
					 console.log(result);
					 return res.send({result : result});
		});
});






//var server = require('../config/server');

// console.log("Rooms Show ->",Game.Rooms);

//  Game.Rooms[123] = {
//  	City : "Ahemdabad"
//  };

router.get('/', async function(req, res) {
	res.render('index.html');
});

router.get('/test-controller', async function(req, res) {
  mycont.test(req, res);
});



router.get('/test',  async function(req, res) {

	test.create({ title: 'shiv_tets' }, function (err, awesome_instance) {
	  if (err) return res.send(err);
	  // saved!
	  console.log("awesome_instance ",awesome_instance);
	  res.send('Record Saved!');

	});
})

// Car models page
router.get('/test2', async  function(req, res) {
	//       console.log("4Rooms Show ->",server.Rooms[123]);
	// server.Rooms[123] = {
 // 	City : "Test 2",
 // 	State : "Gujarat",
 // 	Mobile : 9998000756,
 // 	NAme : "Hiamnshu Raval"
 // }
  res.send('Audi Q7, BMW X5, Mercedes GL')
})

router.get('/insert_user', async  function(req, res) {
 	User.create({ name: 'Mahadev',email:'himansu@hr.com' }, function (err, awesome_instance) {
	  if (err) return res.send("Erro:"+err);
	  // saved!
	  console.log("awesome_instance ",awesome_instance);
	  res.send('Record Saved!');

	});
  
})


router.get('/insert_room', async  function(req, res) {
 	Room.create({ name: 'Shiv',user:'5b50973e0f89e1408aa3afa2' }, function (err, awesome_instance) {
	  if (err) return res.send("Erro:"+err);
	  // saved!
	  console.log("awesome_instance ",awesome_instance);
	  res.send('Record Saved!');

	});
  
})


router.get('/show', async  function(req, res) {
 	Room.findOne({ name: 'Shiv'}).populate('user').exec(function (err, room) {
    if (err) return res.send("Erro:"+err);
    console.log('The Name is %s', room.user.name);
    res.send('Found');
    // prints "The author is Ian Fleming"
  });
  
})

 
module.exports = router