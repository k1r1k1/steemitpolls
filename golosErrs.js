/* This library makes standard error logs of "Steemit"/"Golos" user-friendly and in native language */

async function humaNize(errors) {
	/*console.log('caught:',errors);
	var request = new XMLHttpRequest();
		request.open('GET', 'errs/' + detectLang() + '.json', false);
		request.send(null);
		var my_JSON_object = JSON.parse(request.responseText);
	if (errors.cause) {
		errors = JSON.stringify(errors.cause.payload.error.data.stack[0].data.error.stack[0].format);
		console.log('cleared:', errors);
		console.log('found:', my_JSON_object[errors]);
		return my_JSON_object[errors]
	} else if (my_JSON_object[errors] != undefined) {
		console.log('found:', my_JSON_object[errors]);
		return my_JSON_object[errors]
	} else {
		console.log('ERROR:', errors)
		return errors
	}*/

	await fetch('errs/' + detectLang() + '.json')
		.then((response) => response.json())
		.then((responseJSON) => {
			if (errors.cause) {
				errors = JSON.stringify(errors.cause.payload.error.data.stack[0].data.error.stack[0].format);
				console.log('found1:', responseJSON[errors]);
				return responseJSON[errors]
			} else if (responseJSON[errors] != undefined) {
				console.log('found2:', responseJSON[errors]);
				return responseJSON[errors]
			} else {
				console.log('found3:', errors);
				return errors
			}
	    })

/*	fetch('errs/' + detectLang() + '.json')
		.then((response) => response.json())
		.then((responseJSON) => {
			if (errors.cause) {
				errors = JSON.stringify(errors.cause.payload.error.data.stack[0].data.error.stack[0].format);
				console.log('found1:', responseJSON[errors]);
				results = responseJSON[errors]
			} else if (responseJSON[errors] != undefined) {
				console.log('found2:', responseJSON[errors]);
				results = responseJSON[errors]
			} else {
				console.log('found3:', [errors]);
				results = errors;
					return results
			}
		}).catch(e => console.error(e))*/
}
