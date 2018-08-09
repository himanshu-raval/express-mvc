const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
			device_id: {
				type: 'string',
				required: true
			},
			appid: {
				type: 'string',
				default: ''
			},
			username: {
				type: 'string',
				default: ''
				//required: true
			},
			firstname: {
				type: 'string',
				default: ''
				// required: true
			},
			lastname: {
				type: 'string',
				default: ''
				// required: true
			},
			// profilePic: {
			// 	type: 'string',
			// 	required: true
			// },
			isFb: {
				type: 'boolean',
				default: false
				//required: true
			},
			profilePicId: {
				type: 'string',
				default: '0'
				// required: true
			},
			fbProfileUrl: {
				type: 'string',
				default: ''
				// required: true
			},
			email: {
				type: 'string',
				default: ''
			},
			password: {
				type: 'string',
				default: ''
			},
			mobile: {
				type: 'string',
				default: ''
				// required: true
			},
			gender: {
				type: 'string',
				default: ''
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
				type: 'string',
				default: ''
			},
			socketId: {
				type: 'string',
				default: ''
			},
			rating: {
				type: 'number',
				default: 0
			},
			updatedAt : { type: Date, default: Date.now() },
			createdAt : { type: Date, default: Date.now() }
},{ collection: 'player' });
mongoose.model('player', PlayerSchema);
 
