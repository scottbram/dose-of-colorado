exports.handler = async (event, context) => {
	const mydocid = event.queryStringParameters.mydocid;

	console.log(mydocid);

	const { AIRTABLE_API_KEY } = process.env;

	console.log(AIRTABLE_API_KEY);

	/*var Airtable = require('airtable');
	var base = new Airtable({apiKey: AIRTABLE_API_KEY}).base('appyIApZ1WBML8Rmo');

	base('mydoc_locations').find(mydocid, function(err, record) {
	    if (err) { console.error(err); return; }
	    console.log(record);
	});*/
};

/*exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
};*/
