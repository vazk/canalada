var JSONSocket = require('json-socket');
var ModuleRegistry = require('./BEModuleRegistry');

var BEWorker = function(serverPort, workerId) {
	this.serverPort = serverPort;
	this.workerId = workerId;

	this.runJob = function(job) {
		console.log('C[', context.workerId, ']: processing [',job.moduleName,']...');
		var module = ModuleRegistry.module(job.moduleName);
		var outputs = {};
		module.process(job.input, outputs);
		this.socket.sendMessage({
									msg:'done',
									status:'ok',
									output: outputs,
									workerId: this.workerId
								});
	};
	this.initialize = function() {
		context = this;
		context.socket = new JSONSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
		context.socket.connect(context.serverPort);
		context.socket.on('connect', function() {
				console.log('C:[', context.workerId,'], @connected');
				context.socket.sendMessage({
									  	msg: 'connected',
									  	workerId: context.workerId
								  	});
				context.socket.sendMessage({a:'a'});
				console.log('C: done');
		});

		context.socket.on('message', function(m) {
		  	console.log('C[', context.workerId, ']: @message: ', JSON.stringify(m));
		  	context.runJob(m);
		});

	};
};



var net = require('net');
var serverPort = process.argv[2];
var workerId = process.argv[3];

var wrkr = new BEWorker(serverPort, workerId);
wrkr.initialize();
