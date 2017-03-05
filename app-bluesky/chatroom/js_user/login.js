(function($, doc) {
	$.init({
		statusBarBackground: '#f7f7f7'
	});
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var settings = app.getSettings();
		var state = app.getState();
		var mainPage = $.preload({
			"id": 'index',
			"url": 'index.html'
		});
		var toMain = function() {
			$.fire(mainPage, 'show', null);
			setTimeout(function() {
				$.openWindow({
					id: 'index',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
			}, 0);
		};
		//检查 "登录状态/锁屏状态" 开始
		console.log("检查状态：" + JSON.stringify(settings));
		if (settings.autoLogin && state.token && settings.gestures) {
			$.openWindow({
				url: 'unlock.html',
				id: 'unlock',
				show: {
					aniShow: 'pop-in'
				},
				waiting: {
					autoShow: false
				}
			});
		} else if (settings.autoLogin && state.token) {
			toMain();
		} else {
			//第三方登录
			var auths = {};
			var oauthArea = doc.querySelector('.oauth-area');
			plus.oauth.getServices(function(services) {
				for (var i in services) {
					var service = services[i];
					auths[service.id] = service;
					var btn = document.createElement('div');
					btn.setAttribute('class', 'oauth-btn');
					btn.authId = service.id;
					btn.style.backgroundImage = 'url("../images/' + service.id + '.png")'
						//alert(service.id);
						//btn.innerText = service.description + "登录";
					oauthArea.appendChild(btn);
				}
				$(oauthArea).on('tap', '.oauth-btn', function() {
					var auth = auths[this.authId];
					var waiting = plus.nativeUI.showWaiting();
					auth.login(function() {
						waiting.close();
						plus.nativeUI.toast("登录认证成功");
						//alert(JSON.stringify(auth.authResult));
						auth.getUserInfo(function() {
							plus.nativeUI.toast("获取用户信息成功");
							//alert(JSON.stringify(auth.userInfo));
							var name = auth.userInfo.nickname || auth.userInfo.name;
							settings.autoLogin = true;
							app.setSettings(settings);
							/*app.setSettings({
								"autologin": true
							});*/
							app.createState(name, function() {
								toMain();
							});
						}, function(e) {
							plus.nativeUI.toast("获取用户信息失败：" + e.message);
						});
					}, function(e) {
						waiting.close();
						plus.nativeUI.toast("登录认证失败：" + e.message);
					});
				});
			}, function(e) {
				oauthArea.style.display = 'none';
				plus.nativeUI.toast("获取登录认证失败：" + e.message);
			});
		}
		// close splash
		setTimeout(function() {
			//关闭 splash
			plus.navigator.closeSplashscreen();
		}, 600);
		//检查 "登录状态/锁屏状态" 结束

		var loginButton = doc.getElementById('login');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		var autoLoginButton = doc.getElementById("autoLogin");
		var regButton = doc.getElementById('reg');
		var forgetButton = doc.getElementById('forgetPassword');
		loginButton.addEventListener('tap', function(event) {
			var loginInfo = {
				username: accountBox.value,
				password: passwordBox.value
			};
			app.login(loginInfo, function(err) {
				if (err) {
					plus.nativeUI.toast(err);
					return;
				}
				toMain();
			});
		});
		$.enterfocus('#login-form input', function() {
			$.trigger(loginButton, 'tap');
		});
		autoLoginButton.classList[settings.autoLogin ? 'add' : 'remove']('mui-active')
		autoLoginButton.addEventListener('toggle', function(event) {
			setTimeout(function() {
				var isActive = event.detail.isActive;
				settings.autoLogin = isActive;
				app.setSettings(settings);
			}, 50);
		}, false);
		regButton.addEventListener('tap', function(event) {
			$.openWindow({
				url: 'reg.html',
				id: 'reg',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
		forgetButton.addEventListener('tap', function(event) {
			$.openWindow({
				url: 'forget_password.html',
				id: 'forget_password',
				show: {
					aniShow: 'pop-in'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		}, false);
		//
		window.addEventListener('resize', function() {
			oauthArea.style.display = document.body.clientHeight > 400 ? 'block' : 'none';
		}, false);
		//
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if (backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	});
}(mui, document));