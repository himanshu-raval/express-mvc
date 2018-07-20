//var mycont = require('../controllers/mycontroller');
var Game = require('../../Boot/Game');

module.exports = function (Socket) {
    Socket.on("test", function(data) {
        console.log("Hello This is test",data);
    });

    Socket.on("join", function(data) {
        console.log("Join Called",Socket.id);
        //Game.Io.emit('test','hello');
         Game.Io.emit('joinRoomBro','New Player Join');
        Game.ThreeCards.Controllers.testCont.joinRoom(Socket,data); 
    });
}