'use strict';

var express = require('express');
var	http = require('http');
var fs = require('fs');
var join = require('path').join;
var path      = require("path");
var mongoose = require( 'mongoose' ); 



var db = require('../config/db');
var routes = join(__dirname, '../routes');

var winston = require('winston'); // Logger
require('winston-daily-rotate-file'); // Game Logger  Daily 

var Game  = new require('../Boot/Game');



Game.App = express();

Game.Server = require('http').Server(Game.App);




Game.Config = new Array();
fs.readdirSync(join(__dirname, '../Config'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Game.Config[file.split('.')[0]] = require(join(join(__dirname, '../Config'), file))
}); 

 
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
Game.Log.info('Loading... DB Connection');
// Mongodb Connection
// Build the connection string 
console.log("Data : ",Game.Config.Database[Game.Config.Database.connectionType].mongo.host)

// Live Connection URL
//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
//'mongodb://admin:admin1234@localhost:27017/myDB';
var dbURI = 'mongodb://'+Game.Config.Database[Game.Config.Database.connectionType].mongo.user+':'+Game.Config.Database[Game.Config.Database.connectionType].mongo.password+'@'+Game.Config.Database[Game.Config.Database.connectionType].mongo.host+':'+Game.Config.Database[Game.Config.Database.connectionType].mongo.port+'/'+Game.Config.Database[Game.Config.Database.connectionType].mongo.database; 
console.log("url",dbURI);
//mongoose.connect(dbURI,dbOPtion); 



Game.Log.info('Loading... Models');
// Load models
fs.readdirSync(join(__dirname, '../models'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(join(__dirname, '../models'), file)));

 Game.Log.info('Loading... Router');
// Load Router
fs.readdirSync(routes)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(routes, file)));



Game.Log.info('Initializing Variables');
Game.Rooms = [];



Game.App.use('/', require('../routes/frontend'))
Game.App.use('/', require('../routes/backend'))





Game.Io = require('socket.io')(Game.Server,{'pingTimeout' :Game.Config.Socket.pingTimeout,'pingInterval' : Game.Config.Socket.pingInterval});

Game.Server.listen(Game.Config.Socket.port);


module.exports = {app: Game.App, server: Game.Server};