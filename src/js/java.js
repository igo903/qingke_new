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

		let newNum = Number(platform.dataset.num);

		console.log(newNum);
	}

	let platforms = [...document.getElementsByName('job-platform')];

	document.getElementById('platforms').addEventListener('click', handleClick);
}());