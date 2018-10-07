/* This library makes standard error logs of "Steemit"/"Golos" user-friendly and in native language */

function humaNize(errors) {
	var request = new XMLHttpRequest();
		request.open('GET', 'https://golospolls.com/errs/' + detectLang() + '.json', false);
		request.send(null);
		var my_JSON_object = JSON.parse(request.responseText);
	if (errors.cause) {
		errors = JSON.stringify(errors.cause.payload.error.data.stack[0].data.error.stack[0].format);
		return my_JSON_object[errors]
	} else if (my_JSON_object[errors] != undefined) {
		return my_JSON_object[errors]
	} else {
		return errors
	}

	/*fetch('errs/' + detectLang() + '.json')
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
		.catch(function() {
			// This is where you run code if the server returns any errors
		});*/
}
