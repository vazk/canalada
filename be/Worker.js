var augment = require("augment");
var JSONSocket = require('json-socket');
var ModuleFactory = require('./BEModuleFactory');


Worker = Object.augment(function() {
	
	this.constructor = function(serverPort, workerId) {
		this.serverPort = serverPort;
		this.workerId = workerId;
	};

	this.runJob = function(job) {
		console.log('C[', context.workerId, ']: processing [',job.moduleName,']...');
		var outputs = {};
		var processor = ModuleFactory.processor(job.moduleName).process;
		processor(job.input, outputs);
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
		});

		context.socket.on('message', function(m) {
		  	console.log('C[', context.workerId, ']: @message: ', JSON.stringify(m));
		  	context.runJob(m);
		});

	};
});



var net = require('net');
var serverPort = process.argv[2];
var workerId = process.argv[3];

var wrkr = new Worker(serverPort, workerId);
wrkr.initialize();
