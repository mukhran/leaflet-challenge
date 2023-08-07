// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><h3>Depth: ${feature.geometry.coordinates[2]}</h3>`);
  }
  //'#F06A6A', '#F0A76A', '#F3B94C', '#F3DB4C', '#E1F34C', '#B6F34C' starting from 90

  //'#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A' starting from 0


  // Return color based on value
function getDepth(x) {
	return x > 90 ? "#F06A6A" :
	       x > 70 ? "#F0A76A" :
	       x > 50 ? "#F3B94C" :
	       x > 30 ? "#F3DB4C" :
	       x > 10 ? "#E1F34C" :

		       "#B6F34C";
}

function getMag(x){
    return x*4
}

//Style function 
function style(feature) {
	return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getDepth(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getMag(feature.properties.mag),
        stroke: true,
        weight: 0.5
	};
}



  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, style(feature));
	},
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [-10,10,30,50,70,90];
    let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
    let labels = [];

    

    limits.forEach(function(limit, index) {
      labels.push(
        "<li><i style=\"background-color: " + colors[index] + "\"></i>" + 
      limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+")
      );
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

}

