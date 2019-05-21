
var mapdata = "data.json"

  var map = new Datamap({
    element: document.getElementById('container'),

    popupTemplate: function(geography, mapdata) {
      return '<div class="hoverinfo">' + geography.properties.name + ' \
        Total athletes:' +  data.Total + 'Female' + data.F + ' '
    },
    highlightBorderWidth: 3
  },



  });
