/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(400, 400, Phaser.AUTO, document.getElementById('game'));
//game.camera.width = 400;
//game.camera.height = 400;
game.state.add('Game',Game);
game.state.start('Game');
