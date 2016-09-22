//modules/dao/game.js

function Game(game){
	this.setGame(game);
}

Game.prototype.getGame = function() {
	return this;
};

Game.prototype.setGame = function(game){
	this.game_guid = game.game_guid;
	this.g_p_less = game.g_p_less;
	this.g_p_more = game.g_p_more;
	this.g_name = game.g_name;
	if(game._id){
		this._id = game._id;
	}
};

Game.prototype.setGUID = function(game_guid){
	this.game_guid = game_guid;
};

Game.prototype.getGUID = function(){
	return this.game_guid;
};

Game.prototype.setG_p_less = function(g_p_less){
	this.g_p_less = g_p_less;
};

Game.prototype.getG_p_less = function(){
	return this.g_p_less;
};

Game.prototype.setG_p_more = function(g_p_more){
	this.g_p_more = g_p_more;
};

Game.prototype.getG_p_more = function(){
	return this.g_p_more;
};

Game.prototype.setG_name = function(g_name){
	this.g_name = g_name;
};

Game.prototype.getG_name = function(){
	return this.g_name;
};

module.exports = Game;