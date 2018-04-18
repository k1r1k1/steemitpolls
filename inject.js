var golosJs, momentJs, sweetAlert, gAuth, gPollsApi, bootstrapMin, gPollsStyle, gPollsWidth, gPollsLink, gPollsContainer;

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.type = 'text/css';
bootstrapMin.href = 'inject.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

golosJs = document.createElement('script');
golosJs.src = 'https://cdn.jsdelivr.net/npm/golos-js@0.6.1/dist/golos.min.js';
(document.head || document.documentElement).appendChild(golosJs);

momentJs = document.createElement('script');
momentJs.src = 'https://cdn.jsdelivr.net/npm/moment@2.21.0/min/moment.min.js';
(document.head || document.documentElement).appendChild(momentJs);

sweetAlert = document.createElement('script');
sweetAlert.src = 'https://unpkg.com/sweetalert2@7.15.0/dist/sweetalert2.all.js';
(document.head || document.documentElement).appendChild(sweetAlert);

gAuth = document.createElement('script');
gAuth.src = 'https://golosimages.com/auth.js';
(document.head || document.documentElement).appendChild(gAuth);

window.onload = function() { // init script after page loaded
gPollsContainer = document.createElement('div');
gPollsContainer.className = 'card border-primary mb-3';
gPollsContainer.innerHTML = `<div class="card-header"><img src="https://golospolls.com/graphics/logo.png" width="25" height="25" class="d-inline-block align-top" alt=""><a href="https://golospolls.com/" target="_blank">GolosPolls.com</a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div></div>`;
document.querySelector('.gPolls').style.width = gPollsWidth;
document.querySelector('.gPolls').appendChild(gPollsContainer);
// div inject
golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
var inputsC = 0, // inputs counter
	resultContent = '', // global variable for content
	pollData = {}, // polling answers
	votes = {},
	checkToVote = false,
	hash = gPollsLink,
	updProgressTimer;

function getPoll(callback) {
	console.log('<f> getPoll');
	document.querySelector('.card-body.text-dark').innerHTML = '';
	if (!resultContent.json_metadata) getHash();
	resultContent.json_metadata = JSON.parse(resultContent.json_metadata); //parse json to js
	var $div = document.createElement('h5'); // inserting header in poll 
	$div.className = 'card-title';
	$div.innerHTML = resultContent.json_metadata.data.poll_title;
	document.querySelector('.card-body.text-dark').appendChild($div);
	getVote(function (data) {
		for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress 
			var $div = document.createElement('div');
			$div.className = 'progress-block';
			if (data[cnt]) {
				$div.innerHTML = `<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
                    <div class="progress" id="` + cnt + `" style="cursor: pointer;">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
                    </div>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling 
			} else {
				$div.innerHTML = `<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
                    <div class="progress" id="` + cnt + `" style="cursor: pointer;">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
                    </div>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling     
			}
		}
		getVote();
	});
	if (callback) callback();
}

function progress_click() { // dummy for polling 
	console.log('<f> progress_click');
	if (wif) {
		swal({ // visual 
			type: 'success',
			title: 'Thanks for making your choice!',
			toast: true,
			showConfirmButton: false,
			timer: 2500
		})
		sendVote(this.id);
	} else {
		auth(() => {
			swal({ // visual 
				type: 'success',
				title: 'Thanks for making your choice!',
				toast: true,
				showConfirmButton: false,
				timer: 2500
			})
			sendVote(this.id);
		});
		if (err) {
			swal({
				title: 'error',
				text: 'authorization failed',
				type: 'error'
			})
		}
	}
}

function getHash() {
	console.log('<f> getHash ', hash);
	if (hash == '') clearUpdTimer();
	startUpdProgTimer();
	var startTarget = '#'; //
	var startPos = -1;
	while ((startPos = hash.indexOf(startTarget, startPos + 1)) != -1) {
		var Pos = startPos,
			targetStart = startPos;
	}
	startTarget = '/'; // search '/' after '/@'
	while ((Pos = hash.indexOf(startTarget, Pos + 1)) != -1) {
		var slashPos = Pos;
	}
	var username = hash.substring(targetStart + 1, slashPos); // '+ 2' removes the target symbols
	var permlink = hash.substring(slashPos + 1); // '+ 1' removes '/' 
	golos.api.getContent(username, permlink, function (err, result) { // The console displays the data required for the post 
		console.log(err, result);
		resultContent = result;
		if (!err && result.title != '') {
			console.log('getContent', result.title);
			getPoll();
		} else {
			console.error('Failed to find post', err);
			clearUpdTimer();
		}
	});
	console.log(username);
	console.log(permlink);
}

function sendVote(pollId) {
	console.log('<f> sendVote');
	if (checkToVote) {
		swal({
			title: 'error',
			text: 'Sorry, seems like you are already voted',
			type: 'error'
		})
	} else {
		var parentAuthor = resultContent.author;
		var parentPermlink = resultContent.permlink;
		var permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
		var title = ''; // title - empty for add a comment
		var body = 'I choose option # ' + pollId; // poll
		var jsonMetadata = {
			app: 'golospolls/0.1',
			canonical: 'https://golospolls.com#' + username + '/' + permlink,
			app_account: 'golosapps',
			data: {
				poll_id: pollId
			}
		};
		jsonMetadata = JSON.stringify(jsonMetadata);
		golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
			if (!err) {
				console.log('comment', result);
			} else console.error(err);
		});
		console.log('<f>sendVote');
	}
}

function getVote(collback) { // getting poll data
	console.log('<f> getVote');
	var cnt = 0;
	pollData = {};
	voters = [];
	golos.api.getContentReplies(resultContent.author, resultContent.permlink, function (err, result) {
		if (!err) {
			result.forEach(function (item) {
				item.json_metadata = JSON.parse(item.json_metadata);
				if (typeof item.json_metadata.data != 'undefined' && typeof item.json_metadata.data.poll_id != 'undefined') {
					if (!~voters.indexOf('"' + item.author + '",')) { // check for cheating votes
						voters = voters + '"' + item.author + '",';
						cnt++;
						if (!pollData[item.json_metadata.data.poll_id]) pollData[item.json_metadata.data.poll_id] = {
							count: 0,
							percnt: 0
						};
						pollData[item.json_metadata.data.poll_id].count++;
					}
					if (username == item.author) { // check if already voted
						checkToVote = true;
					} else {
						checkToVote = false;
					}
				}
			});
			console.log(voters);
			for (index = 0; index < resultContent.json_metadata.data.poll_answers.length; ++index) {
				if (typeof pollData[index] != 'undefined') {
					pollData[index].percnt = Math.round((pollData[index].count * 100) / cnt);
					if (document.querySelectorAll('.progress-bar')[index]) {
						document.querySelectorAll('.progress-bar')[index].style = 'width: ' + pollData[index].percnt + '%;';
						document.querySelectorAll('.progress-bar')[index].innerHTML = pollData[index].percnt + '% (' + pollData[index].count + ')';
					}
				}
			}
		} else console.error(err);
		document.querySelector('.card-header-right p').innerHTML = '<span class="badge badge-info">' + moment(resultContent.created).format('lll') + '</span>';
		if (collback) {
			collback(pollData);
			console.log('<f>getVote callback');
		}
	});
}

function startUpdProgTimer() {
	updProgressTimer = setInterval(getVote, 3000);
	console.log('<f> updProgressTimer');
}

function clearUpdTimer() {
	if (typeof updProgressTimer != 'undefined') {
		clearTimeout(updProgressTimer);
		console.log('<f> clearUpdTimeout');
	}
}
getHash();
};