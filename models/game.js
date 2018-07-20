const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSchema = new Schema({
				roomId: {
					type:'string',
					required:true
				},
				gameNumber: {
					type : 'string'
				},
				smallBlind: {
					type: 'number',
					default: 0
				},
				bigBlind: {
					type: 'number',
					default: 0
				},
				status: {
					type: 'string',
					default: ''
				},
				pot: {
					type: 'number',
					default: 0
				},
				roundName: {
					type: 'string',
					default: ''
				},
				betName: {
					type: 'string',
					default: ''
				},
				bets: {
					type: 'string',
					default: []
				},
				roundBets: {
					type: 'string',
					default: []
				},
				deck: {
					type: 'string',
					default: []
				},
				board: {
					type: 'string',
					default: []
				},
				history: {
					type: 'string',
					default: []
				},
				players: {
					type: 'string',
					default: []
				},
				winners: {
					type: 'string',
					default: []
				},
				sidePotAmount:{
					type: 'string',
					default: []
				}
},{ collection: 'game' });
mongoose.model('game', GameSchema);

 
