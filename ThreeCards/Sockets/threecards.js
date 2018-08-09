
var Game = require('../../Boot/Game');

module.exports = function (Socket) {
    
    Socket.on("Localaccess",async function(data,responce) {
         responce(await Game.ThreeCards.Controllers.PlayerController.localaccess(Socket,data)); 
    });

    Socket.on("CreateGuest", async function(data,responce) {
        responce(await Game.ThreeCards.Controllers.PlayerController.createGuest(Socket,data)); 
    });

    Socket.on("Fbaccess", async function(data,responce) {
        responce(await Game.ThreeCards.Controllers.PlayerController.fbaccess(Socket,data)); 
    });
   

    Socket.on("SubscribeChipsRoom", async function(data,responce) {
        responce(await Game.ThreeCards.Controllers.RoomController.subscribeChipsRoom(Socket,data)); 
    });


   
    Socket.on("test", function(data,res) {
        console.log("Hello This is test",data);
        res({'Data': 'Done'});
      //return {"Hello":"this is Test"};
    });

    Socket.on("join", function(data) {
        console.log("Join Called",Socket.id);
        //Game.Io.emit('test','hello');
         Game.Io.emit('joinRoomBro','New Player Join');
        Game.ThreeCards.Controllers.testCont.joinRoom(Socket,data); 
    });


}