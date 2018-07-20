const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
      name: {
        type: 'string',
        required: true
      },
      updatedAt  : { 
        type : Date, 
        default : Date.now 
      }
});

mongoose.model('test', UserSchema);