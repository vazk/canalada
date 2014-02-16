
var BEModuleRegistry = function() {
	/// members for managing the worker processes
	this.db = {};

	this.register = function(module) {
		console.log('ModuleRegistry: registering ', module.name);
		this.db[module.name] = module;
		console.log('F: ', this.db);
	}

	this.module = function(moduleName) {
		console.log('O: ', moduleName, ' - ', this.db);
		return this.db[moduleName];
	}
};

module.exports = new BEModuleRegistry;