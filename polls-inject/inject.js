var golosJs, momentJs, sweetAlert, gAuth, gPollsApi, bootstrapMin, gPollsStyle, gPollsWidth, gPollsLink, gPollsContainer;

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

gPollsStyle = document.createElement('link');
gPollsStyle.rel = 'stylesheet';
gPollsStyle.href = 'gPolls.css';
(document.head || document.documentElement).appendChild(gPollsStyle);

golosJs = document.createElement('script');
golosJs.src = 'https://cdn.jsdelivr.net/npm/golos-js@0.6.1/dist/golos.min.js';
(document.head || document.documentElement).appendChild(golosJs);

momentJs = document.createElement('script');
momentJs.src = 'https://cdn.jsdelivr.net/npm/moment@2.21.0/min/moment.min.js';
(document.head || document.documentElement).appendChild(momentJs);

sweetAlert = document.createElement('script');
sweetAlert.src = 'https://unpkg.com/sweetalert2@7.15.0/dist/sweetalert2.all.js';
(document.head || document.documentElement).appendChild(sweetAlert);

gAuth = document.createElement('script');
gAuth.src = 'https://golosimages.com/auth.js';
(document.head || document.documentElement).appendChild(gAuth);

golosPollsApi = document.createElement('script');
golosPollsApi.src = 'script.js';
(document.head || document.documentElement).appendChild(golosPollsApi);

window.onload = function() {
	init();
};