jQuery(document).ready(function($){

// COVER PAGE

    // click explore to close overlay
    $('#explore').on('click', function(event){
        event.preventDefault();
        $("#vidtop-content").fadeOut(1000);
        $(".overlay").fadeOut(3000,function(){
          $('iframe').attr('src', '');
          $(".overlay").remove();
        });
    });

// RESPONSIVE NAVIGATION //

    {
    var menu = document.getElementById('menu'),
        WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';

    function toggleHorizontal() {
        [].forEach.call(
            document.getElementById('menu').querySelectorAll('.custom-can-transform'),
            function(el){
                el.classList.toggle('pure-menu-horizontal');
            }
        );
    };

    function toggleMenu() {
        // set timeout so that the panel has a chance to roll up
        // before the menu switches states
        if (menu.classList.contains('open')) {
            setTimeout(toggleHorizontal, 500);
        }
        else {
            toggleHorizontal();
        }
        menu.classList.toggle('open');
        document.getElementById('toggle').classList.toggle('x');
    };

    function closeMenu() {
        if (menu.classList.contains('open')) {
            toggleMenu();
        }
    }

    document.getElementById('toggle').addEventListener('click', function (e) {
        toggleMenu();
    });

    window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);
    };

// SIDE PANEL //

	//open the side panel
	$('#side-menu-about').on('click', function(event){
		event.preventDefault();
		$('.panel').addClass('is-visible');
        $(".panel").load("about-panel.html");
	});
    /*$('#side-menu-borders').on('click', function(event){
        event.preventDefault();
        $('.panel').addClass('is-visible');
        $(".panel").load("borders-panel.html");
    });
    $('#side-menu-sensors').on('click', function(event){
        event.preventDefault();
        $('.panel').addClass('is-visible');
        $(".panel").load("sensors-panel.html");
    });*/

	//close the side panel
	$('.panel').on('click', function(event){
		if( $(event.target).is('.panel') || $(event.target).is('.panel-close') ) {
			$('.panel').removeClass('is-visible');
			event.preventDefault();
		}
	});


// BASTA //

});
