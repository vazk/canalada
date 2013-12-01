function init() {

  var serverBaseUrl = document.domain;

  /* 
   On client init, try to connect to the socket.IO server.
   Note we don't specify a port since we set up our server
   to run on port 8080
  */
  var socket = io.connect(serverBaseUrl);

  //We'll save our session ID in a variable for later
  var sessionId = '';
  /*
 When the client successfuly connects to the server, an
 event "connect" is emitted. Let's get the session ID and
 log it.
  */
  socket.on('connect', function () {
    sessionId = socket.socket.sessionid;
    console.log('Connected ' + sessionId);  

    socket.emit('requestSaveCanal', {name: 'blabla', canal: {pam: 'parampampam'}}); 
    socket.emit('requestReadCanal', {name: 'blabla'}); 

  });
  socket.on('responseReadCanal', function(cdata) {
    console.log(cdata);
  });


 
}

$(document).on('ready', init);