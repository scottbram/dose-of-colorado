// var theData = [];
const Airtable = require('airtable')
const { AIRTABLE_API_KEY } = process.env
const mydoc_data = new Airtable({
		apiKey: AIRTABLE_API_KEY
	})
	.base('appyIApZ1WBML8Rmo')

exports.handler = async (event, context) => {
	const mydocid_query = event.queryStringParameters.mydocid

	try {
		var theGoods

		const resp = await mydoc_data('mydoc_locations')
			.select({
				maxRecords: 100,
				// filterByFormula: "NOT({mydocid} = '')"
				// filterByFormula: 'IF({mydocid} = ' + mydocid_query + ')'
				// filterByFormula: "{mydocid}=" + mydocid_query
				// filterByFormula: `{mydocid} = "mydocid_query"`
				// filterByFormula: '{mydocid}='+mydocid_query
			})
			.firstPage()

		const respJson = resp[0].fields

		if (typeof resp !== 'undefined') {
			theGoods = {
	            statusCode: 200,
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify(respJson)
	        }
		} else {
			theGoods = {
	            statusCode: 204,
	            body: 'I got nada...'
	        }
		}

		return theGoods

		// const resp = await mydoc_data('mydoc_locations')
		/*mydoc_data('mydoc_locations')
			.select({
				maxRecords: 100,
				view: "Grid view"
			})
			.eachPage(
				function page (records, fetchNextPage) {
					// This function (`page`) will get called for each page of records.

					records.forEach( function (record) {

						console.log('record: ')
						console.log(record)

						const loopId = record.get('mydocid')

						console.log('loopId: ' + loopId)

						console.log('Retrieved', loopId);

						// console.log('mydocid_query: ' + mydocid_query)

						// if ( loopId === mydocid_query ) {

							// console.log('WHOOMP, DEHRITIZ')

							// return record
						// }
					});

					// To fetch the next page of records, call `fetchNextPage`.
					// If there are more records, `page` will get called again.
					// If there are no more records, `done` will get called.
					fetchNextPage();
				},
				function done (err) {

					console.log(' ')
					console.log(' - - - - - - - ')
					console.log('err: ')
					console.log(' ')
					console.log( err )
					console.log(' ')
					console.log(' - ^ err ^ - ')
					console.log(' - - - - - - - ')

					if (err) {
						
						console.log('not so much')
						
						console.error(err);
						
						return;
					}
				}
			)*/
		
		/*console.log(' ')
		console.log(' - - - - - - - ')
		console.log('resp: ')
		console.log(' ')
		console.log( resp )
		console.log(' ')
		console.log(' - ^ resp ^ - ')
		console.log(' - - - - - - - ')

		console.log(' ')
		console.log(' - - - - - - - ')
		console.log('resp[0]: ')
		console.log(' ')
		console.log( resp[0] )
		console.log(' ')
		console.log(' - ^ resp[0] ^ - ')
		console.log(' - - - - - - - ')

		const respJson = resp[0].fields

		console.log(' ')
		console.log(' - - - - - - - ')
		console.log('respJson: ')
		console.log(' ')
		console.log( respJson )
		console.log(' ')
		console.log(' - ^ respJson ^ - ')
		console.log(' - - - - - - - ')

		if (typeof resp !== 'undefined') {
			theGoods = {
	            statusCode: 200,
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify(respJson)
	        }
		} else {
			theGoods = {
	            statusCode: 204,
	            body: 'I got nada...'
	        }
		}
		
		console.log(' ')
		
		console.log(' - - - - - - - ')
		console.log('return (try): ')
		console.log(' ')

		return theGoods*/

		/*return {
            statusCode: 200,
            body: JSON.stringify(theData)
        }*/
	} catch (errObj) {
		console.log(' ')
		console.log(' - - - - - - - - - - - - - - ')
		console.log('errObj.message: ')
		console.log(' ')
		console.error(errObj.message)
		console.log(' ')
		console.log(' - ^ errObj.message ^ - ')
		console.log(' - - - - - - - - - - - - - - ')
		console.log(' ')

		const errBody = errObj.message
		
		console.log(' ')
		console.log(' - - - - - - - ')
		console.log('return (catch): ')
		console.log(' ')

		return {
            statusCode: 500,
            body: errBody
        }
	}
};
