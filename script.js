/* Copy To Clipboard */

var $copyLinkBtn = document.querySelector('#cplkbtn'),
    $copyCodeBtn = document.querySelector('#cpcdbtn'),
    inputsC = 2,
    functionCopyLinkToClipboard = function (event) {
        var copyLink = document.querySelector('#cplkint');
        copyLink.select();
        document.execCommand('copy');
    }
$copyLinkBtn.addEventListener('click', functionCopyLinkToClipboard, false);

var functionCopyCodeToClipboard = function (event) {
    var copyCode = document.querySelector('#cpcdint');
    copyCode.select();
    document.execCommand('copy');
}
$copyCodeBtn.addEventListener('click', functionCopyCodeToClipboard, false);

/* adding a response option */

function doInputActive() {
    console.log('doInputActive');
    document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
    document.getElementById('pOption' + inputsC).style.opacity = '1';
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
    document.querySelector('#inputOption' + inputsC).removeEventListener('mousedown', doInputActive, false);
    addInputPoll();
}

function doInputInactive() {
    console.log('remInput');
    document.getElementById('pOption' + inputsC).style.opacity = '0.4';
    document.getElementById('pOptionButt' + inputsC).setAttribute('disabled', 'disabled');
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Click here to add a new one');
    delInputPoll();
}

function addInputPoll() {
    console.log('addInputForPoll');
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
    document.querySelector('#inputOption' + inputsC).addEventListener('mousedown', doInputActive, false);
    document.getElementById('pOptionButt' + inputsC).addEventListener('click', doInputInactive, false);
}

function delInputPoll() {
    console.log('delInputPoll');
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
    var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control');
    for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
        console.log(cnt + ' input: ' + $pollInputs[cnt].value);
        var $div = document.createElement('div');
        $div.className = 'progress-block';
        $div.innerHTML = `<p class="card-text">` + $pollInputs[cnt].value + `</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>`;
        document.querySelector('.card-body.text-dark').appendChild($div);

    }
    /*$pollInputs.forEach(function(entry) {
    console.log(entry);});*/

    /* visual */

    document.getElementById('complete-form').style.display = 'block';
    document.getElementById('Links').style.display = 'block';
    document.getElementById('complete-form').scrollIntoView();
}

/* buttons ivents */

document.querySelector('#inputOption2').addEventListener('mousedown', doInputActive, false);
document.getElementById('pOptionButt2').addEventListener('click', doInputInactive, false);
document.getElementById('complete').addEventListener('click', completeForm, false);