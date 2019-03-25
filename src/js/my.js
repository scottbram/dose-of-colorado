/** my.js */

mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGJyYW0iLCJhIjoiY2p0YzM1NW9zMHM5MTN5cDRsdnJoOGw3byJ9.A7umZVt9Sx7Nb8jfN6M03g';

var mydoc_map;

/*mydoc_map = new mapboxgl.Map({
	container: 'mydoc_map',
	// style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
	// style: 'mapbox://styles/mapbox/outdoors-v9',
	zoom: 6,
	center: [-105.547222, 39] // Geographic center of Colorado
});*/

/*mydoc_map.on('load', function () {
	mydoc_map.addSource('dem', {
		"type": "raster-dem",
		"url": "mapbox://mapbox.terrain-rgb"
	});

	mydoc_map.addLayer({
		"id": "hillshading",
		"source": "dem",
		"type": "hillshade"
	}, 'waterway-river-canal-shadow');
});*/

mydoc_map = new mapboxgl.Map({
	container: 'mydoc_map',
	style: 'mapbox://styles/thatbram/cjtiahjbp0nug1fm8qcymkp8v',
	zoom: 6,
	center: [-105.547222, 39] // Geographic center of Colorado
});

mydoc_map.on('load', function () {
	if (location.href.indexOf('?') !== -1) {
		findMyDoC('url');
	}
});

function loadMap () {
	mydoc_map = new mapboxgl.Map({
		container: 'mydoc_map',
		// style: 'mapbox://styles/thatbram/cjtiahjbp0nug1fm8qcymkp8v', // 'Rado
		style: 'mapbox://styles/thatbram/cjtokh26902ad1fm43xqm4kv2', // 'Rado 2
		zoom: 6,
		center: [-105.547222, 39] // Geographic center of Colorado
	});
}

var mydoc_id = '',
	mydoc_lat,
	mydoc_long,
	mydoc_loc,
	mydoc_loc_str = '',
	mydoc_loc_mb,
	mydoc_marker,
	mydoc_map_popup;

$('#mydoc_id_search_field').on('input', function () {
	mydoc_id = $(this).val();
	mydoc_id = $.trim(mydoc_id);

	if (mydoc_id.length > 4) {
		$('#mydoc_id_search_go').prop('disabled', false);
	} else {
		$('#mydoc_id_search_go').prop('disabled', true);
	}
});

function findMyDoC (mydoc_source) {
	loadMap();

	switch (mydoc_source) {
		case 'user':
			mydoc_id = $('#mydoc_id_search_field').val();
			mydoc_id = $.trim(mydoc_id);

			let stateObj = {
			    mydoc_id: mydoc_id,
			};

			history.pushState(stateObj, '', '?'+mydoc_id);
		break;
		case 'url':
			var qStr_idx = location.href.indexOf('?');
				qStr_idx = qStr_idx + 1;
			var qStr = location.href.substr(qStr_idx, location.href.length)
			
			console.log('qStr: ' + qStr);

			mydoc_id = qStr;

			$('#mydoc_id_search_field').val(mydoc_id);
	}

	console.log('mydoc_id: ' + mydoc_id);

	if (mydoc_id.toLowerCase() === 'alpha') {
		mydoc_lat = 40.130;
		mydoc_long = -105.514
		mydoc_loc_str = mydoc_lat + ' ,' + mydoc_long;
		mydoc_loc_mb = [mydoc_long, mydoc_lat];

		mydoc_map.setCenter(mydoc_loc_mb);
		mydoc_map.setZoom(15);

		mydoc_marker = new mapboxgl.Marker().setLngLat(mydoc_loc_mb).addTo(mydoc_map);

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

		var mydoc_map_popup_template = '<span class="mydoc_id">' + mydoc_id + '</span>';
			mydoc_map_popup_template += '<br>';
			mydoc_map_popup_template += mydoc_loc_str;

		mydoc_map_popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mydoc-map-popup'})
			.setLngLat([-105.514, 40.130])
			.setHTML(mydoc_map_popup_template)
			.addTo(mydoc_map);
	} else {
		$('#mydoc_map').append('<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>DoC id not found.</strong> Please try again.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');

		window.setTimeout( function () {
            $('#mydoc_map .alert').alert('close');
        }, 4000);
	}
}

$('#mydoc_id_search_field').keypress( function (e) {
	if (e.which === 13) {
		findMyDoC('user');
	}
});

$('#mydoc_id_search_go').click( function () {
	findMyDoC('user');
}); 
