var express = require('express'),
    app = express(),
    path = require('path');
    http = require('http');
    server = http.Server(app),
    io = require('socket.io')(server);


  app.set('views', path.join(__dirname, ''));
  app.set('view engine', require('ejs').renderFile);
  app.use(express.static(path.join(__dirname, '')));

app.get('/', function(req, res) {
  res.render('schat.html');
});

var numUsers = 0;

io.on('connection', function(socket){


  socket.on('new user', function(username){
    numUsers++;
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

server.listen(port, function() {
  console.log ('Started listening on port: ' + port);
});