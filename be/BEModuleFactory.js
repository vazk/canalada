var core = require('./BECore.js');

var BEModuleFactory = Object.augment(function() {
	
	this.constructor = function() {
		this.db = {};
		this.db['EmailClient'] = require('./modules/EmailClient.js').EmailClient;
	};

	this.create = function(moduleName) {
		var reg = this.db[moduleName];
		var module = new core.BEModule(moduleName);
		for(var i = 0, total = reg.input.length; i < total; ++i) 
			module.addInputPort(reg.input[i]);
		for(var i = 0, total = reg.output.length; i < total; ++i) 
			module.addOutputPort(reg.output[i]);
		return module;
	};

	this.processor = function(moduleName) {
		var reg = this.db[moduleName];
		if(reg) {
			return this.db[moduleName].process;
		} else {
			return undefined;
		}
	};
});

module.exports = new BEModuleFactory;