/**
 * Created by Jerome on 03-03-16.
 */
//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
var game = new Phaser.Game(400, 400, Phaser.AUTO, document.getElementById('game'));
game.stage.scale.pageAlignHorizontally = true;
game.stage.scale.pageAlignVertically = true;
game.stage.scale.refresh();
game.state.add('Game',Game);
game.state.start('Game');
