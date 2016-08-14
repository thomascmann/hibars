
var colorpalettes = {defaultcolors: {
  1:["#5DA5DA"],
  2:["#5DA5DA","#60BD68"],
  3:["#5DA5DA","#60BD68","#F15854"],
  4:["#5DA5DA","#F15854","#60BD68","#845C59"],
  5:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A"],
  6:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E"],
  7:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0"],
  8:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F"],
  9:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F","#B276B2"],
  10:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F","#B276B2","#C2D580"]
  }
};

function hibars2(settings){

  var chartlocation = "#" + settings.location;
  var dataset = settings.datafile;

  var DependentVariable = settings.dependent;
  var factor1 = settings.factor1;
  var factor2 = settings.factor2;
  var chartwidth = settings.chartwidth || 800;
  var chartheight = settings.chartheight || 500;
  var colorscheme = settings.colorscheme || colorpalettes.defaultcolors;

  var margin = {top: 20, right: 20, bottom: 60, left: 75, legend: 0.15*chartwidth},
      width = chartwidth - margin.left - margin.right - margin.legend,
      totalwidth = chartwidth - margin.left - margin.right,
      height = chartheight - margin.top - margin.bottom;

  var BarPadding1 = .1;
  var BarPadding2 = .1;
  var levelsoffactor2;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], BarPadding1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()

  	.range((function(){
                return colorscheme[levelsoffactor2] || colorpalettes.defaultcolors[levelsoffactor2];
  						})()
  			);
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var errorwidth = 2;

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*2/3);
  

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10);

  var svg = d3.select(chartlocation)
      .style("text-align","center")
    .append("svg")
      .attr("width", width + margin.left + margin.right + margin.legend)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var flipphase1 = 0;
  var flipphase2 = 0;
  var flipphase3 = 0;
  var transitionstate = 0;
  var displayphase = 1;
  var clickedbutton = 1;
  var processinput1;
  var processinput2;
  var phasebuttonwidth = 0.15*chartwidth;
  var phasebuttonheight = 20;

  function axissize(relevantclass, outerwidth, maxsize, minsize) {
  	var sizes = [];
  	svg.selectAll(relevantclass)
  		.style("font-size","1px")
          .style("font-size",function(){
        				var textsize = this.getBBox(); 
        				var restriction = Math.min((outerwidth/(textsize.width)), maxsize);
        				sizes.push(restriction);
        		})
        	.style("font-size",function(){
        									if (minsize) {return Math.max(d3.min(sizes),minsize) + "px";}
        									else {return d3.min(sizes) + "px";}
        								});
  }

  d3.csv(dataset, function(error, rawdata) {
    if (error) throw error;

  var data = d3.nest()
    .key(function(d) { return d[factor1]; })  
    .key(function(d) { return d[factor2]; })  
    .entries(rawdata);
    

    	for (i=0; i<data.length; i++)
    	{
    		for (j=0; j<data[i].values.length; j++)
    		{
    				data[i].values[j].values[0].stderror = +data[i].values[j].values[0].stderror;
    				data[i].values[j].values[0][DependentVariable] = +data[i].values[j].values[0][DependentVariable];
    		}
    	}
    	
    x0.domain(data.map(function(d) { return d.key; }));
    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()]);
  
    
    levelsoffactor2 = data[0]['values'].length;
    color.range((function(){
                return colorscheme[levelsoffactor2] || colorpalettes.defaultcolors[levelsoffactor2];
  						})()
  			);
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      	
    y.domain([Math.min(0,d3.min(data, function(d) { 
          return d3.min(d.values, function(d) 
            { 
              return d3.min(d.values, function(d)
                {
                  return d[DependentVariable] - d.stderror;
                });
            }); 
          })), 
          Math.max(0,d3.max(data, function(d) { 
          return d3.max(d.values, function(d) 
            { 
              return d3.max(d.values, function(d)
                {
                  return d[DependentVariable] + d.stderror;
                });
            }); 
          }))
      ]).nice();

    svg.append("g")
        .attr("class", "x x0 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height)/2)
        .attr("y", -(margin.left-5))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(DependentVariable);
  
    if (y.domain()[0] < 0 && y.domain()[1] > 0) {
      svg.append("g")
          .attr("class", "x axis")
        .append("line")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", width)
          .attr("y2", y(0));
    }

    var factor1group = svg.selectAll(".factor1group")
        .data(data)
      .enter().append("g")
        .attr("class", "factor1group")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });


    var axisticks1 = svg.selectAll(".axisticks1")
    .data(data)
        .enter().append("g")
        .attr("class", "axisticks1")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
        
    axisticks1.filter(function(d,i) { return i < data.length-1; })
      .append("line")
        .attr("class", "group1tick")
    	  .attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
    	  .attr("y1",height)
    	  .attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
    	  .attr("y2",height+margin.bottom)
    	  .attr("stroke","black")
    	  .attr("stroke-width",1);

    axissize(".x0.axis text", x0.rangeBand(), 16);
    
    svg.select("g.x.x0.axis")
        .call(xAxis);

    //Styling. Can also move to CSS.

    svg.selectAll(".axis line")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});


    svg.selectAll(".axis path")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});

    svg.selectAll(".tick line")
      .style("opacity","0.2");

    svg.selectAll(".x.axis path")
      .style("display","inline-block");

    //End styling.
    
    var DVbars = factor1group.selectAll("rect")
        .data(function(d) {return d.values; })
      .enter().append("rect")
      		.attr("class","databar")
        		.attr("width", x1.rangeBand())
        		.attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
        		.style("fill", function(d) { return color(d.key); })
        		.attr("x", function(d) {return x1(d.key); })
      		.attr("y",height)
      		.transition()
      		.duration(500)
        		.attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});

          	factor1group.selectAll("rect").on("mouseover", function(d) {

  					//Get this bar's x/y values, then augment for the tooltip
  					var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
      				var s1 = t1.translate[0];
      				
  					var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + x1.rangeBand() / 2;
  					
          if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
          else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



  					//Create the tooltip label
  					svg.append("circle")
  						.attr("class","tooltip")
  						.attr("r",Math.max(x1.rangeBand()/3,20))
  						.attr("cx",xPosition)
  						.attr("cy",yPosition)
  						.style("fill","aliceblue")
  						.style("pointer-events","none")
  						.style("stroke","black")
  						.style("stroke-width","1px")
  						.style("stroke-opacity",.8)
  						.attr("fill-opacity",.8);
  					svg.append("text")
  					   .attr("class", "tooltip")
  					   .attr("x", xPosition)
  					   .attr("y", yPosition)
  					   .attr("dy","5px")
  					   .attr("text-anchor", "middle")
  					   .attr("font-weight", "bold")
  					   .attr("fill", "black")
  					   .style("pointer-events","none")
  					   .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
  					   .text(d.values[0][DependentVariable]);
  					   
  					axissize("text.tooltip",Math.max(((x1.rangeBand()*.5) - 1),35),16,12);
  			   })
  		.on("mouseout", function() {
  			   
  					//Remove the tooltip
  					d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
  				});


    var errorbars = factor1group.selectAll(".errorbars")
        .data(function(d) {return d.values; })
    	 .enter().append("g")
    	  .attr("class","errorbars")
    	  .style("pointer-events","none")
    	  .attr("transform", function(d) {var txt = x1(d.key) + x1.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

      	errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",0)
    	  		.attr("y1",height)
    	  		.attr("x2",0)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",0)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("x2",0)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
    		errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",height)
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth);
    
    		errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",height)
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
    	  		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth);

    var legend = svg.selectAll(".legend")
        .data(data[0].values)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

    legend.append("rect")
        .attr("x", totalwidth)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(d.key);});

    legend.append("text")
        .attr("x", totalwidth - 6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.key; });
    
    var legendtitle = svg.append("g")
    	  .attr("transform", function(){var txt = totalwidth + 18; return "translate(" + txt + ",8)"; })
    	.append("text")
    	  .attr("class", "legendtitle")
    	  .style("font-weight","bold")
    	  .text(factor2)
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "end");
   
   var axiscontrolstitle = svg.append("g")
        .attr("class", "axiscontrolstitle")
    	  .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });

  axiscontrolstitle.append("text")
    	  .text("X axis controls")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("fill", "steelblue")
        .style("text-anchor", "middle")
        .style("font-weight","bold");

  var fliptitle = svg.append("g")
        .attr("class", "fliptitle")
    	  .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values.length*20 + 85; return "translate(" + txt + "," + txt2 + ")"; });
    
    fliptitle.append("text")
    	  .text("Flips")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("text-anchor", "middle")
        .style("font-style","italic");
        
    var buttons1 = ["Flip " + factor2, "Flip " + factor1];
    var buttons2 = [factor1, factor2];
    
    
    var phasebutton = svg.selectAll(".morphbutton")
       .data(buttons1)
       .enter()
        .append("g")
        .attr("class", function(d, i){ return "morphbutton" + i;})
    	  .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
    
    phasebutton.append("rect")
    	  .attr("width", phasebuttonwidth)
        .attr("height", phasebuttonheight)
        .attr("rx","5")
    	  .attr("ry","5")
    	  .style("fill","#C0C0C0")
    	  .on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
    	  .on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
    	  
    phasebutton.append("text")
    	  .text(function(d){return d;})
    	  .classed("morphtext",true)
        .attr("x", phasebuttonwidth/2)
    	  .attr("y", 15)
    	  .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
    	  .style("text-anchor","middle")
    	  .style("fill","white")
        .style("pointer-events","none")
        .style("font-size","1px")
        .style("font-size",function(d){
        				var textsize = this.getBBox(); 
        				var textwidth = textsize.width;
        				var textheight = textsize.height;
        				var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
        				return restriction + "px";
        		});
      

    var redrawtitle = svg.append("g")
        .attr("class", "redrawtitle")
    	  .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + 125; return "translate(" + txt + "," + txt2 + ")"; });
    
    redrawtitle.append("text")
    	  .text("X axis factor")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("text-anchor", "middle")
        .style("font-style","italic");
        
    var phasebutton2 = svg.selectAll(".morphbutton_2_")
       .data(buttons2)
       .enter()
        .append("g")
        .attr("class", function(d, i){ return "morphbutton_2_" + i;})
    	  .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + i*21 + 130; return "translate(" + txt + "," + txt2 + ")";});
    
    phasebutton2.append("rect")
    	  .attr("width", phasebuttonwidth)
        .attr("height", phasebuttonheight)
        .attr("rx","5")
    	  .attr("ry","5")
    	  .style("fill","#C0C0C0")
    	  .on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
    	  .on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
    	  
    phasebutton2.append("text")
    	  .text(function(d){return d;})
    	  .classed("morphtext2",true)
        .attr("x", phasebuttonwidth/2)
    	  .attr("y", 15)
    	  .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
    	  .style("text-anchor","middle")
    	  .style("fill","white")
        .style("pointer-events","none")
        .style("font-size","1px")
        .style("font-size",function(d){
        				var textsize = this.getBBox(); 
        				var textwidth = textsize.width;
        				var textheight = textsize.height;
        				var restriction = Math.min(phasebuttonwidth/(textsize.width + 2), phasebuttonheight/(textsize.height), 16);
        				return restriction + "px";
        		});

  axissize(".morphtext", phasebuttonwidth-5, 16);
  axissize(".morphtext2", phasebuttonwidth-5, 16);

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
     .style("font-style","italic")
     .on("click", function(){ 
  	if (transitionstate == 0) {
  		transitionstate = 1;
  	
  		if (flipphase1 == 0) {
  			x1.rangeRoundBands([x0.rangeBand(), 0]);
  			flipphase1 = 1;
  			} else if (flipphase1 == 1) {
  			x1.rangeRoundBands([0, x0.rangeBand()]);
  			flipphase1 = 0; 
  			}
  	
  			factor1group.selectAll("rect")
  			  .data(function(d) {return d.values; })
  			  .transition()
     	  	    .attr("width", x1.rangeBand())
        	    .attr("x", function(d) {return x1(d.key); })
              .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));})
              .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
        	    .style("fill", function(d) { return color(d.key); });
      
      		factor1group.selectAll(".errorbars")
      		  .data(function(d) {return d.values; })
    			 .transition()
    			  .attr("transform", function(d) {var txt = x1(d.key) + x1.rangeBand()/2; return "translate(" + txt + ", 0 )"; })
    			  .each("end", function(){ transitionstate = 0; });
  		}
  	});

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
     .style("font-style","italic")
     .on("click", function(){ 
  	if (transitionstate == 0) {
  		transitionstate = 1;
  	
  		if (flipphase2 == 0) {
  			x0.rangeRoundBands([width, 0], BarPadding1);
  			flipphase2 = 1;
  			} else if (flipphase2 == 1) {
  			x0.rangeRoundBands([0, width], BarPadding1);
  			flipphase2 = 0; 
  			}
  	
  	
      	
        svg.select("g.x.x0.axis")
           .transition()
           .call(xAxis);

      
        
      svg.selectAll("g.factor1group")
              .data(data)
              .transition()
              .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
  		
  		
    	  setTimeout(function(){transitionstate = 0;},500);
  	  }
  	});
   
   phasebutton2
     .on("click", function(){ 
  	
  	if (d3.select(this).attr("class") == "morphbutton_2_0") {clickedbutton = 1; processinput1 = factor1; processinput2 = factor2;}
  	if (d3.select(this).attr("class") == "morphbutton_2_1") {clickedbutton = 2; processinput1 = factor2; processinput2 = factor1;}
  	
  	if (transitionstate == 0 && displayphase !== clickedbutton) {
  		transitionstate = 1;
  		displayphase = clickedbutton;
  		flipphase1 = 0;
  		flipphase2 = 0;
  		
    	
    	processchange(processinput1,processinput2);

  		}
  	});

    function processchange(var1,var2){
  	
  		data = d3.nest()
    		.key(function(d) { return d[var1]; })  
    		.key(function(d) { return d[var2]; }) 
    		.entries(rawdata);
    

  	
    	for (i=0; i<data.length; i++)
    	{
    		for (j=0; j<data[i].values.length; j++)
    		{
    				data[i].values[j].values[0].stderror = +data[i].values[j].values[0].stderror;
    				data[i].values[j].values[0][DependentVariable] = +data[i].values[j].values[0][DependentVariable];
    		}
    	}
    	
    		x0.domain(data.map(function(d) { return d.key; })).rangeRoundBands([0, width], BarPadding1);
    		x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()]);

    		levelsoffactor2 = data[0]['values'].length;
    		
    		color.domain(data[0]['values'].map(function(d) { return d.key; }));
    		color.range((function(){
         return colorscheme[levelsoffactor2] || colorpalettes.defaultcolors[levelsoffactor2];
  			})()
  		);
  		

  		svg.selectAll(".databar").transition().duration(500).attr("y",1000).transition().remove();
  		svg.selectAll(".errorline").transition().duration(500).attr("y1",1000).attr("y2",1000).transition().remove();

  	
  	  setTimeout(function(){
  		
  		
  	  	xAxis.scale(x0);
      	
  		svg.select(".x.axis")
  			.call(xAxis);
  	
  		factor1group = factor1group.data([]).exit().remove();
  		axisticks1 = axisticks1.data([]).exit().remove();
  		

  		factor1group = svg.selectAll(".factor1group")
        		.data(data)
      		.enter().append("g")
        		.attr("class", "factor1group")
        		.attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
        	
        axisticks1 = svg.selectAll(".axisticks1")
        		.data(data)
      		.enter().append("g")
        		.attr("class", "axisticks1")
        		.attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
  	
  		
    		axisticks1.filter(function(d,i) { return i < data.length-1; })
      		.append("line")
        		.attr("class", "group1tick")
    	  		.attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
    	  		.attr("y1",height)
    	  		.attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
    	  		.attr("y2",height+margin.bottom)
    	  		.attr("stroke","black")
    	  		.attr("stroke-width",1);
  

   	 axissize(".x0.axis text", x0.rangeBand(), 16);
    
   	 svg.select("g.x.x0.axis")
     	   .call(xAxis);
    
    		DVbars = factor1group.selectAll("rect")
        		.data(function(d) {return d.values; })
      		.enter().append("rect")
      		.attr("class","databar")
        		.attr("width", x1.rangeBand())
        		.attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
        		.style("fill", function(d) { return color(d.key); })
        		.attr("x", function(d) {return x1(d.key); })
      		.attr("y",height)
      		.transition()
      		.duration(500)
        		.attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});
        	
        	      	factor1group.selectAll("rect").on("mouseover", function(d) {

  					//Get this bar's x/y values, then augment for the tooltip
  					var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
      				var s1 = t1.translate[0];
      				
  					var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + x1.rangeBand() / 2;
  					
            if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
            else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



  					//Create the tooltip label
  					svg.append("circle")
  						.attr("class","tooltip")
  						.attr("r",Math.max(x1.rangeBand()/3,20))
  						.attr("cx",xPosition)
  						.attr("cy",yPosition)
  						.style("fill","aliceblue")
  						.style("pointer-events","none")
  						.style("stroke","black")
  						.style("stroke-width","1px")
  						.style("stroke-opacity",.8)
  						.attr("fill-opacity",.8);
  					svg.append("text")
  					   .attr("class", "tooltip")
  					   .attr("x", xPosition)
  					   .attr("y", yPosition)
  					   .attr("dy","5px")
  					   .attr("text-anchor", "middle")
  					   .attr("font-size", "11px")
  					   .attr("font-weight", "bold")
  					   .attr("fill", "black")
  					   .style("pointer-events","none")
  					   .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
  					   .text(d.values[0][DependentVariable]);

  					axissize("text.tooltip",Math.max(((x1.rangeBand()*.5) - 1),35),16,12);
  			   })
  		.on("mouseout", function() {
  			   
  					//Remove the tooltip
  					d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
  				});
  				
    		errorbars = factor1group.selectAll(".errorbars")
        		.data(function(d) {return d.values; })
    	 		.enter().append("g")
    	 		.attr("class","errorbars")
    	 		.style("pointer-events","none")
    	  		.attr("transform", function(d) {var txt = x1(d.key) + x1.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

    		errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",0)
    	  		.attr("y1",height)
    	  		.attr("x2",0)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",0)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("x2",0)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
    		errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",height)
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
    	  		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth);
    
    		errorbars
      		.append("line")
      		.attr("class","errorline")
      		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",height)
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",height)
      		.transition()
      		.duration(500)
    	  		.attr("x1",-x1.rangeBand()/4)
    	  		.attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
    	  		.attr("x2",x1.rangeBand()/4)
    	  		.attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
    	  		.attr("stroke","black")
    	  		.attr("stroke-width",errorwidth);

    		legend.data([]).exit().remove();

    		legend = svg.selectAll(".legend")
        		.data(data[0].values)
      		.enter().append("g")
        		.attr("class", "legend")
        		.attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

    		legend.append("rect")
    			.transition()
        		.attr("x", totalwidth)
        		.attr("width", 18)
        		.attr("height", 18)
        		.style("fill", function(d) {return color(d.key);});

   		legend.append("text")
   			.transition()
        		.attr("x", totalwidth - 6)
        		.attr("y", 9)
        		.attr("dy", ".35em")
        		.style("text-anchor", "end")
        		.text(function(d) { return d.key; });

    		legendtitle.text(var2);
        
         axiscontrolstitle
          	.transition()
    	  		.attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });
        
         fliptitle
          	.transition()
    	 			 .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values.length*20 + 85; return "translate(" + txt + "," + txt2 + ")"; });

      	phasebutton
        		.transition()
    			    .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth + 18; var txt2 = data[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
  		
  		redrawtitle
  			.transition()
    	  			.attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values.length*20 + buttons1.length*21 + 125; return "translate(" + txt + "," + txt2 + ")"; });

  		phasebutton2
  			.transition()
    	  			.attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values.length*20 + buttons1.length*21 + i*21 + 130; return "translate(" + txt + "," + txt2 + ")";});

        	
        	phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
  		.selectAll("text")
  		.text("Flip " + var2);
        	
        	phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
  		.selectAll("text")
  		.text("Flip " + var1);
  		

  		transitionstate = 0;
  	 },500);
  	}
  	
  });
}



function hibars3(settings){

  var chartlocation = "#" + settings.location;
  var dataset = settings.datafile;

  var DependentVariable = settings.dependent;
  var factor1 = settings.factor1;
  var factor2 = settings.factor2;
  var factor3 = settings.factor3;
  var chartwidth = settings.chartwidth || 800;
  var chartheight = settings.chartheight || 500;
  var colorscheme = settings.colorscheme || colorpalettes.defaultcolors;

  var margin = {top: 20, right: 20, bottom: 60, left: 75, legend: 0.15*chartwidth},
      width = chartwidth - margin.left - margin.right - margin.legend,
      totalwidth = chartwidth - margin.left - margin.right,
      height = chartheight - margin.top - margin.bottom;

  var BarPadding1 = .1;
  var BarPadding2 = .1;
  var levelsoffactor3;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], BarPadding1);

  var x1 = d3.scale.ordinal();

  var x2 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()

    .range((function(){
                return colorscheme[levelsoffactor3] || colorpalettes.defaultcolors[levelsoffactor3];
              })()
        );
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var errorwidth = 2;

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*2/3);

  var xAxis2 = d3.svg.axis()
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*1/5);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10);

  var svg = d3.select(chartlocation)
      .style("text-align","center")
    .append("svg")
      .attr("width", width + margin.left + margin.right + margin.legend)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var flipphase1 = 0;
  var flipphase2 = 0;
  var flipphase3 = 0;
  var transitionstate = 0;
  var displayphase = 1;
  var clickedbutton = 1;
  var processinput1;
  var processinput2;
  var processinput3;
  var phasebuttonwidth = 0.15*chartwidth;
  var phasebuttonheight = 20;

  function axissize(relevantclass, outerwidth, maxsize, minsize) {
    var sizes = [];
    svg.selectAll(relevantclass)
      .style("font-size","1px")
          .style("font-size",function(){
                var textsize = this.getBBox(); 
                var restriction = Math.min((outerwidth/(textsize.width)), maxsize);
                sizes.push(restriction);
            })
          .style("font-size",function(){
                          if (minsize) {return Math.max(d3.min(sizes),minsize) + "px";}
                          else {return d3.min(sizes) + "px";}
                        });
  }

  d3.csv(dataset, function(error, rawdata) {
    if (error) throw error;

  var data = d3.nest()
    .key(function(d) { return d[factor1]; })  
    .key(function(d) { return d[factor2]; })  
    .key(function(d) { return d[factor3]; })  
    .entries(rawdata);
    

      for (i=0; i<data.length; i++)
      {
        for (j=0; j<data[i].values.length; j++)
        {
          for (k=0; k<data[i].values[j].values.length; k++)
          {
            data[i].values[j].values[k].values[0].stderror = +data[i].values[j].values[k].values[0].stderror;
            data[i].values[j].values[k].values[0][DependentVariable] = +data[i].values[j].values[k].values[0][DependentVariable];
          }
        }
      }
      
    x0.domain(data.map(function(d) { return d.key; }));
    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()], BarPadding2);
    x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x1.rangeBand()]);
    
    xAxis2.scale(x1);
    
    levelsoffactor3 = data[0]['values'][0]['values'].length;
    color.range((function(){
                return colorscheme[levelsoffactor3] || colorpalettes.defaultcolors[levelsoffactor3];
              })()
        );
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        
    y.domain([Math.min(0,d3.min(data, function(d) { 
          return d3.min(d.values, function(d) 
            { 
              return d3.min(d.values, function(d)
                {
                  return d3.min(d.values, function(d)
                  {
                    return d[DependentVariable] - d.stderror;
                  });
                });
            }); 
          })), 
          Math.max(0,d3.max(data, function(d) { 
          return d3.max(d.values, function(d) 
            { 
              return d3.max(d.values, function(d)
                {
                  return d3.max(d.values, function(d)
                  {
                    return d[DependentVariable] + d.stderror;
                  });
                });
            }); 
          }))
      ]).nice();

    svg.append("g")
        .attr("class", "x x0 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height)/2)
        .attr("y", -(margin.left-5))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(DependentVariable);
  
    if (y.domain()[0] < 0 && y.domain()[1] > 0) {
      svg.append("g")
          .attr("class", "x axis")
        .append("line")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", width)
          .attr("y2", y(0));
    }

    var factor1group = svg.selectAll(".factor1group")
        .data(data)
      .enter().append("g")
        .attr("class", "factor1group")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });

    
    factor1group.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2)
        .style("font-size","12px");


    var axisticks1 = svg.selectAll(".axisticks1")
    .data(data)
        .enter().append("g")
        .attr("class", "axisticks1")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
        
    axisticks1.filter(function(d,i) { return i < data.length-1; })
      .append("line")
        .attr("class", "group1tick")
        .attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
        .attr("y1",height)
        .attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
        .attr("y2",height+margin.bottom)
        .attr("stroke","black")
        .attr("stroke-width",1);

    var factor2group = factor1group.selectAll(".factor2group")
        .data(function(d) {return d.values;})
       .enter().append("g")
        .attr("class", "factor2group")
        .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });

    var axisticks2 = axisticks1.selectAll(".axisticks2")
    .data(function(d) {return d.values;})
        .enter().append("g")
        .attr("class", "axisticks2")
        .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
        
    axisticks2.filter(function(d,i) { return i < data[0].values.length-1; })
       .append("line")
        .attr("class", "group2tick")
        .attr("x1",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
        .attr("y1",height)
        .attr("x2",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
        .attr("y2",height+margin.bottom/3)
        .attr("stroke","black")
        .attr("stroke-width",1);

    axissize(".x0.axis text", x0.rangeBand(), 16);
    axissize(".x1.axis text", x1.rangeBand(), 12);
    
    svg.select("g.x.x0.axis")
        .call(xAxis);

  factor1group.call(xAxis2);

    //Styling. Can also move to CSS.

    svg.selectAll(".axis line")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});


    svg.selectAll(".axis path")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});

    svg.selectAll(".tick line")
      .style("opacity","0.2");

    svg.selectAll(".x.axis path")
      .style("display","inline-block");

    //End styling.
    
    var DVbars = factor2group.selectAll("rect")
        .data(function(d) {return d.values; })
      .enter().append("rect")
          .attr("class","databar")
            .attr("width", x2.rangeBand())
            .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
            .style("fill", function(d) { return color(d.key); })
            .attr("x", function(d) {return x2(d.key); })
          .attr("y",height)
          .transition()
          .duration(500)
            .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});

            factor2group.selectAll("rect").on("mouseover", function(d) {

            //Get this bar's x/y values, then augment for the tooltip
            var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
              var s1 = t1.translate[0];
              var t2 = d3.transform(d3.select(this.parentNode.parentNode).attr("transform"));
              var s2 = t2.translate[0];
              
            var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + x2.rangeBand() / 2;
            
          if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
          else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



            //Create the tooltip label
            svg.append("circle")
              .attr("class","tooltip")
              .attr("r",Math.max(x2.rangeBand()/3,20))
              .attr("cx",xPosition)
              .attr("cy",yPosition)
              .style("fill","aliceblue")
              .style("pointer-events","none")
              .style("stroke","black")
              .style("stroke-width","1px")
              .style("stroke-opacity",.8)
              .attr("fill-opacity",.8);
            svg.append("text")
               .attr("class", "tooltip")
               .attr("x", xPosition)
               .attr("y", yPosition)
               .attr("dy","5px")
               .attr("text-anchor", "middle")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .style("pointer-events","none")
               .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
               .text(d.values[0][DependentVariable]);
               
            axissize("text.tooltip",Math.max(((x2.rangeBand()*.5) - 1),35),16,12);
           })
      .on("mouseout", function() {
           
            //Remove the tooltip
            d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
          });


    var errorbars = factor2group.selectAll(".errorbars")
        .data(function(d) {return d.values; })
       .enter().append("g")
        .attr("class","errorbars")
        .style("pointer-events","none")
        .attr("transform", function(d) {var txt = x2(d.key) + x2.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",0)
            .attr("y1",height)
            .attr("x2",0)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",0)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",0)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);

    var legend = svg.selectAll(".legend")
        .data(data[0].values[0].values)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

    legend.append("rect")
        .attr("x", totalwidth)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(d.key);});

    legend.append("text")
        .attr("x", totalwidth - 6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.key; });
    
    var legendtitle = svg.append("g")
        .attr("transform", function(){var txt = totalwidth + 18; return "translate(" + txt + ",8)"; })
      .append("text")
        .attr("class", "legendtitle")
        .style("font-weight","bold")
        .text(factor3)
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "end");
   
   var axiscontrolstitle = svg.append("g")
        .attr("class", "axiscontrolstitle")
        .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });

  axiscontrolstitle.append("text")
        .text("X axis controls")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("fill", "steelblue")
        .style("text-anchor", "middle")
        .style("font-weight","bold");

  var fliptitle = svg.append("g")
        .attr("class", "fliptitle")
        .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + 85; return "translate(" + txt + "," + txt2 + ")"; });
    
    fliptitle.append("text")
        .text("Flips")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("text-anchor", "middle")
        .style("font-style","italic");
        
    var buttons1 = ["Flip " + factor3, "Flip " + factor2, "Flip " + factor1];
    var buttons2 = [factor1 + "," + factor2, factor1 + "," + factor3, factor2 + "," + factor1, factor3 + "," + factor1, factor2 + "," + factor3, factor3 + "," + factor2];
    
    
    var phasebutton = svg.selectAll(".morphbutton")
       .data(buttons1)
       .enter()
        .append("g")
        .attr("class", function(d, i){ return "morphbutton" + i;})
        .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
    
    phasebutton.append("rect")
        .attr("width", phasebuttonwidth)
        .attr("height", phasebuttonheight)
        .attr("rx","5")
        .attr("ry","5")
        .style("fill","#C0C0C0")
        .on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
        .on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
        
    phasebutton.append("text")
        .text(function(d){return d;})
        .classed("morphtext",true)
        .attr("x", phasebuttonwidth/2)
        .attr("y", 15)
        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
        .style("text-anchor","middle")
        .style("fill","white")
        .style("pointer-events","none")
        .style("font-size","1px")
        .style("font-size",function(d){
                var textsize = this.getBBox(); 
                var textwidth = textsize.width;
                var textheight = textsize.height;
                var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
                return restriction + "px";
            });
      

    var redrawtitle = svg.append("g")
        .attr("class", "redrawtitle")
        .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + 125; return "translate(" + txt + "," + txt2 + ")"; });
    
    redrawtitle.append("text")
        .text("X axis factors")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("text-anchor", "middle")
        .style("font-style","italic");
        
    var phasebutton2 = svg.selectAll(".morphbutton_2_")
       .data(buttons2)
       .enter()
        .append("g")
        .attr("class", function(d, i){ return "morphbutton_2_" + i;})
        .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + i*21 + 130; return "translate(" + txt + "," + txt2 + ")";});
    
    phasebutton2.append("rect")
        .attr("width", phasebuttonwidth)
        .attr("height", phasebuttonheight)
        .attr("rx","5")
        .attr("ry","5")
        .style("fill","#C0C0C0")
        .on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
        .on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
        
    phasebutton2.append("text")
        .text(function(d){return d;})
        .classed("morphtext2",true)
        .attr("x", phasebuttonwidth/2)
        .attr("y", 15)
        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
        .style("text-anchor","middle")
        .style("fill","white")
        .style("pointer-events","none")
        .style("font-size","1px")
        .style("font-size",function(d){
                var textsize = this.getBBox(); 
                var textwidth = textsize.width;
                var textheight = textsize.height;
                var restriction = Math.min(phasebuttonwidth/(textsize.width + 2), phasebuttonheight/(textsize.height), 16);
                return restriction + "px";
            });

  axissize(".morphtext", phasebuttonwidth-5, 16);
  axissize(".morphtext2", phasebuttonwidth-5, 16);

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase1 == 0) {
        x2.rangeRoundBands([x1.rangeBand(), 0]);
        flipphase1 = 1;
        } else if (flipphase1 == 1) {
        x2.rangeRoundBands([0, x1.rangeBand()]);
        flipphase1 = 0; 
        }
    
        factor2group.selectAll("rect")
          .data(function(d) {return d.values; })
          .transition()
              .attr("width", x2.rangeBand())
              .attr("x", function(d) {return x2(d.key); })
              .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));})
              .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
              .style("fill", function(d) { return color(d.key); });
      
          factor2group.selectAll(".errorbars")
            .data(function(d) {return d.values; })
           .transition()
            .attr("transform", function(d) {var txt = x2(d.key) + x2.rangeBand()/2; return "translate(" + txt + ", 0 )"; })
            .each("end", function(){ transitionstate = 0; });
      }
    });

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase2 == 0) {
        x1.rangeRoundBands([x0.rangeBand(), 0], BarPadding2);
        flipphase2 = 1;
        } else if (flipphase2 == 1) {
        x1.rangeRoundBands([0, x0.rangeBand()], BarPadding2);
        flipphase2 = 0; 
        }
    
    
        
      factor1group.selectAll(".x1.axis")
        .transition()
            .call(xAxis2);
            
      factor1group.selectAll("g.factor2group")
            .data(function(d) {return d.values;})
            .transition()
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
      
      
        setTimeout(function(){transitionstate = 0;},500);
      }
    });

  phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase3 == 0) {
        x0.rangeRoundBands([width, 0], BarPadding1);
        flipphase3 = 1;
        } else if (flipphase3 == 1) {
        x0.rangeRoundBands([0, width], BarPadding1);
        flipphase3 = 0; 
        }
        

    
        svg.select("g.x.x0.axis")
           .transition()
           .call(xAxis);

      
        
      svg.selectAll("g.factor1group")
              .data(data)
              .transition()
              .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
    
      
      setTimeout(function(){transitionstate = 0;},500);
      }
    });
   
   phasebutton2
     .on("click", function(){ 
    
    if (d3.select(this).attr("class") == "morphbutton_2_0") {clickedbutton = 1; processinput1 = factor1; processinput2 = factor2; processinput3 = factor3;}
    if (d3.select(this).attr("class") == "morphbutton_2_1") {clickedbutton = 2; processinput1 = factor1; processinput2 = factor3; processinput3 = factor2;}
    if (d3.select(this).attr("class") == "morphbutton_2_2") {clickedbutton = 3; processinput1 = factor2; processinput2 = factor1; processinput3 = factor3;}
    if (d3.select(this).attr("class") == "morphbutton_2_3") {clickedbutton = 4; processinput1 = factor3; processinput2 = factor1; processinput3 = factor2;}
    if (d3.select(this).attr("class") == "morphbutton_2_4") {clickedbutton = 5; processinput1 = factor2; processinput2 = factor3; processinput3 = factor1;}
    if (d3.select(this).attr("class") == "morphbutton_2_5") {clickedbutton = 6; processinput1 = factor3; processinput2 = factor2; processinput3 = factor1;}
    
    if (transitionstate == 0 && displayphase !== clickedbutton) {
      transitionstate = 1;
      displayphase = clickedbutton;
      flipphase1 = 0;
      flipphase2 = 0;
      flipphase3 = 0;
      
      
      processchange(processinput1,processinput2,processinput3);

      }
    });

    function processchange(var1,var2,var3){
    
      data = d3.nest()
        .key(function(d) { return d[var1]; })  
        .key(function(d) { return d[var2]; }) 
        .key(function(d) { return d[var3]; })  
        .entries(rawdata);
    

    
      for (i=0; i<data.length; i++)
      {
        for (j=0; j<data[i].values.length; j++)
        {
          for (k=0; k<data[i].values[j].values.length; k++)
          {
            data[i].values[j].values[k].values[0].stderror = +data[i].values[j].values[k].values[0].stderror;
            data[i].values[j].values[k].values[0][DependentVariable] = +data[i].values[j].values[k].values[0][DependentVariable];
          }
        }
      }
      
        x0.domain(data.map(function(d) { return d.key; })).rangeRoundBands([0, width], BarPadding1);
        x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()], BarPadding2);
        x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x1.rangeBand()]);
    
        levelsoffactor3 = data[0]['values'][0]['values'].length;
        
        color.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; }));
        color.range((function(){
          return colorscheme[levelsoffactor3] || colorpalettes.defaultcolors[levelsoffactor3];
        })()
      );
      

      svg.selectAll(".databar").transition().duration(500).attr("y",1000).transition().remove();
      svg.selectAll(".errorline").transition().duration(500).attr("y1",1000).attr("y2",1000).transition().remove();

    
      setTimeout(function(){
      
      
        xAxis.scale(x0);
        xAxis2.scale(x1);
        
      svg.select(".x.axis")
        .call(xAxis);
    
      factor1group = factor1group.data([]).exit().remove();
      axisticks1 = axisticks1.data([]).exit().remove();
      

      factor1group = svg.selectAll(".factor1group")
            .data(data)
          .enter().append("g")
            .attr("class", "factor1group")
            .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
    
        factor1group.append("g")
            .attr("class", "x1 axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2)
            .style("font-size","12px");
          
          axisticks1 = svg.selectAll(".axisticks1")
            .data(data)
          .enter().append("g")
            .attr("class", "axisticks1")
            .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
      
        axisticks1.filter(function(d,i) { return i < data.length-1; })
          .append("line")
            .attr("class", "group1tick")
            .attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
            .attr("y1",height)
            .attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
            .attr("y2",height+margin.bottom)
            .attr("stroke","black")
            .attr("stroke-width",1);

        factor2group = factor1group.selectAll(".factor2group")
            .data(function(d) {return d.values;})
          .enter().append("g")
            .attr("class", "factor2group")
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
          
          axisticks2 = axisticks1.selectAll(".axisticks2")
            .data(function(d) {return d.values;})
          .enter().append("g")
            .attr("class", "axisticks2")
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });

        axisticks2.filter(function(d,i) { return i < data[0].values.length-1; })
          .append("line")
            .attr("class", "group2tick")
            .attr("x1",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
            .attr("y1",height)
            .attr("x2",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
            .attr("y2",height+margin.bottom/3)
            .attr("stroke","black")
            .attr("stroke-width",1);

     axissize(".x0.axis text", x0.rangeBand(), 16);
     axissize(".x1.axis text", x1.rangeBand(), 12);
    
     svg.select("g.x.x0.axis")
         .call(xAxis);

      factor1group.call(xAxis2);
    
        DVbars = factor2group.selectAll("rect")
            .data(function(d) {return d.values; })
          .enter().append("rect")
          .attr("class","databar")
            .attr("width", x2.rangeBand())
            .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
            .style("fill", function(d) { return color(d.key); })
            .attr("x", function(d) {return x2(d.key); })
          .attr("y",height)
          .transition()
          .duration(500)
            .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});
          
                  factor2group.selectAll("rect").on("mouseover", function(d) {

            //Get this bar's x/y values, then augment for the tooltip
            var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
              var s1 = t1.translate[0];
              var t2 = d3.transform(d3.select(this.parentNode.parentNode).attr("transform"));
              var s2 = t2.translate[0];
              
            var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + x2.rangeBand() / 2;
            
            if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
            else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



            //Create the tooltip label
            svg.append("circle")
              .attr("class","tooltip")
              .attr("r",Math.max(x2.rangeBand()/3,20))
              .attr("cx",xPosition)
              .attr("cy",yPosition)
              .style("fill","aliceblue")
              .style("pointer-events","none")
              .style("stroke","black")
              .style("stroke-width","1px")
              .style("stroke-opacity",.8)
              .attr("fill-opacity",.8);
            svg.append("text")
               .attr("class", "tooltip")
               .attr("x", xPosition)
               .attr("y", yPosition)
               .attr("dy","5px")
               .attr("text-anchor", "middle")
               .attr("font-size", "11px")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .style("pointer-events","none")
               .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
               .text(d.values[0][DependentVariable]);

            axissize("text.tooltip",Math.max(((x2.rangeBand()*.5) - 1),35),16,12);
           })
      .on("mouseout", function() {
           
            //Remove the tooltip
            d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
          });
          
        errorbars = factor2group.selectAll(".errorbars")
            .data(function(d) {return d.values; })
          .enter().append("g")
          .attr("class","errorbars")
          .style("pointer-events","none")
            .attr("transform", function(d) {var txt = x2(d.key) + x2.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",0)
            .attr("y1",height)
            .attr("x2",0)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",0)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",0)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x2.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("x2",x2.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);

        legend.data([]).exit().remove();

        legend = svg.selectAll(".legend")
            .data(data[0].values[0].values)
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

        legend.append("rect")
          .transition()
            .attr("x", totalwidth)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) {return color(d.key);});

      legend.append("text")
        .transition()
            .attr("x", totalwidth - 6)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.key; });

        legendtitle.text(var3);
        
         axiscontrolstitle
            .transition()
            .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });
        
         fliptitle
            .transition()
             .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + 85; return "translate(" + txt + "," + txt2 + ")"; });

        phasebutton
            .transition()
              .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth + 18; var txt2 = data[0].values[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
      
      redrawtitle
        .transition()
              .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + 125; return "translate(" + txt + "," + txt2 + ")"; });

      phasebutton2
        .transition()
              .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values.length*20 + buttons1.length*21 + i*21 + 130; return "translate(" + txt + "," + txt2 + ")";});

      
      
      phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
      .selectAll("text")
      .text("Flip " + var3);
          
          phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
      .selectAll("text")
      .text("Flip " + var2);
          
          phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
      .selectAll("text")
      .text("Flip " + var1);
      

      transitionstate = 0;
     },500);
    }
    
  });
}




function hibars4(settings){

  var chartlocation = "#" + settings.location;
  var dataset = settings.datafile;

  var DependentVariable = settings.dependent;
  var factor1 = settings.factor1;
  var factor2 = settings.factor2;
  var factor3 = settings.factor3;
  var factor4 = settings.factor4;
  var chartwidth = settings.chartwidth || 800;
  var chartheight = settings.chartheight || 500;
  var colorscheme = settings.colorscheme || colorpalettes.defaultcolors;

  var margin = {top: 20, right: 20, bottom: 60, left: 75, legend: 0.15*chartwidth},
      width = chartwidth - margin.left - margin.right - margin.legend,
      totalwidth = chartwidth - margin.left - margin.right,
      height = chartheight - margin.top - margin.bottom;

  var BarPadding1 = .05;
  var BarPadding2 = .1;
  var BarPadding3 = .1;
  var levelsoffactor4;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], BarPadding1);

  var x1 = d3.scale.ordinal();

  var x2 = d3.scale.ordinal();

  var x3 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()

    .range((function(){
                return colorscheme[levelsoffactor4] || colorpalettes.defaultcolors[levelsoffactor4];
              })()
        );
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var errorwidth = 2;

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*3/5);

  var xAxis2 = d3.svg.axis()
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*1/3);
      
  var xAxis3 = d3.svg.axis()
      .orient("bottom")
      .tickSize(0)
      .tickPadding(margin.bottom*1/8);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10);

  var svg = d3.select(chartlocation)
      .style("text-align","center")
    .append("svg")
      .attr("width", width + margin.left + margin.right + margin.legend)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var flipphase1 = 0;
  var flipphase2 = 0;
  var flipphase3 = 0;
  var flipphase4 = 0;
  var transitionstate = 0;
  var displayphase = 1;
  var clickedbutton = 1;
  var processinput1;
  var processinput2;
  var processinput3;
  var processinput4;
  var phasebuttonwidth = 0.15*chartwidth;
  var phasebuttonheight = 20;

  function axissize(relevantclass, outerwidth, maxsize, minsize) {
    var sizes = [];
    svg.selectAll(relevantclass)
      .style("font-size","1px")
          .style("font-size",function(){
                var textsize = this.getBBox(); 
                var restriction = Math.min((outerwidth/(textsize.width)), maxsize);
                sizes.push(restriction);
            })
          .style("font-size",function(){
                          if (minsize) {return Math.max(d3.min(sizes),minsize) + "px";}
                          else {return d3.min(sizes) + "px";}
                        });
  }

  d3.csv(dataset, function(error, rawdata) {
    if (error) throw error;

  var data = d3.nest()
    .key(function(d) { return d[factor1]; })  
    .key(function(d) { return d[factor2]; })  
    .key(function(d) { return d[factor3]; }) 
    .key(function(d) { return d[factor4]; })   
    .entries(rawdata);

      
      for (i=0; i<data.length; i++)
      {
        for (j=0; j<data[i].values.length; j++)
        {
          for (k=0; k<data[i].values[j].values.length; k++)
          {
            for (l=0; l<data[i].values[j].values[k].values.length; l++)
              {
              data[i].values[j].values[k].values[l].values[0].stderror = +data[i].values[j].values[k].values[l].values[0].stderror;
              data[i].values[j].values[k].values[l].values[0][DependentVariable] = +data[i].values[j].values[k].values[l].values[0][DependentVariable];
              }
          }
        }
      }
      
    x0.domain(data.map(function(d) { return d.key; }));
    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()], BarPadding2);
    x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x1.rangeBand()], BarPadding3);
    x3.domain(data[0]['values'][0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x2.rangeBand()]);

    
    xAxis2.scale(x1);
    xAxis3.scale(x2);
    
    levelsoffactor4 = data[0]['values'][0]['values'][0]['values'].length;
    color.range((function(){
                return colorscheme[levelsoffactor4] || colorpalettes.defaultcolors[levelsoffactor4];
              })()
        );
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        
    y.domain([Math.min(0,d3.min(data, function(d) { 
          return d3.min(d.values, function(d) 
            { 
              return d3.min(d.values, function(d)
                {
                  return d3.min(d.values, function(d)
                  {
                    return d3.min(d.values, function(d)
                    {
                      return d[DependentVariable] - d.stderror;
                    });
                  });
                });
            }); 
          })), 
        Math.max(0,d3.max(data, function(d) { 
          return d3.max(d.values, function(d) 
            { 
              return d3.max(d.values, function(d)
              {
                return d3.max(d.values, function(d)
                {
                  return d3.max(d.values, function(d)
                  {
                    return d[DependentVariable] + d.stderror; 
                  });
                });
              });
            }); 
        }))
      ]).nice();

    svg.append("g")
        .attr("class", "x x0 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height)/2)
        .attr("y", -(margin.left-5))
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(DependentVariable);
    
    if (y.domain()[0] < 0 && y.domain()[1] > 0) {
      svg.append("g")
          .attr("class", "x axis")
        .append("line")
          .attr("x1", 0)
          .attr("y1", y(0))
          .attr("x2", width)
          .attr("y2", y(0));
    }

    var factor1group = svg.selectAll(".factor1group")
        .data(data)
      .enter().append("g")
        .attr("class", "factor1group")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });

    
    factor1group.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2)
        .style("font-size","12px");


    var axisticks1 = svg.selectAll(".axisticks1")
    .data(data)
        .enter().append("g")
        .attr("class", "axisticks1")
        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
        
    axisticks1.filter(function(d,i) { return i < data.length-1; })
      .append("line")
        .attr("class", "group1tick")
        .attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
        .attr("y1",height)
        .attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
        .attr("y2",height+margin.bottom)
        .attr("stroke","black")
        .attr("stroke-width",1);

    var factor2group = factor1group.selectAll(".factor2group")
        .data(function(d) {return d.values;})
       .enter().append("g")
        .attr("class", "factor2group")
        .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });

    var axisticks2 = axisticks1.selectAll(".axisticks2")
    .data(function(d) {return d.values;})
        .enter().append("g")
        .attr("class", "axisticks2")
        .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
        
    axisticks2.filter(function(d,i) { return i < data[0].values.length-1; })
       .append("line")
        .attr("class", "group2tick")
        .attr("x1",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
        .attr("y1",height)
        .attr("x2",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
        .attr("y2",height+margin.bottom/3)
        .attr("stroke","black")
        .attr("stroke-width",1);

    
    var factor3group = factor2group.selectAll(".factor3group")
        .data(function(d) {return d.values;})
       .enter().append("g")
        .attr("class", "factor3group")
        .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });

    var axisticks3 = axisticks2.selectAll(".axisticks3")
    .data(function(d) {return d.values;})
        .enter().append("g")
        .attr("class", "axisticks3")
        .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });
        
    axisticks3.filter(function(d,i) { return i < data[0].values[0].values.length-1; })
       .append("line")
        .attr("class", "group3tick")
        .attr("x1",x2.rangeBand()/2+x2.rangeBand()/(2-2*BarPadding3))
        .attr("y1",height)
        .attr("x2",x2.rangeBand()/2+x2.rangeBand()/(2-2*BarPadding3))
        .attr("y2",height+margin.bottom/5)
        .attr("stroke","black")
        .attr("stroke-width",1);
    
    
    
      axissize(".x0.axis text", x0.rangeBand(), 16);
      axissize(".x1.axis text", x1.rangeBand(), 12);

    
    svg.select("g.x.x0.axis")
        .call(xAxis);

    factor1group.call(xAxis2);
    
    
    factor2group.append("g")
        .attr("class", "x2 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis3)
        .style("font-size","10px")
      .selectAll("text")
       .style("text-anchor", "middle");
    
    axissize(".x2.axis text", x2.rangeBand(), 10);   
       
    factor2group.call(xAxis3);
    
    //Styling. Can also move to CSS.

    svg.selectAll(".axis line")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});


    svg.selectAll(".axis path")
      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});

    svg.selectAll(".tick line")
      .style("opacity","0.2");

    svg.selectAll(".x.axis path")
      .style("display","inline-block");

    //End styling.
    

    var DVbars = factor3group.selectAll("rect")
        .data(function(d) {return d.values; })
      .enter().append("rect")
          .attr("class","databar")
            .attr("width", x3.rangeBand())
            .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
            .style("fill", function(d) { return color(d.key); })
            .attr("x", function(d) {return x3(d.key); })
          .attr("y",height)
          .transition()
          .duration(500)
            .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});
        
     factor3group.selectAll("rect").on("mouseover", function(d) {

            //Get this bar's x/y values, then augment for the tooltip
            var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
              var s1 = t1.translate[0];
              var t2 = d3.transform(d3.select(this.parentNode.parentNode).attr("transform"));
              var s2 = t2.translate[0];
              var t3 = d3.transform(d3.select(this.parentNode.parentNode.parentNode).attr("transform"));
              var s3 = t3.translate[0];
              
            var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + s3 + x3.rangeBand() / 2;
            
          if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
          else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



            //Create the tooltip label
            svg.append("circle")
              .attr("class","tooltip")
              .attr("r",Math.max(x3.rangeBand()/3,20))
              .attr("cx",xPosition)
              .attr("cy",yPosition)
              .style("fill","aliceblue")
              .style("pointer-events","none")
              .style("stroke","black")
              .style("stroke-width","1px")
              .style("stroke-opacity",.8)
              .attr("fill-opacity",.8);
            svg.append("text")
               .attr("class", "tooltip")
               .attr("x", xPosition)
               .attr("y", yPosition)
               .attr("dy","5px")
               .attr("text-anchor", "middle")
               .attr("font-size", "11px")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .style("pointer-events","none")
               .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
               .text(d.values[0][DependentVariable]);
               
            axissize("text.tooltip",Math.max(((x3.rangeBand()*.5) - 1),35),16,12);
           })
      .on("mouseout", function() {
           
            //Remove the tooltip
            d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
          });
          
    var errorbars = factor3group.selectAll(".errorbars")
        .data(function(d) {return d.values; })
       .enter().append("g")
        .attr("class","errorbars")
        .style("pointer-events","none")
        .attr("transform", function(d) {var txt = x3(d.key) + x3.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

    errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",0)
            .attr("y1",height)
            .attr("x2",0)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",0)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",0)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);

    var legend = svg.selectAll(".legend")
        .data(data[0].values[0].values[0].values)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

    legend.append("rect")
        .attr("x", totalwidth)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(d.key);});

    legend.append("text")
        .attr("x", totalwidth - 6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.key; });
    
    var legendtitle = svg.append("g")
        .attr("transform", function(){var txt = totalwidth + 18; return "translate(" + txt + ",8)"; })
      .append("text")
        .attr("class", "legendtitle")
        .style("font-weight","bold")
        .text(factor4)
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "end");
   
   var axiscontrolstitle = svg.append("g")
        .attr("class", "axiscontrolstitle")
        .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });

  axiscontrolstitle.append("text")
        .text("X axis Flips")
        .attr("x", -phasebuttonwidth/2)
        .attr("y",0)
        .style("fill", "steelblue")
        .style("text-anchor", "middle")
        .style("font-weight","bold");


        
    var buttons1 = ["Flip " + factor4, "Flip " + factor3, "Flip " + factor2, "Flip " + factor1];
    var buttons2 = [
            factor1 + "," + factor2 + "," + factor3 + "," + factor4, 
            factor1 + "," + factor2 + "," + factor4 + "," + factor3, 
            factor1 + "," + factor3 + "," + factor2 + "," + factor4, 
            factor1 + "," + factor3 + "," + factor4 + "," + factor2, 
            factor1 + "," + factor4 + "," + factor2 + "," + factor3,
            factor1 + "," + factor4 + "," + factor3 + "," + factor2,
            factor2 + "," + factor1 + "," + factor3 + "," + factor4, 
            factor2 + "," + factor1 + "," + factor4 + "," + factor3, 
            factor2 + "," + factor3 + "," + factor1 + "," + factor4, 
            factor2 + "," + factor3 + "," + factor4 + "," + factor1, 
            factor2 + "," + factor4 + "," + factor1 + "," + factor3,
            factor2 + "," + factor4 + "," + factor3 + "," + factor1,
            factor3 + "," + factor1 + "," + factor2 + "," + factor4, 
            factor3 + "," + factor1 + "," + factor4 + "," + factor2, 
            factor3 + "," + factor2 + "," + factor1 + "," + factor4, 
            factor3 + "," + factor2 + "," + factor4 + "," + factor1, 
            factor3 + "," + factor4 + "," + factor1 + "," + factor2,
            factor3 + "," + factor4 + "," + factor2 + "," + factor1,
            factor4 + "," + factor1 + "," + factor2 + "," + factor3, 
            factor4 + "," + factor1 + "," + factor3 + "," + factor2, 
            factor4 + "," + factor2 + "," + factor1 + "," + factor3, 
            factor4 + "," + factor2 + "," + factor3 + "," + factor1, 
            factor4 + "," + factor3 + "," + factor1 + "," + factor2,
            factor4 + "," + factor3 + "," + factor2 + "," + factor1
            ];
    
    
    var phasebutton = svg.selectAll(".morphbutton")
       .data(buttons1)
       .enter()
        .append("g")
        .attr("class", function(d, i){ return "morphbutton" + i;})
        .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
    
    phasebutton.append("rect")
        .attr("width", phasebuttonwidth)
        .attr("height", phasebuttonheight)
        .attr("rx","5")
        .attr("ry","5")
        .style("fill","#C0C0C0")
        .on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
        .on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
        
    phasebutton.append("text")
        .text(function(d){return d;})
        .classed("morphtext",true)
        .attr("x", phasebuttonwidth/2)
        .attr("y", 15)
        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
        .style("text-anchor","middle")
        .style("fill","white")
        .style("pointer-events","none")
        .style("font-size","1px")
        .style("font-size",function(d){
                var textsize = this.getBBox(); 
                var textwidth = textsize.width;
                var textheight = textsize.height;
                var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
                return restriction + "px";
            });
      

    var redrawtitle = d3.select(chartlocation).append("div")
        .text("Factor Hierarchy (last is legend)")
        .style("font-style","italic")
        .style("color","steelblue");
        
  var phasebutton2 = d3.select(chartlocation)
            .append("select")
            .attr("class","select")
                      .attr("name", "redrawlist")
                      .attr("transform", function() {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values[0].values.length*20 + buttons1.length*21 + 130; return "translate(" + txt + "," + txt2 + ")";});

  var options = phasebutton2.selectAll("option")
       .data(buttons2)
       .enter()
        .append("option");
        
   options.text(function(d){ return d;})
    .attr("value",function(d){return d;})
    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
    .style("font-size","12px");
   

  axissize(".morphtext", phasebuttonwidth-5, 16);

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase1 == 0) {
        x3.rangeRoundBands([x2.rangeBand(), 0]);
        flipphase1 = 1;
        } else if (flipphase1 == 1) {
        x3.rangeRoundBands([0, x2.rangeBand()]);
        flipphase1 = 0; 
        }
    
        factor3group.selectAll("rect")
          .data(function(d) {return d.values; })
          .transition()
              .attr("width", x3.rangeBand())
              .attr("x", function(d) {return x3(d.key); })
              .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));})
              .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
              .style("fill", function(d) { return color(d.key); });
      
          factor3group.selectAll(".errorbars")
            .data(function(d) {return d.values; })
           .transition()
            .attr("transform", function(d) {var txt = x3(d.key) + x3.rangeBand()/2; return "translate(" + txt + ", 0 )"; })
            .each("end", function(){ transitionstate = 0; });
      }
    });

   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase2 == 0) {
        x2.rangeRoundBands([x1.rangeBand(), 0], BarPadding3);
        flipphase2 = 1;
        } else if (flipphase2 == 1) {
        x2.rangeRoundBands([0, x1.rangeBand()], BarPadding3);
        flipphase2 = 0; 
        }
    
        
        
      factor2group.selectAll(".x2.axis")
        .transition()
            .call(xAxis3);
            
      factor2group.selectAll("g.factor3group")
            .data(function(d) {return d.values;})
            .transition()
            .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });
      
      
        setTimeout(function(){transitionstate = 0;},500);
      }
    });

  phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase3 == 0) {
        x1.rangeRoundBands([x0.rangeBand(), 0], BarPadding2);
        flipphase3 = 1;
        } else if (flipphase3 == 1) {
        x1.rangeRoundBands([0, x0.rangeBand()], BarPadding2);
        flipphase3 = 0; 
        }
        
    
        
        
        factor1group.selectAll(".x1.axis").transition().call(xAxis2);
    
    
          factor1group.selectAll("g.factor2group")
            .data(function(d) {return d.values;})
            .transition()
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
    
      
      setTimeout(function(){transitionstate = 0;},500);
      }
    });
    
   phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton3"; })
     .style("font-style","italic")
     .on("click", function(){ 
    if (transitionstate == 0) {
      transitionstate = 1;
    
      if (flipphase4 == 0) {
        x0.rangeRoundBands([width, 0], BarPadding1);
        flipphase4 = 1;
        } else if (flipphase4 == 1) {
        x0.rangeRoundBands([0, width], BarPadding1);
        flipphase4 = 0; 
        }
        

    
        svg.select("g.x.x0.axis")
           .transition()
           .call(xAxis);

      
        
      svg.selectAll("g.factor1group")
              .data(data)
              .transition()
              .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
    
      
      setTimeout(function(){transitionstate = 0;},500);
      }
    });
   
   phasebutton2
     .on("change", menuChanged);
     
  function menuChanged(){ 
    
    var selectedValue = d3.event.target.value;
    var valuearray = selectedValue.split(',');
    
    if (transitionstate == 0) {
      transitionstate = 1;

      flipphase1 = 0;
      flipphase2 = 0;
      flipphase3 = 0;
      flipphase4 = 0;
      
      
      processchange(valuearray[0],valuearray[1],valuearray[2],valuearray[3]);

      }
    }

    function processchange(var1,var2,var3,var4){
      

      
      data = d3.nest()
        .key(function(d) { return d[var1]; })  
        .key(function(d) { return d[var2]; }) 
        .key(function(d) { return d[var3]; })  
        .key(function(d) { return d[var4]; })  
        .entries(rawdata);
    

    
      for (i=0; i<data.length; i++)
      {
        for (j=0; j<data[i].values.length; j++)
        {
          for (k=0; k<data[i].values[j].values.length; k++)
          {
            for (l=0; l<data[i].values[j].values[k].values.length; l++)
              {
              data[i].values[j].values[k].values[l].values[0].stderror = +data[i].values[j].values[k].values[l].values[0].stderror;
              data[i].values[j].values[k].values[l].values[0][DependentVariable] = +data[i].values[j].values[k].values[l].values[0][DependentVariable];
              }
          }
        }
      }
      
    x0.domain(data.map(function(d) { return d.key; })).rangeRoundBands([0, width], BarPadding1);
    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x0.rangeBand()], BarPadding2);
    x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x1.rangeBand()], BarPadding3);
    x3.domain(data[0]['values'][0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRoundBands([0, x2.rangeBand()]);

    
    levelsoffactor4 = data[0]['values'][0]['values'][0]['values'].length;
      color.range((function(){
                return colorscheme[levelsoffactor4] || colorpalettes.defaultcolors[levelsoffactor4];
              })()
        );
        
      color.domain(data[0]['values'][0]['values'][0]['values'].map(function(d) { return d.key; }));
        

      svg.selectAll(".databar").transition().duration(500).attr("y",1000).transition().remove();
      svg.selectAll(".errorline").transition().duration(500).attr("y1",1000).attr("y2",1000).transition().remove();

    
      setTimeout(function(){
      
      xAxis.scale(x0);
        xAxis2.scale(x1);
        xAxis3.scale(x2);
        
      svg.select(".x.axis")
        .call(xAxis);

    
      factor1group = factor1group.data([]).exit().remove();
      axisticks1 = axisticks1.data([]).exit().remove();
      

      factor1group = svg.selectAll(".factor1group")
            .data(data)
          .enter().append("g")
            .attr("class", "factor1group")
            .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
    
        factor1group.append("g")
            .attr("class", "x1 axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2)
            .style("font-size","12px");
          
          axisticks1 = svg.selectAll(".axisticks1")
            .data(data)
          .enter().append("g")
            .attr("class", "axisticks1")
            .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
    
      
        axisticks1.filter(function(d,i) { return i < data.length-1; })
          .append("line")
            .attr("class", "group1tick")
            .attr("x1",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
            .attr("y1",height)
            .attr("x2",x0.rangeBand()/2+x0.rangeBand()/(2-2*BarPadding1))
            .attr("y2",height+margin.bottom)
            .attr("stroke","black")
            .attr("stroke-width",1);

        factor2group = factor1group.selectAll(".factor2group")
            .data(function(d) {return d.values;})
          .enter().append("g")
            .attr("class", "factor2group")
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });
          
          axisticks2 = axisticks1.selectAll(".axisticks2")
            .data(function(d) {return d.values;})
          .enter().append("g")
            .attr("class", "axisticks2")
            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });

        axisticks2.filter(function(d,i) { return i < data[0].values.length-1; })
          .append("line")
            .attr("class", "group2tick")
            .attr("x1",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
            .attr("y1",height)
            .attr("x2",x1.rangeBand()/2+x1.rangeBand()/(2-2*BarPadding2))
            .attr("y2",height+margin.bottom/3)
            .attr("stroke","black")
            .attr("stroke-width",1);
            
       factor3group = factor2group.selectAll(".factor3group")
        .data(function(d) {return d.values;})
       .enter().append("g")
        .attr("class", "factor3group")
        .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });

    axisticks3 = axisticks2.selectAll(".axisticks3")
      .data(function(d) {return d.values;})
        .enter().append("g")
        .attr("class", "axisticks3")
        .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });
        
    axisticks3.filter(function(d,i) { return i < data[0].values[0].values.length-1; })
       .append("line")
        .attr("class", "group3tick")
        .attr("x1",x2.rangeBand()/2+x2.rangeBand()/(2-2*BarPadding3))
        .attr("y1",height)
        .attr("x2",x2.rangeBand()/2+x2.rangeBand()/(2-2*BarPadding3))
        .attr("y2",height+margin.bottom/5)
        .attr("stroke","black")
        .attr("stroke-width",1);

        axissize(".x0.axis text", x0.rangeBand(), 16);
          axissize(".x1.axis text", x1.rangeBand(), 12);
          axissize(".x2.axis text", x2.rangeBand(), 10);
    


    
    svg.select("g.x.x0.axis")
        .call(xAxis);

    factor1group.call(xAxis2);
    
    
    factor2group.append("g")
        .attr("class", "x2 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis3)
        .style("font-size","10px")
      .selectAll("text")
       .style("text-anchor", "middle");
    
    axissize(".x2.axis text", x2.rangeBand(), 10);   
       
    factor2group.call(xAxis3);
    
        DVbars = factor3group.selectAll("rect")
            .data(function(d) {return d.values; })
          .enter().append("rect")
          .attr("class","databar")
            .attr("width", x3.rangeBand())
            .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(0)); })
            .style("fill", function(d) { return color(d.key); })
            .attr("x", function(d) {return x3(d.key); })
          .attr("y",height)
          .transition()
          .duration(500)
            .attr("y", function(d) {return y(Math.max(0,d.values[0][DependentVariable]));});
            
          factor3group.selectAll("rect").on("mouseover", function(d) {

            //Get this bar's x/y values, then augment for the tooltip
            var t1 = d3.transform(d3.select(this.parentNode).attr("transform"));
              var s1 = t1.translate[0];
              var t2 = d3.transform(d3.select(this.parentNode.parentNode).attr("transform"));
              var s2 = t2.translate[0];
              var t3 = d3.transform(d3.select(this.parentNode.parentNode.parentNode).attr("transform"));
              var s3 = t3.translate[0];
              
            var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + s3 + x3.rangeBand() / 2;
            
          if (d.values[0][DependentVariable] >=0) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
          else if (d.values[0][DependentVariable] <0) {var yPosition = y(0) + parseFloat(d3.select(this).attr("height"))*3/4;}



            //Create the tooltip label
            svg.append("circle")
              .attr("class","tooltip")
              .attr("r",Math.max(x3.rangeBand()/3,20))
              .attr("cx",xPosition)
              .attr("cy",yPosition)
              .style("fill","aliceblue")
              .style("pointer-events","none")
              .style("stroke","black")
              .style("stroke-width","1px")
              .style("stroke-opacity",.8)
              .attr("fill-opacity",.8);
            svg.append("text")
               .attr("class", "tooltip")
               .attr("x", xPosition)
               .attr("y", yPosition)
               .attr("dy","5px")
               .attr("text-anchor", "middle")
               .attr("font-size", "11px")
               .attr("font-weight", "bold")
               .attr("fill", "black")
               .style("pointer-events","none")
               .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
               .text(d.values[0][DependentVariable]);
               
            axissize("text.tooltip",Math.max(((x3.rangeBand()*.5) - 1),35),16,12);
           })
      .on("mouseout", function() {
           
            //Remove the tooltip
            d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
          });

        errorbars = factor3group.selectAll(".errorbars")
            .data(function(d) {return d.values; })
          .enter().append("g")
          .attr("class","errorbars")
          .style("pointer-events","none")
            .attr("transform", function(d) {var txt = x3(d.key) + x3.rangeBand()/2; return "translate(" + txt + ", 0 )"; });

        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",0)
            .attr("y1",height)
            .attr("x2",0)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",0)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",0)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);});
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] + d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);
    
        errorbars
          .append("line")
          .attr("class","errorline")
          .attr("stroke","black")
            .attr("stroke-width",errorwidth)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",height)
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",height)
          .transition()
          .duration(500)
            .attr("x1",-x3.rangeBand()/4)
            .attr("y1",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("x2",x3.rangeBand()/4)
            .attr("y2",function(d) {var txt = d.values[0][DependentVariable] - d.values[0].stderror; return y(txt);})
            .attr("stroke","black")
            .attr("stroke-width",errorwidth);

        legend.data([]).exit().remove();

        legend = svg.selectAll(".legend")
            .data(data[0].values[0].values[0].values)
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {var txt = i*20 + 20; return "translate(0," + txt + ")"; });

        legend.append("rect")
          .transition()
            .attr("x", totalwidth)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) {return color(d.key);});

      legend.append("text")
        .transition()
            .attr("x", totalwidth - 6)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d.key; });

        legendtitle.text(var4);
        
         axiscontrolstitle
            .transition()
            .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values[0].values.length*20 + 60; return "translate(" + txt + "," + txt2 + ")"; });
        
        phasebutton
            .transition()
              .attr("transform", function(d,i) {var txt = totalwidth-phasebuttonwidth + 18; var txt2 = data[0].values[0].values[0].values.length*20 + i*21 + 90; return "translate(" + txt + "," + txt2 + ")";});
      
      redrawtitle
        .transition()
              .attr("transform", function(){var txt = totalwidth + 18; var txt2 = data[0].values[0].values[0].values.length*20 + buttons1.length*21 + 125; return "translate(" + txt + "," + txt2 + ")"; });

      phasebutton2
        .transition()
              .attr("transform", function() {var txt = totalwidth-phasebuttonwidth+18; var txt2 = data[0].values[0].values[0].values.length*20 + buttons1.length*21 + 130; return "translate(" + txt + "," + txt2 + ")";});

      
      phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
      .selectAll("text")
      .text("Flip " + var4);
                
      phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
      .selectAll("text")
      .text("Flip " + var3);
          
          phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
      .selectAll("text")
      .text("Flip " + var2);
          
          phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton3"; })
      .selectAll("text")
      .text("Flip " + var1);
      

      transitionstate = 0;
     },500);
    }
    
  });
}

