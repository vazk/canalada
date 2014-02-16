var augment = require("augment");
var wd = require('./BEWorkDispatcher');

function assert(condition, message) {
    if (!condition) {
        throw 	message || "Assertion failed";
    }
}



var BELink = Object.augment(function() {
	this.constructor = function (){
		this.toPort = null;
		this.fromPort = null;
		this.data = null;
	};
	this.hasData = function() {
		return this.data != null;
	};
	this.push = function(data) {
		assert(!this.hasData(), "the link has unprocessed data");
		this.data = data;
		this.buzzToPort();
	};
	this.pull = function() {
		assert(this.hasData(), "the link has no data to pull");
		this.buzzFromPort();
		var data = this.data;
		this.data = null;
		return data;
	};
	this.setToPort = function(port) {
		port.link = this;
		this.toPort = port;
	};
	this.setFromPort = function(port) {
		port.link = this;
		this.fromPort = port;
	};
	this.buzzToPort = function() {
		if(this.toPort) {
			this.toPort.buzz();
		}
	};
	this.buzzFromPort = function() {
		if(this.fromPort) {
			this.fromPort.buzz();
		}
	};
});


var BEPortBase = Object.augment(function() {
	this.constructor = function() {
		this.name = null;
		this.link = null;
		this.module = null;
	};
	this.hasLink = function() {
		return this.link != null;
	};
	this.hasModule = function() {
		return this.module != null;
	};
	this.hasData = function() {
		return this.hasLink() && this.link.hasData();
	};
	this.setModule = function(module) {
		this.module = module;
	};
	this.buzz = function() {
		console.log("buzz!");
		this.module.execute();
	};

});

var BEInputPort = BEPortBase.augment(function() {
	this.constructor = function() {
		this.mandatory = true;
	};
	this.pull = function() {
		if(this.hasLink()) {
			return this.link.pull();
		} else {
			return undefined;
		}
	};
	this.setLink = function(link) {
		this.link = link;
		this.link.setInputPort(this);
	};
	this.isMandatory = function() {
		return this.mandatory;
	};
});

var BEOutputPort = BEPortBase.augment(function() {
	this.constructor = function() {
		this.overwritable = false;
	};
	this.push = function(data) {
		assert(!this.hasData(), "the output port has unprocessed data");
		if(this.hasLink()) {
			this.link.push(data);
		}
	};
	this.setLink = function(link) {
		this.link = link;
		this.link.setOutputPort(this);
	};
	this.isOverwritable = function() {
		return this.overwritable;
	};
});

var BEModule = Object.augment(function() {
	this.constructor = function(name) {
		this.name = name;
    	this.inputPorts = [];
	    this.outputPorts = [];
	};

    this.addInputPort = function(portName) {
    	var port = new BEInputPort();
    	port.name = portName;
    	port.setModule(this);
        this.inputPorts.push(port);
        return port;
    };

    this.addOutputPort = function(portName) {
    	var port = new BEOutputPort();
    	port.name = portName;
        port.setModule(this);
        this.outputPorts.push(port);
        return port;
    };

    this.execute = function () {
    	// check input ports for data
    	var inputs = {};
    	var port;
    	for(var i = 0, total = this.inputPorts.length; i < total; ++i) {
    		port = this.inputPorts[i];
    		if(!port.hasData() && port.isMandatory()) {
    			return;
    		}
  		}
  		// now check the outputs to make sure the previous data is consumed
  	   	for(var i = 0, total = this.outputPorts.length; i < total; ++i) {
  	   		port = this.outputPorts[i];
    		if(port.hasData() && !port.isOverwritable()) {
    			return;
    		}
  		}

       	for(var i = 0, total = this.inputPorts.length; i < total; ++i) {
    		port = this.inputPorts[i];
    		if(!port.hasData() && port.isMandatory()) {
    			return;
    		}
    		inputs[port.name] = port.pull();
  		}
  		wd.submitJob({
				moduleName: this.name,
				input: inputs
			});
    };
});


exports.assert = assert;
exports.BELink = BELink;
exports.BEInputPort = BEInputPort;
exports.BEOutputPort = BEOutputPort;
exports.BEModule = BEModule;

