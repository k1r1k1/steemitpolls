var golosJs, momentJs, sweetAlert, gAuth, gPollsApi, bootstrapMin, gPollsStyle, gPollsWidth, gPollsLink, gPollsContainer;

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

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

gPollsStyle = document.createElement('link');
gPollsStyle.rel = 'stylesheet';
gPollsStyle.href = 'gPolls.css';
(document.head || document.documentElement).appendChild(gPollsStyle);

document.addEventListener('DOMContentLoaded', function() {
gPollsContainer = document.createElement('div');
gPollsContainer.class = 'card border-primary mb-3';
gPollsContainer.innerHTML = `<div class="card-header"><img src="logo.png" width="25" height="25" class="d-inline-block align-top" alt=""><a class="gPolls" href="https://golospolls.com/" target="_blank">GolosPolls.com</a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div></div>`;
document.querySelector('.gPolls').style.width = gPollsWidth;
document.querySelector('.gPolls').appendChild(gPollsContainer);
});