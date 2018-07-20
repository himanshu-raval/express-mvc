const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
			device_id: {
				type: 'string',
				required: true
			},
			appid: {
				type: 'string'
			},
			username: {
				type: 'string',
				required: true
			},
			firstname: {
				type: 'string',
				// required: true
			},
			lastname: {
				type: 'string',
				// required: true
			},
			// profilePic: {
			// 	type: 'string',
			// 	required: true
			// },
			isFbProfile: {
				type: 'boolean',
				required: true
			},
			profilePicId: {
				type: 'string',
				default: '0'
				// required: true
			},
			fbProfileUrl: {
				type: 'string'
				// required: true
			},
			email: {
				type: 'string'
			},
			password: {
				type: 'string'
			},
			mobile: {
				type: 'string',
				// required: true
			},
			gender: {
				type: 'string',
				// required: true
			},
			chips: {
				type: 'number',
				required: true
			},
			diamonds: {
				type: 'number',
				required: true
			},
			activationCode: {
				type: 'string',
				default: ''
			},
			status: {
				type: 'string',
				default: 'inactive'
			},
			sessionId: {
				type: 'string'
			},
			socketId: {
				type: 'string'
			},
			rating: {
				type: 'number',
				default: 0
			}
},{ collection: 'player' });
mongoose.model('player', PlayerSchema);
 
