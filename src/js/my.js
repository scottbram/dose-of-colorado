/** my.js */

// console.log('my.js');

let myid = 0;

$('#mydoc_id_search_field').on('input', function () {
	myid = $(this).val();

	if (myid.length > 4) {
		$('#mydoc_id_search_go').attr('disabled', 'false');
	} else {
		$('#mydoc_id_search_go').attr('disabled', 'true');
	}
});
