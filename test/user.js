const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
      name: {
        type: 'string',
        required: true
      },
      email : {
      	type: 'string'
      },
      updatedAt  : { 
        type : Date, 
        default : Date.now 
      }
      
},{ collection: 'user' } );

mongoose.model('user', UserSchema);