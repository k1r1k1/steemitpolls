/* ------------------------------- */
//	extended js for main service	//
// 		https://golospolls.com/		//
/* ------------------------------- */
// switching to testnet
/*golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
golos.config.set('websocket', 'wss://ws.testnet.golos.io');*/
var inputsC = 0; // inputs counter
initLang('en'); // lang init = en
if (hash != '') {
	getHash(function (resultContent) {
		insertHtmlPoll(resultContent);
		// inserting social buttons
		console.log('*********BUTTONS****INJECTION************');
		var $div = document.createElement('div');
		$div.innerHTML = `<a class="btn share-fb" href="https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `&display=popup&ref=plugin&src=share_button" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-facebook2"> Share</span></a>
					
<a class="btn btn-info share-tw" href="https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=Attention%20friends!%20I%27m%20interested%20in%20your%20opinion%20on%20one%20issue%20-%20please%20choose%20the%20option%20that%20you%20think%20is%20correct%20http%3A%2F%2Fgolospolls.com&tw_p=tweetbutton&url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-twitter"> Tweet</span></a>
					
<a class="btn share-vk" href="https://vk.com/share.php?url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><img src="graphics/vk-logo.png" width="20" height="13" class="d-inline-block align-top"><span>Поделиться</span></a>
					
<a class="btn share-gp" href="https://plus.google.com/share?app=110&url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-google-plus"> Share</span></a>`;
		document.querySelectorAll('.card-body.text-dark')[1].appendChild($div);
		if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
		if (location.hash == '') clearUpdTimer();
	});
	if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
}

window.onhashchange = function () {
	hash = location.hash.substring(1);
	console.log('hash has been changed: ', hash);
	if (hash != '') getHash(function (resultContent) {
		insertHtmlPoll(resultContent);
	});
}
addInactiveInput();
addPollingInputs();

		// custom ipfs connection
/*		var connectionCustom = {};
		function initCustomConnection() {
			connectionCustom = {
				api: {
					protocol: `http`,
					port: `5001`,
					address: `91.201.41.253`
				},
				gateway: {
					protocol: `http`,
					port: `7777`,
					address: `91.201.41.253`
				}
			}
			initConnection(connectionCustom);
			console.log(connectionCustom);
		}*/

document.onreadystatechange = function () { // loading animation switch-off
	console.log('<f> doc ready');
	if (document.readyState === "complete") {
		/*document.querySelector('#language').classList.remove('btn-info'); // lang button style change
		document.querySelector('#language').classList.add('btn-warning');*/
		document.querySelector('.lding').style.display = 'none';
		initCustomConnection();
	}
}

function insertHtmlPoll(resultContent) {
	console.log('<f> insertHtmlPoll ');
	document.querySelector('.card-body.text-dark').innerHTML = '';
	var $div = document.createElement('h5'); // inserting header in poll
	$div.className = 'card-title';
	$div.innerHTML = resultContent.json_metadata.data.poll_title + '<p><br><img src="' + resultContent.json_metadata.data.title_image + '" class="img-thumbnail mx-auto d-block" height="400">';
	document.querySelector('.card-body.text-dark').appendChild($div);
	getVote(function () {
		for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress 
			var $div = document.createElement('div');
			$div.className = 'progress-block';
			if (resultContent.json_metadata.data.poll_answers[cnt]) {
				$div.innerHTML = `<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
						<p><img src="` +  resultContent.json_metadata.data.poll_images[cnt] + `" height="150" class="rounded">
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
		updateProgressValues();
	});
	document.getElementById('complete-form').style.display = 'block';
	document.getElementById('share-form').style.display = 'block';
	document.getElementById('PollConstructor').style.display = 'none';
	document.getElementById('complete-form').scrollIntoView();
	document.querySelector('#cplkint').value = 'https://golospolls.com/#' + resultContent.author + '/' + resultContent.permlink;
	document.querySelector('#cpcdint').value = `<!-- Put this script tag to the <head> of your page --> <script src="https://golospolls.com/inject.js"></script><!-- Put this div and script tags to the place, where the Poll block will be --> <div class="gPolls"></div><script type="text/javascript">var gPollsWidth = '300', gPollsLink = '` + resultContent.author + `/` + resultContent.permlink + `';</script>`;
	startUpdProgTimer(3500);
}

function updateProgressValues() {
	getVote(function () {
		// console.log('<f> incertPollProg pollData', pollData);
		cnt = resultContent.json_metadata.data.poll_answers.length;
		for (index = 0; index < resultContent.json_metadata.data.poll_answers.length; ++index) {
			if (typeof pollData[index] != 'undefined') {
				if (document.querySelectorAll('.progress-bar')[index]) {
					document.querySelectorAll('.progress-bar')[index].style = 'width: ' + pollData[index].percnt + '%;';
					document.querySelectorAll('.progress-bar')[index].innerHTML = pollData[index].percnt + '% (' + pollData[index].count + ')';
				}
			}
		}
		document.querySelector('.card-header-right p').innerHTML = '<span class="badge badge-info">voters: ' + countOfVoters + '</span><span class="badge badge-info">created: ' + moment(resultContent.created).format('lll') + '</span>';
	})
}

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
	document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
	document.getElementById('addImg' + inputsC).removeAttribute('disabled');
	document.getElementById('pOption' + inputsC).style.opacity = '1';
	document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
	document.querySelector('#inputOption' + inputsC).removeEventListener('focus', addPollingInputs, false);
	addInactiveInput();
}
addPollingInputs(); // add 2nd active field in a polling form

function addInactiveInput() {
	inputsC++;
	var $div = document.createElement('div');
	$div.className = 'input-group mb-3';
	$div.id = 'pOption' + inputsC;
	$div.style = 'opacity: 0.4;';
	$div.innerHTML = `<div class="input-group-prepend">
<img id="load-img" src="graphics/loading.gif" width="34" height="34" style="display: none; margin: 0 5px;">
                        <button class="btn btn-secondary" type="button" id="addImg` + inputsC + `" disabled><span class="icon-image"></span></button>
                    </div><input type="text" class="form-control" placeholder="Click here to add a new one" aria-label="Get a link of your poll" aria-describedby="basic-addon2" id="inputOption` + inputsC + `" data-toggle="tooltip" data-placement="left">
<div class="input-group-append">
                        <button class="btn btn-danger" type="button" id="pOptionButt` + inputsC + `" disabled><span class="icon-cross"></span></button>
                    </div>
                </div>`;
	$div.querySelector('#inputOption' + inputsC).addEventListener('focus', addPollingInputs, false);
	$div.querySelector('.btn.btn-danger').addEventListener('click', function (e) { // del button event
		if (e.target.tagName == 'BUTTON') {
			e.target.parentNode.parentNode.remove();
		} else if (e.target.tagName == 'SPAN') {
			e.target.parentNode.parentNode.parentNode.remove();
		}
	}, false);
	$div.querySelector('.btn.btn-secondary').addEventListener('click', function (e) { // img button event
		if (e.target.tagName == 'BUTTON' || e.target.tagName == 'SPAN') {
			(e.target.parentNode.parentNode).querySelector('img').style.display = 'block';
			(e.target.parentNode.parentNode).querySelector('img').src = 'graphics/loading.gif';
			uploadImageToIpfs(function (err, files) {
				if (err) {
					console.error('ipfs error: ', err);
					(e.target.parentNode.parentNode).querySelector('img').src = 'graphics/err.png';
				} else {
					console.log(files[0][0].path + files[0][0].hash);
					(e.target.parentNode.parentNode).querySelector('img').src = files[0][0].path + files[0][0].hash;
				}
			});
		}
	}, false);
	document.getElementById('PollForm').appendChild($div);
}

function completeForm(callback) {
	console.log('<f> completeForm');
	// collecting data & sending 
	var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control'),
		$pollImages = document.getElementById('PollForm').getElementsByTagName('img'),
		errTrigger,
		newPostTimout,
		answers = [],
		answerimages = [];
	for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
		if ($pollInputs[cnt].value == '') {
			$pollInputs[cnt].setAttribute('class', 'form-control title is-invalid');
			errTrigger = true;
		} else {
			answers[cnt] = $pollInputs[cnt].value;
			answerimages[cnt] = $pollImages[cnt].src;
		}
	}
	if (errTrigger) return;
	str = urlLit(document.querySelector('.form-control.title').value, 0);
	//str.replace(/[^\w\d]/g, '_');
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
			title_image: document.querySelector('#load-img').src,
			poll_images: answerimages,
			poll_answers: answers
		}
	};
	send_request(callback, str, title, jsonMetadata);
	// chech if error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	swal({ // visual
		type: 'success',
		title: 'Your polling form has been compiled',
		text: 'Don`t forget to share it!',
		showConfirmButton: false,
		timer: 2500
	})
	tagNewPost = true;
	clearTimeout(newPostTimout);
	counter = 24;
	newPostTimout = setInterval(function () {
		counter--;
		console.log('counter =', counter);
		if (counter == 0) {
			clearTimeout(newPostTimout);
			tagNewPost = false;
		}
	}, 1000);
}

function send_request(callback, str, title, jsonMetadata) {
	console.log('<f> send_request');
	var parentAuthor = ''; // for post creating, empty field
	var parentPermlink = 'test'; // main tag
	var body = 'test;'/* `<p>
					GolosPolls - is microservice for conducting polls on the blockchain <a target="_blank" href="https://golos.io">Golos</a>. This platform is a thin client, that works without a backend (only frontend and blockchain) directly on the <a>GitHub Pages</a> (through <a target="_blank" href="https://www.cloudflare.com/">CloudFlare</a>).</p>
					<img src="https://golospolls.com/graphics/logo.png" height="300" width="300"></img>
				<ul>
					We use:
					<li><a target="_blank" href="https://github.com/GolosChain/golos-js">Golos.js</a> - the JavaScript API for Golos blockchain;</li>
					<li><a target="_blank" href="https://github.com/twbs/bootstrap">Bootstrap</a> - the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web;</li>
					<li><a target="_blank" href="https://github.com/lipis/flag-icon-css">Flag-icon-css</a> - a collection of all country flags in SVG;</li>
					<li><a target="_blank" href="https://www.i18next.com">I18next</a> - is an internationalization-framework written in and for JavaScript;</li>
					<li><a target="_blank" href="https://github.com/zloirock/core-js">Core-js</a> - modular standard library for JavaScript. Includes polyfills for ECMAScript 5, ECMAScript 6: promises, symbols, collections, iterators, typed arrays, ECMAScript 7+ proposals, setImmediate, etc. Some additional features such as dictionaries or extended partial application. You can require only needed features or use it without global namespace pollution.</li>
					<li><a target="_blank" href="https://github.com/limonte/sweetalert2">SweetAlert2</a> - a beautiful, responsive, customizable, accessible replacement for JavaScript's popup boxes.</li>
					<li><a target="_blank" href="https://github.com/Keyamoon/IcoMoon-Free">IcoMoon-Free</a> - is a free vector icon pack by Keyamoon.</li>
				</ul>`; // post text */
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
				text: err,
				showConfirmButton: false,
				timer: 4000
			});
		}
		callback(err, result);
	}); // add post
}

function getMyPolls(callback) {
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
				golos.api.getContentReplies(item.author, item.permlink, function (err, result) {
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
				text: err,
				showConfirmButton: false,
				timer: 4000
			});
		}
		if (callback) callback(err, result);
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
			console.log('auth() =>');
			auth(() => {
				wif = JSON.parse(wif);
				JSON.parse(wif)['posting']
				localStorage.wif = wif.posting;
				completeForm(function (err, result) {
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
			document.querySelector('.lding').style.display = 'none'; // loader off
		}
	}
}, false);

document.getElementById('my-polls').addEventListener('click', function () {
	if (wif) { // if already authorized
		getMyPolls();
		document.querySelector('#share-form').style.display = 'none';
	} else {
		console.log('auth() =>');
		auth(() => {
			wif = JSON.parse(wif);
			localStorage.wif = wif.posting;
			getMyPolls(function (err, result) {
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
		document.querySelector('.lding').style.display = 'none'; // loader off
	}
}, false);

document.getElementById('aboutGolosPollsBtn').addEventListener('click', () => {
	console.log('<f> about click');
	swal({
		title: document.getElementById('about-html-title').innerHTML,
		html: document.getElementById('about-html').innerHTML,
		type: 'info',
		showConfirmButton: false,
		width: 600,
		padding: '1rem',
		showCloseButton: 'true'
	});
}, false);

document.getElementById('integration').addEventListener('click', () => {
	console.log('<f> integration click');
	swal({
		title: document.getElementById('integration-html-header').innerHTML,
		html: document.getElementById('integration-html').innerHTML,
		type: 'info',
		showConfirmButton: false,
		width: 600,
		padding: '1rem',
		showCloseButton: 'true'
	});
}, false);

document.getElementById('upload').addEventListener('click', function () {
	document.querySelector('#load-img').style = "display: inline-block; margin-left: 1rem;";
	document.querySelector('#load-img').src = 'graphics/loading.gif';
	uploadImageToIpfs(function (err, files) {
		if (err) {
			console.error('ipfs error: ', err);
			document.querySelector('#load-img').src = 'graphics/err.png';
		} else {
			console.log(files[0][0].path + files[0][0].hash);
			document.querySelector('#load-img').src = files[0][0].path + files[0][0].hash;
		}
	});
});