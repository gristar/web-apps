(function($, doc) {
	var settings = app.getSettings();
	var account = doc.getElementById('nickName');
	//
	$.plusReady(function() {
			var state = app.getState();
			console.log("获取用户名" + JSON.stringify(state));
			account.innerText = state.account;
		})
		/*window.addEventListener('show', function() {
			var state = app.getState();
			console.log("设置用户名" + JSON.stringify(state));
			account.innerText = state.account;
		}, false);*/

	/*var loginPage = $.preload({
		"id": 'login',
		"url": 'login.html'
	});*/
	var toLogin = function() {
		//		$.fire(loginPage, 'show', null);
		$.openWindow({
			id: 'login',
			"url": 'login.html',
			show: {
				aniShow: 'pop-in'
			},
			waiting: {
				autoShow: false
			}
		});
	};

	// 注销所有授权登录认证服务
	function authLogout() {
		plus.oauth.getServices(function(services) {
			auths = services;
			for (var i in auths) {
				var s = auths[i];
				if (s.authResult) {
					s.logout(function(e) {
						console.log("注销登录认证成功！");
					}, function(e) {
						console.log("注销登录认证失败！");
					});
				}
			}
		}, function(e) {
			alert("获取分享服务列表失败：" + e.message + " - " + e.code);
		});

	}
	doc.getElementById("logout").addEventListener('tap', function() {
		console.log("退出");
		toLogin();
		authLogout();
		app.setSettings({
			"autoLogin": false
		});
		app.setState({
			"account": null,
			"token": null
		})
	});
}(mui, document));