var prefix = 'gF';
var tagSelector = 'all';
var ckeditor;
var jsonMetadata = '';
var domain = (location.hostname == "") ? 'localhost' : location.hostname;

// 0 - ideas
// 1 - problems
// 2 - questions
// 3 - thanks
var tabLabels = [0, 0, 0, 0];
var tabLabelNames = ['all', 'idea', 'problem', 'question', 'thank'];
var labels = [];

//GENERAL

var initGolosFeedback = function () {

	//setting up container-row-col structure
	initBootstrapStructure();

	//setting up invisible block with translatable text
	initTranslationText();

	//initialization of the navbar with tabs for sorting feedbacks
	initTabs();

	//в полной версии подразумевается, что навбар уже на странице есть, и нужно только привязать событие к кнопке (как здесь)
	//в виджете навбара нет и кнопка будет создаваться отдельно

	//loading posts according to current tag selector
	loadFbs();

	location.hash = 'all';

	document.getElementById('golos-urls').addEventListener('click', function () {
		getUrls();
	});
}
document.addEventListener('DOMContentLoaded', initGolosFeedback);



//START---------------------------------------------------------------------------------
var initBootstrapStructure = function () {
	let wrapper = document.querySelector('.' + prefix + 'wrapper');
	wrapper.classList.add('container');
}

var initTranslationText = function () {
	let ul = document.createElement('ul');
	ul.className = "translate-phrases";
	ul.style.display = "none";
	ul.innerHTML = "<li>Title</li>0<li>Description</li>1<li>Idea</li>2<li>Question</li>3<li>Problem</li>4<li>Thank</li>5<li>Submit</li>6<li>Cancel</li>7<li>There's no feedbacks in this category yet. You can be the first</li>8<li>Type your comment here</li>9<li>all</li>10<li>ideas</li>11<li>questions</li>12<li>problems</li>13<li>thanks</li>14<li>Submit</li>15<li>About Integration!</li>16";
	document.querySelector('.' + prefix + 'wrapper').appendChild(ul);
}

//TABS----------------------------------------------------------------------------------
var initTabs = function () {
	let navTabs = document.createElement('div');
	navTabs.className = 'row nav-tab-buttons';
	navTabs.innerHTML = '<div class="col-12"><nav class="navbar navbar-expand-lg tabs"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavFeedbackTabs" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse d-flex justify-content-center" id="navbarNavFeedbackTabs"><div class="container"><div class="row"><div class="col-12 tabs"><ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link tab active" href="#all" data-target="all"><span class="icon-radio-unchecked"></span> ' + document.querySelectorAll('.translate-phrases li')[10].innerHTML + ' <span class="tab-label">(' + 0 + ')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#ideas" data-target="idea"><span class="icon-magic-wand"></span> ' + document.querySelectorAll('.translate-phrases li')[11].innerHTML + ' <span class="tab-label">(' + tabLabels[0] + ')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#problems" data-target="problem"><span class="icon-bug"></span> ' + document.querySelectorAll('.translate-phrases li')[13].innerHTML + ' <span class="tab-label">(' + tabLabels[1] + ')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#questions" data-target="question"><span class="icon-question"></span> ' + document.querySelectorAll('.translate-phrases li')[12].innerHTML + ' <span class="tab-label">(' + tabLabels[2] + ')</span></a></li><li class="nav-item"><a class="nav-link tab" href="#thanks" data-target="thank"><span class="icon-gift"></span> ' + document.querySelectorAll('.translate-phrases li')[14].innerHTML + ' <span class="tab-label">(' + tabLabels[3] + ')</span></a></li></ul></div></div></div></div></nav></div>';
	document.querySelector('.' + prefix + 'wrapper').appendChild(navTabs);

	//add events for tab buttons
	Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach(function (item) {
		item.addEventListener('click', function () {
			Array.from(document.getElementById('navbarNavFeedbackTabs').getElementsByClassName('tab')).forEach(function (item) {
				delClassIfContains(item, 'active');
			});
			item.classList.add('active');
			tagSelector = item.getAttribute('data-target');
			removeFbs();
			loadFbs();
			closeAddFbForm();
		});
	});

	labels = Array.from(document.getElementsByClassName('tab-label'));
}

var updateTabLabels = function (data) {
	let i;
	let sum = 0;
	for (i = labels.length; i > 1; i--) {
		labels[i - 1].innerHTML = '(' + data[i - 2] + ')';
		sum += data[i - 2];
	}
	labels[0].innerHTML = '(' + sum + ')';
}

var incData = function (type) {
	tabLabels[getTabLabelIndexByType(type)] += 1;
}

var getTabLabelIndexByType = function (type) {
	return tabLabelNames.indexOf(type) - 1;
}

var clearTabLabels = function () {
	for (let i = 0; i < tabLabels.length; i++) {
		tabLabels[i] = 0;
	}
	updateTabLabels(tabLabels);
}



//FORM FOR ADDING NEW FEEDBACK----------------------------------------------------------
var createFromAddFb = function () {
	let form = document.createElement('div');
	form.className = 'row form frm-add-fb';
	form.innerHTML = "<div class='col-lg-12 tile'><form><div class='form-group'><label for='formHeader'>" + document.querySelectorAll('.translate-phrases li')[0].innerHTML + "</label><input type='text' class='form-control' id='formHeader' name='inptHeader' aria-describedby='formHeader' required></div><div class='form-group'><label for='formTex'>" + document.querySelectorAll('.translate-phrases li')[1].innerHTML + "</label><textarea class='form-control' id='formText' name='txtBody' rows='3'></textarea></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-idea' value='option1' checked><label class='form-check-label' for='formRadio0'>" + document.querySelectorAll('.translate-phrases li')[2].innerHTML + "</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-question' value='option2'><label class='form-check-label' for='formRadio1'>" + document.querySelectorAll('.translate-phrases li')[3].innerHTML + "</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-problem' value='option3'><label class='form-check-label' for='formRadio2'>" + document.querySelectorAll('.translate-phrases li')[4].innerHTML + "</label></div><div class='form-check'><input class='form-check-input' type='radio' name='exampleRadios' id='radio-thank' value='option3'><label class='form-check-label' for='formRadio3'>" + document.querySelectorAll('.translate-phrases li')[5].innerHTML + "</label></div><button type='submit' class='btn btn-success btn-add-fb-done mr-2'><span class='icon-checkmark'></span> " + document.querySelectorAll('.translate-phrases li')[6].innerHTML + "</button><button type='button' class='btn btn-danger btn-add-fb-cancel ml-2'><span class='icon-cross'></span> " + document.querySelectorAll('.translate-phrases li')[7].innerHTML + "</button></form></div>";
	document.querySelector('.' + prefix + 'wrapper').appendChild(form);


	ClassicEditor
		.create(document.querySelector('#formText'), {
			removePlugins: ['ImageUpload'],
		})
		.then(editor => {
			ckeditor = editor;

			let but = document.createElement('button');
			but.className = "ck ck-button ck-enabled ck-off attach-image";
			but.innerHTML = '<svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000" fill-rule="nonzero"></path></svg><span class="ck ck-tooltip ck-tooltip_s"><span class="ck ck-tooltip__text">Attach image via GolosImages</span></span><span class="ck ck-button__label">Attach image</span>';
			but.id = "upload";
			but.type = "button";
			document.querySelector('div.ck.ck-toolbar').appendChild(but);
			addEventForBtnUploadImg();
		})
		.catch(err => {
			console.error(err.stack);
			showError(err.message);
		});

	addEventForFbDone();
	addEventForFbCancel();
	clearJsonMetadata(); // = JSON.stringify(tagList);//add tagList to json
}
var addEventForFbDone = function () {
	document.querySelector('.' + prefix + 'wrapper .frm-add-fb')
		.getElementsByTagName('form')[0]
		.addEventListener('submit', function (e) {
			e.preventDefault();

			auth(function () {
				golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
					if (err) {
						swal({
							type: 'error',
						});
					} else {
						swal({
							type: 'success',
						});
						sendAddFbForm();
					}
					console.log(result);
				});
			}, ['posting']);

			return false;
		});
}
var sendAddFbForm = function () {
	let parentAuthor = '';
	let parentPermlink = 'fb';
	let author = username;
	let title = document.getElementById('formHeader').value;
	let permlink = urlLit(title, 0) + '-' + Date.now().toString();
	let body = ckeditor.getData();

	addToJsonMetadata([findCheckedRadio()], "tags");
	console.log(jsonMetadata);
	console.log('title: ' + title + ' body: ' + body + ' tags: ' + parentPermlink + ' permlink: ' + permlink + ' json: ' + jsonMetadata);
	console.log(window.wif);

	golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
		//console.log(err, result);
		if (!err) {
			document.getElementById('formHeader').value = '';
			ckeditor.setData('');
			closeAddFbForm();
			removeFbs();
			loadFbs();
			console.log('sent');
		} else {
			console.error(err);
			showError(err.message);
		}
	});

	//SHOW MESSAGE ABOUT SUCCESSFUL SENDING
}
var addEventForBtnUploadImg = function () {

	document.getElementById('upload').addEventListener('click', function () {

		uploadImageToIpfs(function (err, files) {
			if (!err) {

				files = refactorIpfsResult(files);
				console.log(files);
				addToJsonMetadata(files, "image");
				addImageToTxtarea(files);
			} else {
				console.error(err);
				showError(err.message);
			}
		});
	});
}
var addEventForFbCancel = function () {
	document.querySelector('.' + prefix + 'wrapper .frm-add-fb .btn-add-fb-cancel').addEventListener('click', function () {
		closeAddFbForm();
		loadFbs();
		clearJsonMetadata();
	});
}
var openAddFbForm = function () {
	removeFbs();
	createFromAddFb();
	document.querySelector('.' + prefix + 'btn-add-fb').style.display = 'none';
}
var closeAddFbForm = function () {
	if (document.querySelector('.' + prefix + 'btn-add-fb').style.display == 'none') {
		document.querySelector('.' + prefix + 'wrapper .frm-add-fb').remove();
		document.querySelector('.' + prefix + 'btn-add-fb').style.display = 'inline-block';

	}
}
var findCheckedRadio = function () {
	let res = '';
	Array.from(getBlockAddFb().getElementsByClassName('form-check-input')).forEach(function (item) {
		if (item.checked == true) {
			res = item.getAttribute('id').split('-')[1].toString();
		}
	});
	return res;
}

var getBlockAddFb = function () {
	return document.getElementsByClassName('frm-add-fb')[0];
}



//FEEDBACKS------------------------------------------------------------------------------
var loadFbs = function () {
	//let tags = [domain];
	//tags.push('fb');
	//if(tagSelector != 'all') tags.push(tagSelector);

	var query = {
		select_tags: ['fb', domain],
		select_authors: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'],
		limit: 100
	};

	console.log(tagSelector);
	console.log(query.select_tags);
	golos.api.getDiscussionsByBlog(query, function (err, result) {
		console.log(err, result);

		//no matching feedbacks
		let nothing = false;

		if (!err) {
			if (result == []) {
				createEmptyFb();

			} else {

				//проверить все полученные фидбеки - функция создания фидбека внутри
				filter(result);
				updateTabLabels(tabLabels);
			}

		} else {
			console.error(err);
			showError(err.message);
		}
	});

}
var formData = function (object) {
	let data = [];
	data.push(object.id); //0 id
	data.push(object.title); //1 title
	data.push(object.body); //2 body
	data.push(object.children); //3 count of comments
	data.push(object.author); //4 author
	data.push(object.created); // 5 date

	//эти строки повторяются в formDataCom
	let likes = 0;
	let dislikes = 0;
	object.active_votes.forEach(function (item) {
		if (item.percent > 0) likes++;
		else if (item.percent < 0) dislikes++;
	});
	data.push(likes); //6 likes
	//их нужно вынести в функцию


	data.push(dislikes); //7 dislikes
	data.push(object.permlink); //8 permlink

	data.push(getVoteStateOnload(object) / 10000); //9 vote of this user
	return data;
}
var createFb = function (data) {
	let note = document.createElement('div');
	note.className = 'row fb';
	note.setAttribute('id', data[0]);
	note.setAttribute('data-permlink', data[8]);
	note.setAttribute('data-opened', 0);
	note.setAttribute('data-like', data[9]);
	note.innerHTML = "<div class='container body-fb tile'><div class='row'><div class='col-lg-9 col-md-9 text'><h3>" + data[1] + "</h3><p>" + data[2] + "</p><div class='buttons'><button type='button' class='btn btn-dark btn-show-comments'><span class='badge badge-light'>" + data[3] + "</span><span class='icon-message-square'></span><span class='icon-arrow-left hidden'></span><span class='hidden'> Back</span></button></div></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>" + data[4] + "</h6></div><div class='photo'><img src='http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg'></div><div class='date'><small>" + moment(data[5]).format('MMMM Do YYYY, h:mm:ss a') + "</small></div><div class='likes'><button type='button' class='btn btn-secondary btn-vote' data-like='1'><span class='badge badge-dark'>" + data[6] + "</span><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-vote' data-like='0'><span class='icon-thumbs-down'></span><span class='badge badge-dark'>" + data[7] + "</span></button></div></div></div></div></div><div class='container comments'></div>";
	document.querySelector('.' + prefix + 'wrapper').appendChild(note);
	checkVoteColor(data[0], '');

	addEventsForCommentButtons(data[0]);
	addEventsForFbLikes(data[0]);
	addEventForFbHeader(data[0]);

	console.log('feedback has been created: id = ' + data[0]);
}
var addEventsForCommentButtons = function (fbId) {
	getBtnShowComment(fbId).addEventListener('click', function () {
		toggleFb(fbId);
	});
}
var expandFb = function (fbId) {
	golos.api.getContent(getAuthor(fbId, ''), getPermlink(fbId, ''), 1000, function (err, result) {
		//console.log(err, result);
		if (!err) {
			removeFbs();
			console.log(result);
			createFb(formData(result));
			toggleBtnCom(fbId);
			document.getElementById(fbId).setAttribute('data-opened', 1);
			loadComments(fbId);
			createCommentForm(fbId);
			setHash(fbId);
		} else console.error(err);
	});
}
var removeFbs = function () {
	Array.from(document.querySelectorAll('.' + prefix + 'wrapper .fb')).forEach(function (item) {
		item.remove();
	});
	closeAddFbForm();
	clearHash();
	clearTabLabels();
}
var checkVoteColor = function (fbId, comId) {
	let state = getVoteState(fbId, comId);
	if (state == -1) {
		delClassIfContains(getBtnVote(fbId, comId, 1), 'btn-success');
		getBtnVote(fbId, comId, 0).classList.add('btn-danger');
	} else if (state == 0) {
		delClassIfContains(getBtnVote(fbId, comId, 1), 'btn-success');
		delClassIfContains(getBtnVote(fbId, comId, 0), 'btn-danger');
	} else if (state == 1) {
		delClassIfContains(getBtnVote(fbId, comId, 0), 'btn-danger');
		getBtnVote(fbId, comId, 1).classList.add('btn-success');
	}
}
var toggleBtnCom = function (fbId) {
	let thisBtn = getBtnShowComment(fbId);
	if (thisBtn.children[2].classList.contains('hidden')) {
		thisBtn.children[0].classList.add('hidden');
		thisBtn.children[1].classList.add('hidden');
		thisBtn.children[2].classList.remove('hidden');
		thisBtn.children[3].classList.remove('hidden');
	} else {
		thisBtn.children[2].classList.add('hidden');
		thisBtn.children[3].classList.add('hidden');
		thisBtn.children[0].classList.remove('hidden');
		thisBtn.children[1].classList.remove('hidden');
	}
}
var addEventForFbHeader = function (fbId) {
	getFbHeader(fbId).addEventListener('click', function () {
		toggleFb(fbId);
	});
}
var toggleFb = function (fbId) {
	if (document.getElementById(fbId).getAttribute('data-opened') == '0') {
		expandFb(fbId);
	} else {
		removeFbs();
		loadFbs();
		resetHash();
	}
}
var createEmptyFb = function () {
	let note = document.createElement('div');
	note.className = 'row fb empty-fb';

	note.innerHTML = "<div class='col-12'><h4>" + document.querySelectorAll('.translate-phrases li')[8].innerHTML + "</h4></div>";
	document.querySelector('.' + prefix + 'wrapper').appendChild(note);
}
var loadMyFbs = function () {
	var query = {
		select_authors: [username],
		select_tags: ['fb', domain],
		limit: 100
	};
	golos.api.getDiscussionsByBlog(query, function (err, result) {
		console.log(err, result);
		if (!err) {
			filter(result);
		} else {
			console.error(err);
			showError(err.message);
		}
	});
}

/** filter for testnet
 */
var filter = function (selection) {

	let nothing = true;

	selection.forEach(function (item) {

		if (item.parent_permlink == 'fb') {

			//если контрольный тэг fb совпадает, можно парсить метадату
			let json = JSON.parse(item.json_metadata);


			if (json.tags[0] == domain) {

				//переменная отсеит кривые фидбеки, если они не относятся ни к одному из существующих типов
				var control = false;

				//проверить по всем типам фидбеков
				for (let j = 0; j < tabLabelNames.length; j++) {

					//инкрементировать лейбл
					if (json.tags[1] == tabLabelNames[j]) {
						incData(json.tags[1]);
						control = true;
						break;
					}
				}

				//если текущий таб тоже совпадает - вывести фидбек
				if ((json.tags[1] == tagSelector || tagSelector == 'all') && control) {
					console.log(item);
					createFb(formData(item));
					nothing = false;
				}

			}
		}
	});

	if (nothing) {
		createEmptyFb();
	}

}

//filter for mainnet
/*
var filter = function(selection) {

    let nothing = true;
    selection.forEach(function(item) {

        if(item.parent_permlink == 'test' && item.permlink != 'post-fb-1527284621475') {

            //если контрольный тэг fb совпадает, можно парсить метадату
            let json = JSON.parse(item.json_metadata);


            if(json.tags[0] == 'fb' && json.tags[1] == domain) {

                //переменная отсеит кривые фидбеки, если они не относятся ни к одному из существующих типов
                var control = false;

                //проверить по всем типам фидбеков
                for(let j = 0; j < tabLabelNames.length; j++) {

                    //инкрементировать лейбл
                    if(json.tags[2] == tabLabelNames[j] ) {
                        incData(json.tags[2]);
                        control = true;
                        console.log('инкрементировано: '+tabLabelNames[j]);
                        break;
                    }
                }

                //если текущий таб тоже совпадает - вывести фидбек
                if( (json.tags[2] == tagSelector || tagSelector == 'all') && control ) {
                    console.log(item);
                    createFb( formData(item) );
                    nothing = false;
                }

            }
        }
    });

    if( nothing) {
        createEmptyFb();
    }

}
*/
//filter for mainnet

var getBtnShowComment = function (fbId) {
	return document.getElementById(fbId).getElementsByClassName('btn-show-comments')[0];
}
var getFbHeader = function (fbId) {
	return document.getElementById(fbId).getElementsByClassName('text')[0].children[0];
}
//prototype getFbById(fbId) - take fb from existing here
//prototype getFbByPermlink(permlink) - take fb from the blockchain



//COMMENTS-------------------------------------------------------------------------------
var loadComments = function (fbId) {
	golos.api.getContentReplies(getAuthor(fbId, ''), getPermlink(fbId, ''), 1000, function (err, result) {
		//console.log(err, result);
		if (!err) {
			result.forEach(function (item) {
				console.log('getContentReplies', item);
				createComment(formDataCom(item, fbId));
			});
		} else {
			console.error(err);
			showError(err.message);
		}
	});
}
var formDataCom = function (object, fbId) {
	var data = [];
	data.push(object.id); //0 - id
	data.push(fbId); //1 - parent ID
	data.push(object.body); //2 - body
	data.push(object.author); //3 - author
	data.push(object.created); //4 - created (date)
	let likes = 0;
	let dislikes = 0;
	object.active_votes.forEach(function (item) {
		if (item.percent > 0) likes++;
		else if (item.percent < 0) dislikes++;
	});
	data.push(likes); //5 - likes
	data.push(dislikes); //6 - dislikes
	data.push(object.permlink); //7 permlink
	data.push(getVoteStateOnload(object) / 10000); // 8 vote of this user
	return data;
}
var createComment = function (data) {
	let comment = document.createElement('div');
	comment.className = 'row comment';
	comment.setAttribute('id', data[0]);
	comment.setAttribute('data-permlink', data[7]);
	comment.setAttribute('data-like', data[8]);
	comment.innerHTML = "<div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile body-comment'><div class='row'><div class='col-lg-9 col-md-9 text'><p>" + data[2] + "</p></div><div class='col-lg-3 col-md-3 controls'><div class='controls-wrapper'><div class='name'><h6>" + data[3] + "</h6></div><div class='photo'><img src='http://www.xn--80aefdbw1bleoa1d.xn--p1ai//plugins/uit/mychat/assets/img/no_avatar.jpg'></div><div class='date'><small>" + moment(data[4]).format('MMMM Do YYYY, h:mm:ss a') + "</small></div><div class='likes'><button type='button' class='btn btn-secondary btn-com-vote' data-like='1'><span class='badge badge-dark'>" + data[5] + "</span><span class='icon-thumbs-up'></span></button><button type='button' class='btn btn-secondary btn-com-vote' data-like='0'><span class='icon-thumbs-down'></span><span class='badge badge-dark'>" + data[6] + "</span></button></div></div></div></div></div>";
	getBlockComments(data[1]).appendChild(comment);
	checkVoteColor(data[1], data[0]);
	addEventsForComLikes(data[1], data[0]);
	console.log("comment has been created: " + data[1] + " " + data[0]);
}
var removeComments = function (fbId) {
	Array.from(getBlockComments(fbId).children).forEach(function (item) {
		item.remove();
	});
}

var getComment = function (fbId, comId) {
	let comment;
	Array.from(getBlockComments(fbId).children).forEach(function (item) {
		if (item.getAttribute('id') == comId) {
			comment = item;
		}
	});
	return comment;
}
var getBlockComments = function (fbId) {
	return document.getElementById(fbId).getElementsByClassName('comments')[0];
}
var getAddComForm = function (fbId) {
	return getBlockFormAddComment(fbId).children[0].children[0].children[0];
}



//FORM FOR ADDING NEW COMMENT-------------------------------------------------------------
function createCommentForm(fbId) {
	var commentForm = document.createElement('div');
	commentForm.className = 'container frm-add-com';
	commentForm.innerHTML = "<div class='row'><div class='col-lg-10 offset-lg-1 col-md-10 offset-md-1 tile'><form><div class='form-group'><textarea class='form-control txt-add-com' id='commentBody' rows='3' placeholder='" + document.querySelectorAll('.translate-phrases li')[9].innerHTML + "'></textarea></div><button type='click' class='btn btn-primary btn-add-com-done'><span class='icon-checkmark'></span> " + document.querySelectorAll('.translate-phrases li')[6].innerHTML + "</button></form></div></div>";
	document.getElementById(fbId).appendChild(commentForm);


	ClassicEditor
		.create(document.querySelector('#commentBody'), {
			removePlugins: ['ImageUpload'],
		})
		.then(editor => {
			ckeditor = editor;

			let but = document.createElement('button');
			but.className = "ck ck-button ck-enabled ck-off attach-image";
			but.innerHTML = '<svg class="ck ck-icon ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000" fill-rule="nonzero"></path></svg><span class="ck ck-tooltip ck-tooltip_s"><span class="ck ck-tooltip__text">Attach image via GolosImages</span></span><span class="ck ck-button__label">Attach image</span>';
			but.id = "upload";
			but.type = "button";
			document.querySelector('div.ck.ck-toolbar').appendChild(but);
			addEventForBtnUploadImg();
		})
		.catch(err => {
			console.error(err.stack);
		});

	addEventsForComDone(fbId);
	clearJsonMetadata();
}
var addEventsForComDone = function (fbId) {
	getAddComForm(fbId).addEventListener('submit', function (e) {
		e.preventDefault();
		auth(function () {
			golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
				if (err) {
					swal({
						type: 'error',
					});
				} else {
					swal({
						type: 'success',
					});
					sendAddComForm(fbId);
				}
				console.log(result);
			});
		}, ['posting']);
		return false;
	});
}
var sendAddComForm = function (fbId) {
	let parentAuthor = getAuthor(fbId, '');
	let parentPermlink = getPermlink(fbId, '');
	let author = username;
	let permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now();
	let title = '';
	let body = ckeditor.getData();
	console.log('comment to note ' + fbId + '. Body: ' + body);
	golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function (err, result) {
		//console.log(err, result);
		if (!err) {
			console.log('comment', result);
			ckeditor.setData('');
			removeComments(fbId);
			loadComments(fbId);
		} else {
			console.error(err);
			showError(err.message);
		}
	});
}

var getTxtareaCom = function (fbId) {
	return getBlockFormAddComment(fbId).getElementsByClassName('txt-add-com')[0];
}
var getBlockFormAddComment = function (fbId) {
	return document.getElementById(fbId).children[document.getElementById(fbId).childElementCount - 1];
}


//VOTING----------------------------------------------------------------------------------
//эти 4 функции похожи
var addEventsForFbLikes = function (fbId) {
	getBtnsVote(fbId, '').forEach(function (item) {
		item.addEventListener('click', function () {
			let isLike = Number(item.getAttribute('data-like'));
			//auth( voteForFb.bind(this, fbId, isLike), ['posting']);
			auth(function () {
				golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
					if (err) {
						swal({
							type: 'error',
						});
					} else {
						swal({
							type: 'success',
						});
						voteForFb(fbId, isLike);
					}
					console.log(result);
				});
			}, ['posting']);
		});
	});
}
var voteForFb = function (fbId, like) {
	let weight;
	let state = getVoteState(fbId, '');
	(like == 1) ? weight = 10000: weight = -10000;
	weight = updateVoteState(fbId, '', weight / 10000);
	golos.broadcast.vote(wif.posting, username, getAuthor(fbId, ''), getPermlink(fbId, ''), weight, function (err, result) {
		console.log(err, result);
		if (!err) {
			setLblVote(fbId, '', weight / 10000, state);
			checkVoteColor(fbId, '');
		} else {
			console.error(err);
			showError(err.message);
		}
	});
}
var addEventsForComLikes = function (fbId, comId) {
	getBtnsVote(fbId, comId).forEach(function (item) {
		item.addEventListener('click', function () {
			let isLike = Number(item.getAttribute('data-like'));
			//auth( voteForCom.bind(this, fbId, comId, isLike), ['posting']);
			auth(function () {
				golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
					if (err) {
						swal({
							type: 'error',
						});
					} else {
						swal({
							type: 'success',
						});
						voteForCom(fbId, comId, isLike);
					}
					console.log(result);
				});
			}, ['posting']);
		});
	});
}
var voteForCom = function (fbId, comId, like) {
	let weight;
	let state = getVoteState(fbId, comId);
	(like == 1) ? weight = 10000: weight = -10000;
	weight = updateVoteState(fbId, comId, weight / 10000);
	golos.broadcast.vote(wif.posting, username, getAuthor(fbId, comId), getPermlink(fbId, comId), weight, function (err, result) {
		console.log(err, result);
		if (!err) {
			setLblVote(fbId, comId, weight / 10000, state);
			checkVoteColor(fbId, comId);
		} else {
			console.error(err);
			showError(err.message);
		}
	});
}

var getBtnVote = function (fbId, comId, isLike) {
	let btn;
	if (comId) {
		btn = getBlockControls(fbId, comId).getElementsByClassName('btn-com-vote')[1 - isLike];
	} else {
		btn = getBlockControls(fbId, '').getElementsByClassName('btn-vote')[1 - isLike];
	}
	return btn;
}
var getBtnsVote = function (fbId, comId) {
	if (comId) {
		return Array.from(getComment(fbId, comId).getElementsByClassName('btn-com-vote'));
	} else {
		return Array.from(getBlockControls(fbId, '').getElementsByClassName('btn-vote'));
	}
}



//ERRORS----------------------------------------------------------------------------------
var showError = function (text) {
	swal("Error!", text, "error");
}


//OTHER FUNCTIONS


/*Removes class from the given element if it contains it*/
var delClassIfContains = function (element, className) {
	if (element.classList.contains(className)) {
		element.classList.remove(className);
	}
}

/*Calculates and sets a new vote state of a feedback or comment depending of their state and given vote*/
var updateVoteState = function (fbId, comId, vote) {
	let state = getVoteState(fbId, comId);
	let res;

	//setting up new state depending on the pressed button
	if (vote == -1 && state != -1) res = -1;
	if (vote == 1 && state != 1) res = 1
	if (vote * state > 0) res = 0;

	if (comId) {
		getComment(fbId, comId).setAttribute('data-like', res);
	} else {
		document.getElementById(fbId).setAttribute('data-like', res);
	}
	//TODO что это за строчки?
	//setLblVote(fbId,comId,state,res);
	//checkVoteColor(fbId,comId);
	return res * 10000;
}

/*Returns the block with info & controll buttons of a feedback or comment*/
var getBlockControls = function (fbId, comId) {
	if (comId) {
		return getComment(fbId, comId).getElementsByClassName('controls')[0];
	} else {
		return document.getElementById(fbId).getElementsByClassName('controls')[0];
	}
}

/*Gets the permlink parameter of the given feedback or comment*/
var getPermlink = function (fbId, comId) {
	let result;
	if (comId) {
		result = getComment(fbId, comId).getAttribute('data-permlink');
	} else {
		result = document.getElementById(fbId).getAttribute('data-permlink');
	}
	return result;
}

/*Gets the author's name of the given feedback of comment*/
var getAuthor = function (fbId, comId) {
	let result;
	if (comId) {
		result = getBlockControls(fbId, comId);
	} else {
		result = getBlockControls(fbId, '');
	}
	return result.getElementsByClassName('name')[0].children[0].innerHTML;
}

/*Gets the current vote state of a feedback or comment*/
var getVoteState = function (fbId, comId) {
	let state;
	if (comId) {
		state = Number(getComment(fbId, comId).getAttribute('data-like'));
	} else {
		state = Number(document.getElementById(fbId).getAttribute('data-like'));
	}
	return state;
}

/*Gets the vote state relatively to the current user if he has signed in*/
var getVoteStateOnload = function (object) {
	let result = 0;
	if (wif.posting) {
		object.active_votes.forEach(function (item) {
			if (item.voter == username) {
				result = item.percent;
			}
		});
	} else {
		result = 0;
	}
	return result;
}

/*Sets the number of likes or dislikes on the label in a comment or feedback control panel*/
//упростить
var setLblVote = function (fbId, comId, val, val0) {
	let likes;
	let dislikes;
	let label;
	if (val == 0 || val0 == 0) { //одиночные изменения

		//нажатие на дизлайк
		if (val == -1 || val0 == -1) label = getBtnVote(fbId, comId, 0).children[1];
		//нажатие на лайк
		if (val == 1 || val0 == 1) label = getBtnVote(fbId, comId, 1).children[0];

		likes = Number(label.innerHTML);

		//изменение числа
		if (val == 0) likes--;
		if (val0 == 0) likes++;
		label.innerHTML = likes;

	} else if (val != 0 && val0 != 0) {
		//двойное изменение
		likes = Number(getBtnVote(fbId, comId, 1).children[0].innerHTML);
		dislikes = Number(getBtnVote(fbId, comId, 0).children[1].innerHTML);
		if (val == 1) {
			//нажатие на лайк
			likes++;
			dislikes--;
		} else {
			//нажатие на дизлайк
			likes--;
			dislikes++;
		}
		getBtnVote(fbId, comId, 1).children[0].innerHTML = likes;
		getBtnVote(fbId, comId, 0).children[1].innerHTML = dislikes;
	}
}

/*checks the color of vote buttons and sets it according to actual vote state*/
var checkVoteColor = function (fbId, comId) {
	let state = getVoteState(fbId, comId);
	if (state == -1) {
		delClassIfContains(getBtnVote(fbId, comId, 1), 'btn-success');
		getBtnVote(fbId, comId, 0).classList.add('btn-danger');
	} else if (state == 0) {
		delClassIfContains(getBtnVote(fbId, comId, 1), 'btn-success');
		delClassIfContains(getBtnVote(fbId, comId, 0), 'btn-danger');
	} else if (state == 1) {
		delClassIfContains(getBtnVote(fbId, comId, 0), 'btn-danger');
		getBtnVote(fbId, comId, 1).classList.add('btn-success');
	}
}

/*Sets the default statement of the json*/
var clearJsonMetadata = function () {
	jsonMetadata = '{"tags":["' + domain + '"],"images":[]}';
}

/*Adds the image tag to the current text in textbox of a texteditor*/
var addImageToTxtarea = function (imageObjects) {
	console.log(imageObjects);
	let text = ckeditor.getData();
	console.log(text);
	imageObjects.forEach(function (item) {

		text += '<br> <a href="' + item.path + item.hash + '">' + item.path + item.hash + '</a><br>';
		console.log(text);
	});
	ckeditor.setData(text);
	console.log(ckeditor.getData());
}

/*Adds data of different types to the json*/
var addToJsonMetadata = function (element, mode) {
	let parsed = {};
	parsed = JSON.parse(jsonMetadata);

	if (mode == "tags") {
		element.forEach(function (item) {
			parsed.tags.push(item);
		})
	}

	if (mode == "image") {
		if (element != null) {
			element.forEach(function (item) {
				parsed.images.push(item);
			});
		} else {
			console.log('null exception in image mode');
		}
	}

	jsonMetadata = JSON.stringify(parsed);
}

/*Work with hash in the url string*/
var setHash = function (fbId) {
	location.hash = getAuthor(fbId, '') + '/' + getPermlink(fbId, '');
}
var resetHash = function () {
	labels.forEach(function (item) {
		if (item.parentElement.classList.contains('active')) {
			//console.log( item.parentElement);
			location.hash = item.parentElement.getAttribute('href').substr(1);
		}
	});
}
var clearHash = function () {
	location.hash = '';
}

/*Translates russian letters to translit form*/
var urlLit = function (w, v) { // cyrilic-to-translit-function
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

/**/
var refactorIpfsResult = function (result) {
	let i;
	let out = [];
	for (i = 0; i < result.length; i++) {
		out.push(result[i][0]);
	}
	return out;
}


/*ADDITIONAL*/
async function getUrls() {

	if (wif == '') {
		auth(function () {
			golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
				if (err) {
					swal({
						type: 'error',
					});
				} else {
					swal({
						type: 'success',
					})
					removeFbs();
					loadMyFbs();
				}
				console.log(result);
			});
		}, ['posting']);

	} else {
		removeFbs();
		loadMyFbs();
	}
}
