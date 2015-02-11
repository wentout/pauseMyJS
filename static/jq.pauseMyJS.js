(function($){

	var delay = function ( delay ) {
		var url = '/delay/' + delay;
		var t = delay;
		$.ajax({
			url: url,
			async: false,
			complete: function() {}
		});
		return t;
	};
	
	var pause = function (seconds) {
		return delay (seconds * 1000);
	};
	pause.ms = function (ms) {
		return delay (ms);
	};
	
	$.pauseEverything = pause;

}(jQuery));