(function () {
	'use strict';

	(function () {
		var
			TAB_ID = 'detail',
			tab = boring.tab(TAB_ID),
			tabEl = document.getElementById(TAB_ID);

		document.getElementById('consult').addEventListener('click', function () {
			tab.go(1);
			tabEl.scrollIntoView();
		});
	}());
}());