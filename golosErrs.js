/* This lib makes standard error logs of "Steemit"/"Golos" user-friendly and in native language */

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
}
