var allJs = `<script src="https://cdn.jsdelivr.net/npm/i18next@11.2.3/i18next.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/i18next-xhr-backend@1.5.1/i18nextXHRBackend.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/i18next-browser-languagedetector@2.2.0/i18nextBrowserLanguageDetector.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/findandreplacedomtext@0.4.6/src/findAndReplaceDOMText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap.native@2.0.23/dist/bootstrap-native-v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/steem@0.7.2/dist/steem.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/moment@2.22.2/min/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/moment@2.22.2/min/locales.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.19.1/dist/sweetalert2.all.min.js"></script>
<script src="https://steemitpolls.com/lang.js"></script>
<script src="https://steemitpolls.com/auth.js"></script>
<script src="https://steemitpolls.com/api.js"></script>
<link rel="stylesheet" type="text/css" href="https://steemitpolls.com/inject.css">`;
allJs = document.createRange().createContextualFragment(allJs); // create dom element
(document.head || document.documentElement).appendChild(allJs);

function incertHtmlPoll(resultContent) {
	console.log('<f> incertHtmlPoll inject');
	document.querySelector('.card-body.text-dark').innerHTML = '';
	var $div = document.createElement('h5'); // inserting header in poll
	$div.className = 'card-title';
	$div.innerHTML = resultContent.json_metadata.data.poll_title;
	if (resultContent.json_metadata.data.poll_description) $div.innerHTML = $div.innerHTML + '<br><label class="poll-desc">' + resultContent.json_metadata.data.poll_description + '</label>';
	document.querySelector('.card-body.text-dark').appendChild($div);
	getVote(function () {
		for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress
			var $div = document.createElement('div');
			$div.className = 'progress-block';
			if (resultContent.json_metadata && resultContent.json_metadata.data && resultContent.json_metadata.data.poll_answers && resultContent.json_metadata.data.poll_images && resultContent.json_metadata.data.poll_answers[cnt] && resultContent.json_metadata.data.poll_images[cnt]) {
				$div.innerHTML = `<div class="card" id="` + cnt + `" onclick="progress_click(this.id)"><div class="card-body vote-item">
<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
						<p><img src="` + resultContent.json_metadata.data.poll_images[cnt] + `" class="rounded"><div class="progress"  style="cursor: pointer;"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div></div></div></div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
			} else {
				$div.innerHTML = `<div class="card" id="` + cnt + `" onclick="progress_click(this.id)"><div class="card-body vote-item"><label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label><div class="progress" style="cursor: pointer;"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div></div></div></div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
			}
		}
		getVote(function () {
			console.log('<f> incertPollProg pollData', pollData);
			cnt = resultContent.json_metadata.data.poll_answers.length;
			document.querySelector('.card-date p').innerHTML = '</span><span class="badge badge-light">' + moment(resultContent.created).format('lll') + '</span>';
		})
	});
	document.querySelector('.card.border-primary.mb-3 a').href = 'https://steemitpolls.com/#' + resultContent.author + '/' + resultContent.permlink;
	startUpdProgTimer(3500);
}

function updateProgressValues() {
	console.log('<f> updateProgressValues');
	getVote(function () {
		document.querySelector('.card-header-right p').innerHTML = '<span class="badge badge-info">' + document.querySelectorAll('.translate-phrases li')[4].innerHTML + ': ' + countOfVoters + '</span>';
	})
}

window.addEventListener('load', function () { // init script after page loaded
	console.log('<f> doc loaded');
	localStorage.lang = detectLang();
	// background
/*	var i = 0;
	bgTimer = setInterval(function () {
		i = i + 2;
		if (i > 360) {
			i = 0;
		}
		document.querySelector('.sPolls .card-body').style = 'background-image: linear-gradient(' + i + 'deg, #ff000045, #0000ff7d);';
	}, 100);*/
	// variable in valid format moment.js
	switch (localStorage.lang) {
		case 'ua':
			moment.locale('uk');
			break;
		case 'by':
			moment.locale('be');
			break;
		case 'cn':
			moment.locale('zh-cn');
			break;
		case 'kr':
			moment.locale('ko');
			break;
		case 'jp':
			moment.locale('ja');
			break;
		default:
			moment.locale(localStorage.lang);
	}
	initLang(localStorage.lang); // automatic lang switch
	sPollsContainer = document.createElement('div');
	sPollsContainer.className = 'card border-primary mb-3';
	sPollsContainer.innerHTML = `<div class="card-header bg-transparent border-success"><img src="https://steemitpolls.com/graphics/logo-animated.gif" width="25" height="25" class="logo-top"><a href="https://steemitpolls.com/" target="_blank"><img src="https://steemitpolls.com/graphics/steemitpolls-animated-18px.svg" class="d-inline-block align-top"></a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div><div class="card-date"><p></p></div></div>`;
	document.querySelector('.sPolls').style.width = sPollsWidth;
	document.querySelector('.sPolls').appendChild(sPollsContainer); // div inject
	console.log('<f> doc ready');
	hash = sPollsLink;
	getHash(function (resultContent) {
		incertHtmlPoll(resultContent);
	});
});
