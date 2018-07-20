class Game {
    constructor(id, roomId, smallBlind, bigBlind, status, pot, roundName, betName, bets, roundBets, deck, board, history, gameNumber, sidePotAmount, allInPlayers, allInPlayersRoundBets) {
        this.id = id;
        this.roomId = roomId;
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.status = (status) ? status : 'Waiting';
        this.pot = (pot) ? pot : 0;
        this.roundName = (roundName) ? roundName : 1;
        this.betName = (betName) | 'bet';
        this.bets = (bets) ? bets : [];
        this.roundBets = (roundBets) ? roundBets : [];
        this.deck = (deck) ? deck : [];
        this.board = (board) ? board : [];
        this.history = (history) ? history : []
        this.gameNumber = gameNumber,
        this.sidePotAmount = sidePotAmount,
        this.allInPlayers = (allInPlayers) ? allInPlayers : [],
        this.allInPlayersRoundBets = (allInPlayersRoundBets) ? allInPlayersRoundBets : []
    }
    static createObject(game) {
        return new Game(
            game.id,
            game.roomId,
            game.smallBlind,
            game.bigBlind,
            game.status,
            game.pot,
            game.roundName,
            game.betName,
            game.bets,
            game.roundBets,
            game.deck,
            game.board,
            game.history,
            game.gameNumber,
            game.sidePotAmount,
            game.allInPlayers,
            game.allInPlayersRoundBets
        )
    }
    toJson() {
        var game = {
            id: this.id,
            roomId: this.roomId,
            smallBlind: this.smallBlind,
            bigBlind: this.bigBlind,
            status: this.status,
            pot: this.pot,
            roundName: this.roundName,
            betName: this.betName,
            bets: this.bets,
            roundBets: this.roundBets,
            deck: this.deck,
            board: this.board,
            history: this.history,
            gameNumber: this.gameNumber,
            sidePotAmount: this.sidePotAmount,
            allInPlayers: this.allInPlayers,
            allInPlayersRoundBets: this.allInPlayersRoundBets
        }

        return game
    }
    async getSidePotAmount(room) {
        let players = room.players
        let game = room.game
        let pot = {}
        let allInPlayers = []
        // get all users having allin
        for (let i = 0; i < players.length; i++) {
            if (players[i].status == 'Playing' && players[i].allIn == true) {
                allInPlayers.push({ id: players[i].id, bet: game.roundBets[i] });
            }
        }
        console.log('allInPlayers', allInPlayers, game.roundBets)
        if (allInPlayers.length > 0) {
            let allinPlayersBet = [];
            // get the bets calculation based on users's allin
            // for (let i = 0; i < allInPlayers.length; i++) {
            //     console.log("Round Bets : ",game.roundBets[allInPlayers[i]]);
            //     allinPlayersBet.push(game.roundBets[allInPlayers[i]])
            // }
            // sort all allin's from lowest to highest
            // allinPlayersBet.sort(function (a, b) {
            //     return a - b;
            // })

            allInPlayers.sort(function (a, b) {
                return a.bet - b.bet;
            })

            console.log('Allin player bet', allInPlayers)
            let allInValue = 0;
            // calculating pot for every allin user.
            for (let j = 0; j < allInPlayers.length; j++) {
                pot[allInPlayers[j].id] = []
                for (let i = 0; i < game.roundBets.length; i++) {
                    pot[allInPlayers[j].id].push(0)
                }
                allInValue = allInPlayers[j].bet - allInValue;
                for (let i = 0; i < game.roundBets.length; i++) {
                    let betVal = allInValue;
                    if (game.roundBets[i] >= allInValue) {
                        game.roundBets[i] = game.roundBets[i] - parseInt(allInValue); // Update Round Bit Value
                    } else {
                        betVal = game.roundBets[i];
                        game.roundBets[i] = 0 // Update Round Bit Value
                    }
                    pot[allInPlayers[j].id][i] = betVal;
                }
            }
            console.log('pot 1', pot)
            pot['mainpot'] = []
            for (let i = 0; i < game.roundBets.length; i++) {
                pot['mainpot'].push(0)
            }
            for (let i = 0; i < game.roundBets.length; i++) {
                pot['mainpot'][i] = game.roundBets[i];
            }
            console.log('pot 2 ', pot)
        } else {
            pot['mainpot'] = []
            for (let i = 0; i < game.roundBets.length; i++) {
                pot['mainpot'].push(game.roundBets[i])
            }
        }
        // for (let i = pot.length - 1; i >= 0; i--) {
        //     let nonZero = 0;
        //     let innerPort = pot[i]
        //     for (let j = pot[i].length - 1; j >= 0; j--) {
        //         if (pot[i][j] > 0) {
        //             nonZero++
        //         }
        //     }
        //     if (!nonZero) {
        //         pot.splice(i, 1)
        //     }
        // }
        console.log('all in player listing', allInPlayers);
        game.allInPlayers = allInPlayers;
        game.allInPlayersRoundBets = [];
        // game.allInPlayersRoundBets = game.roundBets;
        for (var i = 0; i < pot.length; i++) {
            game.allInPlayersRoundBets.push(pot[i].reduce(getSum));
        }
        console.log("game.allInPlayersRoundBets :",game.allInPlayersRoundBets)
        game.sidePotAmount = pot;
        return pot
    }

}

function getSum(total, num) {
    return total + num;
}

module.exports = Game
