var BE = require('./BECore.js').BE;

BE.ModuleFactory = Object.augment(function() {
	
	this.constructor = function() {
		this.db = {};
		this.register('EmailClient');
	};

	this.register = function(moduleName) {
		var m = {};
		m.process = require('../installed_modules/'+moduleName+'/Process.js').Process;
		m.io = require('../installed_modules/'+moduleName+'/IO.js').IO;
		this.db[moduleName] = m;
	}

	this.create = function(moduleName) {
		var reg = this.db[moduleName];
		var module = new BE.Module(moduleName);
		for(var i = 0, total = reg.io.input.length; i < total; ++i) 
			module.addInputPort(reg.io.input[i]);
		for(var i = 0, total = reg.io.output.length; i < total; ++i) 
			module.addOutputPort(reg.io.output[i]);
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

module.exports = new BE.ModuleFactory;