/** my.js */

// console.log('my.js');

mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGJyYW0iLCJhIjoiY2p0YzM1NW9zMHM5MTN5cDRsdnJoOGw3byJ9.A7umZVt9Sx7Nb8jfN6M03g';
				
var mydoc_map = new mapboxgl.Map({
	container: 'mydoc_map',
	style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
	zoom: 6,
	center: [-105.547222, 39] // Geographic center of Colorado
});

mydoc_map.on('load', function () {
	mydoc_map.addSource('dem', {
		"type": "raster-dem",
		"url": "mapbox://mapbox.terrain-rgb"
	});

	mydoc_map.addLayer({
		"id": "hillshading",
		"source": "dem",
		"type": "hillshade"
	}, 'waterway-river-canal-shadow');
});

var mydoc_id = 0;

$('#mydoc_id_search_field').on('input', function () {
	mydoc_id = $(this).val();

	console.log(mydoc_id.length);

	if (mydoc_id.length > 4) {
		$('#mydoc_id_search_go').prop('disabled', false);
	} else {
		$('#mydoc_id_search_go').prop('disabled', true);
	}
});

$('#mydoc_id_search_go').click( function () {
	
	console.log('mydoc_id: ' + mydoc_id);

	var mydoc_marker = new mapboxgl.Marker().setLngLat([-105.514, 40.130]).addTo(mydoc_map);

	mydoc_map.setCenter([-105.514, 40.130]);
	mydoc_map.setZoom(15);

	var markerHeight = 38, markerRadius = 8, linearOffset = 10;

	var popupOffsets = {
		'top': [0, 0],
		'top-left': [0,0],
		'top-right': [0,0],
		'bottom': [0, -markerHeight],
		'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
		'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
		'left': [markerRadius, (markerHeight - markerRadius) * -1],
		'right': [-markerRadius, (markerHeight - markerRadius) * -1]
	};

	var mydoc_map_popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mydoc-map-popup'})
		.setLngLat([-105.514, 40.130])
		.setHTML('DoC id: alpha')
		.addTo(mydoc_map);
}); 
