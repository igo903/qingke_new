'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
	function handleClick(e) {
		var t = e.target;

		if (platforms.indexOf(t) !== -1) {
			updateNum(t);
		}
	}

	function updateNum(platform) {
		if (typeof platform === 'number') {
			platform = platforms[platform];
		}

		var newNumChars = platform.dataset.num;
		var fixedZeros = '';

		for (var i = charBoxes.length - newNumChars.length; i > 0; i--) {
			fixedZeros += '0';
		}

		newNumChars = fixedZeros + newNumChars;
		newNumChars.split('').forEach(function (newNumChar, index) {
			var charBox = charBoxes[index];
			charBox.setAttribute('value', newNumChar);
			charBox.innerHTML = newNumChar;
		});
	}

	var platforms = [].concat(_toConsumableArray(document.getElementsByName('job-platform')));
	var charBoxes = [].concat(_toConsumableArray(document.getElementsByClassName('j-jobs-num-char')));

	document.getElementById('platforms').addEventListener('click', handleClick);
	updateNum(0);
})();

(function () {
	function handleClick(e) {
		var teacher = boring.bubbleElement(e.target, function (el) {
			return el.classList.contains('j-teacher');
		});

		if (teacher) {
			updateTeacherIntro(teacher);
		}
	}

	function updateTeacherIntro(teacher) {
		teacherIntroBox.innerHTML = teacher.dataset.intro;
	}

	var teacherIntroBox = document.getElementById('teacher-intro');

	document.getElementById('teachers').addEventListener('click', handleClick);
})();

(function () {
	function handleTabShow(e) {
		pauseScroll();
		scroll(findEl(e.target));
	}

	function findEl(target) {
		return target ? document.getElementById(target.getAttribute('href').slice(1)).getElementsByClassName(TABLE_CLASS)[0] || null : null;
	}

	function scroll(el) {
		if (!el || el.offsetHeight <= el.parentNode.offsetHeight) {
			return;
		}

		scrollData.el = el;
		scrollData.top = 0;
		keepScroll();

		el.onmouseenter = pauseScroll;
		el.onmouseleave = keepScroll;
	}

	function keepScroll(ts) {
		scrollData.top -= SPEED;
		scrollData.el.style.cssText += '; transform: translateY(' + scrollData.top + 'px);';
		addRow();

		scrollData.id = requestAnimationFrame(keepScroll);
	}

	function pauseScroll() {
		cancelAnimationFrame(scrollData.id);
	}

	function addRow() {
		var preparadRow = scrollData.el.rows[scrollData.addedTimes];

		if (Math.abs(scrollData.top) >= (scrollData.addedTimes + 1) * preparadRow.offsetHeight) {
			scrollData.el.tBodies[0].appendChild(preparadRow.cloneNode(true));
			scrollData.addedTimes++;
		}
	}

	var SPEED = 0.5;
	var TABLE_CLASS = 'j-scrolled-table';

	var scrollData = {
		el: null,
		id: 0,
		top: 0,
		addedTimes: 0
	};

	$('#students-data [data-toggle="tab"]').on('shown.bs.tab', handleTabShow);
	$('#students-data [data-toggle="tab"]:first').tab('show');
})();