var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    //layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function getColorPreference(coordinate_depth) {
        switch (true) {
            case coordinate_depth > 90:
                return "#4C0099";
            case coordinate_depth > 70:
                return "#6600CC";
            case coordinate_depth > 50:
                return "#7F00FF";
            case coordinate_depth > 30:
                return "#9933FF";
            case coordinate_depth > 10:
                return "#8266FF";
            default:
                return "#CC99FF";
        }
    }

    function markerSize(magnitude) {
        return Math.sqrt(magnitude) * 10;
    }

    function stylebox(feature) {
        return {
            fillOpacity: 0.75,
            color: "white",
            fillColor: getColorPreference(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag)
        };
    }
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong);
        },
        style: stylebox,
        onEachFeature: function (feature, mylayer) {
            mylayer.bindPopup(`<h2>Mag: ${feature.properties.mag}</h2> <hr> <h3>Elev: ${feature.geometry.coordinates[2]}</h3> `);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street
        // "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [29.4241, -98.4936],
        zoom: 5,
        layers: [street, earthquakes]
    });
    //earthquakes.addTo(myMap);
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

