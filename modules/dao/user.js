// modules/dao/user
function User(user){
	if(user){
		if(user._id){
			this._id = user._id;
		}
		this.user_guid  = user.user_guid;
		this.account = user.account;
		this.pic = user.pic;
	}
	else{
		this.user_guid  = 0;
		this.account = '';
		this.pic = '';
	}
}

User.prototype.getUser_guid = function(){
	return this.user_guid;
};

User.prototype.setUser_guid = function(user_guid){
	this.user_guid = user_guid;
};

User.prototype.getAccount = function(){
	return this.account;
};

User.prototype.setAccount = function(account){
	this.account = account;
};

User.prototype.getPic = function(){
	return this.pic;
};

User.prototype.setPic = function(pic){
	this.pic = pic;
};

module.exports = User;