//------------------------------/

/* GolosPolls main script file */

//-----------------------------/

// switching to testnet 
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
var cyrillicToTranslit = module.exports; // cyrillicToTranslit initializing 
var inputsC = 2, // inputs counter
    resultContent = '', // global variable for content
    pollData = {}, // polling answers
    hash = location.hash.substring(1); // geting hash
if (hash != '') getHash();
window.onhashchange = function () {
    hash = location.hash.substring(1);
    console.log('hash has been changed: ', hash);
if (hash != '') getHash();
};

function CopyLinkToClipboard() {
    document.querySelector('#cplkint').select();
    document.execCommand('copy');
    swal({
        type: 'success',
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
        title: 'Code has been copied',
        showConfirmButton: false,
        timer: 1800
    })
}
document.querySelector('#cpcdbtn').addEventListener('click', CopyCodeToClipboard, false);

function addPollingInputs() { // adding a response option 
    document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
    document.getElementById('pOption' + inputsC).style.opacity = '1';
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
    document.querySelector('#inputOption' + inputsC).removeEventListener('mousedown', addPollingInputs, false);
    addInactiveInput();
}
addPollingInputs(); // add 2nd active field in a polling form

function doInputInactive() {
    document.getElementById('pOption' + inputsC).style.opacity = '0.4';
    document.getElementById('pOptionButt' + inputsC).setAttribute('disabled', 'disabled');
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Click here to add a new one');
    delInputPoll();
}

function addInactiveInput() {
    inputsC++;
    var $div = document.createElement('div');
    $div.className = 'input-group mb-3';
    $div.id = 'pOption' + inputsC;
    $div.style = 'opacity: 0.4; transition: .5s;';
    $div.innerHTML = `<div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="pOptionButt` + inputsC + `" disabled>Remove</button>
                    </div>
                    <input type="text" class="form-control" placeholder="Click here to add a new one" aria-label="Get a link of your poll" aria-describedby="basic-addon2" id="inputOption` + inputsC + `">
                </div>`;
    document.getElementById('PollForm').appendChild($div);
    document.querySelector('#inputOption' + inputsC).addEventListener('mousedown', addPollingInputs, false);
    document.getElementById('pOptionButt' + inputsC).addEventListener('click', doInputInactive, false);
}

function delInputPoll() {
    document.getElementById('PollForm').addEventListener('click', function (e) {
        for (var target = e.target; target && target != this; target = target.parentNode.parentNode) {
            if (target.matches('div')) {
                target.remove();
                e.preventDefault();
                break;
            }
        }
    }, false);
}

function completeForm() {
    // collecting data & sending 
    var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control');
    var answers = [];
    for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
        answers[cnt] = $pollInputs[cnt].value;
    }
    str = module.exports().transform(document.querySelector('.form-control.title').value, '-');
    str.replace(/[^\w\d]/g, '_');
    str = str + '-' + Date.now();
    var title = document.querySelector('.form-control.title').value;
    console.log('permlink : ' + str);
    console.log('json var : ' + answers); // debug info
    console.log('title : ' + title);
    var jsonMetadata = {
        app: 'golospolls/0.1',
        canonical: 'https://golospolls.com#' + username + '/' + str,
        app_account: 'golosapps',
        data: {
            poll_title: title,
            poll_answers: answers
        }
    };
    //getPoll(function () {
    send_request(str, title, jsonMetadata);
    swal({ // visual 
        type: 'success',
        title: 'Your polling form has been compiled',
        text: 'Don`t forget to share it!',
        showConfirmButton: false,
        timer: 2500
    })
    // })
    console.log('<f>completeForm');
}

function getPoll(callback) {
    if (!resultContent.json_metadata) getHash();
    resultContent.json_metadata = JSON.parse(resultContent.json_metadata); //parse json to js
    var $div = document.createElement('h5'); // inserting header in poll 
    $div.className = 'card-title';
    $div.innerHTML = resultContent.json_metadata.data.poll_title;
    document.querySelector('.card-body.text-dark').appendChild($div);
    getVote(function (data) {
        console.log(data); // debug info
        setInterval(getVote, 4000); // get result with interval
        for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress 
            var $div = document.createElement('div');
            $div.className = 'progress-block';
            if (data[cnt]) {
                $div.innerHTML = `<p class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</p>
                    <div class="progress" id="` + cnt + `" style="cursor: pointer;">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
                    </div><br>`;
                document.querySelector('.card-body.text-dark').appendChild($div);
                document.getElementById(cnt).onclick = progress_click; // dummy for polling 
            } else {
                $div.innerHTML = `<p class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</p>
                    <div class="progress" id="` + cnt + `" style="cursor: pointer;">
                        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>
                    </div><br>`;
                document.querySelector('.card-body.text-dark').appendChild($div);
                document.getElementById(cnt).onclick = progress_click; // dummy for polling     
            }
        }
    });
    document.getElementById('complete-form').style.display = 'block';
    document.getElementById('PollConstructor').style.display = 'none';
    document.getElementById('complete-form').scrollIntoView();
    document.querySelector('#cplkint').value = 'golospolls.com#' + resultContent.author + '/' + resultContent.permlink;
    if (callback) callback();
    console.log('<f>getPoll');
}

function progress_click() { // dummy for polling 
    if (wif) {
        alert('Вы только что выбрали вариант № ' + this.id);
        sendVote(this.id);
    } else {
        auth();
    }
}

function send_request(str, title, jsonMetadata) {
    var parentAuthor = ''; // for post creating, empty field
    var parentPermlink = 'test'; // main tag
    var body = 'At the moment, you are looking at the test page of a simple microservice, which is currently under development. And since it so happened that you look at it, here`s a random cat, good luck to you and all the best.<img src="https://tinygrainofrice.files.wordpress.com/2013/08/kitten-16219-1280x1024.jpg"></img>'; // post text
    golos.broadcast.comment(wif, parentAuthor, parentPermlink, username, str, title, body, jsonMetadata, function (err, result) {
        //console.log(err, result);
        if (!err) {
            console.log('comment', result);
            window.location.hash = username + '/' + str;
        } else console.error(err);
    }); // add post
    console.log('<f>sendRequest');
}

function getHash() {
    var startTarget = '/@'; // search '/@' - FIX THIS BUG! WHY IT`S WORKING?
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
    golos.api.getContent(username, permlink, function (err, result) { // The console displays the data required for the post 
        console.log(err, result);
        resultContent = result;
        if (!err && result.title != '') {
            console.log('getContent', result.title);
            getPoll();
        } else console.error('Failed to find post',err);
    });
    console.log('<f>getHash');
}

function sendVote(pollId) {
    var parentAuthor = resultContent.author;
    var parentPermlink = resultContent.permlink;
    var permlink = 're-' + parentAuthor + '-' + parentPermlink + '-' + Date.now(); // re-epexa-test-url-1517333064308
    var title = ''; // title - для добавления комментария, поле пустое
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
        //console.log(err, result);
        if (!err) {
            console.log('comment', result);
        } else console.error(err);
    });
    console.log('<f>sendVote');
}

function getVote(collback) { // getting poll data 
    var cnt = 0;
    pollData = {};
    golos.api.getContentReplies(resultContent.author, resultContent.permlink, function (err, result) {
        if (!err) {
            result.forEach(function (item) {
                item.json_metadata = JSON.parse(item.json_metadata);
                if (typeof item.json_metadata.data != 'undefined' && typeof item.json_metadata.data.poll_id != 'undefined') {
                    cnt++;
                    if (!pollData[item.json_metadata.data.poll_id]) pollData[item.json_metadata.data.poll_id] = {
                        count: 0,
                        percnt: 0
                    };
                    pollData[item.json_metadata.data.poll_id].count++;
                }
            });
            for (index = 0; index < resultContent.json_metadata.data.poll_answers.length; ++index) {
                if (typeof pollData[index] != 'undefined') {
                    pollData[index].percnt = Math.round((pollData[index].count * 100) / cnt);
                    if (document.querySelectorAll('.card-text')[index])
                        document.querySelectorAll('.card-text')[index].innerHTML = resultContent.json_metadata.data.poll_answers[index] + ' (' + pollData[index].percnt + ')%';
                    if (document.querySelectorAll('.progress-bar')[index]) {
                        document.querySelectorAll('.progress-bar')[index].style = 'width: ' + pollData[index].percnt + '%;';
                        document.querySelectorAll('.progress-bar')[index].innerHTML = pollData[index].count;
                    }
                } else {
                    pollData[index] = {
                        count: 0,
                        percnt: 0
                    };
                    if (document.querySelectorAll('.card-text')[index])
                        document.querySelectorAll('.card-text')[index].innerHTML = resultContent.json_metadata.data.poll_answers[index] + ' (' + pollData[index].percnt + ')%';
                }
            }
        } else console.error(err);
        if (collback) {
            collback(pollData);
            console.log('<f>getVote callback' + cnt);
        }
    });
}

// buttons events 
document.getElementById('pOptionButt1').addEventListener('click', doInputInactive, false);
document.getElementById('pOptionButt2').addEventListener('click', doInputInactive, false);
document.getElementById('complete').addEventListener('click', function () {
    if (wif) {
        swal({
            title: 'Are you sure?',
            text: 'You won`t be able to revert this!',
            type: 'warning',
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
        auth();
    }
}, false);