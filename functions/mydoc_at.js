const Airtable = require('airtable')
const { AIRTABLE_API_KEY } = process.env
const mydoc_data = new Airtable({
		apiKey: AIRTABLE_PAT
	})
	.base('appyIApZ1WBML8Rmo')

exports.handler = async (event, context) => {
	const mydocid_query = event.queryStringParameters.mydocid

	try {
		var theGoods,
		// https://community.airtable.com/t/variable-in-filterbyformula/2251
			filterFormula = "({mydocid} = '" + mydocid_query + "')";

		const resp = await mydoc_data('mydoc_locations')
			.select({
				maxRecords: 100,
				filterByFormula: filterFormula
			})
			.firstPage()

		if (typeof resp !== 'undefined') {
			theGoods = {
	            statusCode: 200,
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify(resp)
	        }
		} else {
			theGoods = {
	            statusCode: 204,
	            body: 'I got nada...'
	        }
		}

		return theGoods
	} catch (errObj) {
		const errBody = {
			'err_msg': errObj.message
		}
		
		return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errBody)
        }
	}
};
