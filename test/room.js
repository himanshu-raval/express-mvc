const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
            name          : { type: 'string', required: true },
		user		  :{ type: Schema.Types.ObjectId, ref: 'user' },
            updatedAt  : {  type : Date,   default : Date.now   }
            
		
},{ collection: 'room' });
mongoose.model('room', RoomSchema);
      
 
