
class ChipsService {
	async create (data){
		// data.status = 'waiting';
		// let cnt = await load('App/Models/Setting').count();
		// data['gameNumber'] = 'PSG'+parseInt(cnt + 1);
		// let game = await load('Games/Teenpatti/Entities/Game',data);
		// return await load('Games/Teenpatti/Entities/Game',game);
		try {
			console.log(data);
			return await load('App/Models/ChipsTransaction').create(data).fetch()
		} catch (e) {
			console.log(e);
		}
	}

	// async get (id){
	// 	// Game.findOne({id:id})
	// 	// .populate('game')
	// 	// .exec(function (err, game) {
	// 	// 	if(err) { return cb(err) }
	// 	// 	if(!game){
	// 	// 		return cb(new Error('No table available'));
	// 	// 	}
	// 	// 	return cb(null, load('Poker/Game',game));
	// 	// })
	// 	var game = await load('App/Models/Game').findOne({ id })
	// 	return load('Games/Teenpatti/Entities/Game',game);
	// }
	//
	// async search (query){
	// 	// Game.find(query)
	// 	// .populate('game')
	// 	// .exec(function (err, games) {
	// 	// 	if(err) { return cb(err) }
	// 	// 	var tempGames = []
	// 	// 	if(games.length > 0){
	// 	// 		games.forEach(function(game){
	// 	// 			tempGames.push(load('Poker/Game',game))
	// 	// 		})
	// 	// 	}
	// 	// 	return cb(null, tempGames);
	// 	// })
	// 	var game =  await load('App/Models/Game').find(query)
	// 	return load('Games/Teenpatti/Entities/Game',game);
	//
	// }
	//
	// async update (query){
	// 	// let self = this
	// 	// var id = game.id
	// 	// Game.update({id: id}, game.toJson())
	// 	// .exec(function (err, games) {
	// 	// 	if(err) { console.log('updateGame', err); return cb(err) }
	// 	// 	if(games[0]){
	// 	// 		self.get(games[0].id,function(err,game){
	// 	// 			if(err) { console.log('updateGame', err); return cb(err) }
	// 	// 			return cb(null, game);
	// 	// 		})
	// 	// 	}
	// 	// 	return cb(null, game);
	// 	// })
	// 	let records = await load('App/Models/Game').update({id: query.id}, query).fetch()
	// 	return records.length > 0 ? records[0] : null
	// }
}
module.exports = ChipsService
