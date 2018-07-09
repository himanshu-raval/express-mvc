'use strict';

var express = require('express')
  , router = express.Router()

const mongoose = require('mongoose');
const User = mongoose.model('User');

// Load Controllers  
var mycont = require('../controllers/mycontroller');
  
 
router.get('/test-controller', async function(req, res) {
  mycont.test(req, res);
})

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
  res.send('Audi Q7, BMW X5, Mercedes GL')
})

module.exports = router