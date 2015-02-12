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
		worker.onmessage = function(e, delta) {
			if (e.data == 'tick') {
				timer();
			}
			if (e.data[0] == 'pause') {
				makeCaption($seconds.val(), e.data[1]);
			}
		};
	} else {
		setInterval(timer, 1000);
	}
	
	var makeCaption = function(val, delta) {
		if (worker) {
			$caption.html('Timer was frozen at [ ' + delta + ' ] ms... But not UI, because window.Worker exists!');
		} else {
			$caption.html('Timer was frozen at [ ' + delta + ' ] ms... And UI too, because of no window.Worker...');
		}
	};
	
	$('#start')
	.on('click', function() {
		var val = parseInt($seconds.val()) || 1;
		$seconds.val(val);
		if (worker) {
			worker.postMessage(['pause', val]);
		} else {
			var t = Date.now();
			window.pause(val);
			makeCaption(val, Date.now() - t);
		}
	});
	
	$('#jqstart')
	.on('click', function() {
		var val = parseInt($seconds.val()) || 1;
		$seconds.val(val);
		$.pauseEverything(val);
		$caption.html('Timer was frozen at [ ' + val + ' ] seconds... And UI too, because of no $.pause runs in the main window...');
	});
	
});
}());