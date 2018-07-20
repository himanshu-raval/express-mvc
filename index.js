'use strict';
/**
 * Module dependencies.
 */
// var server = require('./config/server');
// server.Rooms = [];
// server.Rooms[123]  = { name : "Himanshu" };

require('./Boot/Server');

var Game = require('./Boot/Game');
 
//console.log("Game Rooms ->",Game.Config.Database.local);



const express = require('express');
const	http = require('http');
const	path = require('path');
const	config = require('./config');
//const	app = express();
	//MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const fs = require('fs');
const join = require('path').join;
const db = require('./config/db');
const models = join(__dirname, 'models');

 



// var sizeof = require('object-sizeof');

// function intervalFunc() {
//   console.log("Size : ",sizeof(server.Rooms[123]));
//   console.log('My Current Value :',server.Rooms[123]);
// }

// setInterval(intervalFunc, 1500);






// Load models








/***
 * Load Middlewares [Create middlewares File in Security->Middlewares Folder And Load Here]
 * */
//var middlewares = require("./security/middlewares/frontend"); // Load middlewares File
//Game.App.use(middlewares.frontRequestCheck); // Middlewares For All Routes



/***
 * Load Routs [Create Routes File in Routes Folder And Load Here]
 * */




	// app.use(function (req, res, next) {
	// 	console.log('Time:', Date.now())
	// 	next()
	// })

	

	
//console.log("Hellow ");
	// app.locals.title = 'My App';
	// app.locals.config = require('./config')();
	// app.locals.email = 'me@myapp.com';


	//console.log("Config :",app.locals.config.port);
 //let gameserver = require('http').Server(app);

/***
 * Load Controllers [Create Controllers File in Routes Folder And Load Here]
 * */

	


// var io = require('socket.io')(gameserver);

//  gameserver.listen(app.locals.config.port,function(err){
//  	console.log('Express app started on port ' + app.locals.config.port);	


// 		io.on('connection', function (socket) {
// 			console.log("Express");
// 		 // socket.emit('news', { hello: 'world' });
// 		//  socket.on('my other event', function (data) {
// //console.log(data);
// 		 // });
// 		});


//  });
//   listen();
 

// function listen () {
//   if (app.get('env') === 'test') return;
//   app.listen(app.locals.config.port,function(err){

//   	console.log('Express app started on port ' + app.locals.config.port);	

// 		io.on('connection', function (socket) {
// 			console.log("Express");
// 		 // socket.emit('news', { hello: 'world' });
// 		//  socket.on('my other event', function (data) {
// //console.log(data);
// 		 // });
// 		});

//   });
  
// }

//   http.createServer(app).listen(app.locals.config.port, function() {
// 		  	 io.on('connection', function (socket) {
// 			console.log("Express");
// 		 // socket.emit('news', { hello: 'world' });
// 		//  socket.on('my other event', function (data) {
// //console.log(data);
// 		 // });
// 		});
// 		 });










	//let Home = require('./controllers/home');
	//console.log("Home :",Home);

	
	// Admin = require('./controllers/Admin'),
	 
	// Blog = require('./controllers/Blog'),
	// Page = require('./controllers/Page');

// all environments
// app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/templates');
//app.set('view engine', 'hjs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.cookieParser('fast-delivery-site'));
//app.use(express.session());
//app.use(app.router);
//app.use(require('less-middleware')({ src: __dirname + '/public' }));
//app.use(express.static(path.join(__dirname, 'public')));

// development only
// if ('development' == app.get('env')) {
//   	app.use(express.errorHandler());
// }

// MongoClient.connect('mongodb://' + config.basic.mongo.host + ':' + config.basic.mongo.port,{ useNewUrlParser: true }, function(err, db) {
// 	if(err) {
// 		console.log('Sorry, there is no mongo db server running.');
// 	} else {
		// var attachDB = function(req, res, next) {
		// 	req.db = db;
		// 	next();
		// };
		// app.all('/admin*', attachDB, function(req, res, next) {
		// 	Admin.run(req, res, next);
		// });			
		// app.all('/blog/:id', attachDB, function(req, res, next) {
		// 	Blog.runArticle(req, res, next);
		// });	
		// app.all('/blog', attachDB, function(req, res, next) {
		// 	Blog.run(req, res, next);
		// });	
		// app.all('/services', attachDB, function(req, res, next) {
		// 	Page.run('services', req, res, next);
		// });	
		// app.all('/careers', attachDB, function(req, res, next) {
		// 	Page.run('careers', req, res, next);
		// });	
		// app.all('/contacts', attachDB, function(req, res, next) {
		// 	Page.run('contacts', req, res, next);
		// });	
		// app.all('/', attachDB, function(req, res, next) {
		// 	Home.run(req, res, next);
		// });		

		//  http.createServer(app).listen(app.locals.config.port, function() {
		//   	console.log(
		//   		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		//   		'\nExpress server listening on port ' + config.port
		//   	);
		 // });
// 	}
// });