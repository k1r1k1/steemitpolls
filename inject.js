var allJs = `<script src="https://cdn.jsdelivr.net/npm/i18next@11.2.3/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/i18next-xhr-backend@1.5.1/i18nextXHRBackend.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap.native@2.0.23/dist/bootstrap-native-v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/golos-js@0.7.2/dist/golos.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/moment@2.21.0/min/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.19.1/dist/sweetalert2.all.min.js"></script>
<script src="https://golospolls.com/auth.js"></script>
<script src="https://golospolls.com/api.js"></script>
<link rel="stylesheet" type="text/css" href="https://golospolls.com/inject.css">
<script src="https://cdn.jsdelivr.net/npm/i18next-browser-languagedetector@2.2.0/i18nextBrowserLanguageDetector.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/findandreplacedomtext@0.4.6/src/findAndReplaceDOMText.min.js"></script>`;
allJs = document.createRange().createContextualFragment(allJs); // create dom element
(document.head || document.documentElement).appendChild(allJs);

function incertHtmlPoll(resultContent) {
	console.log('<f> incertHtmlPoll inject');
	document.querySelector('.card-body.text-dark').innerHTML = '';
	var $div = document.createElement('h5'); // inserting header in poll
	$div.className = 'card-title';
	$div.innerHTML = resultContent.json_metadata.data.poll_title;
	document.querySelector('.card-body.text-dark').appendChild($div);
	getVote(function () {
		for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress 
			var $div = document.createElement('div');
			$div.className = 'progress-block';
			if (resultContent.json_metadata.data.poll_answers[cnt]) {
				$div.innerHTML = `<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
				<div class="progress" id="` + cnt + `" style="cursor: pointer;">
					<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
				</div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling 
			} else {
				$div.innerHTML = `<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
				<div class="progress" id="` + cnt + `" style="cursor: pointer;">
					<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
				</div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling     
			}
		}
		getVote(function () {
			console.log('<f> incertPollProg pollData', pollData);
			cnt = resultContent.json_metadata.data.poll_answers.length;
			document.querySelector('.card-header-right p').innerHTML = '</span><span class="badge badge-info">' + moment(resultContent.created).format('lll') + '</span>';
		})
	});
	document.querySelector('.card.border-primary.mb-3 a').href = 'https://golospolls.com/#' + resultContent.author + '/' + resultContent.permlink;
	startUpdProgTimer(3500);
}

window.addEventListener('load', function () { // init script after page loaded
	console.log('<f> doc loaded');
	/*	golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
		golos.config.set('websocket', 'wss://ws.testnet.golos.io');*/
	gPollsContainer = document.createElement('div');
	gPollsContainer.className = 'card border-primary mb-3';
	gPollsContainer.innerHTML = `
<div class="card-header bg-transparent border-success"><img src="https://golospolls.com/graphics/logo.png" width="25" height="25" class="d-inline-block align-top" alt=""><a href="https://golospolls.com/" target="_blank">GolosPolls</a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div></div>`;
	document.querySelector('.gPolls').style.width = gPollsWidth;
	document.querySelector('.gPolls').appendChild(gPollsContainer); // div inject
	console.log('<f> doc ready');
	hash = gPollsLink;
	getHash(function (resultContent) {
		incertHtmlPoll(resultContent);
	});
});
