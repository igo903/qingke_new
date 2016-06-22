"use strict";

jQuery(document).ready(function ($) {
	$("#focus").royalSlider({
		// options go here
		// as an example, enable keyboard arrows nav
		autoHeight: true,
		keyboardNavEnabled: true,
		loop: true,
		transitionType: 'fade',
		arrowsNav: false,
		addActiveClass: true,
		sliderDrag: false,
		autoPlay: {
			// autoplay options go gere
			enabled: true,
			pauseOnHover: true,
			delay: 2000
		}
	});

	$("#courses").royalSlider({
		keyboardNavEnabled: true,
		controlNavigation: 'none',
		loopRewind: true,
		sliderDrag: false,
		autoHeight: true
	});

	$('#teachers').royalSlider({
		arrowsNav: false,
		loopRewind: true,
		navigateByClick: false,
		sliderDrag: false,
		transitionSpeed: 400
	});
});

(function () {
	// boring.tab('focus-tabs');
})();

(function () {
	var videoDialog = boring.dialog('student-dialog', {
		onclose: function onclose() {
			studentPlayer.pause();
		}
	}),
	    studentPlayer = videojs('student-video'),
	    STUDENT_CLASS = 'j-student';

	document.getElementById('students').addEventListener('click', function (e) {
		var student = boring.bubbleElement(e.target, function (el) {
			return el.classList.contains(STUDENT_CLASS);
		});

		if (student) {
			e.preventDefault();
			studentPlayer.src(student.href);
			studentPlayer.play();
			videoDialog.open();
		}
	});
})();