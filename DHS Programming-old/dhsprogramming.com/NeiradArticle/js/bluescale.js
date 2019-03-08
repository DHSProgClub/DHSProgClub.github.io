/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$(document).ready(function(){
	$(".btn").mouseenter(function(){
		$(".brand-heading").css("opacity", "1");
		$(".intro-text").css("opacity", "1");
	})
	.mouseleave(function(){
		$(".brand-heading").css("opacity", ".75");
		$(".intro-text").css("opacity", ".75");
	});
	
	
	$(document).on('keydown', function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code === 78){
			
			if($("#light_or_dark").attr("href") === "NeiradArticle/css/NeiradStyleLite.css"){
				$("#light_or_dark").attr("href", "NeiradArticle/css/NeiradStyle.css");
			}
			else{
				$("#light_or_dark").attr("href", "NeiradArticle/css/NeiradStyleLite.css");
			}
		}
	});
});
