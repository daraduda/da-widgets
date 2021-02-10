$(document).ready(function() {
	$(".main-div").hover(function () {
		$(this).children('.sub-div').fadeIn();
	},
		function() {
			$(this).children('.sub-div').fadeOut();
	});
});