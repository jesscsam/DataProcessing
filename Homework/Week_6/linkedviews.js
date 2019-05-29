
var mapdata = d3.json("mapdata.json");

var countryselect = "USA"

d3v5.json("mapdata.json").then(function(dataset){

  drawBarChart(countryselect)

  var map = new Datamap({
    element: document.getElementById('container'),
    data: dataset,
    fills: {
            '0-50' : '#a1dab4',
            '50-100' : '#41b6c4',
            '100-200' : '#2c7fb8',
            '200+' : '#253494',
            defaultFill: '#dddddd'
        },

    geographyConfig: {

      popupTemplate: function(geography, data) {
        if (!data){ return '<div class="hoverinfo">' + geography.properties.name + '\
                    <br>No data'}
        else {
            return '<div class="hoverinfo">' + geography.properties.name + ' \
              <br> Total athletes: ' +  data.Total + ' '
            }
      },
      popupOnHover: true,
      highlightOnHover: true,
      highlightFillColor: '#ffffcc',
      highlightBorderColor: '#696969',
      highlightBorderWidth: 2,
      highlightBorderOpacity: 1

  },
    done: function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
          if (typeof(dataset[geography.id]) != 'undefined') {
            countryselect = geography.id
            d3v5.selectAll(".barChart").remove()
            drawBarChart(countryselect);
          }
        })
  }
});

map.legend()





function drawBarChart(country) {
    //Width, height and scale
    var w = 800;
    var h = 500;
    var padding = 50;
    var kleinpadding = 30;
    var countryselect = country;

    // initialize SVG
    var svg = d3v5.select("#svgdiv")
                .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("class", "barChart")


     d3v5.json("barchartdata.json").then(function(data){

       if (!data[countryselect]){
         svg.append("text").text(countryselect + " has won no medals in the 2016 Olympics. ")
                          .attr("y", 40)
                          .attr("x", 350)
                          .attr("font-family", "Arial")
                          .attr("font-size", 14)
         return;
       }

       var yScale = d3v5.scaleLinear()
                 .domain([0, d3v5.max(data[countryselect], function(d) { return d['number']; })])
                 .range([h - 100, 0]);

       var y_axis = d3v5.axisLeft()
                     .scale(yScale);


       var xScale = d3v5.scaleBand()
                 .domain(['Bronze','Silver', 'Gold'])
                 .range([200, w])
                 .paddingInner(0.05)
                 .paddingOuter(0.05)

       var x_axis = d3v5.axisBottom()
                      .scale(xScale);

      //allows hover over individual bars and shows values
      var tip = d3v5.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                      return  d["number"] +" medals</span>";
                    });


       svg.selectAll("rect")
           .data(data[countryselect])
         .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("fill", function(d) {
                if (d['type'] == 'Bronze'){
                  return '#c1692a'  }
                else if (d['type'] == 'Silver') {
                  return '#bababa' }
                else if (d['type'] == 'Gold') {
                  return '#f9dd6b'
                }})
           .attr("width", function(d) {
               return xScale.bandwidth()
             })
           .attr("y", function(d) {
               return yScale(d['number']) + 50
             })
           .attr("x", function(d) {
               return xScale(d['type']);
           })
           .attr("height", function(d) {
             return (h - padding) - yScale(d['number']) - 50;
           })
           .on('mouseover', function(d){tip.show(d, this)})
           .on('mouseout', function(d){tip.hide(d, this)});

        svg.call(tip);

      svg.append("text").text("Medals won by " + countryselect + "")
                        .attr("x", w / 2)
                        .attr("y", 25)
                        .attr("font-family", "arial")
                        .style("font-size", "14px")

      // draw both axes
       svg.append("g")
          .attr("transform", "translate(0, "+ 450 +")")
          .call(x_axis);

       svg.append("g")
          .attr("transform", "translate("+ 200 +", "+ 50 +")")
          .call(y_axis);

          svg.append("text")
             .attr("x", -150)
             .attr("y", 160)
             .attr("text-anchor", "middle")
             .attr("transform", "rotate(-90)")
             .attr("font-family", "arial")
             .style("font-size", "13px")
             .text("amount of medals");

         svg.append("text")
            .attr("x", 500)
            .attr("y", 490)
            .attr("text-anchor", "middle")
            .attr("font-family", "arial")
            .style("font-size", "13px")
            .text("type of medal");
     })
   }
 })
