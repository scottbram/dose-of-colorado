const Airtable = require('airtable')
const { AIRTABLE_PAT } = process.env
const mydoc_data = new Airtable({
		apiKey: AIRTABLE_PAT
	})
	.base('appyIApZ1WBML8Rmo')

const handler = async (req, res) => {
	const mydocid_query = req.query.mydocid

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

		console.log(resp);

		if (typeof resp !== 'undefined') {
			res = {
	            statusCode: 200,
	            headers: { 'Content-Type': 'application/json' },
	            // body: JSON.stringify(resp)
				json: resp
	        }
		} else {
			res = {
	            statusCode: 204,
	            body: 'I got nada...'
	        }
		}

		return res
	} catch (errObj) {
		const errBody = {
			'err_msg': errObj.message
		}
		
		return {
            statusCode: errObj.statusCode,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errBody)
        }
	}
};

module.exports = handler