// https://github.com/javascript/augment
// https://news.ycombinator.com/item?id=7243414
var JSONSocket = require('json-socket');
var ChildProcess = require('child_process');


var BEWorkDispatcher = function(numWorkers) {
	/// members for managing the worker processes
	this.numWorkers = numWorkers;
	this.workers = [];
	this.workerPool = [];
	/// members used for managing the actual work...
	this.jobs = [];

	this.start = function() {
		this.initializeWorkers();
		this.startServer();
	};

	this.submitJob = function(job) {
		//var id = Math.floor((Math.random()*numThreads)+1);
		console.log("S: submitting job ", job);
		var wrkr = this.workerPool.shift();
		if(wrkr === undefined) {
			this.jobs.push(job);
			console.log('chkpt1');
		} else {
			console.log('chkpt2 ', JSON.stringify(job));
			wrkr.socket.sendMessage(job);
		}
	};

	this.workerAvailable = function(wrkr) {
		console.log('S: worker [', wrkr.workerId, '] is available!');
		var poolSize = this.workerPool.push(wrkr);
		var job = this.jobs.shift();
		if(job !== undefined) {
			this.submitJob(job);
		}
	};

	this.initializeWorkers = function() {
		var context = this;
		for(var i = 0;  i < this.numWorkers; ++i) {
			var wrkr = ChildProcess.fork('BEWorker.js', [9999, i]);
			console.log('N', require('./BEModuleRegistry'));
			wrkr.workerId = i;
			wrkr.socket = null;
			this.workers.push(wrkr);

			wrkr.on('exit', function(m) {
				console.log("S: child quit...");
			});
		}
	};

	this.startServer = function() {
		var context = this;
		// Open up the server and send sockets to child
		var server = require('net').createServer();

		server.on('connection', function (socket) {
			socket = new JSONSocket(socket);
			console.log("S: connected from: ", socket.remoteAddress);

			socket.on('message', function(m) {
				console.log('S: @message: ', JSON.stringify(m));
				//var m = JSON.parse(data);
				if(m.msg === 'connected') {
					var workerId = m.workerId;
		  			console.log('S: worker #', workerId, ' is connected.');
		  			var wrkr = context.workers[workerId];
		  			wrkr.socket = socket;
		  			context.workerAvailable(wrkr);
		  		} else 
		  		if(m.msg === 'done') {
		  			console.log('S: worker [', m.workerId,
		  						'] finished the job, status: ', m.status);
		  			var workerId = m.workerId;
		  			var wrkr = context.workers[workerId];
		  			context.workerAvailable(wrkr);
		  		}
			});
			//this.workers[0].send("oy");
		});
		console.log("S: started listening to port: ", 9999);
		server.listen(9999);
	};
};

var numThreads = 1; 
module.exports = new BEWorkDispatcher(numThreads);

/*
var wd = new BEWorkDispatcher(numThreads);
setInterval(function(){
		wd.submitJob({
				moduleName:'EmailClient',
				data:'aha'
			});
	}, 3000); 
wd.start();
*/


//module.exports = new BEWorkDispatcher;