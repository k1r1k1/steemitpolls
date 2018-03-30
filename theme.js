function changeTheme() {
	var themes = ['sandstone', 'united'];
	var exceptionsThemes = ['cerulean', 'cyborg', 'darkly', 'materia', 'sketchy', 'slate', 'solar', 'spacelab', 'superhero', 'yeti', 'lumen', 'simplex', 'flatly'];
	var menus = ['bg-light', 'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark'];
	var menus2 = ['navbar-light', 'navbar-dark'];
	/*$.getJSON('https://bootswatch.com/api/4.json', function(data) {
		var themes = data.themes;*/
		var $controls = $('<form class="form-inline" style="position: fixed; bottom: 12px; right: 20px;"><select class="custom-select mb-2 mr-sm-2 mb-sm-0 input-sm" id="select-theme"></select><select class="custom-select mb-2 mr-sm-2 mb-sm-0 input-sm" id="select-menu"></select><select class="custom-select mb-2 mr-sm-2 mb-sm-0 input-sm" id="select-menu2"></select></form>');
		$('footer > .container').append($controls);
		var $theme = $('link[href$="bootstrap.min.css"]'),
			$navBar = $('.navbar'),
			$selectTheme = $controls.find('#select-theme'),
			$selectMenu = $controls.find('#select-menu'),
			$selectMenu2 = $controls.find('#select-menu2');
		themes.forEach(function(value, index) {
			//if (exceptionsThemes.indexOf(value.name) == -1) $selectTheme.append($('<option />').val(index).text(value.name));
			$selectTheme.append($('<option />').val(index).text(value));
		});
		menus.forEach(function(value) {
			$selectMenu.append($('<option />').val(value).text(value));
		});
		menus2.forEach(function(value) {
			$selectMenu2.append($('<option />').val(value).text(value));
		});
		$selectTheme.change(function(){
			var selectVal = $(this).val(),
				theme = themes[selectVal];
			//$theme.attr('href', theme.css);
			$theme.attr('href', 'https://bootswatch.com/4/' + theme + '/bootstrap.min.css');
			localStorage.theme = selectVal;
		});
		$selectMenu.change(function(){
			var selectVal = $(this).val();
			menus.forEach(function(value) {
				$navBar.removeClass(value);
			});
			$navBar.addClass(selectVal);
			localStorage.themeMenu = selectVal;
		});
		$selectMenu2.change(function(){
			var selectVal = $(this).val();
			menus2.forEach(function(value) {
				$navBar.removeClass(value);
			});
			$navBar.addClass(selectVal);
			localStorage.themeMenu2 = selectVal;
		});
		if (localStorage.theme) $selectTheme.val(localStorage.theme).change();
		if (localStorage.themeMenu) $selectMenu.val(localStorage.themeMenu).change();
		if (localStorage.themeMenu2) $selectMenu2.val(localStorage.themeMenu2).change();
	//}, 'json');
}

if (localStorage.theme || localStorage.themeMenu || localStorage.themeMenu2) changeTheme();