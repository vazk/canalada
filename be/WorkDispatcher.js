// https://github.com/javascript/augment
// https://news.ycombinator.com/item?id=7243414
var augment = require("augment");
var JSONSocket = require('json-socket');
var ChildProcess = require('child_process');


WorkDispatcher = Object.augment(function() {
	
	this.constructor = function(numWorkers) {
		/// members for managing the worker processes
		this.numWorkers = numWorkers;
		this.workers = [];
		this.workerPool = [];
		/// members used for managing the actual work...
		this.submittedJobs = [];
		this.runningJobs = [];
	};

	this.start = function() {
		this.initializeWorkers();
		this.startServer();
	};

	this.submitJob = function(job) {
		//var id = Math.floor((Math.random()*numThreads)+1);
		console.log("S: submitting job ", job);
		var wrkr = this.workerPool.shift();
		if(wrkr === undefined) {
			this.submittedJobs.push(job);
		} else {
			wrkr.socket.sendMessage(job);
			this.sendJobToWorker(wrkr, job);
		}
	};

	this.signalWorkCompletion = function(workerId, status, output) {
		console.log('S: worker[', workerId, '] finished the job, status: ', status);
  		// find and release the worker
  		var wrkr = this.workers[workerId];
		this.workerAvailable(wrkr);
		// check the status and update the job accordingly
		if(status === 'ok') {

		} else {

		}
	};

	this.sendJobToWorker = function(wrkr, job) {
		this.runningJobs.push(job);
		wrkr.socket.sendMessage(job);
	};

	this.workerAvailable = function(wrkr) {
		console.log('S: worker [', wrkr.workerId, '] is available!');
		var job = this.submittedJobs.shift();
		if(job !== undefined) {
			//this.submitJob(job);
			this.sendJobToWorker(wrkr, job);
		} else {
			this.workerPool.push(wrkr);			
		}
	};

	this.initializeWorkers = function() {
		var context = this;
		for(var i = 0;  i < this.numWorkers; ++i) {
			var wrkr = ChildProcess.fork('Worker.js', [9999, i]);
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
			console.log("S: connected from: ", socket.remoteAddress);
			socket = new JSONSocket(socket);

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
		  			context.signalWorkCompletion(m.workerId, m.status, m.output);
		  		}
			});
			//this.workers[0].send("oy");
		});
		console.log("S: started listening to port: ", 9999);
		server.listen(9999);
	};
});

var numThreads = 1; 
module.exports = new WorkDispatcher(numThreads);

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