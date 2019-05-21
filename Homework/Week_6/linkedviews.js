
var mapdata = d3.json("data.json");

d3v5.json("data.json").then(function(dataset){


  console.log(dataset);
  var map = new Datamap({
    element: document.getElementById('container'),
    data: dataset,

    geographyConfig: {


      popupTemplate: function(geography, data) {

        return '<div class="hoverinfo">' + geography.properties.name + ' \
          <br> Total athletes: ' +  data.Total + ' <br> Female athletes: ' + data.F + ' \
          <br> Male athletes: ' + data.M + ' '
      },
      highlightBorderWidth: 3
  }



  });
})
