/** my.js */
var mydoc = ( typeof (mydoc) === 'object' ) ? mydoc : {};
(mydoc = {
	init : function () {
		mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGJyYW0iLCJhIjoiY2p0YzM1NW9zMHM5MTN5cDRsdnJoOGw3byJ9.A7umZVt9Sx7Nb8jfN6M03g';
		let mydoc_id_queryStr_val = $.urlParam('mydocid');

		console.log('mydoc_id_queryStr_val: ' + mydoc_id_queryStr_val);

		if ( mydoc_id_queryStr_val === false ) {
			let mydoc_map = mydoc.loadMap();

			mydoc_map.on('load', function () {
				$('#mydoc_map_status').hide();

				if ( $('#mydoc_map .alert').is(':visible') ) {
					$('#mydoc_map .alert').removeAttr('style');
				}
			});
		} else {
			$('#mydoc_id_search_field').val(mydoc_id_queryStr_val);

			$('#mydoc_id_search_go').prop('disabled', true);

			mydoc.findMyDoC('url');
		}

		$('#mydoc_id_search_field').on('input', function () {
			let mydoc_id_search_val = $(this).val();
				mydoc_id_search_val = $.trim(mydoc_id_search_val);

			if (mydoc_id_search_val.length > 4) {
				$('#mydoc_id_search_go').prop('disabled', false);
			} else {
				$('#mydoc_id_search_go').prop('disabled', true);
			}
		});

		$('#mydoc_id_search_field').keypress( function (e) {
			if (e.which === 13) {
				mydoc.findMyDoC('user');
			}
		});

		$('#mydoc_id_search_go').click( function () {
			mydoc.findMyDoC('user');
		});
	}
	,
	loadMap : function (settings) {
		$('#mydoc_map_status').show();

		var center = [-105.547222, 39];
		var zoom = 6.5;

		if (typeof settings !== 'undefined') {
			/** If no map center is specified, set to geographic center of Colorado */
			if (typeof settings.center !== 'undefined') {
				center = settings.center;
			}

			/** If no map zoom level is specified, set to a level making Colorado identifiable across widest variety of resolutions */
			if (typeof settings.zoom !== 'undefined') {
				zoom = settings.zoom;
			}
		}

		let mydoc_map = new mapboxgl.Map({
			container: 'mydoc_map',
			style: 'mapbox://styles/thatbram/cjtokh26902ad1fm43xqm4kv2', // 'Rado 2
			center: center,
			zoom: zoom
		});

		return mydoc_map;
	}
	,
	findMyDoC : function (source) {

		console.log('findMyDoC...');

		$('#mydoc_map .alert').alert('close');

		let mydoc_id_search_val;

		switch (source) {
			case 'user':

				console.log('...source: user');

				var qStr_idx = location.href.indexOf('?');

				console.log('qStr_idx: ' + qStr_idx);

				if (qStr_idx !== -1) {
					history.pushState('', document.title, window.location.pathname);
				}

				mydoc_id_search_val = $('#mydoc_id_search_field').val();
				mydoc_id_search_val = $.trim(mydoc_id_search_val);
			break;
			case 'url':

				console.log('...source: url');

				let mydoc_id_queryStr_val = $.urlParam('mydocid');
				mydoc_id_search_val = mydoc_id_queryStr_val;
		}

		mydoc_id_search_val = mydoc_id_search_val.toLowerCase();

		console.log('mydoc_id_search_val: ' + mydoc_id_search_val);

		let mydoc_id_valid = false;

		/** 
		 * In an upcoming version, 
		 * at this point a request is made 
		 * to the myDoC datastore 
		 * If a match is found, 
		 * a success status is returned 
		 * with the data in the response.
		 *
		 * For now, there is this...
		 */

		let mydoc_data = {
			date: '2019-03-11',
			lat: 40.130,
			long: -105.514
		};

		/** Matching "alpha" is the dev placeholder for matching a valid ID */
		if (mydoc_id_search_val === 'alpha') {
			mydoc_id_valid = true;
		}

		if (mydoc_id_valid) {
			let mydoc_id = mydoc_id_search_val;

			/** Set directly accessible URL */
			history.pushState('', document.title, '?mydocid=' + mydoc_id);

			let mydoc_lat = mydoc_data.lat;
			let mydoc_long = mydoc_data.long;
			let mydoc_loc_mb = [mydoc_long, mydoc_lat];

			let settings = {
				center: mydoc_loc_mb,
				zoom: 15
			}

			let mydoc_map = mydoc.loadMap(settings);

			mydoc_map.on('load', function () {

				console.log('findMyDoC mydoc_map.on(load)');

				$('#mydoc_map_status').hide();

				if ( $('#mydoc_map .alert').is(':visible') ) {
					$('#mydoc_map .alert').removeAttr('style');
				}

				let mydoc_marker = new mapboxgl.Marker().setLngLat(mydoc_loc_mb).addTo(mydoc_map);

				var markerHeight = 38,
					markerRadius = 8,
					linearOffset = 10;

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

				let mydoc_loc_str = mydoc_lat + ', ' + mydoc_long;

				mydoc_map_popup_template = '<span class="mydoc_id">' + mydoc_id + '</span>'
					+ '<br>'
					+ mydoc_loc_str
					+ '<br>'
					+ '<a href="#mydoc_details">Details</a>'
				;

				mydoc_map_popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mydoc-map-popup'})
					.setLngLat([mydoc_long, mydoc_lat])
					.setHTML(mydoc_map_popup_template)
					.addTo(mydoc_map);
			});
		} else {
			let mydoc_map = mydoc.loadMap();

			mydoc_map.on('load', function () {

				console.log('findMyDoC mydoc_map.on(load) - invalid id');

				$('#mydoc_map_status').hide();

				if ( $('#mydoc_map .alert').is(':visible') ) {
					$('#mydoc_map .alert').removeAttr('style');
				}
			});

			$('#mydoc_map').append('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>DoC id not found.</strong> Please try again.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');

			console.log( '$(#mydoc_map_status).is(:visible): ' +  $('#mydoc_map_status').is(':visible') );

			if ( $('#mydoc_map_status').is(':visible') ) {
				let mapStatus_h = $('#mydoc_map_status').outerHeight();

				$('#mydoc_map .alert:first').css('margin-top', mapStatus_h + 16 + 'px');
			}

			/** Autoclose the alerts */
			/*window.setTimeout( function () {
	            $('#mydoc_map .alert').alert('close');
	        }, 4000);*/
		}
	}
}).init();
