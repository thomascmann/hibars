
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
  10:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F","#B276B2","#C2D580"],
  11:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F","#B276B2","#C2D580","4D4D4D"],
  12:["#5DA5DA","#F15854","#60BD68","#845C59","#FAA43A","#41977E","#F17CB0","#DECF3F","#B276B2","#C2D580","4D4D4D","#673333"]
  }
};


function hibars(settings){

  	var chartlocation = "#" + settings.location;
  	var dataset = settings.datafile;

  	var DependentVariable = settings.dependent;
  	var factor1 = settings.factor1;
  	var factor2 = settings.factor2;
  	var numfactors = 2;
  	if (settings.factor3) 
  		{
  			var factor3 = settings.factor3;
  			numfactors = 3;
  		}
  	if (settings.factor4) 
  		{
  			var factor4 = settings.factor4;
  			numfactors = 4;
  		}
  	var chartwidth = settings.chartwidth || 800;
  	var chartheight = settings.chartheight || 500;
  	var colorscheme = settings.colorscheme || colorpalettes.defaultcolors;
  	var auto_size = settings.auto_size || "no";
  	var show_controls = settings.controls || "yes";
  	var y_reference = settings.y_reference || 0;
  	var errors = settings.errors || "stderror";

  	if ((settings.errorLO) && (settings.errorHI)) 
  	{
  		var errorLO = settings.errorLO;
  		var errorHI = settings.errorHI;
  	}



  	var margin = {top: 0.04*chartheight, right: 0.025*chartwidth, bottom: 0.12*chartheight, 
  		left: 0.09375*chartwidth, legend: 0.15*chartwidth},
    	width = chartwidth - margin.left - margin.right - margin.legend,
    	totalwidth = chartwidth - margin.left - margin.right,
    	height = chartheight - margin.top - margin.bottom;

	var BarPadding1 = .1;
	var BarPadding2 = .1;
	var BarPadding3 = .1;
	if (numfactors == 4) {BarPadding1 = .05;}
	var levelsoffactor;

	var x0 = d3.scaleBand()
		.rangeRound([0, width]).padding(BarPadding1);

	var x1 = d3.scaleBand();

	var x2 = d3.scaleBand();

	var x3 = d3.scaleBand();

	var y = d3.scaleLinear()
		.range([height, 0]);

	var color;

	var errorwidth = Math.min(0.0025*chartwidth, 0.004*chartheight);

	var xAxis = d3.axisBottom()
		.scale(x0)
	    .tickSize(0)
	    .tickPadding(margin.bottom*2/3);

	var xAxis2 = d3.axisBottom()
     	.tickSize(0)
    	.tickPadding(margin.bottom*1/5);

    if (numfactors == 4)
    {
    	var xAxis3 = d3.axisBottom()
    	    .tickSizeInner(0)
      		.tickSizeOuter(0)
      		.tickPadding(margin.bottom*1/8);

      	xAxis.tickPadding(margin.bottom*3/5);
      	xAxis2.tickPadding(margin.bottom*1/3);
    }
  	
  	function formatter(d){
	    if (Math.abs(d) < 1000)
		{
			return d3.format(" ")(d);
		}
		if (Math.abs(d) >= 1000 && Math.abs(d) < 1000000)
		{
			return (d/1000 + "k");
		}
		else if (Math.abs(d) >= 1000000 && Math.abs(d) < 1000000000)
		{
			return (d3.format(" ")(d/1000000) + "M");
		}
		else if (Math.abs(d) >= 1000000000 && Math.abs(d) < 1000000000000)
		{
			return (d3.format(" ")(d/1000000000) + "B");
		}
		else if (Math.abs(d) >= 1000000000000 && Math.abs(d) < 1000000000000000)
		{
			return (d3.format(" ")(d/1000000000000) + "T");
		}
		else if (Math.abs(d) >= 1000000000000000 && Math.abs(d) < 1000000000000000000)
		{
			return (d3.format(" ")(d/1000000000000000) + "P");
		}
		else if (Math.abs(d) >= 1000000000000000000 && Math.abs(d) < 1000000000000000000000)
		{
			return (d3.format(" ")(d/1000000000000000000) + "E");
		}
		else if (Math.abs(d) >= 1000000000000000000000 && Math.abs(d) < 1000000000000000000000000)
		{
			return (d3.format(" ")(d/1000000000000000000000) + "Z");
		}
		else
		{
			return (d3.format(" ")(d/1000000000000000000000000) + "Y");
		}
  	}

  	var yAxis = d3.axisLeft()
    	.scale(y)
    	//.tickArguments([,"s"])
    	.tickFormat(function(d)
    		{
    			return formatter(d);
    		})
    	.tickSizeInner(-width)
    	.tickSizeOuter(0)
    	.tickPadding(0.0125*chartwidth);

	if (auto_size == "no")
	{
	  var svg = d3.select(chartlocation)
	    .style("text-align","center")
	    .append("svg")
	    	.attr("width", width + margin.left + margin.right + margin.legend)
	    	.attr("height", height + margin.top + margin.bottom)
	    	.append("g")
	      		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	} 
	else if (auto_size == "yes")
	{
		var locationdiv = d3.select(chartlocation)
			.style("text-align","center")
			.append("div")
				.style("display","inline-block")
				.style("position","relative")
				.style("width","100%")
				.style("padding-bottom","calc(100% * " + chartheight/chartwidth + ")")
				//.style("padding-bottom","100%")
				.style("vertical-align","top")
				.style("overflow","hidden");

		var svg = locationdiv
	    	.append("svg")
	      		.attr("viewBox","0 0 " + chartwidth + " " + chartheight)
	      		.attr("preserveAspectRatio","xMinYMin meet")
			    //.attr("width", chartwidth)
			    //.attr("height", chartheight)
			    .style("display","inline-block")
			    .style("position","absolute")
			    .style("top","0px")
			    .style("left","0px")
	    		.append("g")
	      			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

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
	//var phasebuttonwidth = 0.15*chartwidth;
	var phasebuttonwidth = 0.95*margin.legend;
	var phasebuttonheight = 0.05*height;

	//if (phasebuttonheight > 20) {phasebuttonheight = 20;}

	var legendboxsize = Math.min(phasebuttonwidth,phasebuttonheight,margin.legend*0.5)*0.9;

	function axissize(relevantclass, outerwidth, outerheight, maxsize, minsize) 
	{
  		var sizes = [];
  		svg.selectAll(relevantclass)
  		.style("font-size","1px")
        .each(function(){
        	var textsize = this.getBBox(); 
            if (textsize.width == null) {textsize.width = 10;}
            if (textsize.height == null) {textsize.height = 1;}
            sizes.push(outerwidth/(textsize.width));
            if (outerheight){
                sizes.push(outerheight/(textsize.height));
            }
        });
       	if (maxsize) {sizes.push(maxsize);}
       	if (minsize)
       	{
       		var sizeval = Math.max(d3.min(sizes),minsize);
       	}
        else 
        {
        	var sizeval = d3.min(sizes);
        }
       	svg.selectAll(relevantclass).style("font-size",sizeval + "px");
       	return sizeval;
  	}

  	d3.csv(dataset, function(error, rawdata) {
	    if (error) throw error;
	    if (numfactors == 2)
	    {
		  	var data = d3.nest()
		    	.key(function(d) { return d[factor1]; })  
		    	.key(function(d) { return d[factor2]; })  
		    	.entries(rawdata);
		    
		    	for (i=0; i<data.length; i++)
		    	{
		    		for (j=0; j<data[i].values.length; j++)
		    		{
		    			if ((errorLO) && (errorHI))
		    			{
		    				data[i].values[j].values[0].errorHI = +data[i].values[j].values[0][errorHI];
		    				data[i].values[j].values[0].errorLO = +data[i].values[j].values[0][errorLO];
		    			}
		    			else
		    			{
			    			data[i].values[j].values[0].errorHI = +data[i].values[j].values[0][DependentVariable] + +data[i].values[j].values[0][errors];
		    				data[i].values[j].values[0].errorLO = +data[i].values[j].values[0][DependentVariable] - +data[i].values[j].values[0][errors];
		    			}

		    			data[i].values[j].values[0][DependentVariable] = +data[i].values[j].values[0][DependentVariable];
		    		}
		    	}
		    	
		    x0.domain(data.map(function(d) { return d.key; }));
		    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]);
		    
		    levelsoffactor = data[0]['values'].length;
		    y.domain([Math.min(y_reference,d3.min(data, function(d) { 
		        return d3.min(d.values, function(d) 
		            { 
		              return d3.min(d.values, function(d)
		                {
		                	return d["errorLO"];
		                });
		            }); 
		    	})), 
		    	Math.max(y_reference,d3.max(data, function(d) 
		        { 
			        return d3.max(d.values, function(d) 
			        { 
			            return d3.max(d.values, function(d)
			            {
			                  return d["errorHI"];
			            });
			        }); 
		        }))
		    ]).nice();
	    }
	    else if (numfactors == 3)
	    {
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
			          	if ((errorLO) && (errorHI))
			          	{
		    				data[i].values[j].values[k].values[0].errorHI = +data[i].values[j].values[k].values[0][errorHI];
		    				data[i].values[j].values[k].values[0].errorLO = +data[i].values[j].values[k].values[0][errorLO];
			          	}
			          	else
			          	{
		    				data[i].values[j].values[k].values[0].errorHI = +data[i].values[j].values[k].values[0][DependentVariable] + +data[i].values[j].values[k].values[0][errors];
		    				data[i].values[j].values[k].values[0].errorLO = +data[i].values[j].values[k].values[0][DependentVariable] - +data[i].values[j].values[k].values[0][errors];
			          	}
		    			data[i].values[j].values[k].values[0][DependentVariable] = +data[i].values[j].values[k].values[0][DependentVariable];
			          }
			        }
			    }
			      
			x0.domain(data.map(function(d) { return d.key; }));
			x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
			x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x1.bandwidth()]);
			    
			xAxis2.scale(x1);
			    
			levelsoffactor = data[0]['values'][0]['values'].length;
			y.domain([Math.min(y_reference,d3.min(data, function(d) { 
		        return d3.min(d.values, function(d) 
		            { 
		              return d3.min(d.values, function(d)
		                {
		                  return d3.min(d.values, function(d)
		                  {
		                    return d["errorLO"];
		                  });
		                });
		            }); 
		          })), 
		          Math.max(y_reference,d3.max(data, function(d) { 
		          return d3.max(d.values, function(d) 
		            { 
		              return d3.max(d.values, function(d)
		                {
		                  return d3.max(d.values, function(d)
		                  {
		                    return d["errorHI"];
		                  });
		                });
		            }); 
		        }))
		    ]).nice();
			
			phasebuttonheight = Math.min(0.05*height, (height - data[0]['values'][0]['values'][0]['values'].length*legendboxsize*1.1)/16, 
    			(height - data[0]['values'][0]['values'].length*legendboxsize*1.1)/16, 
    			(height - data[0]['values'].length*legendboxsize*1.1)/16, legendboxsize);
	    }
	    else if (numfactors == 4)
	    {
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
			              		if ((errorLO) && (errorHI))
			              		{
		    						data[i].values[j].values[k].values[l].values[0].errorHI = +data[i].values[j].values[k].values[l].values[0][errorHI];
		    						data[i].values[j].values[k].values[l].values[0].errorLO = +data[i].values[j].values[k].values[l].values[0][errorLO];
			              		}
			              		else 
			              		{
		    						data[i].values[j].values[k].values[l].values[0].errorHI = +data[i].values[j].values[k].values[l].values[0][DependentVariable] + +data[i].values[j].values[k].values[l].values[0][errors];
		    						data[i].values[j].values[k].values[l].values[0].errorLO = +data[i].values[j].values[k].values[l].values[0][DependentVariable] - +data[i].values[j].values[k].values[l].values[0][errors];
			              		}
		    					data[i].values[j].values[k].values[l].values[0][DependentVariable] = +data[i].values[j].values[k].values[l].values[0][DependentVariable];
			              	}
			          	}
			        }
			    }
			      
			    x0.domain(data.map(function(d) { return d.key; }));
			    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
			    x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x1.bandwidth()]).padding(BarPadding3);
			    x3.domain(data[0]['values'][0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x2.bandwidth()]);

			    
			    xAxis2.scale(x1);
			    xAxis3.scale(x2);
			    
			    levelsoffactor = data[0]['values'][0]['values'][0]['values'].length;
			        
			    y.domain([Math.min(y_reference,d3.min(data, function(d) { 
			          return d3.min(d.values, function(d) 
			            { 
			              return d3.min(d.values, function(d)
			                {
			                  return d3.min(d.values, function(d)
			                  {
			                    return d3.min(d.values, function(d)
			                    {
			                    	return d["errorLO"];
			                    });
			                  });
			                });
			            }); 
			          })), 
			        Math.max(y_reference,d3.max(data, function(d) { 
			          return d3.max(d.values, function(d) 
			            { 
			              return d3.max(d.values, function(d)
			              {
			                return d3.max(d.values, function(d)
			                {
			                  return d3.max(d.values, function(d)
			                  {
			                    return d["errorHI"]; 
			                  });
			                });
			              });
			            }); 
			        }))
			    ]).nice();
	    }


	    var color = d3.scaleOrdinal()
	      	.range((function()
	      		{
	            	return colorscheme[levelsoffactor] || colorpalettes.defaultcolors[levelsoffactor];
	        	})()
	        );
	      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]); 	

	    svg.append("g")
	        .attr("class", "x x0 axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    svg.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("x", -(height)/2)
	        .attr("y", function(d){
	        	var textsize = this.getBBox(); 
	          	var textwidth = textsize.width;
	          	var textheight = textsize.height;
	          	var restriction = -(margin.left) + Math.min(width/(textsize.height*1.1), 0.03*chartwidth);
	          	return restriction;
	    	})
	        //.attr("dy", 0.25*margin.left)
	        .style("text-anchor", "middle")
	        .text(DependentVariable)
	        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
	        .style("font-size","1px")
	        .style("font-size",function(d){
	        	var textsize = this.getBBox(); 
	          	var textwidth = textsize.width;
	          	var textheight = textsize.height;
	          	var restriction = Math.min(height/(textsize.width*1.1), 0.35*margin.left/(textsize.height*1.1));
	          	return restriction + "px";
	    	});
	  
		/*    if (y.domain()[0] < 0 && y.domain()[1] > 0) {
	      svg.append("g")
	          .attr("class", "x axis")
	        .append("line")
	          .attr("x1", 0)
	          .attr("y1", y(0))
	          .attr("x2", width)
	          .attr("y2", y(0))
	          .style("stroke","black")
	          .style("stroke-width",0.002*chartheight);
	    }*/

	    var factor1group = svg.selectAll(".factor1group")
	        .data(data)
	      	.enter().append("g")
	        .attr("class", "factor1group")
	        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });

	    if (numfactors > 2)
	    {
	    	factor1group.append("g")
	        .attr("class", "x1 axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis2)
	        .style("font-size","12px");
	    }

	    var axisticks1 = svg.selectAll(".axisticks1")
	    	.data(data)
	        .enter().append("g")
	        .attr("class", "axisticks1")
	        .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
	        
	    axisticks1.filter(function(d,i) { return i < data.length-1; })
	      	.append("line")
	        .attr("class", "group1tick")
	    	.attr("x1",x0.bandwidth()/2+x0.bandwidth()/(2-2*BarPadding1))
	    	.attr("y1",height)
	    	.attr("x2",x0.bandwidth()/2+x0.bandwidth()/(2-2*BarPadding1))
	    	.attr("y2",height+margin.bottom)
	    	.attr("stroke","black")
	    	.attr("stroke-width",0.002*chartheight);

	    if (numfactors > 2) 
	    {
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
		        .attr("x1",x1.bandwidth()/2+x1.bandwidth()/(2-2*BarPadding2))
		        .attr("y1",height)
		        .attr("x2",x1.bandwidth()/2+x1.bandwidth()/(2-2*BarPadding2))
		        .attr("y2",height+margin.bottom/3)
		        .attr("stroke","black")
		        .attr("stroke-width",0.002*chartheight);
	    }

	    if (numfactors > 3)
	    {
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
		        .attr("x1",x2.bandwidth()/2+x2.bandwidth()/(2-2*BarPadding3))
		        .attr("y1",height)
		        .attr("x2",x2.bandwidth()/2+x2.bandwidth()/(2-2*BarPadding3))
		        .attr("y2",height+margin.bottom/5)
		        .attr("stroke","black")
		        .attr("stroke-width",0.002*chartheight);
	    }

	    axissize(".x0.axis text", x0.bandwidth()*0.95, 0.3*margin.bottom);	    
	    
	    if (numfactors > 2)
	    {
	    	axissize(".x1.axis text", x1.bandwidth()*0.95, 0.25*margin.bottom);
	    }

	    svg.select("g.x.x0.axis")
	        .call(xAxis);
	    
	    if (numfactors > 2)
	    {
			factor1group.call(xAxis2);
	    }

	    if (numfactors > 3)
	    {
	    	factor2group.append("g")
		        .attr("class", "x2 axis")
		        .attr("transform", "translate(0," + height + ")")
		        .call(xAxis3)
		        .style("font-size","10px")
		      .selectAll("text")
		       	.style("text-anchor", "middle");   
		    
		    axissize(".x2.axis text", x2.bandwidth()*0.95, 0.2*margin.bottom, Math.min(0.0125*chartwidth, 0.02*chartheight));   
		    factor2group.call(xAxis3);
	    }

	    
	    //axissize(".x0.axis text", x0.bandwidth(), 0.02*chartwidth, 0, 0.032*chartheight);

	    //Styling. Can also move to CSS.
		/*
	    svg.selectAll(".axis line")
	      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});

	    svg.selectAll(".axis path")
	      .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});

	    svg.selectAll(".x.axis path")
	      .style("display","inline-block");
		*/
		
		var tickarray = [];
		svg.selectAll("g.tick")
			.each(function(d){if (!isNaN(parseFloat(d)) && isFinite(d)) {tickarray.push(d);}})
		
		svg.selectAll("g.tick")
	    	.filter(function(d){ return d!=y_reference;} )
	    	.select('line')
	    	.style("opacity","0.2");

		if (tickarray.indexOf(y_reference) == -1)
		{
	      	svg.selectAll("g.y.axis")
	      	.append("g")
	          	.attr("class", "tick refline")
	        .append("line")
	          	.attr("x1", 0)
	          	.attr("y1", y(y_reference))
	          	.attr("x2", width)
	          	.attr("y2", y(y_reference))
	          	.style("stroke","black")
	          	.style("stroke-width",0.002*chartheight);	

	        svg
	        .append("text")
	        	.attr("class","y axis reftext")
	        	.attr("x", 0)
	        	.attr("y", y(y_reference))
	        	.attr("dy",-0.004*chartheight)
	        	.text(formatter(y_reference))
	        	.attr("text-anchor", "start")
			    .attr("font-weight", "bold")
			    .attr("font-style","italic")
			    .attr("fill", "black")
			    .style("pointer-events","none")
			    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
		}

		//if (y.domain()[0] < 0 && y.domain()[1] > 0) {
	    svg.selectAll("g.tick")
	    	.select('line')
			.attr("stroke-width",0.002*chartheight);
		//}

		svg.selectAll(".axis path")
			.attr("stroke-width",0.002*chartheight);

		svg.selectAll("g.x1, g.x2")
			.selectAll('path')
			.attr("display","none");

	    svg.selectAll(".y.axis")
	        .style("font-size",function(){return Math.min(0.032*chartheight, 0.032*chartwidth, margin.left*.15) + "px";});

	    //End styling.

	    if (numfactors == 2) {
	    	var baraxis = x1; 
	    	var prebaraxis = x0;
	    	var bargroup = factor1group;
	    	var bardata = data[0];
	    	var barfactor = factor2;
	    }
	    else if (numfactors == 3) {
	    	var baraxis = x2; 
	    	var prebaraxis = x1;
	    	var bargroup = factor2group;
	    	var bardata = data[0].values[0];
	    	var barfactor = factor3;
	    }
	    else if (numfactors == 4) {
	    	var baraxis = x3; 
	    	var prebaraxis = x2;
	    	var preprebaraxis = x1;
	    	var bargroup = factor3group;
	    	var bardata = data[0].values[0].values[0];
	    	var barfactor = factor4;
	    }

	    var DVbars = bargroup.selectAll("rect")
	        .data(function(d) {return d.values; })
	      		.enter()
	      		.append("rect")
	      		.attr("class","databar")
	        	.attr("width", baraxis.bandwidth())
	        	.attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(y_reference)); })
	        	.style("fill", function(d) { return color(d.key); })
	        	.attr("x", function(d) {return baraxis(d.key); })
	      		.attr("y",height)
	      		.transition()
	      		.duration(500)
          		.attr("y", function(d) 
	        		{
	        			if (d.values[0][DependentVariable] >= y_reference)
	        			{
	        				d.values[0].adj = Math.min(50/chartheight,.5);
	        				return y(d.values[0][DependentVariable]) + d.values[0].adj;
	        			}
	        			else if (d.values[0][DependentVariable] < y_reference)
	        			{
	        				d.values[0].adj = 1 - Math.min(50/chartheight,.5);
	        				return y(y_reference) + d.values[0].adj;
	        			}
	        		});

	    bargroup.selectAll("rect").on("mouseover", function(d) 
	    {
		  	//Get this bar's x/y values, then augment for the tooltip
		    var t1 = d3.select(this.parentNode).attr("transform");
		    var translated = t1.substring(t1.indexOf("(")+1, t1.indexOf(")")).split(",");
		    var s1 = Number(translated[0]);
		    var s2 = 0;
		    if (numfactors > 2)
		    {
		    	var t2 = d3.select(this.parentNode.parentNode).attr("transform");
            	var translated2 = t2.substring(t2.indexOf("(")+1, t2.indexOf(")")).split(",");
            	s2 = Number(translated2[0]);
		    }
		    var s3 = 0;
		    if (numfactors > 3)
		    {
			   	var t3 = d3.select(this.parentNode.parentNode.parentNode).attr("transform");
	            var translated3 = t3.substring(t3.indexOf("(")+1, t3.indexOf(")")).split(",");
	            s3 = Number(translated3[0]);
		    }
		    
		    var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + s3 + baraxis.bandwidth() / 2;

		  	if (d.values[0][DependentVariable] >=y_reference) 
		  		{
		  			var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;
		  		}
		    else if (d.values[0][DependentVariable] <y_reference) 
		    	{
		    		var yPosition = y(y_reference) + parseFloat(d3.select(this).attr("height"))*3/4;
		    	}
		    
		    var toolsize = Math.max(baraxis.bandwidth()/2.5,0.02*chartwidth,0.02*chartheight);
		  	//Create the tooltip label
			svg.append("circle")
				.attr("class","tooltip")
				.attr("r",toolsize)
				.attr("cx",xPosition)
				.attr("cy",yPosition)
				.style("fill","aliceblue")
				.style("pointer-events","none")
				.style("stroke","black")
				.style("stroke-width",0.002*chartheight + "px")
				.style("stroke-opacity",.8)
				.attr("fill-opacity",.8);
			svg.append("text")
			    .attr("class", "tooltip")
			    .attr("x", xPosition)
			    .attr("y", yPosition)
			    .attr("dy", 0.35*toolsize + "px")
			    .attr("text-anchor", "middle")
			    //.attr("font-weight", "bold")
			    .attr("fill", "black")
			    .style("pointer-events","none")
			    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
			    .text(d.values[0][DependentVariable]);	   
		  		
		  		var fontsize = axissize("text.tooltip",toolsize*3/2,toolsize);
		  		d3.selectAll("text.tooltip")
		  			.attr("dy",fontsize/2.5 + "px");
	  	})
	  	.on("mouseout", function() 
	  	{
	  		//Remove the tooltip
	  		d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
	  	});

	    var errorbars = bargroup.selectAll(".errorbars")
	        .data(function(d) {return d.values; })
	    	.enter().append("g")
	    	.attr("class","errorbars")
	    	.style("pointer-events","none")
	    	.attr("transform", function(d) {var txt = baraxis(d.key) + baraxis.bandwidth()/2; return "translate(" + txt + ", 0 )"; });

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
	  		.attr("y1",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
	  		.attr("x2",0)
	  		.attr("y2",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;});

		errorbars
	  		.append("line")
	  		.attr("class","errorline")
	  		.attr("stroke","black")
	  		.attr("stroke-width",errorwidth)
	  		.attr("x1",-baraxis.bandwidth()/4)
	  		.attr("y1",height)
	  		.attr("x2",baraxis.bandwidth()/4)
	  		.attr("y2",height)
	  		.transition()
	  		.duration(500)
	  		.attr("x1",-baraxis.bandwidth()/4)
	  		.attr("y1",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
	  		.attr("x2",baraxis.bandwidth()/4)
	  		.attr("y2",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
	  		.attr("stroke","black")
	  		.attr("stroke-width",errorwidth);

		errorbars
	  		.append("line")
	  		.attr("class","errorline")
	  		.attr("stroke","black")
	  		.attr("stroke-width",errorwidth)
	  		.attr("x1",-baraxis.bandwidth()/4)
	  		.attr("y1",height)
	  		.attr("x2",baraxis.bandwidth()/4)
	  		.attr("y2",height)
	  		.transition()
	  		.duration(500)
	  		.attr("x1",-baraxis.bandwidth()/4)
	  		.attr("y1",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;})
	  		.attr("x2",baraxis.bandwidth()/4)
	  		.attr("y2",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;})
	  		.attr("stroke","black")
	  		.attr("stroke-width",errorwidth);

	    var legend = svg.selectAll(".legend")
	        .data(bardata.values)
	      	.enter().append("g")
	        .attr("class", "legend")
	        .attr("transform", function(d, i) {var txt = i*legendboxsize*1.1 + legendboxsize; return "translate(0," + txt + ")"; });

	    legend.append("rect")
	        .attr("x", chartwidth - margin.left - legendboxsize)
	        .attr("width", legendboxsize)
	        .attr("height", legendboxsize)
	        .style("fill", function(d) {return color(d.key);});

	    legend.append("text")
	        .attr("x", (chartwidth - margin.left - legendboxsize)*0.991489)
	        .attr("y", legendboxsize/2)
	        .attr("dy", legendboxsize/3.2)
	        .style("text-anchor", "end")
	        .text(function(d) { return d.key; })
	        .classed("legendtext",true)
	        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
	        // .style("font-size","1px");
	        // .style("font-size",function(d){
	        //         var textsize = this.getBBox(); 
	        //         var textwidth = textsize.width;
	        //         var textheight = textsize.height;
	        //         var restriction = Math.min((margin.legend - legendboxsize)/(textsize.width), legendboxsize/(textsize.height), 16);
	        //         return restriction + "px";
	        //     });
	    
	    var legendtitle = svg.append("g")
	    	.attr("transform", function(){var txt = chartwidth - margin.left; return "translate(" + txt + "," + legendboxsize/2 + ")";})
	    	.append("text")
	    	//.style("font-weight","bold")
	    	.text(barfactor)
	    	.attr("class", "legendtitle")
	        .attr("x", 0)
	        .attr("y", 0)
	        .style("text-anchor", "end")
	        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
	        // .style("font-size","1px");
	      //   .style("font-size",function(d){
	      //     var textsize = this.getBBox(); 
	      //     var textwidth = textsize.width;
	      //     var textheight = textsize.height;
	      //     var restriction = Math.min((phasebuttonwidth)/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
	      //     return restriction + "px";
	      // });
	   
	   	axissize("text.legendtext", margin.legend - legendboxsize, legendboxsize*0.8);
		axissize("text.legendtitle", margin.legend*0.8, legendboxsize);
		d3.selectAll("text.legendtitle").style("font-weight","bold");

	   	if (show_controls == "yes")
	   	{
		   	var axiscontrolstitle = svg.append("g")
		        .attr("class", "axiscontrolstitle")
		    	.attr("transform", function(){var txt = chartwidth - margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3; return "translate(" + txt + "," + txt2 + ")"; });

		  	axiscontrolstitle.append("text")
		    	.text("X axis controls")
		        .attr("class","morphtext3")
		        .attr("x", -phasebuttonwidth/2)
		        .attr("y",0)
		        .style("fill", "steelblue")
		        .style("text-anchor", "middle")
		        //.style("font-weight","bold")
		        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
		        // .style("font-size","1px")
		      //   .style("font-size",function(d){
		      //     var textsize = this.getBBox(); 
		      //     var textwidth = textsize.width;
		      //     var textheight = textsize.height;
		      //     var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
		      //     return restriction + "px";
		      // });

		  	var fliptitle = svg.append("g")
		        .attr("class", "fliptitle")
		    	.attr("transform", function(){var txt = chartwidth - margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + phasebuttonheight*2; return "translate(" + txt + "," + txt2 + ")"; });
		    
		    fliptitle.append("text")
		    	.text("Flips")
		        .attr("class","morphtext3")
		        .attr("x", -phasebuttonwidth/2)
		        .attr("y",0)
		        .style("text-anchor", "middle")
		        //.style("font-style","italic")
		        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
		        // .style("font-size","1px")
		      //   .style("font-size",function(d){
		      //     var textsize = this.getBBox(); 
		      //     var textwidth = textsize.width;
		      //     var textheight = textsize.height;
		      //     var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
		      //     return restriction + "px";
		      // });
		    
		    if (numfactors == 2){
		    	var buttons1 = ["Flip " + factor2, "Flip " + factor1];
		    	var buttons2 = [factor1, factor2];
		    }
		    else if (numfactors == 3){
		    	var buttons1 = ["Flip " + factor3, "Flip " + factor2, "Flip " + factor1];
	    		var buttons2 = [factor1 + "," + factor2, factor1 + "," + factor3, factor2 + "," + factor1, factor3 + "," + factor1, factor2 + "," + factor3, factor3 + "," + factor2];
		    }
		    else if (numfactors == 4){
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
		    }
	   
		    var phasebutton = svg.selectAll(".morphbutton")
		       	.data(buttons1)
		       	.enter()
		       	.append("g")
		        .attr("class", function(d, i){ return "morphbutton" + i;})
		    	.attr("transform", function(d,i) {var txt = chartwidth-margin.left-phasebuttonwidth; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + phasebuttonheight*2.5 + i*(phasebuttonheight*1.1); return "translate(" + txt + "," + txt2 + ")";});
		    
		    phasebutton.append("rect")
		    	.attr("width", phasebuttonwidth)
		        .attr("height", phasebuttonheight)
		        .attr("rx",0.00625*chartwidth)
		    	.attr("ry",0.01*chartheight)
		    	.style("fill","#C0C0C0")
		    	.on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
		    	.on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
		        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
		    	  
		    phasebutton.append("text")
		    	.text(function(d){return d;})
		    	.classed("morphtext",true)
		        .attr("x", phasebuttonwidth/2)
		    	.attr("y", phasebuttonheight*3/4)
		    	.style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
		    	.style("text-anchor","middle")
		    	.style("fill","white")
		        .style("pointer-events","none");
		        // .style("font-size","1px")
		        // .style("font-size",function(d){
		        // 				var textsize = this.getBBox(); 
		        // 				var textwidth = textsize.width;
		        // 				var textheight = textsize.height;
		        // 				var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
		        // 				return restriction + "px";
		        // 		});
		      
		    if (numfactors < 4)
		    {
			    var redrawtitle = svg.append("g")
			        .attr("class", "redrawtitle")
			    	.attr("transform", function(){var txt = chartwidth - margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + buttons1.length*(phasebuttonheight*1.1) + phasebuttonheight*4; return "translate(" + txt + "," + txt2 + ")"; });
			    
			    redrawtitle.append("text")
			    	.text("X axis structure")
			        .attr("class","morphtext3")
			        .attr("x", -phasebuttonwidth/2)
			        .attr("y",0)
			        .style("text-anchor", "middle")
			       	// .style("font-style","italic")
			        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");
			        // .style("font-size","1px")
			      //   .style("font-size",function(d){
			      //     var textsize = this.getBBox(); 
			      //     var textwidth = textsize.width;
			      //     var textheight = textsize.height;
			      //     var restriction = Math.min(phasebuttonwidth/(textsize.width + 1), phasebuttonheight/(textsize.height), 16);
			      //     return restriction + "px";
			      // });
			        
			    var phasebutton2 = svg.selectAll(".morphbutton_2_")
			       	.data(buttons2)
			       	.enter()
			        .append("g")
			        .attr("class", function(d, i){ return "morphbutton_2_" + i;})
			    	.attr("transform", function(d,i) {var txt = chartwidth-margin.left-phasebuttonwidth; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + buttons1.length*(phasebuttonheight*1.1) + i*(phasebuttonheight*1.1) + phasebuttonheight*4.5; return "translate(" + txt + "," + txt2 + ")";});
			    
			    phasebutton2.append("rect")
			    	.attr("width", phasebuttonwidth)
			        .attr("height", phasebuttonheight)
		        	.attr("rx",0.00625*chartwidth)
		    		.attr("ry",0.01*chartheight)
			    	.style("fill","#C0C0C0")
			    	.on("mousedown", function(){d3.select(this).style("fill","darkgrey");})
			    	.on("mouseout", function(){d3.select(this).style("fill","#C0C0C0");})
			        .on("mouseup", function(){d3.select(this).style("fill","#C0C0C0");});
			    	  
			    phasebutton2.append("text")
			    	.text(function(d){return d;})
			    	.classed("morphtext2",true)
			        .attr("x", phasebuttonwidth/2)
			    	.attr("y", phasebuttonheight*3/4)
			    	.style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
			    	.style("text-anchor","middle")
			    	.style("fill","white")
			        .style("pointer-events","none");
			        // .style("font-size","1px")
			        // .style("font-size",function(d){
			        // 				var textsize = this.getBBox(); 
			        // 				var textwidth = textsize.width;
			        // 				var textheight = textsize.height;
			        // 				var restriction = Math.min(phasebuttonwidth/(textsize.width + 2), phasebuttonheight/(textsize.height), 16);
			        // 				return restriction + "px";
			        // 		});
		    }
		    else if (numfactors >= 4)
		    {
			    var redrawtitle = d3.select(chartlocation).append("div")
			        .text("Factor Hierarchy (last is legend)")
			        .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
			        .style("font-style","italic")
			        .style("color","steelblue");
			        
			  	var phasebutton2 = d3.select(chartlocation)
			        .append("select")
			        .attr("class","select")
			        .attr("name", "redrawlist")
			        .attr("transform", function() {var txt = chartwidth-margin.left-phasebuttonwidth; var txt2 = bardata.values.length*legendboxsize + buttons1.length*(phasebuttonheight*1.1) + phasebuttonheight*7; return "translate(" + txt + "," + txt2 + ")";});

			  	var options = phasebutton2.selectAll("option")
			       	.data(buttons2)
			       	.enter()
			        .append("option");
			        
			   	options.text(function(d){ return d;})
				    .attr("value",function(d){return d;})
				    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
				    .style("font-size","12px");
		    }


		  	axissize("text.morphtext", phasebuttonwidth*0.9, phasebuttonheight*0.95);
		  	axissize("text.morphtext2", phasebuttonwidth*0.9, phasebuttonheight*0.95);
		  	axissize("text.morphtext3", phasebuttonwidth*0.9, phasebuttonheight*0.95);
		  	d3.selectAll(".axiscontrolstitle text").style("font-weight","bold");
		  	d3.selectAll(".fliptitle text").style("font-style","italic");
		  	d3.selectAll(".redrawtitle text").style("font-style","italic");


		   	phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
		    	.style("font-style","italic")
		     	.on("click", function()
		     	{ 
		  			if (transitionstate == 0) {
		  			transitionstate = 1;
		  	
			  		if (flipphase1 == 0) 
			  		{
			  			baraxis.rangeRound([prebaraxis.bandwidth(), 0]);
			  			flipphase1 = 1;
			  		} 
			  		else if (flipphase1 == 1) 
			  		{
			  			baraxis.rangeRound([0, prebaraxis.bandwidth()]);
			  			flipphase1 = 0; 
			  		}
			  	
			  		bargroup.selectAll("rect")
			  			.data(function(d) {return d.values; })
			  			.transition()
			     	  	.attr("width", baraxis.bandwidth())
			        	.attr("x", function(d) {return baraxis(d.key); })
			            .attr("y", function(d) {return y(Math.max(y_reference,d.values[0][DependentVariable])) + d.values[0].adj;})
			            .attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(y_reference)); })
			        	.style("fill", function(d) { return color(d.key); });
			      
			      	bargroup.selectAll(".errorbars")
			      		.data(function(d) {return d.values; })
			    		.transition()
			    		.attr("transform", function(d) {var txt = baraxis(d.key) + baraxis.bandwidth()/2; return "translate(" + txt + ", 0 )"; })
			    		.call(function(){ transitionstate = 0; });
		  			}
		  		});

		   	phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
		    	.style("font-style","italic")
		     	.on("click", function()
		     	{ 
				  	if (transitionstate == 0) 
				  	{
				  		transitionstate = 1;
				  	
				  		if (numfactors == 2) 
				  		{
				  			if (flipphase2 == 0)
				  			{
				  				prebaraxis.rangeRound([width, 0]).padding(BarPadding1);
				  				flipphase2 = 1;
				  			}
				  			else if (flipphase2 == 1)
				  			{
				  				prebaraxis.rangeRound([0, width]).padding(BarPadding1);
				  				flipphase2 = 0;
				  			}
					  		svg.select("g.x.x0.axis")
					           .transition()
					           .call(xAxis);

					      	svg.selectAll("g.factor1group")
					            .data(data)
					            .transition()
					            .attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
				  		} 
				  		else if (numfactors == 3) 
				  		{
				  			if (flipphase2 == 0)
				  			{
				  				prebaraxis.rangeRound([x0.bandwidth(), 0]).padding(BarPadding2);
				  				flipphase2 = 1;
				  			}
				  			else if (flipphase2 == 1)
				  			{
				  				prebaraxis.rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
				  				flipphase2 = 0;
				  			}		
				  			factor1group.selectAll(".x1.axis")
					        	.transition()
					            .call(xAxis2);
					            
					    	factor1group.selectAll("g.factor2group")
					            .data(function(d) {return d.values;})
					            .transition()
					            .attr("transform", function(d) {return "translate(" + x1(d.key) + ",0)"; });	  			
				  		}
				  		else if (numfactors == 4)
				  		{
				  			if (flipphase2 == 0)
				  			{
				  				prebaraxis.rangeRound([x1.bandwidth(), 0]).padding(BarPadding3);
				  				flipphase2 = 1;
				  			}
				  			else if (flipphase2 == 1)
				  			{
				  				prebaraxis.rangeRound([0, x1.bandwidth()]).padding(BarPadding3);
				  				flipphase2 = 0;
				  			}		
				  			factor2group.selectAll(".x2.axis")
					        	.transition()
					            .call(xAxis3);
					            
					    	factor2group.selectAll("g.factor3group")
					            .data(function(d) {return d.values;})
					            .transition()
					            .attr("transform", function(d) {return "translate(" + x2(d.key) + ",0)"; });				  			
				  		}
				  		
				    	setTimeout(function(){transitionstate = 0;},500);
				  	}
			  	});

			if (numfactors == 3)
			{
				phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
			    	.style("font-style","italic")
				    .on("click", function(){ 
					    if (transitionstate == 0) {
					    	transitionstate = 1;
					    
					    	if (flipphase3 == 0) {
					        	x0.rangeRound([width, 0]).padding(BarPadding1);
					        	flipphase3 = 1;
					        } else if (flipphase3 == 1) {
					        	x0.rangeRound([0, width]).padding(BarPadding1);
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
			}

			if (numfactors == 4)
			{
				phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
			    	.style("font-style","italic")
				    .on("click", function(){ 
					    if (transitionstate == 0) {
					    	transitionstate = 1;
					    
					    	if (flipphase3 == 0) {
					        	x1.rangeRound([x0.bandwidth(), 0]).padding(BarPadding2);
					        	flipphase3 = 1;
					        } else if (flipphase3 == 1) {
					        	x1.rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
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
					        	x0.rangeRound([width, 0]).padding(BarPadding1);
					        	flipphase4 = 1;
					        } else if (flipphase4 == 1) {
					        	x0.rangeRound([0, width]).padding(BarPadding1);
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
			}
		   	
		   	if (numfactors < 4)
		   	{
			   	phasebutton2
			    	.on("click", function(){ 
			  	
			  		if (d3.select(this).attr("class") == "morphbutton_2_0" && numfactors == 2) {clickedbutton = 1; processinput1 = factor1; processinput2 = factor2;}
			  		if (d3.select(this).attr("class") == "morphbutton_2_1" && numfactors == 2) {clickedbutton = 2; processinput1 = factor2; processinput2 = factor1;}
					if (d3.select(this).attr("class") == "morphbutton_2_0" && numfactors > 2) {clickedbutton = 1; processinput1 = factor1; processinput2 = factor2; processinput3 = factor3;}
				    if (d3.select(this).attr("class") == "morphbutton_2_1" && numfactors > 2) {clickedbutton = 2; processinput1 = factor1; processinput2 = factor3; processinput3 = factor2;}
				    if (d3.select(this).attr("class") == "morphbutton_2_2") {clickedbutton = 3; processinput1 = factor2; processinput2 = factor1; processinput3 = factor3;}
				    if (d3.select(this).attr("class") == "morphbutton_2_3") {clickedbutton = 4; processinput1 = factor3; processinput2 = factor1; processinput3 = factor2;}
				    if (d3.select(this).attr("class") == "morphbutton_2_4") {clickedbutton = 5; processinput1 = factor2; processinput2 = factor3; processinput3 = factor1;}
				    if (d3.select(this).attr("class") == "morphbutton_2_5") {clickedbutton = 6; processinput1 = factor3; processinput2 = factor2; processinput3 = factor1;}
				    
			  		if (transitionstate == 0 && displayphase !== clickedbutton) 
			  		{
			  			transitionstate = 1;
			  			displayphase = clickedbutton;
			  			flipphase1 = 0;
			  			flipphase2 = 0;
			  			flipphase3 = 0;
			  			
			  			if (numfactors == 2)
			  			{
			  				processchange(processinput1,processinput2);
			  			}
			  			else if (numfactors == 3)
			  			{
			  				processchange(processinput1,processinput2,processinput3);
			  			}

			  		}
			  	});
		   	}
		   	else if (numfactors >= 4)
		   	{
		   		phasebutton2
	     			.on("change", menuChanged);
		   	}

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

		    function processchange(var1,var2,var3,var4)
		    {
		    	if (numfactors == 2)
		    	{
		    		data = d3.nest()
			    		.key(function(d) { return d[var1]; })  
			    		.key(function(d) { return d[var2]; }) 
			    		.entries(rawdata);

			    	for (i=0; i<data.length; i++)
			    	{
			    		for (j=0; j<data[i].values.length; j++)
			    		{
			    			if ((errorLO) && (errorHI))
			    			{
			    				data[i].values[j].values[0].errorHI = +data[i].values[j].values[0][errorHI];
			    				data[i].values[j].values[0].errorLO = +data[i].values[j].values[0][errorLO];
			    			}
			    			else
			    			{
				    			data[i].values[j].values[0].errorHI = +data[i].values[j].values[0][DependentVariable] + +data[i].values[j].values[0][errors];
			    				data[i].values[j].values[0].errorLO = +data[i].values[j].values[0][DependentVariable] - +data[i].values[j].values[0][errors];
			    			}

			    			data[i].values[j].values[0][DependentVariable] = +data[i].values[j].values[0][DependentVariable];
			    		}
			    	}
			    	x0.domain(data.map(function(d) { return d.key; })).rangeRound([0, width]).padding(BarPadding1);
		    		x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]);
		    		bardata = data[0];
		    	}
		    	else if (numfactors == 3)
		    	{
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
				          	if ((errorLO) && (errorHI))
				          	{
			    				data[i].values[j].values[k].values[0].errorHI = +data[i].values[j].values[k].values[0][errorHI];
			    				data[i].values[j].values[k].values[0].errorLO = +data[i].values[j].values[k].values[0][errorLO];
				          	}
				          	else
				          	{
			    				data[i].values[j].values[k].values[0].errorHI = +data[i].values[j].values[k].values[0][DependentVariable] + +data[i].values[j].values[k].values[0][errors];
			    				data[i].values[j].values[k].values[0].errorLO = +data[i].values[j].values[k].values[0][DependentVariable] - +data[i].values[j].values[k].values[0][errors];
				          	}
			    			data[i].values[j].values[k].values[0][DependentVariable] = +data[i].values[j].values[k].values[0][DependentVariable];
				          }
				        }
				    }
			        x0.domain(data.map(function(d) { return d.key; })).rangeRound([0, width]).padding(BarPadding1);
			        x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
			        x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x1.bandwidth()]);
			        bardata = data[0].values[0];
			        
		    	}
		    	else if (numfactors == 4)
		    	{
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
				              		if ((errorLO) && (errorHI))
				              		{
			    						data[i].values[j].values[k].values[l].values[0].errorHI = +data[i].values[j].values[k].values[l].values[0][errorHI];
			    						data[i].values[j].values[k].values[l].values[0].errorLO = +data[i].values[j].values[k].values[l].values[0][errorLO];
				              		}
				              		else 
				              		{
			    						data[i].values[j].values[k].values[l].values[0].errorHI = +data[i].values[j].values[k].values[l].values[0][DependentVariable] + +data[i].values[j].values[k].values[l].values[0][errors];
			    						data[i].values[j].values[k].values[l].values[0].errorLO = +data[i].values[j].values[k].values[l].values[0][DependentVariable] - +data[i].values[j].values[k].values[l].values[0][errors];
				              		}
			    					data[i].values[j].values[k].values[l].values[0][DependentVariable] = +data[i].values[j].values[k].values[l].values[0][DependentVariable];
				              	}
				          	}
				        }
				    }
				      
				    x0.domain(data.map(function(d) { return d.key; })).rangeRound([0, width]).padding(BarPadding1);
				    x1.domain(data[0]['values'].map(function(d) { return d.key; })).rangeRound([0, x0.bandwidth()]).padding(BarPadding2);
				    x2.domain(data[0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x1.bandwidth()]).padding(BarPadding3);
				    x3.domain(data[0]['values'][0]['values'][0]['values'].map(function(d) { return d.key; })).rangeRound([0, x2.bandwidth()]);
		    		bardata = data[0].values[0].values[0];
		    	}

		    	levelsoffactor = bardata['values'].length;
		    		
		    	color.domain(bardata['values'].map(function(d) { return d.key; }));
		    	color.range((function()
		    		{
		        		return colorscheme[levelsoffactor] || colorpalettes.defaultcolors[levelsoffactor];
		  			})()
		  		);
		  		
		  		svg.selectAll(".databar").transition().duration(500).attr("y",1000).transition().remove();
		  		svg.selectAll(".errorline").transition().duration(500).attr("y1",1000).attr("y2",1000).transition().remove();

		  	  	setTimeout(function(){
			  		
			  	  	xAxis.scale(x0);
			  	  	if (numfactors > 2)
			  	  	{
			  	  		xAxis2.scale(x1);
			  	  	}
			  	  	if (numfactors > 3)
			  	  	{
			  	  		xAxis3.scale(x2);
			  	  	}
			      	
			  		svg.select(".x.axis")
			  			.call(xAxis);
			  	
			  		factor1group = factor1group.data([]).exit().remove();
			  		axisticks1 = axisticks1.data([]).exit().remove();

			  		factor1group = svg.selectAll(".factor1group")
			        	.data(data)
			      		.enter().append("g")
			        	.attr("class", "factor1group")
			        	.attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });

			        if (numfactors > 2)
			        {
				        factor1group.append("g")
				            .attr("class", "x1 axis")
				            .attr("transform", "translate(0," + height + ")")
				            .call(xAxis2)
				            .style("font-size","12px");
			        }
			        	
			        axisticks1 = svg.selectAll(".axisticks1")
			        	.data(data)
			      		.enter().append("g")
			        	.attr("class", "axisticks1")
			        	.attr("transform", function(d) {return "translate(" + x0(d.key) + ",0)"; });
			  	
			  		
			    	axisticks1.filter(function(d,i) { return i < data.length-1; })
			      		.append("line")
			        		.attr("class", "group1tick")
			    	  		.attr("x1",x0.bandwidth()/2+x0.bandwidth()/(2-2*BarPadding1))
			    	  		.attr("y1",height)
			    	  		.attr("x2",x0.bandwidth()/2+x0.bandwidth()/(2-2*BarPadding1))
			    	  		.attr("y2",height+margin.bottom)
			    	  		.attr("stroke","black")
			    	  		.attr("stroke-width",0.002*chartheight);
			  		
			  		if (numfactors > 2)
			  		{
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
				            .attr("x1",x1.bandwidth()/2+x1.bandwidth()/(2-2*BarPadding2))
				            .attr("y1",height)
				            .attr("x2",x1.bandwidth()/2+x1.bandwidth()/(2-2*BarPadding2))
				            .attr("y2",height+margin.bottom/3)
				            .attr("stroke","black")
				            .attr("stroke-width",0.002*chartheight);
			  		}

			  		if (numfactors > 3)
			  		{
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
					        .attr("x1",x2.bandwidth()/2+x2.bandwidth()/(2-2*BarPadding3))
					        .attr("y1",height)
					        .attr("x2",x2.bandwidth()/2+x2.bandwidth()/(2-2*BarPadding3))
					        .attr("y2",height+margin.bottom/5)
					        .attr("stroke","black")
					        .attr("stroke-width",0.002*chartheight);
			  		}

			   	 	axissize(".x0.axis text", x0.bandwidth()*0.95, 0.3*margin.bottom);
			   	 	if (numfactors > 2) {axissize(".x1.axis text", x1.bandwidth()*0.95, 0.25*margin.bottom);}
			    	if (numfactors > 3) {axissize(".x2.axis text", x2.bandwidth()*0.95, 0.2*margin.bottom, Math.min(0.0125*chartwidth, 0.02*chartheight));}

			   	 	svg.select("g.x.x0.axis")
			     	   .call(xAxis);

			     	if (numfactors > 2) {
			     		factor1group.call(xAxis2);
			     	}

			     	if (numfactors > 3) {
			     		factor2group.append("g")
	        				.attr("class", "x2 axis")
	        				.attr("transform", "translate(0," + height + ")")
	        				.call(xAxis3)
	        				.style("font-size","10px")
	      				  .selectAll("text")
	       					.style("text-anchor", "middle");
	    
	    				axissize(".x2.axis text", x2.bandwidth()*0.95, 0.2*margin.bottom, Math.min(0.0125*chartwidth, 0.02*chartheight));
	       
	    				factor2group.call(xAxis3);
			     	}

			     	svg.selectAll(".axis path")
						.attr("stroke-width",0.002*chartheight);

					svg.selectAll("g.x1, g.x2")
						.selectAll('path')
						.attr("display","none");

				    if (numfactors == 2) {
				    	baraxis = x1; 
				    	prebaraxis = x0;
				    	bargroup = factor1group;
				    	bardata = data[0];
				    	barfactor = var2;
				    }
				    else if (numfactors == 3) {
				    	baraxis = x2; 
				    	prebaraxis = x1;
				    	bargroup = factor2group;
				    	bardata = data[0].values[0];
				    	barfactor = var3;
				    }
				    else if (numfactors == 4) {
				    	baraxis = x3; 
				    	prebaraxis = x2;
				    	bargroup = factor3group;
				    	bardata = data[0].values[0].values[0];
				    	barfactor = var4;
				    }

				    if (tickarray.indexOf(y_reference) == -1)
					{	
						d3.select("text.y.axis.reftext").remove();

				        svg
				        .append("text")
				        	.attr("class","y axis reftext")
				        	.attr("x", 0)
				        	.attr("y", y(y_reference))
				        	.attr("dy",-0.004*chartheight)
				        	.text(formatter(y_reference))
				        	.attr("text-anchor", "start")
						    .attr("font-weight", "bold")
						    .attr("font-style","italic")
						    .attr("fill", "black")
						    .style("pointer-events","none")
						    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif");


						svg.selectAll(".y.axis")
	        				.style("font-size",function(){return Math.min(0.032*chartheight, 
	        					0.032*chartwidth, margin.left*.15) + "px";});
					}
			    
		    		DVbars = bargroup.selectAll("rect")
		        		.data(function(d) {return d.values; })
		      			.enter().append("rect")
		      			.attr("class","databar")
		        		.attr("width", baraxis.bandwidth())
		        		.attr("height", function(d) {return Math.abs(y(d.values[0][DependentVariable]) - y(y_reference)); })
		        		.style("fill", function(d) { return color(d.key); })
		        		.attr("x", function(d) {return baraxis(d.key); })
		      			.attr("y",height)
		      			.transition()
		      			.duration(500)
		        		.attr("y", function(d) 
		        		{
		        			if (d.values[0][DependentVariable] >= y_reference)
		        			{
		        				d.values[0].adj = Math.min(50/chartheight,.5);
		        				return y(d.values[0][DependentVariable]) + d.values[0].adj;
		        			}
		        			else if (d.values[0][DependentVariable] < y_reference)
		        			{
		        				d.values[0].adj = 1 - Math.min(50/chartheight,.5);
		        				return y(y_reference) + d.values[0].adj;
		        			}
		        		});
			        	
			       	bargroup.selectAll("rect").on("mouseover", function(d) 
			       	{
			  			//Get this bar's x/y values, then augment for the tooltip
					    var t1 = d3.select(this.parentNode).attr("transform");
					    var translated = t1.substring(t1.indexOf("(")+1, t1.indexOf(")")).split(",");
					    var s1 = Number(translated[0]);
					    var s2 = 0;
					    if (numfactors > 2)
					    {
					    	var t2 = d3.select(this.parentNode.parentNode).attr("transform");
			            	var translated2 = t2.substring(t2.indexOf("(")+1, t2.indexOf(")")).split(",");
			            	s2 = Number(translated2[0]);
					    }
					    var s3 = 0;
					    if (numfactors > 3)
					    {
						    var t3 = d3.select(this.parentNode.parentNode.parentNode).attr("transform");
		            		var translated3 = t3.substring(t3.indexOf("(")+1, t3.indexOf(")")).split(",");
		            		s3 = Number(translated3[0]);
					    }
					    
					    var xPosition = parseFloat(d3.select(this).attr("x")) + s1 + s2 + s3 + baraxis.bandwidth() / 2;
			  					
			            if (d.values[0][DependentVariable] >=y_reference) {var yPosition = parseFloat(d3.select(this).attr("y")) + parseFloat(d3.select(this).attr("height"))*1/4;}
			            else if (d.values[0][DependentVariable] <y_reference) {var yPosition = y(y_reference) + parseFloat(d3.select(this).attr("height"))*3/4;}
					   
					    var toolsize = Math.max(baraxis.bandwidth()/2.5,0.02*chartwidth,0.02*chartheight);

					  	//Create the tooltip label
						svg.append("circle")
							.attr("class","tooltip")
							.attr("r",toolsize)
							.attr("cx",xPosition)
							.attr("cy",yPosition)
							.style("fill","aliceblue")
							.style("pointer-events","none")
							.style("stroke","black")
							.style("stroke-width",0.002*chartheight + "px")
							.style("stroke-opacity",.8)
							.attr("fill-opacity",.8);
						svg.append("text")
						    .attr("class", "tooltip")
						    .attr("x", xPosition)
						    .attr("y", yPosition)
						    .attr("dy", 0.35*toolsize + "px")
						    .attr("text-anchor", "middle")
						    //.attr("font-weight", "bold")
						    .attr("fill", "black")
						    .style("pointer-events","none")
						    .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
						    .text(d.values[0][DependentVariable]);	   
					  		
					  	var fontsize = axissize("text.tooltip",toolsize*3/2,toolsize);
		  				d3.selectAll("text.tooltip")
		  					.attr("dy",fontsize/2.5 + "px");
			  		})
			  		.on("mouseout", function() {	   
			  			//Remove the tooltip
			  			d3.selectAll(".tooltip").transition().duration(100).attr("fill-opacity",0).style("stroke-opacity",0).remove();
			  		});
			  				
		    		errorbars = bargroup.selectAll(".errorbars")
		        		.data(function(d) {return d.values; })
		    	 		.enter().append("g")
		    	 		.attr("class","errorbars")
		    	 		.style("pointer-events","none")
		    	  		.attr("transform", function(d) {var txt = baraxis(d.key) + baraxis.bandwidth()/2; return "translate(" + txt + ", 0 )"; });

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
		    	  		.attr("y1",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
		    	  		.attr("x2",0)
		    	  		.attr("y2",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;});
		    
		    		errorbars
		      			.append("line")
		      			.attr("class","errorline")
		      			.attr("stroke","black")
		    	  		.attr("stroke-width",errorwidth)
		    	  		.attr("x1",-baraxis.bandwidth()/4)
		    	  		.attr("y1",height)
		    	  		.attr("x2",baraxis.bandwidth()/4)
		    	  		.attr("y2",height)
		      			.transition()
		      			.duration(500)
		    	  		.attr("x1",-baraxis.bandwidth()/4)
		    	  		.attr("y1",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
		    	  		.attr("x2",baraxis.bandwidth()/4)
		    	  		.attr("y2",function(d) {var txt = d.values[0]["errorHI"]; return y(txt) + d.values[0].adj;})
		    	  		.attr("stroke","black")
		    	  		.attr("stroke-width",errorwidth);
		    
		    		errorbars
		      			.append("line")
		      			.attr("class","errorline")
		      			.attr("stroke","black")
		    	  		.attr("stroke-width",errorwidth)
		    	  		.attr("x1",-baraxis.bandwidth()/4)
		    	  		.attr("y1",height)
		    	  		.attr("x2",baraxis.bandwidth()/4)
		    	  		.attr("y2",height)
		      			.transition()
		      			.duration(500)
		    	  		.attr("x1",-baraxis.bandwidth()/4)
		    	  		.attr("y1",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;})
		    	  		.attr("x2",baraxis.bandwidth()/4)
		    	  		.attr("y2",function(d) {var txt = d.values[0]["errorLO"]; return y(txt) + d.values[0].adj;})
		    	  		.attr("stroke","black")
		    	  		.attr("stroke-width",errorwidth);

			        legend.data([]).exit().remove();

			        legend = svg.selectAll(".legend")
			            .data(bardata.values)
			         	.enter().append("g")
			            .attr("class", "legend")
			            .attr("transform", function(d, i) {var txt = i*legendboxsize*1.1 + legendboxsize; return "translate(0," + txt + ")"; });

			        legend.append("rect")
			            .attr("x", chartwidth - margin.left - legendboxsize)
			            .attr("width", legendboxsize)
			            .attr("height", legendboxsize)
			            .style("fill", function(d) {return color(d.key);});

			        legend.append("text")
			            .attr("x", (chartwidth - margin.left - legendboxsize)*0.991489)
			            .attr("y", legendboxsize/2)
			            .attr("dy", legendboxsize/3.2)
			            .style("text-anchor", "end")
			            .text(function(d) { return d.key; })
			            .style("font-family","'Droid Sans', Helvetica, Arial, sans-serif")
			            .classed("legendtext",true)
			            .style("font-size","1px");
			            // .style("font-size",function(d){
			            //         var textsize = this.getBBox(); 
			            //         var textwidth = textsize.width;
			            //         var textheight = textsize.height;
			            //         var restriction = Math.min(phasebuttonwidth/(textsize.width + 2), phasebuttonheight/(textsize.height), 16);
			            //         return restriction + "px";
			            //     });


			    	legendtitle.text(barfactor)
			    		.attr("class","legendtitle")
			    		.style("font-weight","normal");

			  		axissize("text.legendtext", margin.legend - legendboxsize, legendboxsize*0.8);
			 		axissize("text.legendtitle", margin.legend*0.8, legendboxsize);
			  		d3.selectAll("text.legendtitle").style("font-weight","bold");
			        
			        axiscontrolstitle
			          	.transition()
			    	  	.attr("transform", function(){var txt = chartwidth-margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3; return "translate(" + txt + "," + txt2 + ")"; });
			        
			        fliptitle
			          	.transition()
			    	 	.attr("transform", function(){var txt = chartwidth-margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + phasebuttonheight*2; return "translate(" + txt + "," + txt2 + ")"; });

			      	phasebutton
			        	.transition()
			    		.attr("transform", function(d,i) {var txt = chartwidth-margin.left-phasebuttonwidth; var txt2 = bardata.values.length*legendboxsize*1.1 + i*(phasebuttonheight*1.1) + legendboxsize*3 + phasebuttonheight*2.5; return "translate(" + txt + "," + txt2 + ")";});
			  		
			  		if (numfactors < 4)
			  		{
			  			redrawtitle
			  				.transition()
			    	  		.attr("transform", function(){var txt = chartwidth-margin.left; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + buttons1.length*(phasebuttonheight*1.1) + phasebuttonheight*4; return "translate(" + txt + "," + txt2 + ")"; });

			  			phasebutton2
			  				.transition()
			    	  		.attr("transform", function(d,i) {var txt = chartwidth-margin.left-phasebuttonwidth; var txt2 = bardata.values.length*legendboxsize*1.1 + legendboxsize*3 + buttons1.length*(phasebuttonheight*1.1) + i*(phasebuttonheight*1.1) + phasebuttonheight*4.5; return "translate(" + txt + "," + txt2 + ")";});
			  		}
			  		
			        if (numfactors == 2)
			        {
				        phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
				  			.selectAll("text")
				  			.text("Flip " + var2);
				        	
				        phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
				  			.selectAll("text")
				  			.text("Flip " + var1);
			        }
			  		else if (numfactors == 3)
			  		{
			  			phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton0"; })
					      	.selectAll("text")
					      	.text("Flip " + var3);

					    phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton1"; })
					      	.selectAll("text")
					      	.text("Flip " + var2);
					          
					    phasebutton.filter(function(d,i) { return d3.select(this).attr("class") == "morphbutton2"; })
					      	.selectAll("text")
					      	.text("Flip " + var1);
			  		}
			  		else if (numfactors == 4)
			  		{
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
			  		}

			  		transitionstate = 0;
		  	 	},500);
		  	}
		}
	});
}
