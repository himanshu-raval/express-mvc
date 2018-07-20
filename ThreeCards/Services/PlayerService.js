class PlayerService {
	async create(data) {
		return await load('App/Models/Player').create(data).fetch()
	}
	async getByEmail(email) {
		return await load('App/Models/Player').findOne({ email })
	}
	async getBySocket(socketId) {
		return await load('App/Models/Player').findOne({ socketId })
	}

	async getByDeviceId(device_id) {
		return await load('App/Models/Player').findOne({ device_id })
	}

	async getByAppId(appid) {
		return await load('App/Models/Player').findOne({ appid })
	}

	async getById(id) {
		return await load('App/Models/Player').findOne({id})
	}

	async getByIds(ids) {
		return await load('App/Models/Player').find({ id: ids })
	}

	

	async getPlayerLeaderBoard(count) {

		//return	await load('App/Models/ChipsDiamondHistory').sum('amount');
	 
	  let players =  await load('App/Models/Player').find({select : ['username', 'chips', 'profilePicId','isFbProfile','fbProfileUrl']}).sort({ 'chips': -1 });
		let responceObj = [];
		players.forEach(function(plr){
			responceObj.push({
				'username' : plr.username,
				'chips' : plr.chips,
				'profilePicId' : plr.profilePicId,
				'isFbProfile' : plr.isFbProfile,
				'fbProfileUrl' : plr.fbProfileUrl
			})
		})
		return responceObj;
 
	}

	async update(query, data) {
		let records = await load('App/Models/Player').update(query, data).fetch()
		return records.length > 0 ? records[0] : null
	}

	async entityById(id){
		let player =  await load('App/Models/Player').findOne({ id })
		return await load('Games/Teenpatti/Entities/Player',player)
	}

	async verifyPassword(password, hashPassword) {

		return await load('Iniv/Hash').verify(password, hashPassword)
	}
	async getGuild(guildId) {
		return await load('App/Models/Guild').findOne({ id: guildId })
	}
	async getItems(playerId) {
		return await load('App/Models/Item').find({ player: playerId })
	}

	async getAllOnline() {
		return await load('App/Models/Player').find({
			where: {
				status: 'online'
			},
			select: ['id', 'username', 'Position']
		})
	}
	/**
	 *
	 * @param {*} id Player id
	 * @param [x,y] position
	 */
	async getInView(id, position, view) {
		if (!position) {
			position = [0, 0]
		}
		let bottomBound = [parseFloat(position[0]) - parseFloat(view.x), parseFloat(position[1]) - parseFloat(view.y)];
		let topBound = [parseFloat(position[0]) + parseFloat(view.x), parseFloat(position[1]) + parseFloat(view.y)];

		let players = await load('Iniv/Database').table('player').where({
			Position: {
				$geoWithin: {
					$box: [bottomBound, topBound]
				}
			},
			"_id": { "$ne": { "$oid": id } },
			status: 'online'
		})
		.select("guild","username","characteristics","Position","IsAlive","temData","socketId")
		.all()

		let playersObj = {}
		players.map(player => {
			player.id = player._id
			delete player._id
		})
		players.forEach(player => {
			playersObj[player.id] = player
		});
		return playersObj

	}
	/**
	 *
	 * @param {*} id Player id
	 */
	async getBook(id) {
		let player = await load('App/Models/Player').findOne({
			where: {
				id: id,
			},
			select: ['id', 'book']
		})
		if (!player.book) {
			player.book = {
				Arrow_Rapid: 0,
				Arrow_Explosion: 0,
				Arrow_Poison: 0,
				Arrow_Vanish: 0,
				Arrow_Multiple: 0,
				Arrow_Slug: 0,

				Spell_Fireball: 0,
				Spell_Explosion: 0,
				Spell_Heal: 0,
				Spell_Paralyze: 0,
				Spell_Blink: 0,
				Spell_Toxic: 0,
				Spell_Resurrection: 0,

				Melee_Power: 0,
				Melee_Bleed: 0,
				Melee_Whirlwind: 0,
				Melee_Rage: 0,
				Melee_Assault: 0,
				Melee_Stunning: 0
			}
		}
		return player
	}

	/**
	 *
	 * @param {*} id Player id
	 * @param [x,y] position
	 */
	async addQuest(id, quest) {
		// console.log(id, quest)
		let player = await load('App/Models/Player').findOne({
			where: {
				id: id,
			},
			select: ['quests']
		})
		if (!player.quests) {
			player.quests = {};
			player.quests[quest.QuestName] = quest;
		} else {
			if (Object.keys(player.quests).indexOf(quest.QuestName) == -1) {
				player.quests[quest.QuestName] = quest;
			} else {
				player.quests[quest.QuestName] = quest;
			}
		}
		return await load('App/Models/Player').update({ id }, { quests: player.quests })
	}
	/**
	 *
	 * @param {*} id Player id
	 * @param [x,y] position
	 */
	async getQuest(id, quest) {
		let player = await load('App/Models/Player').findOne({
			where: {
				id: id,
			},
			select: ['quests']
		})
		if (!player.quests || Object.keys(player.quests).length == 0) {
			return {
				status: 'fail',
				result: null,
				message: 'Noquest Object'
			}
		}
		if (Object.keys(player.quests).indexOf(quest.QuestName) == -1) {
			return {
				status: 'fail',
				result: null,
				message: 'this quest not found'
			}
		}
		return {
			status: 'success',
			result: player.quests[quest.QuestName]
		};
	}
}

module.exports = PlayerService
