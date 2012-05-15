if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {

	/**
	* Woohoo.. we have SVG support : )
	* Use D3.js to get data.json and render the charts
	*/ 

	d3.json("/assets/data/data.json", function(data) {

		var timeline, timeline_width = 500, timeline_height = 500; //Timeline SVG.
		var parse = d3.time.format("%b %Y").parse; // Parse Date function
		var items = []; // Current Items on the Timeline
		var queue = []; // Queue for timeline
	  	var rings_available = [];

	  	// Array of color functions
		var colors = {};
		colors.other = d3.interpolateRgb("#b21563","#ef1a84");
		colors.frontend = d3.interpolateRgb("#f39b1f","#ffca99");
		colors.backend = d3.interpolateRgb("#8bc243","#a6ff3d");
		colors.experience = d3.interpolateRgb("#1cb8e9","#8ae7ff");

		// Start and End Date for the graph
		var start_date = parse('Sep 1995');
		var end_date = new Date();
		end_date.setDate(end_date.getDate() + 280);

		// Time Scale for converting Dates to Radians
		var angle = d3.time.scale().domain([start_date, end_date]).range([0,2*Math.PI]);

		// Parse Dates & Calculate Rings
		var next_ring = 0;
		queue = _(data).flatten();

		_(queue).each(function(d,i) {

			//Parse Dates
			d.start_date = d.start ? parse(d.start) : null;
			if (!d.end) d.end = d.start;
			d.end_date = (d.end == "Present") ? new Date() : parse(d.end);

			//Calculate which ring to sit on
			d.ring = 0;
			while (d.start_date < rings_available[d.ring])
	    		d.ring++;
	    	rings_available[d.ring] = d.end_date;

	    	//
	    	d.id = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); 
	    	
		});

		// Now, calculate colors based on the ring position
		_(queue).each(function(d) { 
			color_func = d.group ? colors[d.group] : colors.experience;
			d.color = color_func(d.ring/rings_available.length);
			//d.color = color_func(0);
		});
		
	  	/**
		* Set up Timeline SVG
		*/ 	

		timeline = d3.select("#timeline").append("svg:svg")
			.attr('width', timeline_width)
			.attr('height', timeline_height)
			.append('g')
			.attr('transform', "translate("+((timeline_width/2) +0.5)+","+((timeline_height/2)+0.5)+")");

		timeline.append('text')
			.text('Timeline')
			.attr("text-anchor", "middle")
			.attr("dy", "0.4em");

		/**
		* Tooltip
		*/

		var tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip");

		/**
		* Arc Generator
		*/
		
		arc = d3.svg.arc()
			.innerRadius(function(d) { return 50 + (d.ring*14); })
			.outerRadius(function(d) { return 63 + (d.ring*14);	})
			.startAngle(function(d) { return angle(d.start_date); })
			.endAngle(function(d) { return d.start == d.end ? angle(d.start_date) + 0.03 : angle(d.end_date) });

		/**
		* Arc Tween Interpolator ... D3 Rocks!
		*/

		function arcTween(a) {
			var i = d3.interpolate({end_date: a.start_date}, a);
			return function(t) { return arc(i(t)); };
		}

	  	/**
		* Redraw Arcs
		*/
	  		
		function redraw() {
			
			g =  timeline.selectAll('g.arc')
				.data(items)
				.enter()
				.append('g')
				.attr('class', 'arc')
				

			var arcs = g.append('path')
				.attr('class', function(d) { return d.id })
				.attr('fill', function(d, i) { return d.color; })
				.each(function(d) { d.previous = d; });


			arcs.transition()
				.duration(1000)
				.attrTween("d", arcTween);

			arcs.on("mouseover", function(d) {
					d3.select('#skills .' + d.id).classed('active',true);
					show_tooltip(d)
				})
				.on("mouseout", function(d) {
					d3.select('#skills .' + d.id).classed('active',false);
					hide_tooltip()
				})
				.on("mousemove", position_tooltip);		
		}

		/** 
		*	Tooltip Functions
		*/

		function show_tooltip(d) {
			template = _.template('<p class="title"><%=name%></p><% if (description) { %><p class="description"><%=description%></p><% } %><p class="date"><%=start%> - <%=end%></p>');
			tooltip.html(template({name: d.name, start: d.start, end: d.end, description: d.description}));
			tooltip.classed("visible",true);
		}

		function hide_tooltip() {
			tooltip.classed("visible", false); //Hide Tooltip
		}

		function position_tooltip(event) {
			mx = d3.event.pageX;
			my = d3.event.pageY;
			tooltip.style("top", (my-10)+"px").style("left",(mx+10)+"px");
		}

		/**
		* Start Pushing Nodes to timeline, one at a time
		*/
	  	
		var timer = setInterval(function() {	 		
	  		if (queue.length) {
	  			node = queue.shift();
	  			items.push(node);
	  			redraw();
	  		}
	  		else {
	  			clearInterval(timer);
	  		}
	  	},100);

		/**
		* ... And finally, draw the skill list
		*/

		skill_list = _.chain(data.skills)
			.filter(function(d) { return d.rank; })
			.sortBy(function(d,i) { return d.group == 'frontend' ? i : i+100; })
			.value();

		var list = d3.select("#skills").append('ul');
		
		var li = list.selectAll("li")
			.data(skill_list)
			.enter()
			.append("li")
			.attr('class', function(d) { return d.id});
		
		li.append('span')
		 	.text(function(d) { return d.name; })
		 	.attr('class','label');	

		li.append('svg')
			.attr('width', 100)
			.attr('height', 8)
			.append('rect')
			.attr('width', 0)
			.attr('height', 8)
			.transition()
			.duration(1000)
			.attr('width', function(d) { return d.rank*10 })
			.attr('height', 8)
			.attr('fill', function(d,i) { return d.color });

		li.on("mouseover", function(d) {
				d3.select('#timeline .' + d.id).classed('active',true);
				show_tooltip(d);
			})
			.on("mouseout", function(d) {
				d3.select('#timeline .' + d.id).classed('active',false);
				hide_tooltip(d);
			})
			.on("mousemove", position_tooltip)	

	});

} else {

	/**
	* No SVG Support :(
	*/
	
	el = document.getElementById("timeline");
	el.innerHTML = '<p class="notice">Sorry, but your browser does not support inline SVG. Please use a modern browser such as Chrome, Safari, Firefox, Opera or Internet Explorer 9</p>';
}

