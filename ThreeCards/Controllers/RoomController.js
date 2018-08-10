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
					'smallBlind' : 100,
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

               console.log("NewRoom",newRoom.id);
 				 data.roomId = newRoom.id;
 				
			}
	
		console.log("data.roomId ",data.roomId );
        socket.join(data.roomId); // socket Join room
		data.socketId =  socket.id; // Only For Send Player Broadcast.


		// return {
		// 	status: 'success',
		// 	result: {
				 
		// 	},
		// 	message: 'Player subscribed successfully.'
		// };

 

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
 
 		socket.myData = {};
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







	joinRoom: async function(socket,data) {
		//let self = this;
		console.log('data.playerId', data.playerId);

		let player = await Game.ThreeCards.Services.PlayerService.getById(data.playerId);

	
		// console.log('playerdata', player);
		data.socketId = player.socketId;
		let room = await Game.ThreeCards.Services.RoomService.get(data.roomId);
		 
		// console.log(room); //return false;
		if (!room) {
			return {
				status: 'fail',
				result: null,
				message: "Room not found",
				statusCode: 401
			};
		}

		// Remove Player which Have Status Left

		for(let i = room.players.length-1; i>=0;i--){
			if (room.players[i].status == 'Left') {
			await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerLeft', { 'playerId': room.players[i].id });
			  room.players.splice(i,1);
			}
		}
		for(let i = room.waitingPlayers.length-1; i>=0;i--){
			if (room.waitingPlayers[i].status == 'Left') {
				await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerLeft', { 'playerId': room.waitingPlayers[i].id });
			  	room.waitingPlayers.splice(i,1);
			}
		}



		//check for user already present //
		//check if player allredy in array
		let oldPlayer = null
		let samePlayer = null
		// if (room.players && room.players.length > 0) {
		// 	for (let i = 0; i < room.players.length; i++) {
		// 		if (room.players[i].id == player.id && room.players[i].status == 'Left') {
		// 			oldPlayer = room.players[i]
		// 			break
		// 		}
		// 	}
		// }

		if (room.waitingPlayers && room.waitingPlayers.length > 0) {
			for (let i = 0; i < room.waitingPlayers.length; i++) {
				console.log("room.waitingPlayers[i].status ->",room.waitingPlayers[i].status);
				if (room.waitingPlayers[i].id == player.id && room.waitingPlayers[i].status != 'Left') {
					console.log('oldplayer');
					oldPlayer = room.waitingPlayers[i]
					break
				}
			}
		}

		if (room.players && room.players.length > 0) {
			for (let i = 0; i < room.players.length; i++) {
				console.log("room.players[i].status ->",room.players[i].status);
				// console.log('room.players[i].id',room.players[i].id);
				if (room.players[i].id == player.id && room.players[i].status != 'Left') {
					console.log('sameplayer');
					samePlayer = room.players[i]
					break
				}
			}
		}
		

		// chek seat in players array
		let seatAvailable = true
		if (room.players && room.players.length > 0) {
			for (let i = 0; i < room.players.length; i++) {
		
				if (room.players[i].seatIndex == data.seatIndex && room.players[i].status != 'Left') {
					// if (room.players[i].seatIndex == data.seatIndex && room.players[i].status != 'Left') {
					seatAvailable = false;
					// return new Error('Seat is not available.');
					break
				}
			}
		}
		
		if (room.waitingPlayers && room.waitingPlayers.length > 0) {
			for (let i = 0; i < room.waitingPlayers.length; i++) {

				if (room.waitingPlayers[i].seatIndex == data.seatIndex && room.waitingPlayers[i].status != 'Left') {
					// if (room.players[i].seatIndex == data.seatIndex && room.players[i].status != 'Left') {
					console.log('seat Not Available');
					seatAvailable = false;
					// return new Error('Seat is not available.');
					break
				}
			}
		}

		// if seat is available add player
		// console.log("seatAvailable =",seatAvailable); //return false;
		// console.log('player there', oldPlayer); //return false;
		if (seatAvailable) {
			// console.log(room); return false;
			// console.log('seat is available'); return false;
			if (samePlayer) {
				return {
					status: 'fail',
					result: null,
					message: "You are Already in this Table",
					statusCode: 401
				};
			} else {
				if (oldPlayer) {

					let userclubData = await load('App/Models/Clubrelation').findOne({playerId: data.playerId, clubId: room.club, type: 'Join Request', status: 'Approved'})

					// Save Chips/Daimond History
			
					let currency = player.chips;
					let text =  'Move '+ room.type +' From Player Clube To Table';
					if (room.type == 'diamonds' && userclubData) {
						console.log("Player Diamonds : ",parseInt(userclubData.diamonds));
						if(parseInt(userclubData.diamonds) < room.minBuyIn ){
							console.log("Low Diamonds");
							return {
								status: 'fail',
								result: null,
								message: "Please Buy Some Diamonds From Club",
								statusCode: 401
							};
						}
						currency = data.amount; //  Player Selected Chips/Diamond
						let remainDiamonds = parseInt(userclubData.diamonds) - parseInt(currency);
						// Remove Diamond from Table 
						 await load('App/Models/Clubrelation').update({id : userclubData.id },{'diamonds': remainDiamonds});


						
					}else{
						text =  'Move '+ room.type +' From Player Chips To Table';
						if(parseInt(player.chips) < room.minBuyIn ){
							console.log("Low Chips");
							return {
								status: 'fail',
								result: null,
								message: "Please Buy Some Chips",
								statusCode: 401
							};
						}
						currency = data.amount; //  Player Selected Chips/Diamond
						let remainChips = parseInt(player.chips) - parseInt(currency);
						// Remove Diamond from Table 
						 await load('App/Models/Player').update({id : player.id },{'chips': remainChips});
					}

					let ChipsDiamondHistory = {
						player: data.playerId,
						type: 'move',
						flag: text,
						gameId: '',
						direction : 'debit',
						amount : currency,
						currency : room.type,
						status: 'success'
					};
					await load('App/Models/ChipsDiamondHistory').create(ChipsDiamondHistory);

					oldPlayer.chips = currency
					oldPlayer.blind = true
					oldPlayer.socketId = data.socketId
					oldPlayer.seatIndex = data.seatIndex
					// oldPlayer.autoBuyin = data.autoBuyin
					oldPlayer.status = 'Waiting';
					console.log('oldPlayer', oldPlayer);
				

					await load('Games/Teenpatti/Services/RoomService').update(room)
					// var playerUpdate = await load('Games/Teenpatti/Services/PlayerService').update({ id: player.id },  {chips: chips});
					if (room.waitingPlayers.length > 0 || room.players.length > 0) {
						let ids = []
						room.players.forEach(function (player) {
							if (player.status != 'Left') {
								ids.push(player.id)
							}
						})

						room.waitingPlayers.forEach(function (player) {
							if (player.status != 'Left') {
								ids.push(player.id)
							}
						})

						let players = await load('Games/Teenpatti/Services/PlayerService').getByIds(ids);
						if (!players) {
							return {
								status: 'fail',
								result: null,
								message: "Players not found",
								statusCode: 401
							};
						}
						let lastPlayer = {}
						console.log('ids', ids);
						for (var i = 0; i < ids.length; i++) {
						// for (var i = 0; i < room.players.length; i++) {
							players.forEach(function (value, key) {
								if (room.players.length > 0 && room.players[i] && room.players[i].id == value.id) {
									let tempdata = room.players[i].toJson()
									// value.level = self.checkLevel(value.xp)
									tempdata.isFbProfile = value.isFbProfile;
									tempdata.fbProfileUrl = value.fbProfileUrl;
									//tempdata.player = value
									// tempdata.player.roomStatus = room.status;
									if (value.id == player.id && value.status != 'Left') {
										lastPlayer = tempdata
									} else {
										console.log("Bro 1");
										channel.socket.toMe().emit('PlayerInfo', tempdata);
										// load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerInfo', tempdata);
									}
								}
								if (room.waitingPlayers > 0 && room.waitingPlayers[i] && room.waitingPlayers[i].id == value.id) {
									let tempdata = room.waitingPlayers[i].toJson()
									// value.level = self.checkLevel(value.xp) 
									tempdata.isFbProfile = value.isFbProfile;
									tempdata.fbProfileUrl = value.fbProfileUrl;
									//tempdata.player = value
									// tempdata.player.roomStatus = room.status;
									if (value.id == player.id && value.status != 'Left') {
										lastPlayer = tempdata
									} else {
										console.log("Bro 2");
										channel.socket.toMe().emit('PlayerInfo', tempdata);
										// load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerInfo', tempdata);
									}
								}
							})
							
						}
						// console.log('lastPlayer', lastPlayer);
						console.log("Bro 3");
						load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerInfo', lastPlayer);
						// checking to start game
						let playersLength = 0
						room.waitingPlayers.forEach(function (player) {
							if (player.status != 'Left') {
								console.log('waitingPlayers');
								playersLength += 1;
							}
						})
						room.players.forEach(function (player) {
							if (player.status != 'Left') { // by Himanshu Raval
								console.log('playingplayers');
								playersLength += 1;
							}
						})
						Logger.info('Waiting player count', playersLength)
						// console.log('room.minPlayers',room.minPlayers);
						if (room.status != 'Running' && playersLength >= room.minPlayers) {
							if (!room.game) {
								Logger.info('Game object not present 2')
								if (self.timers) {
									self.timers[room.id] = setTimeout(function () {
										room.StartGame();
										// room.StartGame();
									}, load('Iniv/Config').get('teenpatti.waitBeforeGameStart', 1000))
								} else {
									self.timers = {}
									self.timers[room.id] = setTimeout(function () {
										room.StartGame();
										// room.StartGame();
									}, load('Iniv/Config').get('teenpatti.waitBeforeGameStart', 1000))
								}
							}else {
								console.log('Game object is there');
							}

						}
						// end check game start
 
						return {
							status: 'success',
							result: { roomId: room.id, turnTime: 20 },
							message: "Room Found"
						};
					}
					// });


				} else {
				 
 
					// let userclubData = await load('App/Models/Clubrelation').findOne({playerId: data.playerId, clubId: room.club, type: 'Join Request', status: 'Approved'})
					// let currency = player.chips;
					// let text =  'Move '+ room.type +' From Player Clubs To Table';
					// 	if (room.type == 'diamonds' && userclubData) {
							
					// 		console.log("Player Diamonds 1: ",parseInt(userclubData.diamonds));
					// 		if(parseInt(userclubData.diamonds) < room.minBuyIn){
					// 			console.log("Low Diamonds");
					// 			return {
					// 				status: 'fail',
					// 				result: null,
					// 				message: "Please Buy Some Diamonds From Club",
					// 				statusCode: 401
					// 			};
					// 		}

					// 		currency = data.amount;
					// 		let remainDiamonds = parseInt(userclubData.diamonds) - parseInt(currency);
					// 		// Remove Diamond from Table 
					// 		 await load('App/Models/Clubrelation').update({id : userclubData.id },{'diamonds': remainDiamonds});
							
					// 	}else{
					// 		text =  'Move '+ room.type +' From Player Chips To Table';
					// 		if(parseInt(player.chips) < room.minBuyIn ){
					// 			console.log("Low Chips");
					// 			return {
					// 				status: 'fail',
					// 				result: null,
					// 				message: "Please Buy Some Chips",
					// 				statusCode: 401
					// 			};
					// 		}
					// 		currency = data.amount; //  Player Selected Chips/Diamond
					// 		let remainChips = parseInt(player.chips) - parseInt(currency);
					// 		// Remove Diamond from Table 
					// 		 await load('App/Models/Player').update({id : player.id },{'chips': remainChips});
					// 	}
	
					// 	let ChipsDiamondHistory = {
					// 		player: data.playerId,
					// 		type: 'move',
					// 		flag: text,
					// 		gameId: '',
					// 		direction : 'debit',
					// 		amount : currency,
					// 		currency : room.type,
					// 		status: 'success'
					// 	};

					// 	await load('App/Models/ChipsDiamondHistory').create(ChipsDiamondHistory);

						// console.log('userclubData', userclubData);
						let roomChanged = await room.AddPlayer(channel,  player.id, data.socketId, player.username, player.profilePicId, /*player.chips*/ currency, data.seatIndex,false);
						// console.log('roomChanged', roomChanged);
						await load('Games/Teenpatti/Services/RoomService').update(roomChanged)
						console.log('Player added to waiting list')
						if ((roomChanged.players && roomChanged.players.length > 0)||(roomChanged.waitingPlayers && roomChanged.waitingPlayers.length > 0)) {
 

							let ids = []
							roomChanged.players.forEach(function (player) {
								if (player.status != 'Left') { // by Himanshu Raval
									ids.push(player.id)
								}
							})
							roomChanged.waitingPlayers.forEach(function (player) {
								if (player.status != 'Left') {
									ids.push(player.id)
								}
							})
							// console.log('roomChanged', roomChanged);
							let players = await load('Games/Teenpatti/Services/PlayerService').getByIds(ids);
							if (!players) {
								return {
									status: 'fail',
									result: null,
									message: "Players not found",
									statusCode: 401
								};
							}
							let lastPlayer = {}
							console.log('sending players info');

							for (var i = 0; i < ids.length; i++) {
								players.forEach(async function (value, key) {
									if (roomChanged.players.length > 0 && roomChanged.players[i] && roomChanged.players[i].id == value.id && roomChanged.players[i].status != 'Left') {
										let tempdata = roomChanged.players[i].toJson()
										tempdata.isFbProfile = value.isFbProfile;
										tempdata.fbProfileUrl = value.fbProfileUrl;
										//value.level = self.checkLevel(value.xp)
										//tempdata.player = value
										// tempdata.player.roomStatus = roomChanged.status;
										if (value.id == player.id) {
											lastPlayer = tempdata
										} else {
											console.log("Bro 2.1");
											channel.socket.toMe().emit('PlayerInfo', tempdata);
											//await load('Iniv/Ws').channel('/').inRoom(roomChanged.id).emit('PlayerInfo', tempdata);
										}
									}

									if (roomChanged.waitingPlayers.length >0 && roomChanged.waitingPlayers[i] && roomChanged.waitingPlayers[i].id == value.id && roomChanged.waitingPlayers[i].status != 'Left') {
										let tempdata = roomChanged.waitingPlayers[i].toJson()
										value.level = self.checkLevel(value.xp)
										tempdata.player = value
										// tempdata.player.roomStatus = roomChanged.status;
										if (value.id == player.id) {
											lastPlayer = tempdata
										} else {
											console.log("Bro 2.2");
											channel.socket.toMe().emit('PlayerInfo', tempdata);
											//await load('Iniv/Ws').channel('/').inRoom(roomChanged.id).emit('PlayerInfo', tempdata);
										}
									}

								})
							}
							// New Code 
							//console.log("lastPlayer :",lastPlayer);
							await load('Iniv/Ws').channel('/').inRoom(roomChanged.id).emit('PlayerInfo', lastPlayer);
						}
				
				}
			}
		} else {
			console.log("Seats is not available");
			return {
				status: 'fail',
				result: null,
				message: "Seat is Not Available",
				statusCode: 401
			};
		}
		// ~
		if (!room || room.status == 'fail') {
			return {
				status: 'fail',
				message: room.message,
				result: null,
				statusCode: 401
			};
		}

		let playingCount = 0;
		for(let i = 0; i < room.players.length;i++){
			if(room.players[i].status == 'Playing'){
				playingCount++;
			}
		}

		// Logger.info('Session in join ',request.session)
		return {
			status: 'success',
			message: "Player room joind successfuly.",
			result: {
				roomId: room.id,
				turnTime: 20,
				roomStatus : (playingCount >= 2 ) ? true : false,
				// turnTime:load('Iniv/Config').get('teenpatti')[room.type]/1000
			}
		};
	}




   
}



async function sendPlayersData(socket,data) {

    let room = await Game.ThreeCards.Services.RoomService.get(data.roomId);
    if (!room) {
        return {
            status: 'fail',
            result: null,
            message: "Room not found",
            statusCode: 401
        };
    }

    console.log("room.players.length",room.players.length)

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





