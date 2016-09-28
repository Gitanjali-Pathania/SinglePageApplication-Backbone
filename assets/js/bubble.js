//d3 = d3 || {};

(function(_){

  //"use strict";

    var obj_ = {};
    obj_.bubble1 = function(){
                              

              var chart = function(selection){

                              
                              

                              // width = parseInt(d3.select('#'+containerId).style('width'));
                              // height = parseInt(d3.select('#'+containerId).style('height'));

                              // set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  
     selection.each(function(data){
    

                                    data.forEach(function(d) {
        d.Letter = d.Letter;
        d.Freq = +d.Freq;
    });
  
  // scale the range of the data
  x.domain(data.map(function(d) { return d.Letter; }));
  y.domain([0, d3.max(data, function(d) { return d.Freq; })]);

  // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");


  // Add bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Freq); })
      .attr("height", function(d) { return height - y(d.Freq); });
                                                

                                                 });

                   
                    //d3.select(window).on('resize.'+containerId, chart.resize);
        
                                              }           

 chart.containerId = function(_){

        

            if(!arguments.length)
               return containerId;

            containerId = _;

            return chart;
        };

    // chart.resize = function(){
    //   d3.select('#'+containerId).select('svg').datum(bubbleData).call(chart);
    // };


return chart;

    }

    //if (typeof module === "object" && module.exports) module.exports = obj_; else this.multiBarchart = obj_;
    if (typeof define === "function" && define.amd) this.bubble1 = obj_, define(obj_); else if (typeof module === "object" && module.exports) module.exports = obj_; else this.bubble1 = obj_;
    //return obj_;
})(window)
 

