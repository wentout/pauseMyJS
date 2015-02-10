var config = require('./config.js');

var p = require('path');
var express = require('express');
var app = express();

app.use( express.static( p.join( __dirname, 'static') ) );

app.get('/delay/:timeout', function(req, res) {
	var t = parseInt(req.params.timeout, 10);
	if (!t || isNaN(t) || (t < 0) || (t > 180000)) {
		t = 1;
	}
	setTimeout(function() {
		res.status(200).send('ok');
	}, t);
});

app.listen(config.port);
console.log('Server is listening on port: ', config.port);