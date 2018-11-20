var express = require('express');
var cors = require('cors');
var app = express();
var https = require('https');
var http = require('http');
var server = http.Server(app);
var bodyParser = require('body-parser');
var request = require('request');
var mymongo = require('./mymongo');


var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/mydb";

console.log('start my-server');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors());
app.options('*', cors());

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
});

app.post('/sportpoint', function(req, res){
	var ip = req.connection.remoteAddress;
	console.log('POST on /sportpoint from ' + ip);
	console.log(req.body);
	var data = req.body;

	mymongo.postData(data, function(json){
		res.json(json);
	});
});

server.listen(8080, function(){
    console.log('listening on: 8080');
});