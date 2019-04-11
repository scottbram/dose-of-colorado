exports.handler = function (event, context, callback) {
	const mydocid = event.queryStringParameters.mydocid

	console.log('mydocid: ' + mydocid);

	const { AIRTABLE_API_KEY } = process.env
	
	const Airtable = require('airtable')

	console.log('Airtable: ');

	const base = new Airtable({
			apiKey: AIRTABLE_API_KEY
		})
		.base('appyIApZ1WBML8Rmo');

	var builtBody;

	base('mydoc_locations').select({
	    filterByFormula: "NOT({mydocid} = '')",
	    maxRecords: 10,
	    view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
	    // This function (`page`) will get called for each page of records.

	    builtBody = JSON.stringify(records);

	    /*records.forEach(function(record) {
	    	let strRet = 'Retrieved:' + record.get('mydocid')
	        
	        console.log(strRet);

	    });*/

	    // To fetch the next page of records, call `fetchNextPage`.
	    // If there are more records, `page` will get called again.
	    // If there are no more records, `done` will get called.
	    fetchNextPage();

	}, function done(err) {
	    if (err) { console.error(err); return; }

	    callback(null, {
			statusCode: 200,
			body: builtBody
		});
	});
}

/*exports.handler = function (event, context, callback) {
// exports.handler = async (event, context) => {

	console.log('context: ');
	console.log(context);

}*/
