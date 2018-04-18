//------------------------------/

/* GolosPolls main script file */

//-----------------------------/
initLang('en'); // lang init = en
// switching to testnet
golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
var cyrillicToTranslit = module.exports; // cyrillicToTranslit initializing 
var inputsC = 0, // inputs counter
	resultContent = '', // global variable for content
	pollData = {}, // polling answers
	votes = {},
	checkToVote = false,
	updProgressTimer,
	tagNewPost,
	counter, // for poll after creating a new post 
	hash = location.hash.substring(1); // geting hash
if (hash != '') getHash();
window.onhashchange = function () {
	hash = location.hash.substring(1);
	console.log('hash has been changed: ', hash);
	if (hash != '') getHash();
};
addInactiveInput();
addPollingInputs();

function CopyLinkToClipboard() {
	document.querySelector('#cplkint').select();
	document.execCommand('copy');
	swal({
		type: 'success',
		toast: true,
		title: 'Link has been copied',
		showConfirmButton: false,
		timer: 1800
	})
}
document.querySelector('#cplkbtn').addEventListener('click', CopyLinkToClipboard, false);

function CopyCodeToClipboard() {
	document.querySelector('#cpcdint').select();
	document.execCommand('copy');
	swal({
		type: 'success',
		toast: true,
		title: 'Code has been copied',
		showConfirmButton: false,
		timer: 1800
	})
}
document.querySelector('#cpcdbtn').addEventListener('click', CopyCodeToClipboard, false);

function addPollingInputs() { // adding a response option
	console.log('<f> addPollingInputs');
	document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
	document.getElementById('pOption' + inputsC).style.opacity = '1';
	document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
	document.querySelector('#inputOption' + inputsC).removeEventListener('focus', addPollingInputs, false);
	addInactiveInput();
}
addPollingInputs(); // add 2nd active field in a polling form

function addInactiveInput() {
	console.log('<f> addInactiveInput');
	inputsC++;
	var $div = document.createElement('div');
	$div.className = 'input-group mb-3';
	$div.id = 'pOption' + inputsC;
	$div.style = 'opacity: 0.4; transition: .5s;';
	$div.innerHTML = `<input type="text" class="form-control" placeholder="Click here to add a new one" aria-label="Get a link of your poll" aria-describedby="basic-addon2" id="inputOption` + inputsC + `">
<div class="input-group-append">
                        <button class="btn btn-danger" type="button" id="pOptionButt` + inputsC + `" disabled><span class="icon-cross"></span></button>
                    </div>
                </div>`;
	$div.querySelector('#inputOption' + inputsC).addEventListener('focus', addPollingInputs, false);
	$div.querySelector('button').addEventListener('click', function (e) {
		if (e.target.tagName == 'BUTTON') {
			e.target.parentNode.parentNode.remove();
		} else if (e.target.tagName == 'SPAN') {
			e.target.parentNode.parentNode.parentNode.remove();
		}
	}, false);
	document.getElementById('PollForm').appendChild($div);
}

function completeForm() {
	console.log('<f> completeForm');
	// collecting data & sending 
	var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control'),
		answers = [];
	for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
		answers[cnt] = $pollInputs[cnt].value;
	}
	str = urlLit(document.querySelector('.form-control.title').value, 0);
	str = str + '-' + Date.now();
	var title = document.querySelector('.form-control.title').value;
	console.log('permlink : ' + str);
	console.log('json var : ' + answers); // debug info
	console.log('title : ' + title);
	var jsonMetadata = {
		app: 'golospolls/0.1',
		canonical: 'https://golospolls.com/#' + username + '/' + str,
		app_account: 'golosapps',
		data: {
			poll_title: title,
			poll_answers: answers
		}
	};
	send_request(str, title, jsonMetadata);
	// chech if error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	swal({ // visual
		type: 'success',
		title: 'Your polling form has been compiled',
		text: 'Don`t forget to share it!',
		showConfirmButton: false,
		timer: 2500
	})
	tagNewPost = true;
	counter = 20;
	newPostTimout = setInterval(function () {
		counter--;
		console.log('counter =', counter);
		if (counter == 0) {
			clearTimeout(newPostTimout);
			tagNewPost = false;
		}
	}, 1000);
}

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
		getVote();
	});
	document.getElementById('complete-form').style.display = 'block';
	document.getElementById('PollConstructor').style.display = 'none';
	document.getElementById('complete-form').scrollIntoView();
	document.querySelector('#cplkint').value = 'https://golospolls.com/#' + resultContent.author + '/' + resultContent.permlink;
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
			swal(err)
		}
	}
}

function send_request(str, title, jsonMetadata) {
	console.log('<f> send_request');
	var parentAuthor = ''; // for post creating, empty field
	var parentPermlink = 'test'; // main tag
	var body = 'At the moment, you are looking at the test page of a simple microservice, which is currently under development. And since it so happened that you look at it, here`s a random cat, good luck to you and all the best.<img src="https://tinygrainofrice.files.wordpress.com/2013/08/kitten-16219-1280x1024.jpg"></img>'; // post text
	golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, str, title, body, jsonMetadata, function (err, result) {
		//console.log(err, result);
		if (!err) {
			//console.log('post: ', result);
			window.location.hash = username + '/' + str;
			document.querySelector('.lding').style.display = 'none';
		} else {
			console.error(err);
			swal({
				type: 'error',
				title: 'error',
				text: err
			});
		}
	}); // add post
}

function getHash() {
	console.log('<f> getHash');
	if (location.hash == '') clearUpdTimer();
	startUpdProgTimer()
	var startTarget = '/@'; // search '/@' - FIX THIS BUG! WHY IT`S WORKING?
	var startPos = -1;
	document.querySelector('.lding').style.display = 'block';
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
		document.querySelector('.lding').style.display = 'none';
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
			} else {
				console.error(err);
				swal({
					type: 'error',
					title: 'error',
					text: err
				});
			}
		});
	}
}

function getVote(collback) { // getting poll data
	console.log('<f> getVote');
	document.querySelector('#share-form').style.display = 'block';
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
				/*else {
					pollData[index] = {
						count: 0,
						percnt: 0
					};
				}*/
			}
		} else {
			console.error(err);
			swal({
				type: 'error',
				title: 'error',
				text: err
			});
		}
		document.querySelector('.card-header-right p').innerHTML = '<span class="badge badge-info">voters: ' + cnt + '</span><span class="badge badge-info">created: ' + moment(resultContent.created).format('lll') + '</span>';
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

function getMyPolls() {
	console.log('<f>my-polls click');
	clearUpdTimer();
	document.querySelector('.lding').style.display = 'block';
	location.hash = '';
	document.querySelector('.card-header-right p').innerHTML = '';
	document.getElementById('complete-form').style.display = 'block';
	document.getElementById('PollConstructor').style.display = 'none';
	var countofvotes = 0,
		cnt = 0,
		winner = 0,
		max = 0;
	var query = {
		select_authors: [username],
		select_tags: ['test'],
		limit: 100
	};
	golos.api.getDiscussionsByBlog(query, function (err, result) {
		console.log('<f>getDiscussionsByBlog ', result);
		if (result == '') {
			document.querySelector('#complete-form .card-header').innerHTML = 'You do not have any polls yet';
			document.querySelector('.lding').style.display = 'none';
		}
		if (!err) {
			result.forEach(function (item) {
				document.querySelector('#complete-form .card-header').innerHTML = 'Make your choice';
				var parent = item.author;
				var parentPermlink = item.permlink;
				golos.api.getContentReplies(parent, parentPermlink, function (err, result) {
					if (!err) {
						pollData = {};
						countofvotes = 0;
						max = 0;
						winner = 0;
						item.json_metadata = JSON.parse(item.json_metadata); //parse json to js
						result.forEach(function (result) {
							result.json_metadata = JSON.parse(result.json_metadata);
							if (typeof result.json_metadata.data != 'undefined' && typeof result.json_metadata.data.poll_id != 'undefined') {
								countofvotes++;
								cnt++;
								if (!pollData[result.json_metadata.data.poll_id]) pollData[result.json_metadata.data.poll_id] = {
									count: 0,
								};
								pollData[result.json_metadata.data.poll_id].count++;
								if (max < pollData[result.json_metadata.data.poll_id].count) {
									max = pollData[result.json_metadata.data.poll_id].count;
									winner = item.json_metadata.data.poll_answers[result.json_metadata.data.poll_id];
								}
								if (max == 0)
									winner = 'no one voted';
							}
						});
						if (item.json_metadata.data) {
							var $div = document.createElement('tr');
							$div.innerHTML = `<td><a href="#` + item.author + `/` + item.permlink + `">` + item.json_metadata.data.poll_title + `</a></td>
                                      <td>` + moment(item.created).format('lll') + `</td>
                                      <td>` + item.json_metadata.data.poll_answers + `</td>
                                      <td>` + countofvotes + `</td>
                                      <td>` + winner + `</td>
                                    </tr>`;
							document.querySelector('.myPollTab').appendChild($div);
							document.querySelector('.lding').style.display = 'none';
						}
					}
				});
			});
		} else {
			console.error(err);
			swal({
				type: 'error',
				title: 'error',
				text: err
			});
		}
	});
	var $div = document.createElement('table');
	$div.className = 'table table-striped';
	$div.innerHTML = `<thead>
                            <tr>
                              <th scope="col">Poll title</th>
                              <th scope="col">Created</th>
                              <th scope="col">Variants</th>
                              <th scope="col">Voters</th>
                              <th scope="col">Leading</th>
                            </tr>
                          </thead>
                          <tbody class="myPollTab">
                          </tbody>
                        </table>`
	document.querySelector('.card-body.text-dark').innerHTML = '';
	document.querySelector('.card-body.text-dark').appendChild($div);
}

function urlLit(w, v) {
	var tr = 'a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
	var ww = '';
	w = w.toLowerCase();
	for (i = 0; i < w.length; ++i) {
		cc = w.charCodeAt(i);
		ch = (cc >= 1072 ? tr[cc - 1072] : w[i]);
		if (ch.length < 3) ww += ch;
		else ww += eval(ch)[v];
	}
	return (ww.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/[-]{2,}/gim, '-').replace(/^\-+/g, '').replace(/\-+$/g, ''));
}


// buttons events 

document.getElementById('complete').addEventListener('click', function () {
	console.log('<f> complete button');
	if (document.querySelector('.form-control.title').value == '') {
		swal({
			title: 'Error',
			text: 'Please, enter the title & the polling fields',
			type: 'error'
		})
	} else {
		if (wif) { // if already authorized
			swal({
				title: 'Are you sure?',
				text: 'You won`t be able to revert this!',
				type: 'question',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, just do it!'
			}).then((result) => {
				if (result.value) {
					completeForm();
				}
			})
		} else {
			auth(() => {
				swal({
					title: 'Are you sure?',
					text: 'You won`t be able to revert this!',
					type: 'question',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, just do it!'
				}).then((result) => {
					if (result.value) {
						completeForm();
					}
				})
			});
			if (err) {
				swal(err)
			} else
				document.querySelector('.lding').style.display = 'none'; // loader off
		}
	}
}, false);

document.getElementById('my-polls').addEventListener('click', function () {
	if (wif) { // if already authorized
		getMyPolls();
		document.querySelector('#share-form').style.display = 'none';
	} else {
		auth(() => {
			getMyPolls();
		});
		if (err) {
			swal(err)
		} else
			document.querySelector('.lding').style.display = 'none'; // loader off
	}
}, false);

document.getElementById('aboutGolosPollsBtn').addEventListener('click', () => {
	console.log('<f> about click');
	swal({
		title: document.getElementById('about-html-title').innerHTML,
		html: document.getElementById('about-html').innerHTML,
		type: 'info',
		buttonsStyling: false,
		confirmButtonClass: 'btn btn-success btn-lg',
		confirmButtonText: document.getElementById('button-cool').innerHTML,
		position: 'top',
		showCloseButton: true
	});
}, false);

document.onreadystatechange = function () { // loading animation switch-off
	console.log('<f> doc ready');
	if (document.readyState === "complete") {
		document.querySelector('.lding').style.display = 'none';
	}
}