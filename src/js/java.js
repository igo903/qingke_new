(function () {
	new Swiper('#cover', {
		effect: 'fade',
		simulateTouch: false,
		autoplay: 3000,
		speed: 1000
	});
}());

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
			let charBox = charBoxes[index];
			charBox.setAttribute('value', newNumChar);
			charBox.innerHTML = newNumChar;
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

(() => {
	function scroll() {
		if (el.offsetHeight <= el.parentNode.offsetHeight) {
			return;
		}

		scrollData.top = 0;
		keepScroll();

		el.onmouseenter = pauseScroll;
		el.onmouseleave = keepScroll;
	}

	function keepScroll(ts) {
		scrollData.top -= SPEED;
		el.style.cssText += `; transform: translateY(${scrollData.top}px);`;
		addRow();

		scrollData.id = requestAnimationFrame(keepScroll);
	}

	function pauseScroll() {
		cancelAnimationFrame(scrollData.id);
	}

	function addRow() {
		let preparadRow = el.rows[scrollData.addedTimes];

		if (Math.abs(scrollData.top) >= (scrollData.addedTimes + 1) * preparadRow.offsetHeight) {
			el.tBodies[0].appendChild(preparadRow.cloneNode(true));
			scrollData.addedTimes++;
		}
	}

	const SPEED = 0.5;

	let el = document.getElementById('students-data');

	let scrollData = {
		id: 0,
		top: 0,
		addedTimes: 0
	};

	scroll();
})();