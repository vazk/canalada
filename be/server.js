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
app.use(express.static(__dirname + "/../fe"));
//app.use(express.static(__dirname + "/../fe/tpt"));



app.get("/", function(req, res) {
	res.render("canal");
});

io.on('connection', function(socket) {
	socket.on('disconnect', function() {
		//participants = _.without(participants, _.findWhere(participants, {id:socket.id}));
		//io.sockets.emit("userDisconnected", {id: socket.id, sender: "system"});
	});
	socket.on('requestSaveCanal', function(cdata) {
    	//_.findWhere(participants, {id: socket.id}).name = data.name;
    	//io.sockets.emit("nameChanged", {id: data.id, name: data.name});
    	console.log("wrote: " + cdata);
    	var fileName = cdata.name + ".canal";
    	fs.writeFile(fileName, JSON.stringify(cdata), function (err) {
  			if (err) 
  				console.log(err);
  			else 
  				console.log("successfully wrote " + fileName);
		});
    });
	socket.on('requestReadCanal', function(cdata) {
		//participants.push({id: data.id, name: data.name});
		//io.sockets.emit("newConnection", {participants:participants});
		var fileName = cdata.name + ".canal";
	 	fs.readFile(fileName, function (err, data) {
  			if (err) throw err;
  			console.log("read: " + data);
  			socket.emit('responseReadCanal', JSON.parse(data));
		});
	});
});



http.listen(app.get("port"), app.get("ipaddr"), function() {
	console.log("Goto http://" + app.get("ipaddr") + ":" + app.get("port"));
});