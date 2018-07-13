'use strict';

var express = require('express')
  , router = express.Router()

const mongoose = require('mongoose');
const User = mongoose.model('User');

// Load Controllers  
var mycont = require('../controllers/mycontroller');
  

//var server = require('../config/server');

// console.log("Rooms Show ->",Game.Rooms);

//  Game.Rooms[123] = {
//  	City : "Ahemdabad"
//  };

router.get('/test-controller', async function(req, res) {
  mycont.test(req, res);
});

router.get('/test',  async function(req, res) {

	User.create({ title: 'shiv_tets' }, function (err, awesome_instance) {
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

module.exports = router