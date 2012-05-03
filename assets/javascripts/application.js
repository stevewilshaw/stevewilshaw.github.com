d3.json("/assets/data/data.json", function(data) {

	var parse = d3.time.format("%b %Y").parse;
	var items = []; 
	var queue = [];
  	var rings_available = [];

  	var skill_colors = d3.interpolateRgb("#f39b1f","#ffca99");
	var skill_colors3 = d3.interpolateRgb("#1cb8e9","#8ae7ff");
	var skill_colors2 = d3.interpolateRgb("#8bc243","#a6ff3d");


	var skill_colors2_highlight = d3.interpolateRgb("#8bc243","#a6ff3d");

	// Parse Data

  	//skills = _(skills).sortBy(function(d){ return parse(d.start); });
  	//skills = _(skills).sortBy(function(d){ return d.group; });

  	// _(skills).each(function(d,i) {
  	// 	d.class="skill";
  	// 	d.start = d.start ? parse(d.start) : null;
   //  	d.end = d.end ? parse(d.end) : parse('Apr 2012');

    	//Find available ring
    // 	ring = 1;
    // 	while (d.start < rings_available[ring])
    // 		ring++;

    // 	rings_available[ring] = d.end;
  		// d.ring = ring;
  	// });

  	//skills = _(data.skills).sortBy(function(d){ return parse(d.start); });
	skills = _.groupBy(data.skills,'group'); //Split Skils into Front end and backend development

	console.log(skills.backend);
	console.log(skills.frontend);

  	var next_ring = 0;

  	//Backend Skills

  	_(skills.backend).each(function(d,i) { 
		d.start_date = d.start ? parse(d.start) : null;
		d.end_date = d.end ? parse(d.end) : parse('Apr 2012'); //If no end date is set, then set to today.
		d.ring = next_ring++;
		d.color = skill_colors2(i/4); 
  	});
  	
  	queue = queue.concat(skills.backend);

  	//Frontend Skills

  	//next_ring++; //Shift up to next ring.

	_(skills.frontend).each(function(d,i) { 
		d.start_date = d.start ? parse(d.start) : null;
		d.end_date = d.end ? parse(d.end) : parse('Apr 2012'); //If no end date is set, then set to today.
		d.ring = next_ring++;
		d.color = skill_colors(i/8); 
	});

  	queue = queue.concat(skills.frontend);

	//Employment
  	
  	_(data.employment).each(function(d) {
    	d.start_date = parse(d.start);
    	d.end_date = parse(d.end);
    	d.ring = next_ring;
    	d.color = skill_colors3(0);
  	});

  	queue = queue.concat(data.employment);

  	// Education

  	next_ring++; //Shift up to next ring.

  	_(data.education).each(function(d) {
  		d.start_date = parse(d.start);
    	d.end_date = d.end ? parse(d.end) : (d.start + (86400000*90));
  		d.ring = next_ring;
  		d.color = skill_colors3(0.5);
  	});

  	queue = queue.concat(data.education);

  	// Freelance

  	next_ring++; //Shift up to next ring.

  	_(data.freelance).each(function(d) {
  		d.start_date = parse(d.start);
    	d.end_date = parse(d.end);
  		d.ring = next_ring;
  		d.color = skill_colors3(1);
  	});

	queue = queue.concat(data.freelance);


  	// Timeline SVG  	

	var w = 500, h =500;
	var start_date = parse('Sep 1995');
	var end_date = parse('Jan 2013');

	var svg = d3.select("#timeline").append("svg")
		.attr('width', w)
		.attr('height', h)
		.append('g')
		.attr('transform', "translate("+((w/2) +0.5)+","+((h/2)+0.5)+")");

	svg.append('text')
		.text('Timeline')
		.attr("text-anchor", "middle")
		.attr("dy", "0.4em");

	svg.append('circle').attr("r", 55);
	//svg.append('circle').attr("r", 325);

	//Axis

	axis = [{"year": "1996"},{"year": "1998"},{"year": "2000"},{"year": "2002"},{"year": "2004"},{"year": "2006"},{"year": "2008"},{"year": "2010"},{"year": "2012"}];
	var parse2 = d3.time.format("%Y").parse;

	// g = svg.selectAll('line')
	// 	.data(axis)
	// 	.enter()
	// 	.append('g');
	
	// g.transition().duration(1000)
	// 	.attr('transform', function(d,i) {
	// 		diff = end_date - start_date;
	// 		year = parse2(d.year) - start_date;
	// 		angle = (year / diff)  * 360;
	// 		return 'rotate('+angle+')'
	// 	});

	// g.append('line')
	// 	.attr('x1', 0)
	// 	.attr('y1', -55)
	// 	.attr('x2', 0)
	// 	.attr('y2', -330);

	// g.append('text')
	// 	.attr('class', 'year')
	// 	.text(function(d) { return d.year })
	// 	 .attr("text-anchor", "middle")
	// 	.attr('transform', "translate(5,-350)rotate(-90)");;

	// Tooltip

	var tooltip = d3.select("body")
		.append("div")
			.attr("class", "tooltip")
			//.style("position", "absolute")
			//.style("z-index", "10")
			//.style("visibility", "hidden")
			.text("a simple tooltip");

	// d3.select("#timeline").on("mousemove", function(){ 
	// 			//d3.selectAll('.arc path').classed('fade',true);
	// 			//d3.select(this).classed('active',true);
	// 			return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");} );

	//Arc Generator

	arc_start = d3.svg.arc()
		.innerRadius(function(d,i) { return 100; 
			//(i*20); return 100 + (d.ring * 15) 
		})
    	.outerRadius(function(d,i) { return 120; 
    		//(i*20); return (d.ring *15) + 110
    	})
		.startAngle(0)
		.endAngle(0);

	arc = d3.svg.arc()
		.innerRadius(function(d) { return 50 + (d.ring*14); })
		.outerRadius(function(d) { return 63 + (d.ring*14);	})
		.startAngle(function(d,i) {
   			return ((d.start_date - start_date) / (end_date - start_date) ) * Math.PI * 2;			
		})
		.endAngle(function(d) {
			return ((d.end_date - start_date)/(end_date - start_date)) * Math.PI * 2;
		});
	
	// Start Pushing Nodes to timeline, one at a time
  	
	var timer = setInterval(function() {	 		
  		if (queue.length) {
  			node = queue.shift();	
  			items.push(node);
  			redraw(); //Draw the arcs
  		}
  		else {
  			clearInterval(timer);
  		}
  	},100);
  		

	function redraw() {
		
		g =  svg.selectAll('g.arc')
			.data(items)
			.enter()
			.append('g').attr('class',function(d) {
				return 'arc ' + d.class + ' group-' + d.group + ' skill-' + d.name;
			})
			.on('mouseover', function() {

			});

		var arcs = g.append('path')
			.attr('fill', function(d, i) { return d.color; })
			//.attr('stroke', '#000')
			.attr("d", arc_start)
			.each(function(d) { d.previous = d; })
			// .on("mouseover", function(d,i) { 
			// 	console.log('Over', d.name);
			// 	mouse_coordinates = d3.mouse("svg");
			// 	console.log(mouse_coordinates);


			// // 	this.attr('opacity', 0.5);
			// })
			.on("mouseover", function(d){ 
				
				tooltip.html('<p class="title">' + d.name + '</p><p class="date">' + d.start + ' - ' +  d.end + '</p>');
				return tooltip.classed("visible",true);
		})
			 .on("mousemove", function(){ 
			// 	//d3.selectAll('.arc path').classed('fade',true);
			// 	//d3.select(this).classed('active',true);
			 	return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");} )
			.on("mouseout", function(d) { 
				//d3.selectAll('.arc path').classed('fade',false);
				//d3.select(this).classed('active',false);
				return tooltip.classed("visible", false);
			})
    		;

		arcs.transition()
			.duration(function(d) {
				duration = (d.end_date - d.start_date) / 20000000;
				return 1000; //duration;
			})
			//.ease("elastic")
    		.attrTween("d", arcTween);
	}

	function arcTween(a) {
		var i = d3.interpolate({end_date: a.start_date}, a);
		return function(t) { return arc(i(t)); };
	}


	// And finally, draw the skill list

	skill_list = _(data.skills).filter(function(d) {
		return d.rank;
	});

	var list = d3.select("#skills").append('ul');
	
	var li = list.selectAll("li")
		.data(skill_list)
		.enter()
			.append("li");
	
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
		.attr('width', function(d) { return d.rank*10})
		.attr('height', 8)
		.attr('fill', function(d,i) { return d.color; }); 

	

});

//remove address bar from iPhone
window.addEventListener("load",function() {
  	setTimeout(function(){ 
    	window.scrollTo(0, 0); // Hide the address bar!
	}, 0);
});