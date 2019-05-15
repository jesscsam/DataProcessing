
// import { transformResponse1 } from 'transformdata1';
// import { transformResponse2 } from 'transformdata2';

var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"

var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];

var h = 600;
var w = 1000;
var paddingright = 400;
var paddingleft = 100

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var data = {};

// get data from API's
Promise.all(requests).then(function(response) {
     var teensIVA = transformResponse1(response[0]);
     var teenP = transformResponse1(response[1]);
     var gdpdata = transformResponse2(response[2]);

     // add teensIVA data to dict
     Object.keys(teensIVA).forEach(function(items) {
       teensIVA[items].forEach(function(item) {
         if (!data[item["Time"]]){
           data[item["Time"]] = [];
         }
         tempdict = {}
         tempdict["Country"] = item["Country"]
         tempdict["teensIVA"] = item["Datapoint"]
         data[item["Time"]].push(tempdict);
      });
     });

     // add teen pregnancy data to dict
     Object.keys(teenP).forEach(function(items) {
        teenP[items].forEach(function(item) {

          if (data[item["Time"]]){
            data[item["Time"]].forEach(function(country){
              if (country["Country"] == item["Country"]){
                country["TeenP"] = item["Datapoint"]
              }
            })
          }
      });
     });

     //add GDP data to dict
      Object.keys(gdpdata).forEach(function(items) {
        gdpdata[items].forEach(function(item) {

          if (data[item["Year"]]){
            data[item["Year"]].forEach(function(country){
              if (country["Country"] == item["Country"]){
                country["GDP"] = item["Datapoint"]
              }
            });
          }
      });
     });

     // drop the two years for which GDP data wasn't available
     delete data["2010"]
     delete data["2011"]

     // drop countries that have missing data
     Object.keys(data).forEach(function(years) {
      for (year = 2012; year < 2017; year++){
        for (i = 0; i < data[year].length ; i++){
          if (!(data[year][i].TeenP )|| !(data[year][i].teensIVA) || !(data[year][i].GDP)){
            data[year].splice(i)
        }
      }
    }
  });

     console.log(data)


    //define scales and axes
    var xScale = d3.scaleLinear()
                    .domain([0, d3.max(data['2012'], function(d) { return d.teensIVA; })])
                    .range([paddingleft, (w - paddingright)]).nice();

    var yScale = d3.scaleLinear()
                  .domain([0, d3.max(data['2012'], function(d) { return d.TeenP; })])
                  .range([h - 50, 100]).nice();

    var y_axis = d3.axisLeft()
                   .scale(yScale);

    var x_axis = d3.axisBottom()
                   .scale(xScale);

    var tip = d3.tip()
                 .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<span style='font-family:Arial;color:grey'>" + d.Country + "</span>";
                  })

    // create functionality to toggle by year, default is 2012
     var date = '2012'
     d3.selectAll(".m")
        .on("click", function() {
          var date = this.getAttribute("value");

          svg.selectAll("circle")
              .data(data[date])
              .transition()
              .attr("cx", function(d){
                  return xScale(d.teensIVA)
                } )
              .attr("cy", function(d){
                  return yScale(d.TeenP)
                } )
              .attr("fill", function(d){
                  if (d.GDP < 25000){ return "#a6cee3" }
                  if (d.GDP > 25000 && d.GDP < 35000){ return "#1f78b4"}
                  if (d.GDP > 35000 && d.GDP < 50000){ return "#b2df8a"}
                  if (d.GDP > 50000){ return "#33a02c" }
                })
              .transition()
                .duration(500)
        });

    // create a dot for each country
     svg.selectAll("circle")
         .data(data[date])
         .enter()
       .append("circle")
         .attr("cx", function(d){
             return xScale(d.teensIVA)
           } )
         .attr("cy", function(d){
             return yScale(d.TeenP)
           } )
         .attr("r", 5)
         .attr("fill", function(d){
           if (d.GDP < 25000){ return "#a6cee3" }
           if (d.GDP > 25000 && d.GDP < 35000){ return "#1f78b4"}
           if (d.GDP > 35000 && d.GDP < 50000){ return "#b2df8a"}
           if (d.GDP > 50000){ return "#33a02c" }
         })
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide);

    svg.call(tip);

    // create x axis
     svg.append("g")
         .call(x_axis)
         .attr("class", "x axis")
         .attr('transform', "translate(0,550)")

    // create y axis
     svg.append("g")
        .call(y_axis)
        .attr("transform", "translate(100,0)")

    svg.append("text")
       .attr("x", (w - 600))
       .attr("y", (50))
       .attr("text-anchor", "middle")
       .attr("font-weight", "bold")
       .style("font-size", "16px")
       .style("font-family", "Arial")
       .text("Teen pregnancies vs. teens living in violent areas");

    svg.append("text")
       .attr("x", (w - 550))
       .attr("y", (h - 15))
       .attr("text-anchor", "middle")
       .style("font-size", "12px")
       .style("font-family", "Arial")
       .text("Children (0-17) living in areas with problems with crime or violence (%)");

     svg.append("text")
        .attr("x", -220)
        .attr("y", 45)
        .attr("text-anchor", "middle")
        .attr('transform', 'rotate(-90)')
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .text("Adolescent fertility rate");


      svg.append("text")
         .attr("x", -190)
         .attr("y", 60)
         .attr("text-anchor", "middle")
         .attr('transform', 'rotate(-90)')
         .style("font-size", "12px")
         .style("font-family", "Arial")
         .text("(births per 1000 women age 15-19)");

      svg.append("circle").attr("cx",700).attr("cy",130).attr("r", 6).style("fill", "#a6cee3")
      svg.append("circle").attr("cx",700).attr("cy",150).attr("r", 6).style("fill", "#1f78b4")
      svg.append("circle").attr("cx",700).attr("cy",170).attr("r", 6).style("fill", "#b2df8a")
      svg.append("circle").attr("cx",700).attr("cy",190).attr("r", 6).style("fill", "#33a02c")
      svg.append("text").attr("x", 720).attr("y", 130).text("GDP < $25.000 per capita").style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 720).attr("y", 150).text("GDP $25.000 - $35.000 per capita").style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 720).attr("y", 170).text("GDP $35.000 - $50.000 per capita").style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 720).attr("y", 190).text("GDP > $50.000 per capita").style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle")

}).catch(function(e){
    throw(e);
});
