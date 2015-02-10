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
	t = (Date.now() - stamp);
	return t;
};

var pause = function (seconds) {
	return delay (seconds * 1000);
};

pause.ms = function (ms) {
	return delay (ms);
};

onmessage = function(e) {
	if (e.data[0] == 'pause') {
		pause(e.data[1]);
		postMessage('pause');
	}
};

var intMsg = function() {
	postMessage('tick');
};
setInterval(intMsg, 1000);