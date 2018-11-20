var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');


console.log('start my-server');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cors());
app.options('*', cors());

app.get('/', function(req, res) {
	console.log('someone is getting');
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.json({foo:'bar'});
});

http.listen(8080, function(){
    console.log('listening on: 8080');
});