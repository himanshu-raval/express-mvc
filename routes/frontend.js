var express = require('express')
  , router = express.Router()

// Load Controllers  
var mycont = require('../controllers/mycontroller');
  
 
router.get('/test-controller', async function(req, res) {
  mycont.test(req, res);
})

router.get('/test',  async function(req, res) {
  res.send('Audi, BMW, Mercedes')
})

// Car models page
router.get('/test2', async  function(req, res) {
  res.send('Audi Q7, BMW X5, Mercedes GL')
})

module.exports = router