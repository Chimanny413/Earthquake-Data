// Created a map centered at [0, 0]
var map = L.map('map').setView([0, 0], 2);

// Added the topographic layer from OpenStreetMap
var topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors'
}).addTo(map);

// Added the street layer from OpenStreetMap
var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Defined a base layers object
var baseLayers = {
    "Topographic": topoLayer,
    "Street": streetLayer
};

// Added layer control to the map
L.control.layers(baseLayers).addTo(map);

// Loaded earthquake data from USGS GeoJSON API
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


// Function to set marker style based on earthquake magnitude and depth
function getMarkerStyle(feature) {
    return {
        radius: Math.sqrt(Math.pow(2, feature.properties.mag)) * 2,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


}

// Function to determine color based on depth
function getColor(depth) {
    var colors = ['#00ff00', '#66ff00', '#ccff00', '#ffff00', '#ffcc00', '#ff9900']; // Six variations of colors
    if (depth > 300) return colors[5];
    else if (depth > 200) return colors[4];
    else if (depth > 100) return colors[3];
    else if (depth > 70) return colors[2];
    else if (depth > 30) return colors[1];
    else return colors[0];
}

// Function to create popups for each feature
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.place && feature.properties.mag && feature.geometry.coordinates) {
        layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2]);
    }
}

// Use D3 to fetch the GeoJSON data
d3.json(url).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, getMarkerStyle(feature));
        },
        onEachFeature: onEachFeature
    }).addTo(map);

   // Add legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [0, 30, 70, 100, 200, 300];
    var colors = ['#00ff00', '#66ff00', '#ccff00', '#ffff00', '#ffcc00', '#ff9900']; // Six variations of colors
    
    div.innerHTML += '<strong>Depth Legend</strong><br>';

    for (var i = 0; i < depths.length; i++) {
        var depthLabel = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+') + ' km';
        var colorBox = '<span style="display:inline-block; width:20px; height:10px; background:' + colors[i] + '; margin-right: 5px;"></span>';
        div.innerHTML += '<div>' + colorBox + ' ' + depthLabel + '</div>';
    }

    return div;
};
legend.addTo(map);

 });






