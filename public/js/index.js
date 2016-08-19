$(function() {
	$.backstretch([
		"./img/turntable.jpg", "./img/harmonica.jpg", "./img/turntable.jpg"
	], {
		duration: 3000,
		fade: 750
	});
	var top = $(window).height()/2 - 64;
	$("#begin").css("top",top+"px");
})