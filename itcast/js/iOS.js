
 $(document).ready(function(){
 	$('.chapter').click(function(){
 		$(this).siblings().toggle();
 		$(this).children('.period-show').children().toggleClass('fa-minus').toggleClass('fa-plus');
 	});
 	$('.period').mouseenter(function(){
 		$(this).css('background','#f5f5f5')
 	});
 	$('.period').mouseleave(function(){
 		$(this).css('background','#fff')
 	})
 })
