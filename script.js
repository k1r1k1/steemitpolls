/* Copy To Clipboard */

var $copyLinkBtn = document.querySelector('#cplkbtn'),
    $copyCodeBtn = document.querySelector('#cpcdbtn'),
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
    document.getElementById('pOptionButt2').removeAttribute('disabled');
    document.getElementById('pOption2').style.opacity = '1';
    document.getElementById('inputOption2').setAttribute('placeholder', 'Type your text here');
}

function remInput() {
    console.log('remInput');
    document.getElementById('pOption2').style.opacity = '0.4';
    document.getElementById('pOptionButt2').setAttribute('disabled', 'disabled');
    document.getElementById('inputOption2').setAttribute('placeholder', 'Click here to add new one');
}

function addInputPoll() {
    console.log('addInputForPoll');
    var $div = document.createElement('div'),
        $oRight = document.getElementsByClassName('oRight')[0],
        $html = chrome.extension.getURL('enrichment.html'),
        $bRelatedListfirstDiv = document.querySelector('.bRelatedList.first');
        $div.className = 'bRelatedList.first';
        $div.innerHTML = `<div`
}


var $pClickedOption = document.querySelector('#pOption2'),
    $inputOption2 = document.querySelector('#inputOption2');
$inputOption2.addEventListener('mousedown', doInputActive, false);
document.getElementById('pOptionButt2').addEventListener('click', remInput, false);