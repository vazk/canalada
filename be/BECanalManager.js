var augment = require("augment");
var BE = require('./BECore.js').BE;


BE.CanalManager = Object.augment(function() {

	this.constructor = function() {
		// TBD: FIX THIS
		this.nextCanalId = 0;
		this.allCanals = {};
		this.runningCanals = {};
	};

	this.createCanal = function(fecanal) {
		var canalId = this.nextCanalId++;
		var canal = new BE.Canal(canalId);
		this.allCanals[canalId] = canal;
		return canal;
	};

	this.destroyCanal = function(canalId) {
		var canal = this.allCanals[canalId];
		if(canal === undefined) {
			console.log('BECanalManager: destroy: invalid canalId: ', canalId);
			return;
		}
		// TBD: do moch more, like make sure it's stopped
		delete this.allCanals[canalId];
		delete this.runningCanals[canalId];
		// TBD: do much more (like cleaning up the environment)
	};


});


module.exports = new BE.CanalManager();