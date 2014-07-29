var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var numUsers = 0;
var path = require('path');

io.on('connection', function(socket){
	numUsers++;
  console.log('a user connected');

	socket.on('new user', function(username){
    io.emit('new user', numUsers);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// app.use(cors());
app.engine('html', require('ejs').renderFile);
app.use('/client', express.static(__dirname + '../client'));
app.set('views', path.join(__dirname, '../client'));

app.get('/', function(req, res) {
  res.render('schat.html');
});

// //app.set('port', process.env.PORT || 3000);
// app.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, ContactCenterId, Content-Type');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     next();
// });

// app.post('/dictionary', function(req, res) {
//     res.send(req.body);
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
