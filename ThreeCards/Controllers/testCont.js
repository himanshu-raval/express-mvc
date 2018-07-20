var Game = require('../../Boot/Game');

module.exports = { 
    joinRoom: async function(socket,data){
        console.log('this is controller:',data)
       // res.send("hi hr");
        try {
 
            socket.join(data.room);
            Game.Io.to(data.room).emit('joinRoomBro','Welcome '+data.name);
           // Game.Io.emit('joinRoomBro','New Player Join 111');
            
        } catch (e) {
            console.log("Erro",e);
            //this will eventually be handled by your error handling middleware
            // next(e) 
           // res.status(200).send("Error"+e)
        }

    }
}



async function getData(data){
    console.log("Data",data)
    return "Data"+data.id;
}
    // res.status(200).send({
    //     data: {
    //       token: service.getUserToken().token,
    //       profile: service.getUser()
    //     }
    //   })