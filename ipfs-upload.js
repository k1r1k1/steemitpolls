let len, arrIpfs, ipfs, $imgId,
	initConnection = connection => {
		ipfs = window.IpfsApi({
			host: connection.api.address,
			port: connection.api.port,
			protocol: connection.api.protocol
		});
		host = `${ connection.gateway.protocol }://${ connection.gateway.address }:${ connection.gateway.port }/ipfs/`;
	};

const connectionDefault = {
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

setTimeout(() => initConnection(connectionDefault), 2000)

function uploadImageToIpfs(imgid, cb) {
	window.cb = cb;
	$imgId = imgid;
	console.log('imgid ipfs =', imgid); // !!! <====
	let div = document.createElement('div');
	div.innerHTML = '<input id="imagesSelector" type="file" multiple accept=".png,.jpg,.jpeg" onclick="document.body.onfocus = checkIt;"  hidden="true"/>';
	(document.head || document.documentElement).appendChild(div);
	document.getElementById('imagesSelector').click();
}

function checkIt() {
	var $inpimg = document.querySelector('#imagesSelector');
	setTimeout(function () {
		if ($inpimg.value.length) {
			console.log('true');
			document.getElementById($imgId).style = 'display: inline-block; margin-right: .5rem;';
			handleFiles($inpimg.files);
			document.body.onfocus = null;
		} else {
			console.log('false');
			document.getElementById($imgId).parentNode.querySelector('img').src = '';
			document.getElementById($imgId).src = 'graphics/img.svg';
			if (document.getElementById($imgId).parentNode.querySelector('.uplded-img')) {
				document.getElementById($imgId).parentNode.querySelector('.uplded-img').style.display = 'none';
				console.log(document.getElementById($imgId).parentNode.querySelector('.uplded-img'));
			}
			document.body.onfocus = null;
		}
		document.getElementById($imgId).parentNode.querySelector('img').style.display = 'inline-block';
	}, 500)
}

function handleFiles(files) {
	arrIpfs = [];
	let fileList = files;
	len = fileList.length;
	for (var i = 0; i < fileList.length; i++) {
		const reader = new FileReader();
		reader.onload = function (data) {
			const obj = {
				name: '',
				body: '',
				hash: '',
			};
			obj.body = ipfs.Buffer(data.target.result);
			obj.name = fileList.name;
			sendToIpfs(obj);
		};
		reader.readAsArrayBuffer(fileList[i]);
	}
}

function sendToIpfs(data) {
	ipfs.files.add(data.body, function (err, file) {
		if (err) cb(err, null);
		else {
			file[0].path = `${ host }`;
			arrIpfs.push(file);
			if (arrIpfs.length == len) cb(null, arrIpfs);
		}
	})
}
