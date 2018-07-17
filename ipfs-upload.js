let len, arrIpfs, ipfs,
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

document.onreadystatechange = function () {
	setTimeout(() => initConnection(connectionDefault), 2000)
}

function uploadImageToIpfs(cb) {
	window.cb = cb;
	let div = document.createElement('div');
	div.innerHTML = '<input id="imagesSelector" type="file" multiple accept=".png,.jpg,.jpeg" onclick="initialize()" onchange="handleFiles(this.files)" hidden="true"/>';
	(document.head || document.documentElement).appendChild(div);
	document.getElementById('imagesSelector').click();
}

function initialize() {
	document.body.onfocus = checkIt;
	console.log('initializing');
}

function checkIt() {
	if (document.getElementById('imagesSelector').value.length)
		handleFiles(document.getElementById('imagesSelector').files)
	else
		alert('Cancel clicked');
	document.body.onfocus = null;
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
