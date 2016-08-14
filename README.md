# hibars
A javascript tool for creating hierarchical, interactive bar charts, just for fun. Based on D3.js.

##About
Hibars creates interactive SVG bar charts from CSV files containing the data to be plotted. The figures are "hierarchical" in that multiple factors can be specified on the X-axis, in a customizable hierarchy (see "Usage"). Each figure is created by a single function call, and is inserted into the page at a specified location.

For examples, see <a target="_blank" href="http://autoweb2.psych.cornell.edu/tmann/Charts/">here</a> and <a target="_blank" href="http://autoweb2.psych.cornell.edu/tmann/Charts/study3">here</a>.

##Usage

You can run Hibars locally or load from the CDN. Minified final versions are in the "dist" folder (most recent and older). The script can also be loaded from the rawgit CDN. For example, to load the most recent version, include the follow tag in your html header:

    <script src="https://cdn.rawgit.com/thomascmann/hibars/master/dist/latest/hibars-latest.min.js"></script>

Hibars creates figures using the **hibars2**, **hibars3**, and **hibars4** functions, depending on whether your data are indexed by two, three, or four factors. You must pass an *object* to this function containing keys and values that specify the data file to use, the location on the page where the figure should be placed, the factors, the dependent variable, and some optional parameters for customization:

```javascript
hibars2({
	location: 'figure_location', 
	datafile: 'data.csv', 
	dependent: 'Dependent Variable', 
	factor1: 'Room', 
	factor2: 'Condition', 
	chartwidth: 1000,                        //optional parameter
	chartheight: 800,                        //optional parameter
	colorscheme: colorpalettes.defaultcolors //optional parameter
});
```

If using the hibars3 function, you must also include "factor3", and if using the hibars4 function, you must also incldue "factor4".

####About the parameters

**location:** Specifies a location (e.g., a \<div\>) where the figure should be appended. Currently, this must be an **element id.**

**datafile:** The name of the CSV file containing the data (see section below for the necessary structure).

**dependent:** The name of the dependent variable. Must match a name in the header row of the CSV file.

**factor1:** The name of the first factor (top of the factor hierarchy). Must match a value in the header row of the CSV file.

**factor2:** The name of the second factor. Must match a value in the header row of the CSV file.

**factor3:** The name of the third factor (**hibars3** and **hibars4** only). Must match a value in the header row of the CSV file.

**factor4:** The name of the fourth factor (**hibars4** only). Must match a value in the header row of the CSV file.

**chartwidth (*optional*):** The width of the figure, in pixels. If not specified, default is 800.

**chartheight (*optional*):** The height of the figure, in pixels. If not specified, default is 500.

**colorscheme (*optional*):** The colorscheme to use in generating the bars in the chart. If not specified, a default colorscheme is used. If specified, the value should refer to an object with numerical keys, with arrays of colors as the values. The keys indicate the number of levels of the factor used in the chart's legend (the lowest in the hierarchry). The number of colors in the array should match the key value. For example, the default colors (colorpalettes.defaultcolors) are coded as:

```javascript
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
```
This allows for the creation of a figure with up to 10 levels of the lowest factor in the hierarchy. See the <a href="https://github.com/axismaps/colorbrewer/">colorbrewer.js palettes for more examples.</a> Hibars will attempt to fall back on the defaults if you specify an incompatible color palette. **Currently, the default colors include only 10 colors.**

###Structure of CSV file
The CSV data file should have a list of headers in the first row. There should be one column for the dependent variable, one for the size of the +/- error bars (*this must ALWAYS be called "stderror"*), and one column per factor. In each factor column, the values reflect the level of the factor. Each row must have a value in each column. For example:

    Room,Condition,Dependent Variable,stderror
    Blue Room,Control,46,11
    Blue Room,Experimental,75,7
    Red Room,Control,102,13
    Red Room,Experimental,65,20
    White Room,Control,130,10
    White Room,Experimental,43,22
    Black Room,Control,-40,10
    Black Room,Experimental,130,12
  
##Updates

Hibars is a personal side project which I am making available in case anyone finds it useful. As such, it will be updated infrequently, but feel free to offer suggestions for improvement!
