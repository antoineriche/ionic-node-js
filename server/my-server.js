var express = require('express');
var cors = require('cors');
var app = express();
var https = require('https');
var http = require('http').Server(app);
var bodyParser = require('body-parser');


console.log('start my-server');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors());
app.options('*', cors());

app.get('/', function(req, res) {
	console.log('someone is getting');

	https.get('https://jsonplaceholder.typicode.com/todos', (resp) => {
		let data = '';

	  	resp
	  		.on('data', (chunk) => data += chunk)
			.on('end', () => res.json(JSON.parse(data)))
	  		.on("error", (err) => console.log("Error: " + err.message));
	});
});

http.listen(8080, function(){
    console.log('listening on: 8080');
});