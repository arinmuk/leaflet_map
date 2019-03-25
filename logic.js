

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});
// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Satellite Map": satellitemap
};

 
 
 
 var myMap = L.map("map", {
 center: [37.09, -95.71],
  zoom: 5,
  layers:[satellitemap,streetmap]
});



url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
  //   // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
   })


   function getColor(mag) {
    return mag >= 5  ? '#B10026' :
           mag >= 4  ? '#e31a1c' :
           mag >= 3  ? '#fc4e2a' :
           mag >= 2  ? '#fd8d3c' :
           mag >= 1  ? '#feb24c' :
                      '#fed976';
  }

  function createCircleMarker( feature, latlng ){
    // Change the values of these options to change the symbol's appearance
    let options = {
      radius: feature.properties.mag*7,
      fillColor: getColor(feature.properties.mag),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    return L.circleMarker( latlng, options );
  }


function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr>Magnitude: " + feature.properties.mag +
    "<p>" + new Date(feature.properties.time) + "</p>");;
   }

  var earthquakes = L.geoJSON(earthquakeData, {pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
 }).addTo(myMap)

createMap(earthquakes);
}

function createMap(earthquakes) {


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes 
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}








