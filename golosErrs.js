/* This library makes standard logs of "Steemit"/"Golos" errors more user-friendly */

function humaNize(errors) {
	alert(errors);
	if (errors.cause) {
		errors = JSON.stringify(errors.cause.payload.error.data.stack[0].data.error.stack[0].format);
		alert(errors);
		console.log(errors);
		var eLang = 'errs/' + detectLang() + '.json',
			request = new XMLHttpRequest();
		request.open('GET', eLang, false);
		request.send(null);
		var my_JSON_object = JSON.parse(request.responseText);
		console.log ('found:', my_JSON_object[errors]);
	} else {

	}
}
