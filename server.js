var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var Victor = require('victor');

const WORLD_WIDTH = 30 * 32;
const WORLD_HEIGHT = 30 * 32;

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayerID = 0;



/** game logic (started at the bottom) **/
var lastTime;
var gameTimeout = null;
var gameUpdateInterval = 40;

function gameUpdate(delta) {
	// update player positions
	var players = getAllPlayers();
	var newPositions = [];
	// calculate new positions of every player
	players.forEach(function (player) {
		if (player.speed != 0) {
			// calculate new position of player
			var newPosition = {
				id: player.id,
				x: player.x + player.direction.x * player.speed,
				y: player.y + player.direction.y * player.speed,
				t: delta
			}
			// check if new position would be out of world bounds
			if (newPosition.x < player.size / 2) {
				newPosition.x = player.size / 2;
			} else if (newPosition.x > WORLD_WIDTH - player.size / 2) {
				newPosition.x = WORLD_WIDTH - player.size / 2;
			}
			if (newPosition.y < player.size / 2) {
				newPosition.y = player.size / 2;
			} else if (newPosition.y > WORLD_HEIGHT - player.size / 2) {
				newPosition.y = WORLD_HEIGHT - player.size / 2;
			}

			player.x = newPosition.x;
			player.y = newPosition.y;
			newPositions.push(newPosition);
		}
	});
	// emit new positions
	if (newPositions.length > 0) io.emit('pos', newPositions);

	gameTimeout = setTimeout(function () {
		gameUpdate(gameUpdateInterval);
	}, gameUpdateInterval);
}

function startGame() {
	gameTimeout = setTimeout(function () {
		// TODO calculate time diff for better calculations
		gameUpdate(gameUpdateInterval);
	}, gameUpdateInterval);
}


// handle connecting players
io.on('connection',function(socket){

    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayerID++,
						direction: new Victor(0, 0),
						speed: 10,
						size: 32,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
				// send other players
				socket.emit('assign_player_id', socket.player.id);
        socket.emit('allplayers', getAllPlayers());
				// inform other players about new player
        socket.broadcast.emit('newplayer', socket.player);


				// client wants to move player into a certain direction
				socket.on('dir', function (vector) {
					// set and normalize direction vector
					socket.player.direction.x = vector.x;
					socket.player.direction.y = vector.y;
					if (vector.x != 0 || vector.y != 0) {
						socket.player.direction.normalize();
					}
				});

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
		startGame();
});
