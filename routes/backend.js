var express = require('express')
  , router = express.Router()

// Load Your Cutom Middlewares
var middlewares = require("../security/middlewares/mycustom");


router.get('/backend',middlewares.cutomCheck, function(req, res) {
  res.send('This is Backend')
})

module.exports = router