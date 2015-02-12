var config = require('./config.js');

var p = require('path');
var http = require('http');
var express = require('express');
var app = express();

var done = 0;
var processing = 0;
var logHash = null;

var hash = {};
var rand_str = (function () {
	var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return function (len) {
		!len && (len = 8);
		var str = '';
		for (var i = 0; i < len; i++) {
			str += r[(Math.floor(Math.random() * 62))];
		}
		return str;
	}
}());
var gen = function() {
	var str = rand_str();
	if (hash[str]) {
		return gen();
	}
	return str;
};

var lastRequest = Date.now();

var st = function(h, t) {
	return function() {
		setTimeout( function() {
			
			var res = hash[h];
			
			// res.status(200).send('ok');
			res.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': '2'});
			res.end('ok');
			
			processing--;
			lastRequest = Date.now();
			done++;
			delete hash[h];
			
		}, t).unref();
	};
};
// app.get('/delay/:timeout', 
// });

var delay = function(t, res) {
	// var t = parseInt(req.params.timeout, 10);
	var t = parseInt( t, 10 );
	if (!t || isNaN(t) || (t < 0) || (t > 180000)) {
		t = 1;
	}
	processing++;
	logHash = true;
	var h = gen();
	hash[h] = res;
	st(h, t)();
	lastRequest = Date.now();
};

setInterval(function() {
	var delta = Date.now() - lastRequest;
	if (delta < 5000) {
		console.log('Done: ', done, '   Processing: ', processing);
	} else {
		if (delta > 200000) {
			if (logHash === true) {
				logHash = false;
				console.log( 'Hash Length:',  Object.keys(hash).length );
			}
		}
	}
}, 5000);

app.use( express.static( p.join( __dirname, 'static') ) );

var tester = /\/delay\/[0-9]+/;
var server = http.createServer( function (req, res) {
	if ( tester.test( req.url ) ) {
		delay ( req.url.split('/delay/')[1], res );
	} else {
		app (req, res);
	}
});
server.listen( 3000 );
// app.listen(config.port);

console.log('Server is listening on port: ', config.port);

process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);
});