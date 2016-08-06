(function () {
	function handleClick(e) {
		let t = e.target;

		if (platforms.indexOf(t) !== -1) {
			updateNum(t);
		}
	}

	function updateNum(platform) {
		if (typeof platform === 'number') {
			platform = platforms[platform];
		}

		let newNumChars = platform.dataset.num;
		let fixedZeros = '';

		for (let i = charBoxes.length - newNumChars.length; i > 0; i--) {
			fixedZeros += '0';
		}

		newNumChars = fixedZeros + newNumChars;
		newNumChars.split('').forEach((newNumChar, index) => {
			charBoxes[index].setAttribute('value', newNumChar);
		});
	}

	let platforms = [...document.getElementsByName('job-platform')];
	let charBoxes = [...document.getElementsByClassName('j-jobs-num-char')];

	document.getElementById('platforms').addEventListener('click', handleClick);
	updateNum(0);
}());

(function () {
	function handleClick(e) {
		let teacher = boring.bubbleElement(e.target, (el) => (el.classList.contains('j-teacher')));

		if (teacher) {
			updateTeacherIntro(teacher);
		}
	}

	function updateTeacherIntro(teacher) {
		teacherIntroBox.innerHTML = teacher.dataset.intro;
	}

	let teacherIntroBox = document.getElementById('teacher-intro');

	document.getElementById('teachers').addEventListener('click', handleClick);
}());