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

		var newNum = Number(platform.dataset.num);

		console.log(newNum);
	}

	var platforms = [].concat(_toConsumableArray(document.getElementsByName('job-platform')));

	document.getElementById('platforms').addEventListener('click', handleClick);
})();