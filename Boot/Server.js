'use strict';

var express = require('express');
var	http = require('http');
var fs = require('fs');
var join = require('path').join;
var path      = require("path");
var mongoose = require( 'mongoose' ); 
var nunjucks = require('nunjucks');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var db = require('../config/db');
var routes = join(__dirname, '../routes');

var winston = require('winston'); // Logger
require('winston-daily-rotate-file'); // Game Logger  Daily 

var Game  = new require('../Boot/Game');



Game.App = express();

/**
 * 
 */

// parse application/x-www-form-urlencoded
Game.App.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
Game.App.use(bodyParser.json())



/**
 * Set Public Folder
 */
Game.App.use(express.static('public')); 


nunjucks.configure('views', {
    autoescape: true,
    express: Game.App
});

Game.Server = require('http').Server(Game.App);

Game.Config = new Array();
fs.readdirSync(join(__dirname, '../Config'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Game.Config[file.split('.')[0]] = require(join(join(__dirname, '../Config'), file))
}); 


/**
 * Session Express
 */

Game.App.use(session({ 
	secret: Game.Config.App.session.secret, 
	cookie: { maxAge: Game.Config.App.session.maxAge }
}));

 
// Logger Load 
const myCustomLevels = {
  levels: {
    trace: 9,
			input: 8,
			verbose: 7,
			prompt: 6,
			debug: 5,
			info: 4,
			data: 3,
			help: 2,
			warn: 1,
			error: 0
  },
  colors: {
    trace: 'magenta',
			input: 'grey',
			verbose: 'cyan',
			prompt: 'grey',
			debug: 'blue',
			info: 'green',
			data: 'grey',
			help: 'cyan',
			warn: 'yellow',
			error: 'red'
  }
};

Game.Log = winston.createLogger({
  
  format: winston.format.json(),
  levels: myCustomLevels.levels ,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    new (winston.transports.DailyRotateFile)({
	   filename: path.join(Game.Config.App.logger.logFolder, '/'+ Game.Config.App.logger.logFilePrefix +'-%DATE%.log'),  
	   datePattern: 'DD-MM-YYYY', // YYYY-MM-DD-HH
	   zippedArchive: true,
	   maxSize: '20m',
	   maxFiles: '14d'  
 	})
  ]
});


if (process.env.NODE_ENV !== 'production') {
  Game.Log.add(new winston.transports.Console({
			level: 'debug',
			timestamp: true,
			format: winston.format.combine(
				winston.format.colorize(),
             	winston.format.simple(),
             	winston.format.timestamp(),
				winston.format.printf((info) => {
				   const {
				        timestamp, level, message, ...args
				   } = info;

				      const ts = timestamp.slice(0, 19).replace('T', ' ');
				      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
				})
            ),
	}));
}



Game.Log.info('Initializing Server...');

Game.Log.info('Loading... Models');
// Load models
fs.readdirSync(join(__dirname, '../models'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(join(__dirname, '../models'), file)));

Game.Log.info('Loading... Router');
// Load Router
fs.readdirSync(routes)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
	Game.App.use('/', require(join(routes, file))); // Register Router to app.use
});

// Load Three Cards 

Game.ThreeCards = {
				Sockets : {},
				Routes : {},
				Entities : {},
				Services : {},
				Controllers : {},
				Models : {}
			};;

fs.readdirSync(path.join(__dirname, '../','./ThreeCards'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
})
.forEach(function(dir) {
	Game.Log.info('Loading... Game '+dir);
	fs
	.readdirSync(path.join(__dirname,  '../', './ThreeCards', dir))
	.filter(function(file) {
		return (file.indexOf(".") !== 0);
	})
	.forEach(function(file) {
		// if(Game.ThreeCards[dir] == undefined){
		// 	Game.ThreeCards[dir] = [];
		// }
		//console.log("Data------>",dir);
		Game.ThreeCards[dir][file.split('.')[0]] = require(path.join(__dirname,  '../', './ThreeCards', dir, file));
	}); 
//console.log(Game.ThreeCards);
// Game.ThreeCards.Controllers.testCont.test('Himanshu'); 
});







Game.Log.info('Initializing Variables');
Game.Rooms = [];

Game.Log.info('Loading... DB Connection');
// Mongodb Connection
// Build the connection string 
//console.log("Data : ",Game.Config.Database[Game.Config.Database.connectionType].mongo.host)


// Live Connection URL
//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]

//'mongodb://admin:admin1234@localhost:27017/myDB';
var dbURI = '';
if(Game.Config.Database.connectionType == 'local'){
  dbURI = 'mongodb://'+Game.Config.Database[Game.Config.Database.connectionType].mongo.host+':'+Game.Config.Database[Game.Config.Database.connectionType].mongo.port+'/'+Game.Config.Database[Game.Config.Database.connectionType].mongo.database; 

}else{
  dbURI = 'mongodb://'+Game.Config.Database[Game.Config.Database.connectionType].mongo.user+':'+Game.Config.Database[Game.Config.Database.connectionType].mongo.password+'@'+Game.Config.Database[Game.Config.Database.connectionType].mongo.host+':'+Game.Config.Database[Game.Config.Database.connectionType].mongo.port+'/'+Game.Config.Database[Game.Config.Database.connectionType].mongo.database; 

}




//console.log("url",dbURI);
//mongoose.connect(dbURI,dbOPtion); 
//console.log("url",Game.Config.Database.option);

 mongoose.connect(dbURI,Game.Config.Database.option); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', async function () {  
	Game.Log.info('Mongoose default connection open to ' + dbURI);


	Game.Io = require('socket.io')(Game.Server,{'pingTimeout' :Game.Config.Socket.pingTimeout,'pingInterval' : Game.Config.Socket.pingInterval});
	 Game.Log.info('Loading... Socket');
	 Game.Io.on('connection', function(socket) {
		Game.Log.info('Some One Connected :'+socket.id);
 
				Object.keys(Game.ThreeCards.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
					Game.ThreeCards.Sockets[key](socket)
				})
		 

		// fs.readdirSync(join(__dirname, '../game/Socket'))
	 //  	.filter(file => ~file.search(/^[^\.].*\.js$/))
	 //  	.forEach(file => require(join(join(__dirname, '../game/Socket'), file))(socket)); // Load Socket File With Socket Parameter Attach

	 });

 
	Game.Server.listen(Game.Config.Socket.port,function() {
		Game.App.use(function(req, res, next) {
			res.render('404.html');
		});
		console.log("(---------------------------------------------------------------)");
		console.log(" |                    Server Started...                        |");
		console.log(" |                  http://"+Game.Config.Database[Game.Config.Database.connectionType].mongo.host+":"+Game.Config.Socket.port+"                      |");
		console.log("(---------------------------------------------------------------)");


		//Game.Log.info('Server Start.... Port :'+Game.Config.Socket.port);
	});

}); 

// If the connection throws an error
mongoose.connection.on('error',async function (err) {  
  Game.Log.info('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  Game.Log.info('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    Game.Log.info('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 












//Game.App.use('/', require('../routes/frontend'));
//Game.App.use('/', require('../routes/backend'));







module.exports = {app: Game.App, server: Game.Server};