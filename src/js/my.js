/** my.js */

var mydoc_id = '',
	mydoc_id_queryStr_val = $.urlParam('mydocid'),
	mydoc_id_valid = false,
	mydoc_id_search_val,
	mydoc_map,
	mydoc_lat,
	mydoc_long,
	mydoc_loc,
	mydoc_loc_str = '',
	mydoc_loc_mb,
	mydoc_marker,
	mydoc_map_popup;

mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGJyYW0iLCJhIjoiY2p0YzM1NW9zMHM5MTN5cDRsdnJoOGw3byJ9.A7umZVt9Sx7Nb8jfN6M03g';

mydoc_map = new mapboxgl.Map({
	container: 'mydoc_map',
	style: 'mapbox://styles/thatbram/cjtiahjbp0nug1fm8qcymkp8v',
	zoom: 6,
	center: [-105.547222, 39] // Geographic center of Colorado
});

mydoc_map.on('load', function () {
	if ( mydoc_id_queryStr_val !== false ) {
		findMyDoC('url');
	}
});

function loadMap () {
	mydoc_map = new mapboxgl.Map({
		container: 'mydoc_map',
		style: 'mapbox://styles/thatbram/cjtokh26902ad1fm43xqm4kv2', // 'Rado 2
		zoom: 6,
		center: [-105.547222, 39] // Geographic center of Colorado
	});
}

$('#mydoc_id_search_field').on('input', function () {
	mydoc_id_search_val = $(this).val();
	mydoc_id_search_val = $.trim(mydoc_id_search_val);

	if (mydoc_id_search_val.length > 4) {
		$('#mydoc_id_search_go').prop('disabled', false);
	} else {
		$('#mydoc_id_search_go').prop('disabled', true);
	}
});

function findMyDoC (mydoc_source) {
	switch (mydoc_source) {
		case 'user':
			mydoc_id_search_val = $('#mydoc_id_search_field').val();
			mydoc_id_search_val = $.trim(mydoc_id_search_val);
		break;
		case 'url':
			mydoc_id_search_val = mydoc_id_queryStr_val;

			if ( mydoc_id !== false ) {
				$('#mydoc_id_search_field').val(mydoc_id_search_val);
			}
	}

	var mydoc_data = {
		id: 'alpha',
		date: '2019-03-11',
		lat: 40.130,
		long: -105.514
	};

	/** Matching "alpha" is the dev placeholder for matching a valid ID */
	if (mydoc_id_search_val.toLowerCase() === 'alpha') {
		mydoc_id_valid = true;
	}

	if (mydoc_id_valid) {
		mydoc_id = mydoc_data.id;

		switch (mydoc_source) {
			case 'user':
				loadMap();
			break;
			case 'url':
				// 
		}

		/** Set directly accessible URL */
		let stateObj = {
		    mydoc_id: mydoc_id,
		};

		history.pushState(stateObj, '', '?' + mydoc_id);

		mydoc_lat = mydoc_data.lat;
		mydoc_long = mydoc_data.long;
		mydoc_loc_str = mydoc_lat + ', ' + mydoc_long;
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

		var mydoc_map_popup_template = '<span class="mydoc_id">' + mydoc_id + '</span>'
			+ '<br>'
			+ mydoc_loc_str
			+ '<br>'
			+ '<a href="#">Details</a>'
		;

		mydoc_map_popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mydoc-map-popup'})
			.setLngLat([mydoc_long, mydoc_lat])
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
