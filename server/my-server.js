var express = require('express');
var cors = require('cors');
var app = express();
var https = require('https');
var http = require('http');
var server = http.Server(app);
var bodyParser = require('body-parser');
var ent = require('ent');
var request = require('request');
var mymongo = require('./mymongo');
var chatsocket = require('./chatsocket');
var io = require('socket.io')(server);
var session = require("express-session")({
    secret: "my-chat-js",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

console.log('start my-server');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors());
app.options('*', cors());

// Use express-session middleware for express
app.use(session);

app.get('/', function(req, res){
	var ip = req.connection.remoteAddress;
	console.log('GET / from ' + ip);
	
	var url = "http://odata.bordeaux.fr/v1/databordeaux/poisport/?format=json";

	http.get(url, (resp) => {
		let data = '';
		let jsonResp = {};

	  	resp
	  		.on('data', (chunk) => data += chunk)
			.on('end', () => {
				try {
					jsonResp.data = []
					JSON.parse(data).d.forEach(function(json, index){
						jsonResp.data.push(json);
					});
					// jsonResp.data = JSON.parse(data.d);
					// console.log(jsonResp.data);
					console.log(jsonResp.data.length + ' points.');
					jsonResp.success = true;
				} catch(error){
					console.log(error);
					jsonResp.success = false;
					jsonResp.error = { message: error.message };
				} finally {
					res.json(jsonResp);
				}
			})
	  		.on("error", (err) => {
	  			console.log("Error: " + err.message);	
	  			jsonResp.success = false;
	  			jsonResp.error = { message: err.message };
	  			res.json(jsonResp)
	  		});
	});
})
.get('/posts', function(req, res){
	var ip = req.connection.remoteAddress;
	var userId = req.params.userId;
	console.log('GET /posts from ' + ip);

	mymongo.getAllPosts(function(jsonArray){
		console.log(jsonArray.data.length + ' posts.');
		res.json(jsonArray);
	});
})
.get('/posts/:userId', function(req, res){
	var ip = req.connection.remoteAddress;
	var userId = req.params.userId;
	console.log('GET /posts/' + userId + ' from ' + ip);

	mymongo.getUserPosts(userId, function(jsonArray){
		console.log(jsonArray.data.length + ' posts for user ' + userId + '.');
		res.json(jsonArray);
	});
})
.post('/posts', function(req, res){
	var ip = req.connection.remoteAddress;
	console.log('POST on /posts from ' + ip);
	console.log(req.body);
	var data = req.body;

	mymongo.postData(data, function(json){
		res.json(json);
	});
});


//Use shared session middleware for socket.io setting autoSave:true
io.use(sharedsession(session, {autoSave:true}));

io.on('connection', (socket) => {
	console.log('new user connected');

	socket.on('chat-login', function(login){
		// var login = ent.encode(login);
		socket.handshake.session.login = login;
	    socket.handshake.session.save();
	    if(login != 'server'){
			console.log('anonymous is: ' + login);
			var msg = chatsocket.signInMessage(login);
			io.emit(chatsocket.CHAT_INFO, msg);
		} else {
			console.log('forbidden login: ' + login);
			var msg = chatsocket.forbiddenLoginMessage(login);
			socket.emit(chatsocket.CHAT_ERROR, msg);
		}
	});

	socket.on('log-out', function(){
		var login = socket.handshake.session.login;
		console.log(login + ' logged out.');
		if(login){
			var msg = chatsocket.signOutMessage(login);
			io.emit(chatsocket.CHAT_INFO, msg);
		}
	});

	socket.on('disconnect', function(){
		console.log('onDisconnect');
	})

	socket.on('chat-message', function(msg){
		var login = socket.handshake.session.login;
		// var msg = ent.encode(msg);
		if(login){
			console.log(login + ': ' + msg);
			var msg = chatsocket.newChatMessage(login, msg);
			socket.broadcast.emit(chatsocket.CHAT_MSG, msg);
		} else {
			console.log("Can't forward message: unknown client.");		
			var msg = chatsocket.unknownClient();
			socket.emit(chatsocket.CHAT_ERROR, msg);
		}
	});
});

server.listen(8080, function(){
    console.log('listening on: 8080');
});