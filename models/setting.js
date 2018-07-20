const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
			defaultChips: {
				type: 'number',
				required: true
			},
			defaultDiamonds: {
				type: 'number',
				required: true
			},
			rakePercenage: {
				type: 'number',
				required: true
			}
	},{ collection: 'setting' });
mongoose.model('setting', SettingSchema);
 
