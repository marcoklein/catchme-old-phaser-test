/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();


Client.askNewPlayer = function(){
	Client.socket.emit('newplayer');
};

Client.sendDirection = function (x, y) {
	Client.socket.emit('dir', {x: x, y: y});
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('assign_player_id', function (id) {
	console.log("Assigned player id: " + id);
	Game.playerId = id;
});

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id, data.x, data.y, data.size, data.isCatcher);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
			Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

		Client.socket.on('change_catcher', function (newCatcher) {
			Game.changeCatcher(newCatcher);
		});

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

		Client.socket.on('pos', function (positions) {
			Game.movePlayers(positions);
		});

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});
