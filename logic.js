// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // creat popup
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


  function pointToLayer(feature, latlng) {

    var mag = parseFloat(feature.properties.mag);

    var magColor = [];
    if (mag > 5) {
      color = "#581845";
      magColor.push(color)
    }
    else if (mag > 4) {
      color = "#900C3F";
      magColor.push(color)
    }
    else if (mag > 3) {
      color = "#C70039";
      magColor.push(color)
    }
    else if (mag > 2) {
      color = "#FF5733";
      magColor.push(color)
    }
    else if (mag > 1) {
      color = "#FFC300";
      magColor.push(color)
    }
    else {
      color = "#DAF7A6";
      magColor.push(color)
    }
    // console.log(magColor)

    var geojsonMarkerOptions = {
      radius: mag * 5,
      fillColor: magColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  createMap(earthquakes)
}


function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  });

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // create legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      scale = ["#581845", "#900C3F", "#C70039", "#FF5733", "#FFC300", "#DAF7A6"],
      labels = ["5+", "4-5", "3-4", "2-3", "1-2", "0-1"];

    for (var i = 0; i < scale.length; i++) {
      div.innerHTML +=
        '<i style="background:' + scale[i] + '"></i>' + labels[i] + '<br>';
    }
    return div;
  };
  legend.addTo(myMap);
}
