var portfolio = {

	init: function() {
		
		// Delay activation each tile
		for(var i = 0; i <8; i++) {
			setTimeout((function(d) { 

				return function() {
					$(".tile").eq(d).addClass("show");
				}
				
			})(i),120 + i * 100);
		}

		// Bind Tile clicks
		$("a.tile").click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			var id = $(this).attr("href");
			portfolio.showProject(id);					
		});

		// Bind Next & Previous Button clicks
		$(".next").click(function(event) {
			event.stopPropagation();
			portfolio.nextProject();
		});

		$(".prev").click(function(event) {
			event.stopPropagation();
			portfolio.previousProject();			
		});

		// Reset Everything on document click
		$(document).click(function() {
			portfolio.reset();
		});

		//Bind Keys
		$(document).keyup(function(e){
            
            if(e.which == 27){
            	portfolio.reset();
            }

            if (e.keyCode == 13) {
            	var id = "#pr1";
            	if ($(".projects").hasClass("projects-active"))
            		portfolio.reset();
            	else
            		portfolio.showProject(id);	
            }

            if (e.keyCode == 37) {
            	portfolio.previousProject();
            }

            if (e.keyCode == 39) {
            	portfolio.nextProject();
            }

         });
	},

	showProject: function(id) {
		$(".projects").addClass("projects-active");
		$(id).addClass("project-active");
		$(".tiles").addClass("inactive");
		$(id).nextAll(".project").addClass("hide-right");	
		$(id).prevAll(".project").addClass("hide-left");
	},

	nextProject: function() {
		next = $(".project-active").next();
		if (next.length) {
			$(".project-active").removeClass("project-active").addClass("hide-left");
			next.removeClass("hide-right").addClass("project-active");
		}
	},

	previousProject: function() {
		prev = $(".project-active").prev();
		if (prev.length) {
			$(".project-active").removeClass("project-active").addClass("hide-right");;
			prev.removeClass("hide-left").addClass("project-active");
		}
	},

	reset: function() {
		$(".projects").removeClass("projects-active");
		$(".project").removeClass("project-active hide-left hide-right");
		$(".tiles").removeClass("inactive");
	}

};

	
$(window).load(function() {

	// Only initialise if browser support transitions. An alternate style for the 
	// portfolio us defined using modernizr's css classes.

	if (Modernizr.opacity && Modernizr.csstransforms) {
		portfolio.init();
	}
});