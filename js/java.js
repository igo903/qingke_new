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
			charBoxes[index].setAttribute('value', newNumChar);
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