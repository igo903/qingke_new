(function () {
	//********** Headroom js functionality **********/
		// grab an element
		var myElement = document.querySelector(".navbar");
		// construct an instance of Headroom, passing the element
		var headroom  = new Headroom(myElement, { offset: 65 });
		// initialise
		headroom.init();


	  $('document').ready(function(){


			$('.dropdown').hover(function(){
				$(this).addClass('open');
			}, function(){
				$(this).removeClass('open');
			});


		$('#nav-toggle').click(function(){
			$(this).toggleClass('active');
			$('.navbar-collapse').toggle();
			$('body').toggleClass('nav-open');
		});

		$('#mobile-subnav').click(function(){
			if($('.second-nav .navbar-left').css('display') == 'block'){
				$('.second-nav .navbar-left').slideUp(function(){
					$(this).addClass('not-visible');
				});
				$(this).html('<i class="fa fa-bars"></i> Open Submenu');
			} else {
				$('.second-nav .navbar-left').slideDown(function(){
					$(this).removeClass('not-visible');
				});
				$(this).html('<i class="fa fa-close"></i> Close Submenu');
			}

		});

	  });
}());

(function () {
	var loginDialog = boring.dialog('loginDialog'),
		regDialog = boring.dialog('regDialog');

	$('.j-login-btn').on('click', function () {
		loginDialog.open();
	});

	$('.j-reg-btn').on('click', function () {
		regDialog.open();
	});
}());

(function () {
	var NOT_AT_TOP_CLASS = 'not-at-top',
		bodyCl = document.body.classList;

	window.addEventListener('scroll', function () {
		if (document.body.scrollTop + document.documentElement.scrollTop > 0) {
			bodyCl.add(NOT_AT_TOP_CLASS);
		} else {
			bodyCl.remove(NOT_AT_TOP_CLASS);
		}
	});

	document.getElementById('to-top').addEventListener('click', function () {
		window.scrollTo(0, 0);
	});
}());