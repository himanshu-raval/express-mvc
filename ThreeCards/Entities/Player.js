class Player {
    constructor(id, socketId, playerName, profilePicId, fb_avatar, status, chips, room, seatIndex, folded, allIn, talked, cards, autoBuyin, defaultActionCount, blind, sideshowRequested, buyInAmount,bot,BotAction) {
        this.id = id;
        this.socketId = socketId;
        this.seatIndex = seatIndex;
        this.playerName = playerName;
        this.profilePicId = profilePicId;
        this.fb_avatar = fb_avatar;
        this.status = status;
        this.chips = chips;
        this.folded = (folded) ? folded : false;
        this.allIn = (allIn) ? allIn : false;
        this.talked = (talked) ? talked : false;
        this.room = room; //Circular reference to allow reference back to parent object.
        this.cards = (cards) ? cards : [];
        this.autoBuyin = autoBuyin | 0
        this.defaultActionCount = (defaultActionCount) ? defaultActionCount : 0
        this.blind = (blind) ? blind : true;
        this.sideshowRequested = (sideshowRequested) ? sideshowRequested : false;
        this.buyInAmount = (buyInAmount) ? buyInAmount : 0;
        this.bot = bot;
        this.BotAction = (BotAction) ? BotAction : {};
    }
    static createObject(player) {
        return new Player(
            player.id,
            player.socketId,
            player.playerName,
            player.profilePicId,
            player.fb_avatar,
            player.status,
            player.chips,
            player.room,
            player.seatIndex,
            player.folded,
            player.allIn,
            player.talked,
            player.cards,
            player.autoBuyin,
            player.defaultActionCount,
            player.blind,
            player.sideshowRequested,
            player.buyInAmount,
            player.bot,
            player.BotAction
        )
    }
    toJson() {
        var player = {
            id: this.id,
            socketId: this.socketId,
            seatIndex: this.seatIndex,
            playerName: this.playerName,
            profilePicId: this.profilePicId,
            fb_avatar: this.fb_avatar,
            status: this.status,
            chips: this.chips,
            folded: this.folded,
            allIn: this.allIn,
            talked: this.talked,
            cards: this.cards,
            autoBuyin: this.autoBuyin,
            defaultActionCount: this.defaultActionCount,
            blind: this.blind,
            sideshowRequested: this.sideshowRequested,
            buyInAmount : this.buyInAmount,
            bot : this.bot,
            BotAction : this.BotAction
        }
        return player
    }
    getChips(cash) {
        this.chips += cash;
    }
    // Player actions: Check(), Fold(), Bet(bet), Call(), AllIn()

   async Show(bet, hasRaised) {
        var i;
        if (this.chips > bet) {
            for (i = 0; i < this.room.players.length; i += 1) {
                if (this === this.room.players[i]) {
                    this.room.game.bets[i] = parseInt(this.room.game.bets[i]) + parseInt(bet);
                    this.room.game.roundBets[i] = this.room.game.bets[i]; // Update Player Round Bets
                    this.room.players[i].chips = parseInt(this.room.players[i].chips) - parseInt(bet);
                    this.room.game.pot = parseInt(this.room.game.pot) + parseInt(bet);
                    this.talked = true;

                    console.log("------------SHOW--------------------");
                    console.log("Player Chips :",this.room.players[i].chips);
                    console.log("Bet :",bet);
                    console.log("Pot :",this.room.game.pot);
                    console.log("--------------------------------");


                    let ChipsDiamondHistory = {
                        player: this.room.players[i].id,
                        type: 'debit',
                        flag: 'Player Show',
                        gameId: this.room.game.id,
                        direction : '',
                        amount : bet,
                        currency : this.room.type,
                        status: 'success'
                    };
                    await load('App/Models/ChipsDiamondHistory').create(ChipsDiamondHistory);



                   
                }
            }
            // update in chips History table and then update in player table.


            //Attemp to progress the game
            this.room.turnBet = { action: load('Iniv/Config').get('teenpatti.Bet'), playerId: this.id, betAmount: bet, hasRaised: hasRaised, isBlind: this.blind, seatIndex: this.seatIndex }

            

            this.room.game.history.push({
                "time": new Date(),
                "playerId": this.id,
                "playerName": this.playerName,
                "gameRound": this.room.game.roundName,
                "betAmount": bet,
                "totalBetAmount": this.getTotalBet(),
                "playerAction": load('Iniv/Config').get('teenpatti.Bet'),
                "hasRaised": hasRaised,
                "remaining": this.chips
            })
            this.room.game.status = 'ForceFinishedShow';
            load('Games/Teenpatti/Controllers/Logical/GameProcess').progress(this.room);
        } else {
            console.log('You don\'t have enought chips --> Allin !!!');
            load('Iniv/Ws').channel('/').inRoom(this.room.id).emit('userPacked', { userPackedPlayerId: this.id })
            this.AllIn(hasRaised);
        }
    }

    Fold(oldbet, hasRaised) {
        console.log("Player Fold :",this.playerName);
        var i, bet;
        //Move any current bet into the pot
        for (i = 0; i < this.room.players.length; i += 1) {
            if (33 === this.room.players[i]) {
                // bet = parseInt(this.room.game.bets[i], 10);
                // this.room.game.bets[i] = 0;
                // this.room.game.pot += bet;
                this.talked = true;
            }
        }
        //Mark the player as folded
        this.folded = true;
        this.room.turnBet = { action: load('Iniv/Config').get('teenpatti.Fold'), playerId: this.id, betAmount: oldbet, hasRaised: hasRaised, isBlind: this.blind, seatIndex: this.seatIndex }
        this.room.game.history.push({
            "time": new Date(),
            "playerId": this.id,
            "playerName": this.playerName,
            "gameRound": this.room.game.roundName,
            "betAmount": 0,
            "totalBetAmount": this.getTotalBet(),
            "playerAction": load('Iniv/Config').get('teenpatti.Fold'),
            "hasRaised": hasRaised,
            "remaining": this.chips
        })
        //Attemp to progress the game
        console.log('Player Folded');
        load('Games/Teenpatti/Controllers/Logical/GameProcess').progress(this.room);
    };

    async Bet(bet, hasRaised) {
        try{
        var i;
        if (this.chips > bet) {
            for (i = 0; i < this.room.players.length; i += 1) {
                if (this === this.room.players[i]) {
                    this.room.game.bets[i] = parseInt(this.room.game.bets[i]) + parseInt(bet);
                    this.room.game.roundBets[i] = this.room.game.bets[i]; // Update Player Round Bets
                    this.room.players[i].chips = parseInt(this.room.players[i].chips) - parseInt(bet);
                    this.room.game.pot = parseInt(this.room.game.pot) + parseInt(bet);
                    this.talked = true;

                    let ChipsDiamondHistory = {
                        player: this.room.players[i].id,
                        type: 'debit',
                        flag: 'Player Bet',
                        gameId: this.room.game.id,
                        direction : '',
                        amount : bet,
                        currency : this.room.type,
                        status: 'success'
                    };
                   await load('App/Models/ChipsDiamondHistory').create(ChipsDiamondHistory);
                }
            }
            // update in chips History table and then update in player table.

            //Attemp to progress the game
            this.room.turnBet = { action: load('Iniv/Config').get('teenpatti.Bet'), playerId: this.id, betAmount: bet, hasRaised: hasRaised, isBlind: this.blind, seatIndex: this.seatIndex }

            this.room.game.history.push({
                "time": new Date(),
                "playerId": this.id,
                "playerName": this.playerName,
                "gameRound": this.room.game.roundName,
                "betAmount": bet,
                "totalBetAmount": this.getTotalBet(),
                "playerAction": load('Iniv/Config').get('teenpatti.Bet'),
                "hasRaised": hasRaised,
                "remaining": this.chips
            })
            load('Games/Teenpatti/Controllers/Logical/GameProcess').progress(this.room);
        } else {
            console.log('You don\'t have enought chips --> AllIn !!! 11111');
            // load('Iniv/Ws').channel('/').inRoom(this.room.id).emit('userPacked', { userPackedPlayerId: this.id })
            this.AllIn(hasRaised);
        }
    }catch(err){
        console.log("Error bot :",err);
    }
    };
    AllIn(hasRaised) {
        var i, allInValue = 0;
        for (i = 0; i < this.room.players.length; i += 1) {
            if (this === this.room.players[i]) {
                if (this.room.players[i].chips !== 0) {
                    this.room.game.bets[i] = parseInt(this.room.game.bets[i]) + parseInt(this.room.players[i].chips);
                    this.room.game.roundBets[i] = this.room.game.bets[i]; // Update Player Round Bets
                    allInValue = this.room.players[i].chips;
                    this.room.game.pot = parseInt(this.room.game.pot) + parseInt(this.room.players[i].chips);
                    this.room.players[i].chips = 0;
                    this.allIn = true;
                    this.talked = true;
                }
            }
        }
        console.log('In All in Function');
        //Attemp to progress the game
        let bet = this.room.getPreviousPlayerAction().betAmount;
        console.log("Previus Bet Amount :",bet);
        this.room.turnBet = { action: load('Iniv/Config').get('teenpatti.AllIn',4), playerId: this.id, betAmount: bet, hasRaised: hasRaised, isBlind: this.blind, seatIndex: this.seatIndex }
        this.room.game.history.push({
            "time": new Date(),
            "playerId": this.id,
            "playerName": this.playerName,
            "gameRound": this.room.game.roundName,
            "betAmount": allInValue,
            "totalBetAmount": this.getTotalBet(),
            "playerAction": load('Iniv/Config').get('teenpatti.AllIn',4),
            "hasRaised": hasRaised,
            "remaining": this.chips
        })
        this.room.game.allInPlayers.push(this.id);
         console.log('this.room.playingPlayersNotFold() :', this.room.playingPlayersNotFold());
        if (this.room.playingPlayersNotFold() < this.room.minPlayers) {
          this.room.game.status = 'ForceFinishedShow';
        }
        load('Games/Teenpatti/Controllers/Logical/GameProcess').progress(this.room);
    };
    
    getPreviousPlayerById(id) {
        let currentPlayer = 0
        for (let i = 0; i < this.room.players.length; i++) {
            if (this.room.players[i].id == id) {
                currentPlayer = i
                break
            }
        }
        let previousPlayer = null;
        for (var i = currentPlayer - 1; i > 0; i--) {
            // array[i]
            if (this.room.players[i].status == 'Playing' && this.room.players[i].folded == false) {
                previousPlayer = this.room.players[i]
            }
        }
        if (!previousPlayer) {
            for (var i = this.room.players.length - 1; i > currentPlayer; i--) {
                // array[i]
                if (this.room.players[i].status == 'Playing' && this.room.players[i].folded == false) {
                    previousPlayer = this.room.players[i]
                }
            }
        }
        return previousPlayer
    }

    async Sideshow(bet, hasRaised) {
        console.log("Side Show Bet :",bet);
        var i;
        if (this.chips > bet) {

            // let player = this.room.getPlayerById(data.playerId);
            let players = this.room.players;
            if (this.room.players.length > 2) {
                let previousPlayer = null;

                // Get Prev Player ID.
                
                console.log("this.room.currentPlayer :",this.room.currentPlayer);

                let k = false;
                for (var i = this.room.currentPlayer - 1; i >= 0; i--) {
                    if (players[i].status == 'Playing' && players[i].folded == false && players[i].blind == false && k == false) {
                        console.log("First  : ",i)
                        previousPlayer = players[i].id;
                        k = true;
                        break;
                    }
                }
                console.log("Previous Player First : ",previousPlayer)
                let j = false;
                if (!previousPlayer) {
                    for (var i = this.room.players.length - 1; i > this.room.currentPlayer; i--) {
                        if (players[i].status == 'Playing' && players[i].folded == false && players[i].blind == false && j == false) {
                            console.log("Second  : ",i)
                            previousPlayer = players[i].id;
                            break;
                            j = true;
                        }
                    }
                }
                let currentSeat;
                console.log('previousPlayer', previousPlayer);
                if (previousPlayer) {
                    for (i = 0; i < this.room.players.length; i += 1) {
                        if (this === this.room.players[i]) {
                            //console.log("Player Match",this.room.players[i].sideshowRequested)

                            this.room.game.bets[i] += bet;
                            this.room.game.roundBets[i] = this.room.game.bets[i]; // Update Player Round Bets
                            // console.log('this.room.game.bets[i]', this.room.game.bets[i]);
                            this.room.players[i].chips -= bet;
                            this.room.game.pot += bet;
                            // this.room.game.pot = this.room.game.pot + bet;
                            this.room.players[i].talked = true;
                            this.room.players[i].sideshowRequested = true;

                            //console.log("Player Match After",this.room.players[i].sideshowRequested)

                            let transation = {
                                player: this.room.players[i].id,
                                game: this.room.game.id,
                                quantity: bet,
                                remaining: this.room.players[i].chips,
                                remark: " ",
                                type: "sideshow"
                            }
                            console.log('transation', transation);
                            
                        }
                    }
                    // update in chips History table and then update in player table.
                    //console.log("room ----------->",this.room);
                    //await load('Games/Teenpatti/Services/RoomService').update(this.room)

                    //Attemp to progress the game
                    this.room.turnBet = { action: load('Iniv/Config').get('teenpatti.SideShow'), playerId: this.id, betAmount: bet, hasRaised: hasRaised, isBlind: this.blind, seatIndex: this.seatIndex };

                    console.log("Side Show Turn Bet ",this.room.turnBet)

                    this.room.game.history.push({
                        "time": new Date(),
                        "playerId": this.id,
                        "playerName": this.playerName,
                        "gameRound": this.room.game.roundName,
                        "betAmount": bet,
                        "totalBetAmount": this.getTotalBet(),
                        "playerAction": load('Iniv/Config').get('teenpatti.Sideshow'),
                        "hasRaised": hasRaised,
                        "remaining": this.chips
                    })

                    // let playerData =  this.room.getPreviousPlayerAction().playerId;
                    let playerData = load('Games/Teenpatti/Services/PlayerService').getById(previousPlayer);
                    console.log('playerData', this.room.getPlayerById(previousPlayer).socketId);
                    load('Iniv/Ws').channel('/').to([this.room.getPlayerById(previousPlayer).socketId]).emit('SlideShowRequest', {
                        playerId: this.room.getPlayerById(previousPlayer).id,
                        senderName: this.room.getPlayerById(this.id).playerName,
                        senderId: this.id
                    });

                   // load('Games/Teenpatti/Controllers/Logical/GameProcess').progress(this.room);
                    
                    // Bot Player Accept Side Show Request
                    if(this.room.getPlayerById(previousPlayer).bot){
                        let playerId = this.id;

                        load('Games/Teenpatti/Controllers/Logical/RoomController').timers[this.room.id] = setTimeout(async function (room) {

                            let data = {
                                response: 'accept', // accept / reject
                                senderPlayerId: room.getPlayerById(previousPlayer).id,
                                playerId: playerId,
                                roomId: room.id
                            }
                           await load('Games/Teenpatti/Controllers/Logical/RoomController').slideShowResponse(null, data);

                          }, 2000,this.room);
                    }

                } else {
                    return {
                        status: 'fail',
                        message: 'No Such Player Found or the previous Player havn\'t seen the cards yet',
                        result: null,
                        statusCode: 401
                    };
                }
            } else {
                return {
                    status: 'fail',
                    message: 'Slide Show is only available with minimum 3 Players',
                    result: null,
                    statusCode: 401
                };
            }
        } else {
            console.log('You don\'t have enought chips --> Folding !!!');
            load('Iniv/Ws').channel('/').inRoom(this.room.id).emit('userPacked', { userPackedPlayerId: this.id })
            this.Fold();
        }
    };

    getTotalBet() {
        let total = 0;
        let self = this
        this.room.game.history.forEach(function (element) {
            if (element.playerId == self.id) {
                total = total + element.betAmount
            }
        });
        return total
    }

    getMaxBet(bets) {
        var maxBet, i;
        maxBet = 0;
        for (i = 0; i < bets.length; i += 1) {
            if (bets[i] > maxBet) {
                maxBet = bets[i];
            }
        }
        return maxBet;
    }
}
module.exports = Player
