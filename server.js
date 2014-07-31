var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io').listen(server);

// Configuration
  app.set('views', __dirname);
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname));


// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);

// Routes

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

app.get('/', 'schat.html');

var status = "All is well.";

var numUsers = 0;

io.sockets.on('connection', function (socket) {
  numUsers++;
  socket.on('new user', function(username){
    io.sockets.emit('new user', numUsers);
  });

  socket.on('disconnect', function(){
    numUsers--;
    io.sockets.emit('new user', numUsers);
    //console.log('disconnected');
  });

  socket.on('chat message', function(msg){
    io.sockets.emit('chat message', msg);
  });
});




io.on('connection', function(socket){
  
  //console.log('connected');

  socket.on('new user', function(username){
    io.emit('new user', numUsers);
  });

  socket.on('disconnect', function(){
    numUsers--;
    io.emit('new user', numUsers);
    //console.log('disconnected');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


var port = process.env.PORT || 5000;

server.listen(port, process.env.IP);