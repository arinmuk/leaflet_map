// var myMap = L.map("map", {
//   center: [37.09, -95.71],
//   zoom: 5
// });

// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets-basic",
//   accessToken: API_KEY
// }).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  return magnitude *10;
}

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
      radius: 8,
      fillColor: "lightgreen",
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    return L.circleMarker( latlng, options );
  }



function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
  //.bindPopup("<h3>" + earthquakeData[i].properties.place +
    //"</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>").addTo(myMap)

    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr>Magnitude: " + feature.properties.mag +
    "<p>" + new Date(feature.properties.time) + "</p>");;
   }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {pointToLayer: createCircleMarker,
     onEachFeature: onEachFeature
  }).addTo(myMap);
  
  // Sending our earthquakes layer to the createMap function

  // for (var i = 0; i < earthquakeData.length; i++) {

  //   geometry=earthquakeData[i].geometry
  //  console.log(geometry.coordinates[0])
  //  console.log(geometry.coordinates[1])
  //  console.log(earthquakeData[i].properties.mag)

  earthquakes = []
  // console.log("earthquakeData.length",earthquakeData.length);
  for (var i = 0; i < earthquakeData.length; i++) {
    // console.log(earthquakeData[i]);
    earthquakes.push(
      L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: getColor(earthquakeData[i].properties.mag),
        fillColor: getColor(earthquakeData[i].properties.mag),
        radius: Math.pow(earthquakeData[i].properties.mag,3) * 1000
      }).bindPopup("<h3>" + earthquakeData[i].properties.place +
      "</h3><hr>Magnitude: " + earthquakeData[i].properties.mag +
      "<p>" + new Date(earthquakeData[i].properties.time) + "</p>")
    );
    
  //   location=[]
  //   location.push(geometry.coordinates[0])
  //   location.push(geometry.coordinates[1])
  //   L.circle(location, {
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: "purple",
  //     // Setting our circle's radius equal to the output of our markerSize function
  //     // This will make our marker's size proportionate to its population
  //     radius: markerSize(mag)
  //   }).bindPopup("<h3>" + earthquakeData[i].properties.place +
  //   "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>").addTo(myMap);
  }
//layer.
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  // var baseMaps = {
  //   "Street Map": streetmap,
  //   "Dark Map": darkmap
  // };
  var significantEarthquakes = L.layerGroup(earthquakes)
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": significantEarthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, significantEarthquakes]
  });

  // // Create a layer control
  // // Pass in our baseMaps and overlayMaps
  // // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);
}














// // Define a markerSize function that will give each city a different radius based on its population
// function markerSize(population) {
//   return population / 40;
// }

// url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// // Store our API endpoint inside queryUrl
// //var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   //"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// // Perform a GET request to the query URL
// d3.json(url, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

//   // Define a function we want to run once for each feature in the features array
//   // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   // var earthquakes = L.geoJSON(earthquakeData, {
//   //   onEachFeature: onEachFeature
//   // });
//   geometry=earthquakeData[0].geometry
//    console.log(geometry.coordinates[0])
//    console.log(geometry.coordinates[1])
//    console.log(earthquakeData[0].properties.mag)
//   // Sending our earthquakes layer to the createMap function

//   for (var i = 0; i < earthquakeData.length; i++) {
//     geometry=earthquakeData[i].geometry
//     mag=earthquakeData[i].properties.mag
//     location=[]
//     location.push(geometry.coordinates[0])
//     location.push(geometry.coordinates[1])
//     L.circle(location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "purple",
//       // Setting our circle's radius equal to the output of our markerSize function
//       // This will make our marker's size proportionate to its population
//       radius: markerSize(mag*1000)
//     }).bindPopup("<h3>" + feature.properties.place +
//     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>").addTo(myMap);
//   }
// //layer.
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);
// }
