/* ------------------------------- */
//	GolosPolls main script file		//
// 		https://golospolls.com/		//
/* ------------------------------- */
// switching to testnet

var resultContent = '', // global variable for content
	pollData = {}, // polling answers
	votes = {},
	checkToVote = false,
	updProgressTimer,
	tagNewPost,
	counter, // for poll after creating a new post 
	hash = location.hash.substring(1); // geting hash

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
			swal(err)
		}
	}
}

function getHash(callback) {
	console.log('<f> getHash');

	/*if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'block';
	if (typeof gPollsLink !== "undefined") hash = gPollsLink;
	if (location.hash == '') clearUpdTimer();
	startUpdProgTimer();*/

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
			console.log('getHash-resultContent=',resultContent);
			callback(result);
		} else {
			console.error('Failed to find post ', err);
			console.log('getContent ', result);
			clearUpdTimer();
		}
		//if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
	});
}

function sendVote(pollId) {
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
			}
		});
	}
}

function getVote(callback) { // getting poll data
	console.log('<f> getVote');
	//document.querySelector('#share-form').style.display = 'block';
	var cnt = 0;
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
			console.log('voters ',voters);
			console.log('pollData ',pollData);
		} else {
			console.error(err);
			swal({
				type: 'error',
				title: 'error',
				text: err
			});
		}
	});
	callback();
}

function startUpdProgTimer() {
	console.log('<f> updProgressTimer');
	updProgressTimer = setInterval(getVote, 3000);
}

function clearUpdTimer() {
	console.log('<f> clearUpdTimeout');
	if (typeof updProgressTimer != 'undefined') {
		clearTimeout(updProgressTimer);
	}
}