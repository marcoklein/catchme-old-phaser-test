/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var cursors;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
		cursors = game.input.keyboard.createCursorKeys();
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/default-map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet_top_down.png', 32, 32);
    game.load.image('player', 'assets/sprites/simple_character.png');
    game.load.image('catcher', 'assets/sprites/simple_catcher.png');
};

Game.create = function(){
    Game.playerMap = {};
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet_complete', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    //layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    //layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
		game.world.setBounds(0, 0, 30 * 32, 30 * 32);
};

Game.update = function () {
	var dirX = 0, dirY = 0;
	if (cursors.up.isDown) {
		dirY = -1;
	} else if (cursors.down.isDown) {
	  dirY = 1;
	}

	if (cursors.left.isDown) {
	  dirX = -1;
	} else if (cursors.right.isDown) {
	  dirX = 1;
	}

	Client.sendDirection(dirX, dirY);
}

Game.addNewPlayer = function(id, x, y, size, isCatcher) {
	if (!isCatcher) {
		Game.playerMap[id] = game.add.sprite(x, y, 'player');
	} else {
	  Game.playerMap[id] = game.add.sprite(x, y, 'catcher');
	}
  Game.playerMap[id].anchor.x = 0.5;
  Game.playerMap[id].anchor.y = 0.5;
	console.log("Added new player with id: " + id);
  if (id == Game.playerId) {
    Game.camera.follow(Game.playerMap[id]);
    Game.camera.flash();
  }
};

// changes the catcher
Game.changeCatcher = function (newCatcher) {
	Game.getAllPlayers().forEach(function (player) {
		console.log('looping through changed catcher: ' + newCatcher.id + ', ' + player.id);
		if (newCatcher.id == player.id) {
			// set catcher sprite
			player.loadTexture('catcher');
			player.isCatcher = true;
			console.log('loaded texture of new catcher')
		} else if (player.isCatcher) {
			// set "normal" player sprite
			player.loadTexture('player');
			player.isCatcher = false;
		}
	});
};

Game.getAllPlayers = function () {
    var players = [];
    Object.keys(Game.playerMap).forEach(function(key){
			var player = Game.playerMap[key];
			player.id = key;
      if(player) players.push(player);
    });
    return players;
}


// move players to given target positions
Game.movePlayers = function (positions) {
	positions.forEach(function (position) {
		var player = Game.playerMap[position.id];
		var tween = game.add.tween(player);
		var duration = position.t;
		tween.to({x: position.x, y: position.y}, duration);
		tween.start();
	});
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};
