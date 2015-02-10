(function(){
$(function(){
	
	var $timer = $('#timer');
	$seconds = $('#seconds');
	$caption = $('#caption');
	
	var timer = function(){
		$timer.html( (new Date()).toString() );
	};
	timer();
	
	var worker = null;
	if (!!window.Worker) {
		var worker = new Worker('worker.js');
		worker.onmessage = function(e) {
			if (e.data == 'tick') {
				timer();
			}
			if (e.data == 'pause') {
				makeCaption($seconds.val());
			}
		};
	} else {
		setInterval(timer, 1000);
	}
	
	var makeCaption = function(val) {
		if (worker) {
			$caption.html('Timer was frozen at [ ' + val + ' ] seconds... But not UI, because window.Worker exists!');
		} else {
			$caption.html('Timer was frozen at [ ' + val + ' ] seconds... And UI too, because of no window.Worker...');
		}
	};
	
	$('#start')
	.on('click', function() {
		var val = parseInt($seconds.val()) || 1;
		$seconds.val(val);
		if (worker) {
			worker.postMessage(['pause', val]);
		} else {
			window.pause(val);
			makeCaption(val);
		}
	});
	
});
}());