//modules/dao/inning_User
function Inning_User(inning_user){
	if(inning_user){
		if(inning_user._id){
			this._id = inning_user._id;
		}
		this.iu_guid = inning_user.iu_guid;
		this.inning_gref = inning_user.inning_gref;
		this.user_gref = inning_user.user_gref;
		this.user_account = inning_user.user_account;
		this.user_pic = inning_user.user_pic;
		this.score = inning_user.score;
		this.online = inning_user.online;
	}
	else{
		this.iu_guid = 0;
		this.inning_gref = '';
		this.user_gref = '';
		this.user_account = '';
		this.user_pic = '';
		this.score = 0;
		this.online = 0;
	}
}

Inning_User.prototype.getIu_guid = function() {
	return this.iu_guid;
};

Inning_User.prototype.setIu_guid = function(iu_guid) {
	this.iu_guid = iu_guid;
};

Inning_User.prototype.getInning_gref = function(){
	return this.inning_gref;
};

Inning_User.prototype.setInning_gref = function(inning_gref){
	this.inning_gref = inning_gref;
};

Inning_User.prototype.getUser_gref = function(){
	return this.user_gref;
};

Inning_User.prototype.setUser_gref = function(user_gref){
	this.user_gref = user_gref;
};

Inning_User.prototype.getUser_account = function(){
	return this.user_account;
};

Inning_User.prototype.setUser_account = function(user_account){
	this.user_account = user_account;
};

Inning_User.prototype.getScore = function(){
	return this.score;
};

Inning_User.prototype.setScore = function(score){
	this.score = score;
};

Inning_User.prototype.getOnline = function(){
	return this.online;
};

Inning_User.prototype.setOnline = function(online){
	this.online = online;
}
module.exports = Inning_User;