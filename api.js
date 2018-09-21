/* ------------------------------- */
//	GolosPolls main script file		//
// 		https://golospolls.com/		//
/* ------------------------------- */
/*golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
golos.config.set('websocket', 'wss://ws.testnet.golos.io');*/

var resultContent = '', // global variable for content
	pollData = {}, // polling answers
	countOfVoters,
	checkToVote = false,
	updProgressTimer,
	tagNewPost,
	counter, // for poll after creating a new post 
	hash = location.hash.substring(1), // geting hash
	$translatePhrases = `<ul class="translate-phrases" style="display: none;">
		0
		<li>Make your choice</li>
		1
		<li>Created</li>
		2
		<li>Variants</li>
		3
		<li>Poll title</li>
		4
		<li>Voters</li>
		5
		<li>Leading</li>
		6
		<li>Type your text here</li>
		7
		<li>Yes, just do it!</li>
		8
		<li>You do not have any polls yet</li>
		9
		<li>Thanks for making your choice!</li>
		10
		<li>Link has been copied</li>
		11
		<li>Code has been copied</li>
		12
		<li>Click here to add a new one</li>
		13
		<li>Your polling form has been compiled</li>
		14
		<li>Don't forget to share it!</li>
		15
		<li>error</li>
		16
		<li>You won't be able to revert this!</li>
		17
		<li>no one voted</li>
		18
		<li>Please, enter the title and the polling fields</li>
		19
		<li>Are you sure?</li>
		20
		<li>List of your polls</li>
		21
		<li>Success</li>
		22
		<li>Remove vote</li>
		23
		<li>Enter the title</li>
		24
		<li>Enter description (not necessary)</li>
		25
		<li>Fill in the following fields</li>
		26
		<li>Please add at least two answers</li>
		27
		<li>You can only vote once</li><!--api.js-->
		28
		<li>Please wait for</li><!--api.js-->
		29
		<li>seconds</li><!--api.js-->
		30
		<li>delete the previous vote to vote again</li><!--api.js-->
		31
		<li>Please fill or remove empty fields</li>
		32
		<li>Fill in this field</li>
		33
		<li>Your poll has been edited</li>
		34
		<li>At least 2 options should stay</li>
		35
		<li>Apply</li>
		36
		<li>Cancel</li>
		37
		<li>Failed to find post</li>
		38
		<li>Your vote has been deleted</li>
		39
		<li>Your vote</li>
	</ul>`;
$translatePhrases = document.createRange().createContextualFragment($translatePhrases); // create dom element
(document.body || document.documentElement).appendChild($translatePhrases);

function progress_click(id) { // dummy for polling
	console.log('<f> progress_click #' + id);
	auth(function () {
		if (wif.posting) {
			sendVote(id, function (err, result) {
				if (err) {
					swal({
						type: 'error',
						title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
						text: humaNize(err)
					});
				} else {
					swal({
						type: 'success',
						title: document.querySelectorAll('.translate-phrases li')[9].innerHTML,
						html: document.querySelector('.socialButtons').innerHTML
					});
				}
			});
		}
	}, ['posting']);
}

function getHash(callback) {
	console.log('<f> getHash');
	if (hash == 'create') {
		newPoll()
	} else if (hash == 'mypolls') {
		myPolls()
	} else if (hash == 'integration') {
		integration()
	} else if (hash == 'about') {
		about()
	} else if (hash == 'support') {
		support()
	} else {
		var startTarget = '/#'; // search '/#'
		var startPos = -1;
		while ((startPos = hash.indexOf(startTarget, startPos + 1)) != -1) {
			var Pos = startPos,
				targetStart = startPos;
		}
		startTarget = '/'; // search '/' after '/#'
		while ((Pos = hash.indexOf(startTarget, Pos + 1)) != -1) {
			var slashPos = Pos;
		}
		var username = hash.substring(targetStart + 2, slashPos); // '+ 2' removes the target symbols
		var permlink = hash.substring(slashPos + 1); // '+ 1' removes '/'
		golos.api.getContent(username, permlink, 10000, function (err, result) { // The console displays the data required for the post
			if (!err && result.title != '') {
				resultContent = result;
				result.json_metadata = JSON.parse(result.json_metadata); //parse json to js
				console.log('getHash-resultContent=', resultContent);
				callback(result);
			} else {
				swal({
					type: 'error',
					title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
					text: document.querySelectorAll('.translate-phrases li')[37].innerHTML
				});
				clearUpdTimer();
			}
		});
	}
}

function sendVote(pollId, callback) {
	console.log('<f> sendVote');
	getVote(() => {
		if (tagNewPost) {
			swal({
				title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
				text: document.querySelectorAll('.translate-phrases li')[28].innerHTML + ' ' + counter + ' ' + document.querySelectorAll('.translate-phrases li')[29].innerHTML,
				type: 'error'
			})
			return;
		}
		if (checkToVote) {
			tryVoteAgain();
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
			golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
				if (!err) {
					console.log('comment', result);
				} else {
					console.error(err);
				}
				callback(err, result);
			});
		}
	});
}

function tryVoteAgain() {
	swal({
		title: document.querySelectorAll('.translate-phrases li')[27].innerHTML,
		text: document.querySelectorAll('.translate-phrases li')[30].innerHTML,
		type: 'error',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: document.querySelectorAll('.translate-phrases li')[35].innerHTML,
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
			removeMyVote();
		}
	})
}

function removeMyVote() {
	golos.broadcast.deleteComment(wif.posting, checkToVote.author, checkToVote.permlink, function (err, result) {
		if (err) {
			swal(
				'error',
				document.querySelectorAll('.translate-phrases li')[15].innerHTML,
				err
			)
			console.error(err);
		}
		insertHtmlPoll(resultContent);
	});
	swal(
		document.querySelectorAll('.translate-phrases li')[21].innerHTML,
		document.querySelectorAll('.translate-phrases li')[38].innerHTML,
		'success'
	)
}

function getVote(callback) { // getting poll data
	// console.log('<f> getVote');
	countOfVoters = 0;
	checkToVote = false;
	pollData = {};
	voters = [];
	golos.api.getContentReplies(resultContent.author, resultContent.permlink, 10000, function (err, result) {
		if (!err) {
			result.forEach(function (item) {
				item.json_metadata = JSON.parse(item.json_metadata);
				if (typeof item.json_metadata.data != 'undefined' && typeof item.json_metadata.data.poll_id != 'undefined') {
					if (!~voters.indexOf('"' + item.author + '",')) { // check for cheating votes
						voters = voters + '"' + item.author + '",';
						if (!pollData[item.json_metadata.data.poll_id]) pollData[item.json_metadata.data.poll_id] = {
							count: 0,
							percnt: 0
						};
						countOfVoters++;
						/*console.log('countOfVoters', countOfVoters);*/
						pollData[item.json_metadata.data.poll_id].count++;
					}
					/*console.log('comments:', item);*/
					if (typeof wif != 'undefined') {
						if (username == item.author) { // check if already voted
							checkToVote = {};
							checkToVote.permlink = item.permlink;
							checkToVote.author = item.author;
							checkToVote.poll_id = item.json_metadata.data.poll_id;
						} else {
							checkToVote = false;
						}
					}
				}
			});
			/*console.log('countOfVoters', countOfVoters);*/
			Object.keys(pollData).map(function (objectKey, index) { // foreach pollData
				pollData[objectKey].percnt = Math.round((pollData[objectKey].count * 100) / countOfVoters); // calculate percent
			});
			cnt = resultContent.json_metadata.data.poll_answers.length;
			for (index = 0; index < resultContent.json_metadata.data.poll_answers.length; ++index) {
				if (typeof pollData[index] != 'undefined') {
					if (document.querySelectorAll('.progress-bar')[index]) {
						document.querySelectorAll('.progress-bar')[index].style = 'width: ' + pollData[index].percnt + '%;';
						document.querySelectorAll('.progress-bar')[index].innerHTML = pollData[index].percnt + '% (' + pollData[index].count + ')';
						document.querySelectorAll('.progress-bar')[index].classList.remove('bg-success');
						if (checkToVote) {
							document.querySelectorAll('.progress-bar')[checkToVote.poll_id].classList.add('bg-success');
							document.querySelectorAll('.progress-bar')[checkToVote.poll_id].innerHTML = '<span class="icon-checkmark"> ' + pollData[index].percnt + '% (' + pollData[index].count + ') - ' + document.querySelectorAll('.translate-phrases li')[39].innerHTML + '</span>';
						}
						/*						console.log('my Comment:', username, checkToVote);*/
					}
				} else if (document.querySelectorAll('.progress-bar')[index]) {
					document.querySelectorAll('.progress-bar')[index].style = 'width: 0%;';
					document.querySelectorAll('.progress-bar')[index].innerHTML = '0% (0)';
				}
			}
		} else {
			swal({
				type: 'error',
				title: 'error',
				text: humaNize(err)
			});
		}
		if (callback) callback();
	});
}

function startUpdProgTimer(interval) {
	clearTimeout(updProgressTimer);
	updProgressTimer = setInterval(updateProgressValues, interval);
	console.log('<f> start-updTimer');
}

function clearUpdTimer() {
	console.log('<f> clearUpdTimeout');
	if (typeof updProgressTimer != 'undefined') {
		clearTimeout(updProgressTimer);
	}
}
