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

				// console.log('qStr_idx: ' + qStr_idx);

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

		$.ajax({
			url: '/.netlify/functions/mydoc_at?mydocid=' + mydoc_id_search_val,
		}).done( function (resp) {
			/** 
			 * Finding a match in the client-side is the solution until the Airtable API proxy function filters the match
			 */
			
			var mydoc_id_valid = false,
				mydoc_data;

			$.each(resp, function (idx, itm) {
				itm = itm.fields;

				if (mydoc_id_search_val === itm.mydocid) {
					mydoc_id_valid = true;
					mydoc_data = itm;

					return;
				}

				if (idx+1 === resp.length && !mydoc_id_valid) {
					mappingErr('invalidMydoc');
				}
			});

			if (mydoc_id_valid) {
				let mydoc_id = mydoc_id_search_val;

				/** Set directly accessible URL */
				history.pushState('', document.title, '?mydocid=' + mydoc_id);

				if (mydoc_data.videos) {
					var videosArr = mydoc_data.videos;
						videosArr = videosArr.split(',');

					$.each(videosArr, function (idx, itm) {
						let vidSvc = itm.substr(0, itm.indexOf(':'));
						var vidId = itm.substr(itm.indexOf(':')+1, itm.length);
						var vidObj;

						switch (vidSvc) {
							case 'vimeo':
								vidObj = '<iframe src="https://player.vimeo.com/video/' + vidId + '" class="video" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
							break;
							// case 'youtube':
								// vidObj = ''; // 'https://youtube.com/watch?v=' + vidId;
							// break;
						}

						$('#mydoc_details_videos_container').append(vidObj);
					});
				}

				/** 
				 * For image display/carousel, use naming convention, for example:
				 * - alpha01.jpg, alpha02.jpg
				 * or
				 * - /alpha/01.jpg, /alpha/02.jpg
				 */

				if (mydoc_data.photos) {
					var photosArr = mydoc_data.photos;
						photosArr = photosArr.split(',');

					/*$.each(photosArr, function (idx, itm) {
						//
					});*/
				}

				if (mydoc_data.collection_date) {
					var mydoc_collDate = mydoc_data.collection_date;

					// Do the date stuff
				}

				if (mydoc_data.latitude) {
					var mydoc_lat = mydoc_data.latitude;
				}

				if (mydoc_data.longitude) {
					var mydoc_long = mydoc_data.longitude;
				}

				if (!mydoc_data.latitude || !mydoc_data.longitude) {
					mappingErr('missingCoors');

					return;
				}
				
				let mydoc_loc_mb = [mydoc_long, mydoc_lat];

				let settings = {
					center: mydoc_loc_mb,
					zoom: 15
				};

				let mydoc_map = mydoc.loadMap(settings);

				mydoc_map.on('load', function () {
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
						// + '<br>'
						// + '<a href="#mydoc_details">Details</a>'
					;

					mydoc_map_popup = new mapboxgl.Popup({offset: popupOffsets, className: 'mydoc-map-popup'})
						.setLngLat([mydoc_long, mydoc_lat])
						.setHTML(mydoc_map_popup_template)
						.addTo(mydoc_map);
				});
			}

			function mappingErr (condition) {
				var errMsg;

				switch (condition) {
					case 'invalidMydoc':
						errMsg = '<strong>DoC id not found.</strong> Please try again.';
					break;
					case 'missingCoors':
						errMsg = '<strong>Can\'t map this Dose ID.</strong> Seems to be from lack of coordinates. Sorry about that... =/';
					break;
					default:
						errMsg = '<strong>Can\'t map this Dose ID.</strong> Looks like that\'s all the info there is. Sorry about that... =/';
					break;
				}
				let mydoc_map = mydoc.loadMap();

				mydoc_map.on('load', function () {

					console.log('findMyDoC mydoc_map.on(load) - invalid id');

					$('#mydoc_map_status').hide();

					if ( $('#mydoc_map .alert').is(':visible') ) {
						$('#mydoc_map .alert').removeAttr('style');
					}
				});

				$('#mydoc_map').append('<div class="alert alert-danger alert-dismissible fade show" role="alert">' + errMsg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');

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
		});
	}
}).init();
