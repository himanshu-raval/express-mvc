'use strict';

const mongoose = require('mongoose');

var Game = require('../../Boot/Game');


const roomModel = mongoose.model('room');
const roomEntities = require('../Entities/Room');

module.exports = { 
    create: async function(data){
        console.log('Create Player Called -------:',data)
        try {

		data.status = 'Waiting'
 		let d1 = new Date();
		let d2 = new Date();
		d1.setHours(+d2.getHours()+( 1 ) );
		d1.setMinutes(new Date().getMinutes());
		data.expireTime = d1;
		data.owner = 'admin';
		data.tableNumber = 'TP1';
		data.dealer = 0;
		data.club = null;
		data.isFull = false;
		data.players = [];
		data.waitingPlayers = [];
		data.gameWinners = [];
		data.gameLosers = [];
	 	data.players = [];
		data.turnBet = '';
		data.game = null;
		data.currentPlayer = null;
		data.bootAmount = 0;

		// Test Entities

		

		//console.log(">>>>>>",room);
			//return data;

		// let cnt = await load('App/Models/Setting').count();
		// data['tableNumber'] = 'TP'+parseInt(cnt + 1);
		//let room = await load('Games/Teenpatti/Entities/Room',data);
		// let newRoom = await load('App/Models/Room').create(data).fetch();
		// let room = await load('Games/Teenpatti/Entities/Room',newRoom);
		// // console.log(room); return false;
		// self.rooms[room.id] = load('Games/Teenpatti/Entities/Room',newRoom);
		// return self.rooms[room.id];

		console.log('Save----------');
		try{
			let room = new roomEntities(null, data.name, data.smallBlind, data.minPlayers, data.maxPlayers, data.minBuyIn, data.maxBuyIn, data.type, data.isLimitGame, data.status, data.dealer, data.players, data.waitingPlayers, data.gameWinners, data.gameLosers, data.turnBet, data.game, data.currentPlayer,data.rackPercent,data.expireTime,data.owner,data.tableNumber, data.isFull, data.club, data.bootAmount);

		    let roomSave = new roomModel(room);
		    room = await roomSave.save(); // Save Room

		     Game.Rooms[room.id]  = new roomEntities(room.id, room.name, room.smallBlind, room.minPlayers, room.maxPlayers, room.minBuyIn, room.maxBuyIn, room.type, room.isLimitGame, room.status, room.dealer, room.players, room.waitingPlayers, room.gameWinners, room.gameLosers, room.turnBet, room.game, room.currentPlayer,room.rackPercent,room.expireTime,room.owner,room.tableNumber, room.isFull, room.club, room.bootAmount); // Save room in Game object

		 	return Game.Rooms[room.id]; // return Room 

		  } catch (err){
		    if (err.name === 'MongoError' && err.code === 11000) {
		    	// Special For Mongoose Error
				return new Error('Database Have Some Issue '+ err.message);    	
				//res.status(409).send(new MyError('Duplicate key', [err.message]));
		    }
		    // Other Error
		    return err;
		  }
 
  
        } catch (e) {
       
            console.log("Erro",e);
        }
	},
	
	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
			return  await roomModel.find(data);
        } catch (e) {
            console.log("Error",e);
        }
	},
	get: async function(id){
        console.log('Find By id:',id)
        try {
        	console.log('Game.Rooms[id]=',Game.Rooms[id]);
			if(Game.Rooms[id]){
				console.log("Room Available in Game Object");
				return Game.Rooms[id];
			}else{
				console.log("Room Not Available in Game Object");
				var room = await roomModel.findOne({'_id' :id});


				 Game.Rooms[room.id]  = new roomEntities(room.id, room.name, room.smallBlind, room.minPlayers, room.maxPlayers, room.minBuyIn, room.maxBuyIn, room.type, room.isLimitGame, room.status, room.dealer, room.players, room.waitingPlayers, room.gameWinners, room.gameLosers, room.turnBet, room.game, room.currentPlayer,room.rackPercent,room.expireTime,room.owner,room.tableNumber, room.isFull, room.club, room.bootAmount); // Save room in Game object

				return Game.Rooms[room.id];
			}
	 
        } catch (e) {
            console.log("Error in Get",e);
        }
	},

	
}



// class RoomService {
// 	constructor(){
// 		this.rooms = {}
// 	}
// 	async create (data){
// 		let self = this
// 		data.status = 'Waiting'
//  		let d1 = new Date();
// 		let d2 = new Date();
// 		d1.setHours(+d2.getHours()+( 1 ) );
// 		d1.setMinutes(new Date().getMinutes());
// 		data.expireTime = d1;
// 		data.owner = 'admin';
// 		data.tableNumber = 'TP1';
// 		data.dealerId = 0;
// 		data.clu = '';
// 		data.isFull = false;
// 		data.players = [];
// 		data.waitingPlayers = [];
// 		data.gameWinners = [];
// 		data.gameLosers = [];
// 		// let cnt = await load('App/Models/Setting').count();
// 		// data['tableNumber'] = 'TP'+parseInt(cnt + 1);
// 		//let room = await load('Games/Teenpatti/Entities/Room',data);
// 		let newRoom = await load('App/Models/Room').create(data).fetch();
// 		let room = await load('Games/Teenpatti/Entities/Room',newRoom);
// 		// console.log(room); return false;
// 		self.rooms[room.id] = load('Games/Teenpatti/Entities/Room',newRoom);
// 		return self.rooms[room.id];
// 	}

// 	async get (id){
// 		let self = this
// 		if(self.rooms[id]){
// 			return self.rooms[id];
// 		}else{
// 			var room = await load('App/Models/Room').findOne({ id });
// 			self.rooms[room.id] = await load('Games/Teenpatti/Entities/Room',room);
// 			return self.rooms[room.id]
// 		}
// 	}

// 	async search (query){
// 		// Room.find(query)
// 		// .populate('game')
// 		// .exec(function (err, rooms) {
// 		// 	if(err) { return cb(err) }
// 		// 	var tempRooms = []
// 		// 	if(rooms.length > 0){
// 		// 		rooms.forEach(function(room){
// 		// 			tempRooms.push(load('Poker/Room',room))
// 		// 		})
// 		// 	}
// 		// 	return cb(null, tempRooms);
// 		// })
// 		return await load('App/Models/Room').find(query);
// 	}

// 	async update (room){
// 	let self = this
// 		let romJson = room.toJson();
// 		if(romJson.game){
// 			let game = await load('App/Models/Game').update({id: romJson.game.id}, romJson.game).fetch()
// 			romJson.game = game[0].id;
// 		}
// 		 await load('App/Models/Room').update({id: room.id}, romJson).fetch()
// 		// let records = await load('App/Models/Room').update({id: id}, {game: room.game.id}).fetch()
//     //  self.rooms[room.id] = await load('Games/Teenpatti/Entities/Room',room) // By Himanshu Raval
//    		return room;
// 	}
// }
// module.exports = RoomService
