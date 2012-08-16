(function($) {
  
	function init() {

		// Delay activation each tile
		$(".portfolio").find(".tile").each(function(index,element) {
			setTimeout((function(element) {
				return function() {
					$(element).addClass("show");
				}   
			})(element), 120 + index * 100);
      	});

		// Bind Tile clicks
		$("a.tile").on("click.portfolio", function(event) {
			event.preventDefault();
			event.stopPropagation();
			var id = $(this).attr("href");
			showProject(id);					
		});

		// Bind Next & Previous Button clicks
		$(".next").on("click.portfolio", function(event) {
			event.stopPropagation();
			nextProject();
		});

		$(".prev").on("click.portfolio", function(event) {
			event.stopPropagation();
			previousProject();			
		});

		// Reset Everything on document click or touch
		$(document).on("click.portfolio touchend.portfolio", reset);

		//Bind Keys
		$(document).on("keyup.portfolio",function(e){
            
            if(e.which == 27){
            	reset();
            }

            if (e.keyCode == 13) {
            	var id = "#pr1";
            	if ($(".projects").hasClass("projects-active"))
            		reset();
            	else
            		showProject(id);	
            }

            if (e.keyCode == 37) {
            	previousProject();
            }

            if (e.keyCode == 39) {
            	nextProject();
            }

        });

	}

  	function showProject(id) {
		$(".projects").addClass("projects-active");
		$(id).addClass("project-active");
		$(".tiles").addClass("inactive");
		$(id).nextAll(".project").addClass("hide-right");	
		$(id).prevAll(".project").addClass("hide-left");
	}

	function nextProject() {
		next = $(".project-active").next();
		if (next.length) {
			$(".project-active").removeClass("project-active").addClass("hide-left");
			next.removeClass("hide-right").addClass("project-active");
		}
	}

	function previousProject() {
		prev = $(".project-active").prev();
		if (prev.length) {
			$(".project-active").removeClass("project-active").addClass("hide-right");;
			prev.removeClass("hide-left").addClass("project-active");
		}
	}

	function reset() {
		$(".projects").removeClass("projects-active");
		$(".project").removeClass("project-active hide-left hide-right");
		$(".tiles").removeClass("inactive");
	}


	// Only initialise if browser support transitions. An alternate style for the 
	// portfolio us defined using modernizr's css classes.
	if (Modernizr.opacity && Modernizr.csstransforms) {

		// Start on window.load after all the images have loaded.
		$(window).load(function() {
			init();
		});
	}
   
                     
})(jQuery);
