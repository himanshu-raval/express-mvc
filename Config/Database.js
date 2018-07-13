module.exports = {
	connectionType :  'local',
	option : {
		autoIndex: false, // Don't build indexes
	  	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	  	reconnectInterval: 500, // Reconnect every 500ms
	  	poolSize: 10, // Maintain up to 10 socket connections
	  	// If not connected, return errors immediately rather than waiting for reconnect
	  	bufferMaxEntries: 0,
	    useNewUrlParser: true,
	    poolSize: 2,
	    promiseLibrary: global.Promise
	},

	local: {
		mode: 'local',
		mongo: {
			host: '127.0.0.1',
			port: 27017,
			user: 'root',
			password : '',
			database: 'express'
		}

	},
	staging: {
		mode: 'staging',
		mongo: {
			host: '127.0.0.1',
			port: 27017,
			user: '',
			password : '',
			database: ''
		}
	},
	production: {
		mode: 'production',
		mongo: {
			host: '127.0.0.1',
			port: 27017,
			user: '',
			password : '',
			database: ''
		}
	}
}