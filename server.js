var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');
var path = require('path');

var numUsers = 0;

app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('schat.html');
});

io.set('heartbeat timeout', 5);

io.on('connection', function(socket){
  numUsers++;
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
