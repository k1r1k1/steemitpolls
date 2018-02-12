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

function suchMyBalls() {
    
     if($inputOption2.getAttribute('checked') == 'checked'){
            $inputOption2.removeAttribute('checked');
            document.getElementById('pOption2').style.opacity = '0.4';
        }else{
            $inputOption2.setAttribute('checked', 'checked');
                document.getElementById('pOption2').style.opacity = '1';
        }
}

var $pClickedOption = document.querySelector('#pOption2'),
    $inputOption2 = document.querySelector('#inputOption2');
$pClickedOption.addEventListener('click', suchMyBalls, false);