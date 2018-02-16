/* Copy To Clipboard */

var inputsC = 2;

function CopyLinkToClipboard() {
    document.querySelector('#cplkint').select();
    document.execCommand('copy');
    swal({
        type: 'success',
        title: 'Link has been copied to clipboard',
        showConfirmButton: false,
        timer: 2000
    })
}
document.querySelector('#cplkbtn').addEventListener('click', CopyLinkToClipboard, false);

function CopyCodeToClipboard() {
    document.querySelector('#cpcdint').select();
    document.execCommand('copy');
    swal({
        type: 'success',
        title: 'Code has been copied to clipboard',
        showConfirmButton: false,
        timer: 2000
    })
}
document.querySelector('#cpcdbtn').addEventListener('click', CopyCodeToClipboard, false);

/* adding a response option */

function doInputActive() {
    document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
    document.getElementById('pOption' + inputsC).style.opacity = '1';
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Type your text here');
    document.querySelector('#inputOption' + inputsC).removeEventListener('mousedown', doInputActive, false);
    addInputPoll();
}

function doInputInactive() {
    document.getElementById('pOption' + inputsC).style.opacity = '0.4';
    document.getElementById('pOptionButt' + inputsC).setAttribute('disabled', 'disabled');
    document.getElementById('inputOption' + inputsC).setAttribute('placeholder', 'Click here to add a new one');
    delInputPoll();
}

function addInputPoll() {
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
    console.log('completeForm');
    /* inserting header in poll */

    var $div = document.createElement('h5');
    $div.className = 'card-title';
    $div.innerHTML = document.querySelector('.form-control.title').value;
    document.querySelector('.card-body.text-dark').appendChild($div);

    /* inserting new inputs in poll */

    var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control');
    for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
        var $div = document.createElement('div');
        $div.className = 'progress-block';
        $div.innerHTML = `<p class="card-text">` + $pollInputs[cnt].value + `</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" id="` + cnt + `" style="width: 100%; cursor: pointer;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div><br>`;
        document.querySelector('.card-body.text-dark').appendChild($div);
        console.log('cnt = ' + cnt);
        document.getElementById(cnt).onclick = progress_click;
    }

    /* visual */



    document.getElementById('complete-form').style.display = 'block';
    document.getElementById('Links').style.display = 'block';
    document.getElementById('complete-form').scrollIntoView();

}

function progress_click() {
    alert('Вы только что выбрали вариант № ' + this.id);
}

/* buttons ivents */

document.querySelector('#inputOption2').addEventListener('mousedown', doInputActive, false);
document.getElementById('pOptionButt2').addEventListener('click', doInputInactive, false);
document.getElementById('complete').addEventListener('click', completeForm, false);