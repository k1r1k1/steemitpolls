/* ------------------------------- */
//	GolosPolls main script file		//
// 		https://golospolls.com/		//
/* ------------------------------- */
// switching to testnet

var resultContent = '', // global variable for content
	pollData = {}, // polling answers
	countOfVoters,
	checkToVote = false,
	updProgressTimer,
	tagNewPost,
	counter, // for poll after creating a new post 
	hash = location.hash.substring(1); // geting hash

function progress_click() { // dummy for polling 
	console.log('<f> progress_click #' + this.id);
	if (wif) {
		sendVote(this.id, function (err, result) {
			if (err) {
				console.error(err);
				swal({
					type: 'error',
					title: 'error',
					text: err,
					showConfirmButton: false,
					timer: 4000
				});
			} else {
				swal({ // visual
					type: 'success',
					title: 'Thanks for making your choice!',
					toast: true,
					showConfirmButton: false,
					timer: 2500
				});
			}
		});
	} else {
		console.log('auth() =>');
		auth(() => {
			sendVote(this.id, function (err, result) {
				if (err) {
					console.error(err);
					swal({
						type: 'error',
						title: 'error',
						text: err,
						showConfirmButton: false,
						timer: 4000
					});
				} else {
					swal({ // visual
						type: 'success',
						title: 'Thanks for making your choice!',
						toast: true,
						showConfirmButton: false,
						timer: 2500
					});
				}
			});
		});
	}
}

function getHash(callback) {
	console.log('<f> getHash');
	var startTarget = '/@'; // search '/@'
	var startPos = -1;
	while ((startPos = hash.indexOf(startTarget, startPos + 1)) != -1) {
		var Pos = startPos,
			targetStart = startPos;
	}
	startTarget = '/'; // search '/' after '/@'
	while ((Pos = hash.indexOf(startTarget, Pos + 1)) != -1) {
		var slashPos = Pos;
	}
	var username = hash.substring(targetStart + 2, slashPos); // '+ 2' removes the target symbols
	var permlink = hash.substring(slashPos + 1); // '+ 1' removes '/'
	console.log('post data: username=' + '"' + username + '"' + ' permlink="' + permlink + '"');
	golos.api.getContent(username, permlink, function (err, result) { // The console displays the data required for the post 
		if (!err && result.title != '') {
			console.log('getContent ', result.title);
			if (!result.json_metadata) getHash();
			resultContent = result;
			result.json_metadata = JSON.parse(result.json_metadata); //parse json to js
			console.log('getHash-resultContent=', resultContent);
			callback(result);
		} else {
			console.error('Failed to find post ', err);
			console.log('getContent ', result);
			clearUpdTimer();
		}
		//if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
	});
}

function sendVote(pollId, callback) {
	console.log('<f> sendVote');
	if (tagNewPost) {
		swal({
			title: 'error',
			text: 'Sorry, you have to wait for ' + counter + ' seconds before first vote',
			type: 'error',
			showConfirmButton: false,
			timer: 2500
		})
	}
	if (checkToVote) {
		swal({
			title: 'error',
			text: 'Sorry, seems like you are already voted',
			type: 'error'
		})
	} else {
		var parentAuthor = resultContent.author;
		console.log('parentAuthor', parentAuthor);
		var parentPermlink = resultContent.permlink;
		console.log('parentPermlink', parentPermlink);
		var permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
		console.log('permlink', permlink);
		var title = ''; // title - empty for add a comment
		var body = 'I choose option # ' + pollId; // poll
		console.log('pollId', pollId);
		var jsonMetadata = {
			app: 'golospolls/0.1',
			canonical: 'https://golospolls.com#' + username + '/' + permlink,
			app_account: 'golosapps',
			data: {
				poll_id: pollId
			}
		};
		jsonMetadata = JSON.stringify(jsonMetadata);
		console.log('golos-broadcast-comment ', wif, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata);
		golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, permlink, title, body, jsonMetadata, function (err, result) {
			if (!err) {
				console.log('comment', result);
			} else {
				console.error(err);
			}
			callback(err, result);
		});
	}
}

function getVote(callback) { // getting poll data
	//document.querySelector('#share-form').style.display = 'block';
	countOfVoters = 0;
	checkToVote = false;
	pollData = {};
	voters = [];
	golos.api.getContentReplies(resultContent.author, resultContent.permlink, function (err, result) {
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
						pollData[item.json_metadata.data.poll_id].count++;
					}
					if (username == item.author) { // check if already voted
						checkToVote = true;
					} else {
						checkToVote = false;
					}
				}
			});
			console.log('<f> getVote count:', Object.keys(pollData).length); // count of object
			Object.keys(pollData).map(function (objectKey, index) { // foreach pollData
				pollData[objectKey].percnt = Math.round((pollData[objectKey].count * 100) / countOfVoters); // calculate percent
			});
		} else {
			console.error(err);
			swal({
				type: 'error',
				title: 'error',
				text: err
			});
		}
		if (callback) callback();
	});
}

function startUpdProgTimer(interval) {
	updProgressTimer = setInterval(getVote, interval);
	console.log('<f> start-updProgressTimer');
}

function clearUpdTimer() {
	console.log('<f> clearUpdTimeout');
	if (typeof updProgressTimer != 'undefined') {
		clearTimeout(updProgressTimer);
	}
}