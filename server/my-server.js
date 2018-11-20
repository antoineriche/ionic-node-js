var express = require('express');
var cors = require('cors');
var app = express();
var https = require('https');
var http = require('http');
var server = http.Server(app);
var bodyParser = require('body-parser');
var request = require('request');


console.log('start my-server');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors());
app.options('*', cors());

app.get('/', function(req, res) {
	var ip = req.connection.remoteAddress;
	console.log(ip + ' is getting');
	
	var url = "http://odata.bordeaux.fr/v1/databordeaux/poisport/?format=json";
	
	http.get(url, (resp) => {
		let data = '';
		let jsonResp = {};

	  	resp
	  		.on('data', (chunk) => data += chunk)
			.on('end', () => {
				try {
					jsonResp.data = JSON.parse(data);
					jsonResp.success = true;
				} catch(error){
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
});

server.listen(8080, function(){
    console.log('listening on: 8090');
});