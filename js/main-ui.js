jQuery(document).ready(function($){


// MENU //

$(".menu-hover").on({
    'mouseenter': function (e) {
        e.stopPropagation();
                    var $lefty = $(".side-menu");
                        $lefty.animate({
                        left: parseInt($lefty.css('left')) < -195 ?
                        $lefty.css('left') === 0 :
                        -95},200,'swing');
                   }
});
$('.menu-hover').on({
    'mouseleave': function(){
        var $lefty = $(".side-menu");
            $lefty.animate({
            left: -196
        },200,'swing');
    }
});


// PANEL //

	//open the lateral panel
	$('#side-menu-about').on('click', function(event){
		event.preventDefault();
		$('.panel').addClass('is-visible');
	});
	//close the lateral panel
	$('.panel').on('click', function(event){
		if( $(event.target).is('.panel') || $(event.target).is('.panel-close') ) {
			$('.panel').removeClass('is-visible');
			event.preventDefault();
		}
	});


// TABS //

	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});


// END

});