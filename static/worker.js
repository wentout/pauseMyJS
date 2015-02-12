var getXmlHttp = function () {
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
};

var delay = function (timeout) {
	var xmlhttp = getXmlHttp();
	xmlhttp.open('GET', '/delay/' + timeout, false);
	var stamp = Date.now();
	xmlhttp.send(null);
	delta = (Date.now() - stamp);
	return delta;
};

var pause = function (seconds) {
	return delay (seconds * 1000);
};

pause.ms = function (ms) {
	return delay (ms);
};

onmessage = function(e) {
	if (e.data[0] == 'pause') {
		var delta = pause(e.data[1]);
		postMessage(['pause', delta]);
	}
};

var intMsg = function() {
	postMessage('tick');
};
setInterval(intMsg, 1000);