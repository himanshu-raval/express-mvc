const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
            name          : { type: 'string', required: true },
		tableNumber   : { type: 'string', required: true },
		dealerId		  : { type: 'number', required: true },
            smallBlind    : { type: 'number', required: true },
		// minBet    		: { type: 'number', required: true },
            // maxBet	      : { type: 'number', required: true },
            // bigBlind	    : { type: 'number', required: true },
            minPlayers    : { type: 'number', required: true },
            maxPlayers    : { type: 'number', required: true },
            minBuyIn      : { type: 'number' },
            maxBuyIn      : { type: 'number' },
            gps      : { type: 'boolean' },
            ip      : { type: 'boolean' },
			// tableNumber   : { type: 'string', required: true },
            isFull			  : { type: 'boolean', required: true },
			// maxPot			  : { type: 'number', required: true },
            rackPercent   : { type: 'number' },
            // rackAmount    : { type: 'number' },
            expireTime    : { type: 'string' },
            type          : { type: 'string' }, // diamond / chips
            owner         : { type: 'string' }, // admin or user
            isLimitGame   : { type: 'boolean' },
            currentPlayer : { type: 'number', allowNull: true },
		players       : { type: 'string' },
            waitingPlayers: { type: 'string' },
            gameWinners   : { type: 'string' },
            gameLosers    : { type: 'string' },
            turnBet       : { type: 'string' },
            status        : { type: 'string' }, // closed for deleted rooms
            game          : [{ type: Schema.Types.ObjectId, ref: 'game' }],
		club		  :	[{ type: Schema.Types.ObjectId, ref: 'user' }],
		bootAmount	  :	{ type: 'number', required: true }
	},{ collection: 'room' });
mongoose.model('room', RoomSchema);

 
