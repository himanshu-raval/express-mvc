var Game = require('../../Boot/Game');


module.exports = {


    subscribeChipsRoom: async function(socket,data){
        try {
            let Rooms = await Game.ThreeCards.Services.RoomService.getByData({owner:"admin"}); 
            console.log("Rooms.length :",Rooms.length);

            if (Rooms.length > 0) {
				for (var i = 0; i < Rooms.length; i++) {
					if (Rooms[i].players && (Rooms[i].players.length + Rooms[i].waitingPlayers.length) < Rooms[i].maxPlayers) {
						data.roomId = Rooms[i].id;
					}
				}
			}
			if (data && !data.roomId) {
				// Create New Room
				let roomObj = {
					'name' : 'Chips Table',
					'smallBlind' : '100',
					'minPlayers' : 2,
					'maxPlayers' : 7,
					'minBuyIn' : 1000,
					'maxBuyIn' : 10000,
					'type' : 'chips',
					'isLimitGame' : false,
					'gps' : false,
					'ip' : false,
					'rackPercent' : 1,
					'rackAmount' : 1,
					'bootAmount' : 100
                }
                let newRoom = await Game.ThreeCards.Services.RoomService.create(roomObj); 

                console.log("NewRoom",newRoom);
 				// data.roomId = newRoom.id;
 				data.roomId = 123;
			}
	

        socket.join(data.roomId); // socket Join room
		data.socketId =  socket.id; // Only For Send Player Broadcast.


		return {
			status: 'success',
			result: {
				 
			},
			message: 'Player subscribed successfully.'
		};



		let room = await sendPlayersData(socket,data);
		if (!room) {
			return {
				status: 'fail',
				result: null,
				message: "Data not found",
				statusCode: 401
			};
		}

		if(room.minBuyIn > data.chips){
			return {
				status: 'fail',
				result: null,
				message: room.minBuyIn+" Balance Require",
				statusCode: 408  // fix code for Redirect to Lobby Screen
			};
		}



		let result = {};
		if (room.game && room.game.status == 'Running') {
			result.history = room.game.history
			result.currentRound = room.game.roundName
			result.cards = room.game.board
			result.potAmount = room.game.pot
		} else {
			result.history = []
			result.currentRound = ''
			result.cards = []
			result.potAmount = 0
		}
 
		socket.myData.playerId = data.playerId
		socket.myData.roomId = data.roomId
		socket.myData.gameType = 'teenpatti'
		socket.myData.id = data.playerId
		socket.myData.socketId = socket.id
		 
		let PlayerChips = data.chips; // chips/Diamond
		let maxBuyIn = room.maxBuyIn;
		if(data.chips < room.maxBuyIn || room.maxBuyIn == 0){
			maxBuyIn =  data.chips;
		}

		 

		return {
			status: 'success',
			result: {
				gameHistory: result,
				turnTime: 20,
				roomId: data.roomId,
				minBuyIn : room.minBuyIn,
				maxBuyIn : maxBuyIn,
				type : room.owner,
				 
			},
			message: 'Player subscribed successfully.'
		};



        } catch (error) {
        	Game.Log.info('Error in subscribeChipsRoom : ' + error);
		return {
			status: 'failed',
			result: {},
			message: 'Something went Wrong'
		};


            
        }

    },

   
}



async function sendPlayersData(channel,data) {

    let room = await Game.ThreeCards.Services.RoomService.get(data.roomId);
    if (!room) {
        return {
            status: 'fail',
            result: null,
            message: "Room not found",
            statusCode: 401
        };
    }

    if ((room.players && room.players.length > 0)||(room.waitingPlayers && room.waitingPlayers.length > 0)) {
        let ids = []
        room.players.forEach(function (player) {
            ids.push(player.id)
        })
        room.waitingPlayers.forEach(function (player) {
            ids.push(player.id)
        })
        // console.log(ids[0]);
        let players = await load('Games/Teenpatti/Services/PlayerService').getByIds(ids);
        // console.log('room.players[i].status', room.players);
        players.forEach(function (player, key) {
            for (var i = 0; i < room.players.length; i++) {
                if (room.players[i].id == player.id && room.players[i].status != 'Left') {
                    console.log('match');
                    let tempdata = room.players[i].toJson();
                    tempdata.isFbProfile = player.isFbProfile;
                    tempdata.fbProfileUrl = player.fbProfileUrl;
                    //player.level = self.checkLevel(player.xp)
                    //tempdata.player = player
                    // tempdata.player.roomStatus = room.status;
                    channel.socket.toMe().emit('PlayerInfo', tempdata);
                }
            }
            for (var i = 0; i < room.waitingPlayers.length; i++) {
                if (room.waitingPlayers[i].id == player.id && room.waitingPlayers[i].status != 'Left') {
                    console.log('match');
                    let tempdata = room.waitingPlayers[i].toJson();
                    tempdata.isFbProfile = player.isFbProfile;
                    tempdata.fbProfileUrl = player.fbProfileUrl;
                    //player.level = self.checkLevel(player.xp)
                    //tempdata.player = player
                    // tempdata.player.roomStatus = room.status;

                    channel.socket.toMe().emit('PlayerInfo', tempdata);
                }
            }
        })
        return room;
    } else {
        return room;
    }
}
