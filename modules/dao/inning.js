//modules/dao/inning.js
function Inning(inning){
	if(inning){
		this.inning_guid = inning.inning_guid;
		this.g_gref = inning.g_gref;
		if(inning._id){
	      this._id = inning._id;
		}
	}
	else{
		this.inning_guid = 0;
		this.g_gref = 0;

	}
}

Inning.prototype.getInning_guid = function() {
	return this.inning_guid;
};

Inning.prototype.setInning_guid = function(inning_guid){
	this.inning_guid = inning_guid;
};

Inning.prototype.getG_gref = function(){
	return this.g_gref;
};

Inning.prototype.setG_gref = function(g_gref){
	this.g_gref = g_gref;
};

module.exports = Inning;