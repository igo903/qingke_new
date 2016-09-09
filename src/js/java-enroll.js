function handleClick(e) {
	e.preventDefault();
	closeEnroll();
}

function closeEnroll() {
	document.body.classList.add(NO_FIXED_BOTTOM_CLASS);
}

function init() {
	document.getElementById('enroll-close').addEventListener('click', handleClick);
}

const NO_FIXED_BOTTOM_CLASS = 'no-fixed-bottom';

export default {
	init
};