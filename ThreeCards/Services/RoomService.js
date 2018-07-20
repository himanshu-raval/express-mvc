
class RoomService {
	constructor(){
		this.rooms = {}
	}
	async create (data){
		let self = this
		data.status = 'Waiting'
 		let d1 = new Date();
		let d2 = new Date();
		d1.setHours(+d2.getHours()+( 1 ) );
		d1.setMinutes(new Date().getMinutes());
		data.expireTime = d1;
		data.owner = 'admin';
		data.tableNumber = 'TP1';
		data.dealerId = 0;
		data.clu = '';
		data.isFull = false;
		data.players = [];
		data.waitingPlayers = [];
		data.gameWinners = [];
		data.gameLosers = [];
		// let cnt = await load('App/Models/Setting').count();
		// data['tableNumber'] = 'TP'+parseInt(cnt + 1);
		//let room = await load('Games/Teenpatti/Entities/Room',data);
		let newRoom = await load('App/Models/Room').create(data).fetch();
		let room = await load('Games/Teenpatti/Entities/Room',newRoom);
		// console.log(room); return false;
		self.rooms[room.id] = load('Games/Teenpatti/Entities/Room',newRoom);
		return self.rooms[room.id];
	}

	async get (id){
		let self = this
		if(self.rooms[id]){
			return self.rooms[id];
		}else{
			var room = await load('App/Models/Room').findOne({ id });
			self.rooms[room.id] = await load('Games/Teenpatti/Entities/Room',room);
			return self.rooms[room.id]
		}
	}

	async search (query){
		// Room.find(query)
		// .populate('game')
		// .exec(function (err, rooms) {
		// 	if(err) { return cb(err) }
		// 	var tempRooms = []
		// 	if(rooms.length > 0){
		// 		rooms.forEach(function(room){
		// 			tempRooms.push(load('Poker/Room',room))
		// 		})
		// 	}
		// 	return cb(null, tempRooms);
		// })
		return await load('App/Models/Room').find(query);
	}

	async update (room){
	let self = this
		let romJson = room.toJson();
		if(romJson.game){
			let game = await load('App/Models/Game').update({id: romJson.game.id}, romJson.game).fetch()
			romJson.game = game[0].id;
		}
		 await load('App/Models/Room').update({id: room.id}, romJson).fetch()
		// let records = await load('App/Models/Room').update({id: id}, {game: room.game.id}).fetch()
    //  self.rooms[room.id] = await load('Games/Teenpatti/Entities/Room',room) // By Himanshu Raval
   		return room;
	}
}
module.exports = RoomService
