    var $copyLinkBtn = document.querySelector('#cplkbtn'),
        $copyCodeBtn = document.querySelector('#cpcdbtn');
    var functionCopyLinkToClipboard = function(event) {
        var copyLink = document.querySelector('#cplkint');
        copyLink.select();
        document.execCommand('copy');
    }
    $copyLinkBtn.addEventListener('click', functionCopyLinkToClipboard, false);
    var functionCopyCodeToClipboard = function(event) {
        var copyCode = document.querySelector('#cpcdint');
        copyCode.select();
        document.execCommand('copy');
    }
    $copyCodeBtn.addEventListener('click', functionCopyCodeToClipboard, false);