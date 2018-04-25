var golosJs, momentJs, sweetAlert, gAuth, gPollsApi, bootstrapMin, gPollsStyle, gPollsWidth, gPollsLink, gPollsContainer;

bootstrapMin = document.createElement('link');
bootstrapMin.rel = 'stylesheet';
bootstrapMin.type = 'text/css';
bootstrapMin.href = 'inject.css';
(document.head || document.documentElement).appendChild(bootstrapMin);

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

gLang = document.createElement('script');
gLang.src = 'https://golosimages.com/lang.js';
(document.head || document.documentElement).appendChild(gLang);

gApi = document.createElement('script');
gApi.src = 'api.js';
(document.head || document.documentElement).appendChild(gApi);

gPollsContainer = document.createElement('div');
gPollsContainer.className = 'card border-primary mb-3';
gPollsContainer.innerHTML = `<div class="card-header"><img src="https://golospolls.com/graphics/logo.png" width="25" height="25" class="d-inline-block align-top" alt=""><a href="https://golospolls.com/" target="_blank">GolosPolls.com</a></div><div class="card-header-right"><p></p></div><div class="card-body text-dark"></div></div>`;
document.querySelector('.gPolls').style.width = gPollsWidth;
document.querySelector('.gPolls').appendChild(gPollsContainer);// div inject