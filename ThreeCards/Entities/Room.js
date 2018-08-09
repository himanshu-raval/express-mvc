class Room {
  constructor(id, name, smallBlind, minPlayers, maxPlayers, minBuyIn, maxBuyIn, type, isLimitGame, status, dealer, players, waitingPlayers, gameWinners, gameLosers, turnBet, game, currentPlayer,rackPercent,expireTime,owner,tableNumber, isFull, club, bootAmount) {
    // constructor(id, name, smallBlind, bigBlind, minPlayers, maxPlayers, minBuyIn, maxBuyIn, type, isLimitGame, status, dealer, players, gameWinners, gameLosers, turnBet, game, currentPlayer,rackPercent,rackAmount,expireTime,owner,tableNumber, isFull, club, bootAmount) {
    var room = this;
    this.id = id;
    this.name = name;
    this.smallBlind = smallBlind;
    // this.bigBlind = bigBlind;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.minBuyIn = minBuyIn;
    this.maxBuyIn = maxBuyIn;
    this.type = type;
    this.isLimitGame = isLimitGame;
    this.status = (status) ? status : 'Waiting';
    this.club = club;
    this.bootAmount = bootAmount;

    //Track the dealer position between games
    this.dealer = dealer;
    if (dealer) {
      //this.dealer = dealer;
    }
    this.players = players;
    if (players && Array.isArray(players)) {
      // console.log(players); return false;
      // players.forEach(function (player) {
      //   player.room = room
      //   room.players.push(load('Games/Teenpatti/Entities/Player', player))
      // })
    }

    this.waitingPlayers = [];
    if (waitingPlayers && Array.isArray(waitingPlayers)) {
      // console.log(players); return false;
      // waitingPlayers.forEach(function (player) {
      //   player.room = room
      //   room.waitingPlayers.push(load('Games/Teenpatti/Entities/Player', player))
      // })
    }

    this.gameWinners = [];
    if (gameWinners) {
      room.gameWinners = gameWinners
    }

    this.gameLosers = [];
    if (gameLosers) {
      // console.log('gameLosers.forEach', gameLosers);
      // gameLosers.forEach(function (player) {
      //   player.room = room
      //   room.gameLosers.push(load('Games/Teenpatti/Entities/Player', player))
      // })
    }
    this.turnBet = turnBet;
    if (turnBet) {
     // room.turnBet = turnBet
    }
    // other variables
    this.game = null
    if (game) {
      //this.game = load('Games/Teenpatti/Entities/Game', game)
    }
    this.currentPlayer = currentPlayer
    this.rackPercent = rackPercent
    // this.rackAmount = rackAmount
    this.expireTime = expireTime
    this.owner = owner
    this.tableNumber = tableNumber

    this.isFull = isFull

    //Validate acceproom value ranges.
    // var err;
    // if (minPlayers < 2) { //require at least two players to start a game.
    //   err = new Error(101, 'Parameter [minPlayers] must be a postive integer of a minimum value of 2.');
    // } else if (maxPlayers > 10) { //hard limit of 10 players at a room.
    //   err = new Error(102, 'Parameter [maxPlayers] must be a positive integer less than or equal to 10.');
    // } else if (minPlayers > maxPlayers) { //Without this we can never start a game!
    //   err = new Error(103, 'Parameter [minPlayers] must be less than or equal to [maxPlayers].');
    // }

    // if (err) {
    //   return err;
    // }
  }

  static createObject(room) {
    // console.log(room); return false;
    return new Room(
      room.id,
      room.name,
      room.smallBlind,
      // room.bigBlind,
      room.minPlayers,
      room.maxPlayers,
      room.minBuyIn,
      room.maxBuyIn,
      room.type,
      room.isLimitGame,
      room.status,
      room.dealer,
      room.players,
      room.waitingPlayers,
      room.gameWinners,
      room.gameLosers,
      room.turnBet,
      room.game,
      room.currentPlayer,
      room.rackPercent,
      // room.rackAmount,
      room.expireTime,
      room.owner,
      room.tableNumber,
      room.isFull,
      room.club,
      room.bootAmount
    );
  }

  /*
   * Helper Methods Public
   */
  toJson() {
    var room = {
      id: this.id,
      name: this.name,
      smallBlind: this.smallBlind,
      // bigBlind: this.bigBlind,
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
      minBuyIn: this.minBuyIn,
      maxBuyIn: this.maxBuyIn,
      type: this.type,
      isLimitGame: this.isLimitGame,
      status: this.status,
      dealer: this.dealer,
      turnBet: this.turnBet,
      players: [],
      waitingPlayers: [],
      gameWinners: this.gameWinners,
      gameLosers: [],
      game: null,
      currentPlayer: this.currentPlayer,
      rackPercent: this.rackPercent,
      // rackAmount : this.rackAmount,
      expireTime : this.expireTime,
      owner : this.owner,
      tableNumber:this.tableNumber,
      club: this.club,
      bootAmount: this.bootAmount
    }
    if (this.players.length > 0) {
      this.players.forEach(function (player) {
        room.players.push(player.toJson())
      })
    }

    if (this.waitingPlayers.length > 0) {
      this.waitingPlayers.forEach(function (player) {
        room.waitingPlayers.push(player.toJson())
      })
    }
    if (this.gameLosers.length > 0) {
      this.gameLosers.forEach(function (player) {
        room.gameLosers.push(player.toJson())
      })
    }
    // other field
    if (this.game) {
      room.game = this.game.toJson()
    }
    return room
  }
  // newRound helper
  getHandForPlayerName(playerName) {
    for (var i in this.players) {
      if (this.players[i].playerName === playerName) {
        return this.players[i].cards;
      }
    }
    return [];
  };
  getDeal() {
    return this.game.board;
  };
  getDealer() {
    return this.players[this.dealer];
  };
  getSmallBliendPlayer() {
    var smallBlind = this.dealer + 1;
    if (smallBlind >= this.players.length) {
      smallBlind = 0;
    }
    return this.players[smallBlind];
  };
  getBigBliendPlayer() {
    var bigBlind = this.dealer + 2;
    if (bigBlind >= this.players.length) {
      bigBlind -= this.players.length;
    }
    return this.players[bigBlind];
  };
  playingPlayers(){
    let players = 0
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].status == 'Playing') {
        players++
      }
    }
    return players;
  }
  playingPlayersNotFold(){
    let players = 0
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].status == 'Playing' && this.players[i].folded == false && this.players[i].allIn == false) {
        players++
      }
    }
    return players;
  }
  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  };
  getPlayerById(id) {
    let player = null
    for (let i = 0; i < this.players.length; i++) {
      if (id == this.players[i].id) {
        player = this.players[i]
        break
      }
    }
    return player;
  };

  getWaitingPlayerById(id) {
    let player = null
    for (let i = 0; i < this.waitingPlayers.length; i++) {
      if (id == this.waitingPlayers[i].id) {
        player = this.waitingPlayers[i]
        break
      }
    }
    return player;
  };

  getPlayerBySocketId(id) {
    let player = null
    for (let i = 0; i < this.players.length; i++) {
      if (id == this.players[i].socketId) {
        player = this.players[i]
        break;
      }
    }
    return player;
  };

  getPreviousPlayerAction() {
    return this.turnBet;
  };
  getAllPlayerChips(){
    let players = []
    for (let i = 0; i < this.players.length; i++) {
      if(this.players[i].status != 'Left'){
        players.push({
          id: this.players[i].id,
          chips: this.players[i].chips
        })
      }
    }
    return players
  }
  // Player actions: Check(), Fold(), Bet(bet), Call(), AllIn()
  show(id, amt, hasRaised) {
    var currentPlayer = this.currentPlayer;
    if (id === this.players[currentPlayer].id) {
      this.players[currentPlayer].Show(amt, hasRaised);
      return true;
    } else {
      Logger.info("wrong user has made a move");
      return false;
    }
  };
  fold(id, oldbet, hasRaised) {
    var currentPlayer = this.currentPlayer;
    if (id === this.players[currentPlayer].id) {
      this.players[currentPlayer].Fold(oldbet, hasRaised);
      return true;
    } else {
      Logger.info("wrong user has made a move");
      return false;
    }
  };

  bet(id, amt, hasRaised) {
    var currentPlayer = this.currentPlayer;
    if (id === this.players[currentPlayer].id) {
      this.players[currentPlayer].Bet(amt, hasRaised);
      return true;
    } else {
      Logger.info("wrong user has made a move");
      return false;
    }
  };

  sideshow(id, amt, hasRaised) {
    var currentPlayer = this.currentPlayer;
    if (id === this.players[currentPlayer].id) {
      this.players[currentPlayer].Sideshow(amt, hasRaised);
      return true;
    } else {
      Logger.info("wrong user has made a move");
      return false;
    }
  };

  getWinners() {
    return this.gameWinners;
  };
  getLosers() {
    return this.gameLosers;
  };
  getAllHands() {
    var all = this.losers.concat(this.players);
    var allHands = [];
    for (var i in all) {
      allHands.push({
        playerName: all[i].playerName,
        chips: all[i].chips,
        hand: all[i].cards,
      });
    }
    return allHands;
  };

  initNewRound() {
    //  console.log('initNewRound function called');
    var room = this
    // console.log(room); return false;
    var i;
    room.dealer += 1;
    if (room.dealer >= room.players.length) {
      room.dealer = 0;
    }
    room.game.status = 'Running';
    room.game.pot = 0;
    room.game.roundName = 1; //Start the first round
    room.game.betName = 'bet'; //bet,raise,re-raise,cap
    // console.log('room.game.bets.length', room.game.bets); return false;
    room.game.bets.splice(0, room.game.bets.length);
    room.game.deck.splice(0, room.game.deck.length);
    room.game.board.splice(0, room.game.board.length);
    room.game.history.splice(0, room.game.history.length);
    // console.log('room.game.bets.length splie function'); return false;
    let roomPlayerCount = 0;
    for (i = 0; i < room.players.length; i += 1) {
      // console.log('in Loop');
      room.players[i].folded = false;
      room.players[i].talked = false;
      room.players[i].allIn = false;
      room.players[i].blind = true;
      room.players[i].sideshowRequested = false;
      room.players[i].cards.splice(0, room.players[i].cards.length);
      if (room.players[i].status == 'Playing') {
           roomPlayerCount ++;
      }
    }
    // console.log(room.game.deck); return false;
    load('Games/Teenpatti/Entities/Deck').fillDeck(room.game.deck);
    // console.log('Deck done'); return false;
   // setTimeout( function(){
          room.NewRound();
   // },3000);
    // console.log('initNewRound function called end here');
  };
  async StartGame() {
    console.log('start game function called');
    var room = this;
   // console.log('starting game with room',room); //return false;
    for (let i = room.players.length - 1; i >= 0; i--) {
      if (!load('Iniv/Ws').channel('/').io.sockets.connected[room.players[i].socketId] && (room.players[i].socketId != 'NoSocketID' && room.players[i].socketId != 'NoSocketID') ) {
        //console.log('Player Socket Left :', room.players[i].playerName);
        room.players[i].status = 'Left';
        let query = { roomId: room.id, playerId: room.players[i].id }
        load('Games/Teenpatti/Controllers/Logical/RoomController').leaveRoom({}, query)
        load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerLeft',{ 'playerId': room.players[i].id });

      }
    }

    
    //If there is no current game and we have enough players, start a new game.
    let playersLength = 0
    let botCount = 0;
    this.waitingPlayers.forEach(function (player) {
     // console.log("Waiting Player.status  :",player.status ); 
     // console.log("Waiting Player.Name  :",player.playerName ); 
      if (player.status != 'Left') {
        playersLength += 1;
      }
    })
    this.players.forEach(function (player) {
     // console.log("player.status  :",player.status ); 
     // console.log("Player.Name  :",player.playerName ); 
      if (player.status != 'Left') {
          playersLength += 1;
          if(player.bot){
            botCount += 1;
          }
      }
    })

     //console.log("playersLength :",playersLength); 
     //console.log("botCount :",botCount); 
     // console.log("Room Game :",room.game); 


    if(playersLength == 2 && botCount == 2){
       
      for(let i = room.players.length-1; i>=0;i--){
        if (room.players[i].bot) {
          await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerLeft', { 'playerId': room.players[i].id });
            room.players.splice(i,1);
            playersLength -= 1;
        }
      }
      for(let i = room.waitingPlayers.length-1; i>=0;i--){
        if (room.waitingPlayers[i].bot) {
          await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerLeft', { 'playerId': room.waitingPlayers[i].id });
            room.waitingPlayers.splice(i,1);
            playersLength -= 1;
        }
      }
      await load('Games/Teenpatti/Services/RoomService').update(room); /// Save room
    }


    //console.log("playersLength New :",playersLength);

    if (!room.game && playersLength >= this.minPlayers) {
      var game = {
        roomId: room.id, smallBlind: room.smallBlind, status: 'Running'
        // roomId: room.id, smallBlind: room.smallBlind, bigBlind: room.bigBlind, status: 'Running'
      }
      // if (room.waitingPlayers.length > 0) {
      let gamePlayers = []
      // gamePlayers.push(room.players)
      // gamePlayers.push(room.waitingPlayers)
    //  console.log('before game players');
      // gamePlayers = room.waitingPlayers
      if (room.waitingPlayers.length > 0) {
        for (var i = 0; i < room.waitingPlayers.length; i++) {
          if (room.waitingPlayers[i].status != 'Left') {
            room.waitingPlayers[i].chips = parseInt(room.waitingPlayers[i].chips) + parseInt(room.waitingPlayers[i].buyInAmount);
            room.waitingPlayers[i].buyInAmount = 0;
            gamePlayers.push(room.waitingPlayers[i]);
          }
        }
        // gamePlayers = room.players
      }
      if (room.players.length > 0) {
        for (var i = 0; i < room.players.length; i++) {
          room.players[i].chips = parseInt(room.players[i].chips) + parseInt(room.players[i].buyInAmount);
          room.players[i].buyInAmount = 0;
          gamePlayers.push(room.players[i]);
        }
        // gamePlayers = room.players
      }
    //  console.log('after game players');

        room.players = gamePlayers ;
        room.waitingPlayers = [];
        console.log('1');
      // }
      // console.log('gameCreate',game); //return false;
      let gameCreate = await load('Games/Teenpatti/Services/GameService').create(game);
        if (!gameCreate) {
          Logger.error(err)
          room.StartGame();
        }
       // console.log('added new game', gameCreate);
        room.game = gameCreate;
        // console.log('gameCreate',gameCreate); //return false;
        console.log('game Created ');
        let playersLength = 0;
        room.players.forEach(function (player) {
          player.defaultActionCount = 0;
          if (player.status != 'Left') {
            playersLength += 1;
          }
        })
        console.log('2');
        if (playersLength >= room.minPlayers) {
          for (var i in room.players) {
            if (room.players[i].status == 'Waiting') {
                room.players[i].status = 'Playing';
            }
          }
          // console.log('3');
          room.game.status = 'Running';
          room.status = 'Running';
          // depriciated
          // console.log('start game function called end here pre');
          let game = load('Games/Teenpatti/Controllers/Logical/RoomController').newGameStarted(room);
          // Event.fire("TeenpattiGameStarted", room);
          // console.log('start game function called end here');
          room.initNewRound();
        }
    }

  };

 async AddPlayer(channel, id, socketId, playerName, profilePicId, chips, seatIndex,bot) {

    var room = this
    // if (chips >= minBet) {
      var player = {
        id: id,
        socketId: socketId,
        playerName: playerName,
        profilePicId: profilePicId,
        // fb_avatar: fb_avatar,
        status: 'Waiting',
        chips: chips,
        room: this,
        seatIndex: seatIndex,
        blind: true,
        bot : bot
        // autoBuyin: autoBuyin
      }
      let playersLength = 0;
      var player = load('Games/Teenpatti/Entities/Player', player);
      // console.log(player);
      this.waitingPlayers.push(player);
      // this.players.push(player);

    // }
    this.players.forEach(function (player) {
      if (player.status != 'Left') {
        playersLength += 1;
      }
    })
    this.waitingPlayers.forEach(function (player) {
      if (player.status != 'Left') {
        playersLength += 1;
      }
    })


    // console.log(room);
    // let updateRoom = await load('Games/Teenpatti/Services/RoomService').update(room)
    // room.players =
   // Logger.info('Waiting player count', playersLength)
   // Logger.info('room Status', this.status)

    if (this.status != 'Running' && playersLength >= this.minPlayers) {

      // console.log('staer Game');
      if (!this.game && room.status != 'Running') {
       // Logger.info('Game object not present')
        this.status = 'Running';
       // console.log('Starting game in 1 sec');
        load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(function () {
          room.StartGame();
        }, load('Iniv/Config').get('teenpatti.waitBeforeGameStart',1000));
      }else{
        if(this.status == 'Finished' && playersLength >= this.minPlayers && this.game){
          this.status = 'Running';
          this.game = null;
         // console.log('Starting game in 1 sec');
          load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(function () {
            room.StartGame();
          }, load('Iniv/Config').get('teenpatti.waitBeforeGameStart',1000));
        } 
      }

    }else{
     // Logger.info('Add Player Room Status is', this.status)
     // Logger.info('Add Player Game :', this.game)
      if(this.status == 'Running' && playersLength >= this.minPlayers && this.game == null){
        
        this.status = 'Finished';
       // console.log('Starting game in 1 sec');
        load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(function () {
          room.StartGame();
        }, load('Iniv/Config').get('teenpatti.waitBeforeGameStart',1000));

      }else{

        if(this.status == 'Running' && playersLength >= this.minPlayers && this.game != null){
          console.log('Game Not runing but all data present');
         // console.log("load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] --->",load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id])

         // && load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id]._called == true

          if(load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] == undefined ){
            
            load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(function () {
              room.status = 'Finished';
              room.game = null;
              room.StartGame();
            }, load('Iniv/Config').get('teenpatti.waitBeforeGameStart',1000));
          }else{
            if(load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] && load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id]._called == true){
              load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(function () {
                room.status = 'Finished';
                room.game = null;
                room.StartGame();
              }, load('Iniv/Config').get('teenpatti.waitBeforeGameStart',1000));
            }
          }
        }
      } 

      // When Players Lenght is 1
      if(playersLength == 1 && room.owner != 'club' && 1 != 1){
        console.log("Playesr Length is 1 So We Use BOT");
       // load('Games/Teenpatti/Controllers/Logical/RoomController').timers[room.id] = setTimeout(async function (room) {

          // playersLength = 0;
          // room.players.forEach(function (player) {
          //   if (player.status != 'Left') {
          //     playersLength += 1;
          //   }
          // })
          // room.waitingPlayers.forEach(function (player) {
          //   if (player.status != 'Left') {
          //     playersLength += 1;
          //   }
          // })

         // if(playersLength == 1 && room.owner != 'club'){

            var PlayerName = ['Herry','Krey','Jay','Rover','Smith','Jems','Bril','Ronaldo'];
            var name1 = Math.floor(Math.random() * 7) + 0;
            var NamePlr1 = PlayerName[name1];
            var index = PlayerName.indexOf(NamePlr1);
            if (index > -1) {
              PlayerName.splice(index, 1);
            }
            var name2 = Math.floor(Math.random() * 6) + 0;
            var NamePlr2 = PlayerName[name2];
            // Player Sit
            var array = [0,1,2,3,4,5,6];
            index = array.indexOf(seatIndex);
            if (index > -1) {
              array.splice(index, 1);
            }
            let plr1seatIndex = array[Math.floor(Math.random()*array.length)];
            index = array.indexOf(plr1seatIndex);
            if (index > -1) {
              array.splice(index, 1);
            }

            var chips1 = Math.floor(Math.random()*(6000-2000+1)+2000);
            var chips2 = Math.floor(Math.random()*(6000-2000+1)+2000);

            let plr2seatIndex = array[Math.floor(Math.random()*array.length)];
    
            var player1 = {
              id: load('Iniv/Config').get('teenpatti.bot1Id'),
              socketId: 'NoSocketID',
              playerName: NamePlr1,
              profilePicId: '5',
              // fb_avatar: fb_avatar,
              status: 'Waiting',
              chips: chips1,
              room: this,
              seatIndex: plr1seatIndex,
              blind: true,
              bot : true
            }
            var player2 = {
              id: load('Iniv/Config').get('teenpatti.bot2Id'),
              socketId: 'NoSocketID',
              playerName: NamePlr2,
              profilePicId: '5',
              // fb_avatar: fb_avatar,
              status: 'Waiting',
              chips: chips2,
              room: this,
              seatIndex: plr2seatIndex,
              blind: true,
              bot : true
            }
            var playerObj1 = load('Games/Teenpatti/Entities/Player', player1);
            // console.log(player);
            room.waitingPlayers.push(playerObj1);
            
            await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerInfo', playerObj1.toJson());

            let plr2 = await room.AddPlayer(channel, load('Iniv/Config').get('teenpatti.bot2Id'), 'NoSocketID', NamePlr2, '3', chips2, plr2seatIndex,true);
            var playerObj2 = load('Games/Teenpatti/Entities/Player', player2);
            await load('Iniv/Ws').channel('/').inRoom(room.id).emit('PlayerInfo', playerObj2.toJson());

        //}



      // },3000,room);
      }
   
    }
    return room;
  };
  removePlayer(id) {
    for (var i in this.players) {
      if (this.players[i].id === id) {
        this.players[i].status = 'Left';
       let bet = this.getPreviousPlayerAction().betAmount;
        console.log("Player Left Then Set Bet Amount",bet);
        if(bet == undefined) {
          console.log("Set Default Bet");
          bet = 100;
        }
        this.players[i].Fold(bet,false);
      }
    }
  }

  removeWaitingPlayer(id) {
    let player = null
    for (var i in this.waitingPlayers) {
      if (this.waitingPlayers[i].id == id) {
        player = this.waitingPlayers.splice(i,1)
        break
      }
    }
  }

  async NewRound() {
    // console.log('newRound');
    var room = this
    // Add players in waiting list
    // update remove player
    for(let i = room.players.length-1; i>=0;i--){
      if (room.players[i].status == 'Left') {
        room.players.splice(i,1)
      }
    }
    room.gameWinners = [];
    room.gameLosers = [];

    room.players.sort(function (a, b) {
      return a.seatIndex - b.seatIndex
    })


    let playerChips = [];

    //Deal 3 cards to each player
    for (i = 0; i < room.players.length; i += 1) {
      if(room.players[i].status == 'Playing'){
        room.players[i].cards.push(room.game.deck.pop());
        room.players[i].cards.push(room.game.deck.pop());
        room.players[i].cards.push(room.game.deck.pop());
        room.game.bets[i] = 100;
        room.game.roundBets[i] = 100; 
        room.players[i].chips -= 100;
        room.game.pot += 100;

        // Set Default Value.
        room.players[i].blind = true;
        room.players[i].folded = false;
        room.players[i].allIn = false;
        room.players[i].talked = false;
        room.players[i].sideshowRequested = false;

        playerChips.push({
          id : room.players[i].id,
          chips : room.players[i].chips
        })

        
        // Player Transection History.

        let ChipsDiamondHistory = {
          player: room.players[i].id,
          type: 'debit',
          flag: 'Player Game Start Bet',
          gameId: room.game.id,
          direction : '',
          amount : 100,
          currency : room.type,
          status: 'success'
        };
        await load('App/Models/ChipsDiamondHistory').create(ChipsDiamondHistory);
      }
    }


    // Send Player Chips Brodcast  
     // console.log("updatedPlayerChips : ",playerChips)
    load('Iniv/Ws').channel('/').inRoom(room.id).emit('updatedPlayerChips', { PlayerChip: playerChips })


    // get currentPlayer
    console.log("room.dealer :",room.dealer);
    room.currentPlayer = room.dealer + 1;
    for (var i = room.currentPlayer; i < room.players.length; i++) {
      if (room.getCurrentPlayer().folded == false) {
          room.currentPlayer = i;
          break;
      }
    }
    if (room.currentPlayer >= room.playingPlayers()) {
      room.currentPlayer = 0;
    }
    for (var i = room.currentPlayer; i < room.players.length; i++) {
      if (room.getCurrentPlayer().folded == false) {
        room.currentPlayer = i;
        break;
      }
    }

    let activPlayerCount = 0;

    for (i = 0; i < room.players.length; i += 1) {
      if (room.players[i].status == 'Playing') {
        activPlayerCount ++;
      }
    }


    if (room.currentPlayer >= activPlayerCount) {
      room.currentPlayer -= activPlayerCount;
    }
    if (room.currentPlayer >= activPlayerCount) {
      room.currentPlayer -= activPlayerCount;
    }

    room.turnBet = {}
    room.status = 'Running';


    // set Bot Player Card Rank & Action Count
    for (i = 0; i < room.players.length; i += 1) {
      if(room.players[i].status == 'Playing' && room.players[i].bot){

        let botPalyerRank = await load('Games/Teenpatti/Controllers/Logical/GameProcess').myRank(room.players[i]);
        let ActionCount = 0;
        if(parseInt(botPalyerRank.rank) == 1){ ActionCount = -1 };
        if(parseInt(botPalyerRank.rank) == 2){ ActionCount = Math.floor(Math.random()*(20-7+1)+7) };
        if(parseInt(botPalyerRank.rank) == 3){ ActionCount = Math.floor(Math.random()*(18-6+1)+6) };
        if(parseInt(botPalyerRank.rank) == 4){ ActionCount = Math.floor(Math.random()*(15-5+1)+5) };
        if(parseInt(botPalyerRank.rank) == 5){ ActionCount = Math.floor(Math.random()*(10-4+1)+4) };
        if(parseInt(botPalyerRank.rank) == 6){ ActionCount = Math.floor(Math.random()*(6-3+1)+3) };

        room.players[i].BotAction = {
          'winningType' : botPalyerRank.winningType,
          'cardsRank' : botPalyerRank.rank,
          'ActionCount' : ActionCount,
        };

      }
    }





    let game = load('Games/Teenpatti/Controllers/Logical/RoomController').newRoundStarted(room);
  };
}
module.exports = Room
