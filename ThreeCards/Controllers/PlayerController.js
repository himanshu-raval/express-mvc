var Game = require('../../Boot/Game');

module.exports = { 
    joinRoom: async function(socket,data){
        console.log('this is controller:',data)
        try {
 
            data.socketId = channel.socket.id;
            let player = await load('Games/Teenpatti/Services/PlayerService').getByDeviceId(data.device_id);

            if (!player) {
                data.chips=900000;
                data.diamonds=10;
                data.isFbProfile = false;
                data.fbProfileUrl = null;
    
                data.status='active';

                return {
                    status: 'create',
                    result: null,
                    message: 'Player to be Create.'
                }
            }else {
            let playerUpdate = await load('Games/Teenpatti/Services/PlayerService').update({id:player.id}, {socketId: channel.socket.id})
                return {
                    status: 'success',
                    result: player,
                    message: 'Player Found'
                }
            }

            
        } catch (e) {
            console.log("Erro",e);
        }

    },


    createGuest: async function(socket,data){
        try {
            data.socketId = socket.id;
            data.chips=1000;
            data.diamonds=10;
            let player = await Game.ThreeCards.Services.PlayerService.getByDeviceId(data.device_id); 
            if (!player) {
            
                data.chips=10000;
                data.diamonds=10;
                data.isFbProfile = false;
                data.status='active';

                player = await Game.ThreeCards.Services.PlayerService.create(data);  // Create Player
      
                return {
                    status: 'success',
                    result: data,
                    message: 'New Player Created'
                }
                
            }else {
              return {
                  status: 'fail',
                  result: null,
                  message: 'Player Already Exist'
              }
            }
            
        } catch (error) {
            Game.Log.info('Error in createGuest : ' + error);
            
        }

    },


    fbaccess: async function(socket,data){
    
        try {
  
            data.socketId = socket.id;
            if (data.appid) {
              let player = await Game.ThreeCards.Services.PlayerService.getByAppId(data.appid);
              if (!player) {
                player = await Game.ThreeCards.Services.PlayerService.getByDeviceId(data.device_id); 
                if (!player) {
                  data.chips=10000;
                  data.diamonds=10;
                  data.socketId = socket.id;
                  data.isFbProfile = true;
                  if (data.fbProfileUrl) {
                    player = await Game.ThreeCards.Services.PlayerService.create(data);  // Create Player
                    return {
                        status: 'success',
                        result: data,
                        message: 'New Player Created'
                    }
                  }else {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Not Able to get FaceBook Url'
                    }
                  }
                }else {
                  // console.log('player', player); return false;
                  let playerUpdate = await Game.ThreeCards.Services.PlayerService.update(player.id, {socketId: channel.socket.id})
                  let update = await Game.ThreeCards.Services.PlayerService.update(player.id, data );
                  let playerNew = await Game.ThreeCards.Services.PlayerService.getByAppId(data.appid);
                  if (playerNew.status == 'active') {
                    return {
                        status: 'success',
                        result: playerNew,
                        message: 'Device Player Found'
                    }
                  }else {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Status Not Active'
                    }
                  }
      
                }
              }else {
                let playerUpdate = await load('Games/Teenpatti/Services/PlayerService').update({id:player.id}, {socketId: channel.socket.id})
                return {
                    status: 'success',
                    result: player,
                    message: 'Device Player Found'
                }
              }
            }else {
              return {
                  status: 'fail',
                  result: null,
                  message: 'Facebook app id not Provided'
              }
            }


            
        } catch (e) {
            Game.Log.info('Error in createGuest : ' + error);
        }

    },


    test: async function(socket,data){
    
        try {
  
            
        } catch (e) {
            Game.Log.info('Error in createGuest : ' + error);
        }

    },

}