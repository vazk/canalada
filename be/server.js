var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io").listen(http);
var _ = require("lodash");
var fs = require("fs");

app.set("ipaddr", "127.0.0.1");
app.set("port", 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.use(express.bodyParser());
//app.use(express.static(__dirname + "/../fe"));
app.use(express.static(__dirname + "/.."));
//app.use(express.static(__dirname + "/../fe/tpt"));


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


app.get("/", function(req, res) {
	res.render("canal");
});

io.on('connection', function(socket) {
	socket.on('disconnect', function() {
		//participants = _.without(participants, _.findWhere(participants, {id:socket.id}));
		//io.sockets.emit("userDisconnected", {id: socket.id, sender: "system"});
	});
	socket.on('requestCanalSave', function(cdata) {
    	//io.sockets.emit("nameChanged", {id: data.id, name: data.name});
    	console.log("wrote: " + cdata);
    	var fileName = cdata.id + ".canal";
    	fs.writeFile(fileName, JSON.stringify(cdata), function (err) {
  			if (err) 
  				console.log(err);
  			else 
  				console.log("successfully wrote {0}".format(fileName));
		});
    });
	socket.on('requestCanalLoad', function(cdata) {
 		var fileName = cdata.id + ".canal";
	 	fs.readFile(fileName, function (err, data) {
  			if (err) {
  				console.log('Error: failed to load the canal-file {0}'.format(fileName));
  			} else {
  				console.log('read: ' + data);
  				socket.emit('responseCanalLoad {0}'.format(JSON.parse(data)));
  			}
		});
	});
	socket.on('requestCanalDelete', function(cdata) {
 		var fileName = cdata.id + ".canal";
	 	fs.unlink(fileName, function (err, data) {
  			if (err) {
  				console.log('Error: failed to delete the canal-file {0}'.format(fileName));
  			}
		});
	});
  socket.on('requestCanalEnable', function(cdata) {
    console.log('canal {0} state enable: {1}'.format(cdata.id, cdata.enable));
  });
});



http.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Goto http://" + app.get("ipaddr") + ":" + app.get("port"));
});