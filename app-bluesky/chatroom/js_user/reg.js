(function($, doc) {
	$.init();
	$.plusReady(function() {
		var settings = app.getSettings();
		var regButton = doc.getElementById('reg');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		var passwordConfirmBox = doc.getElementById('password_confirm');
		var emailBox = doc.getElementById('email');
		var codeBox = doc.getElementById('code');
		var codeImg = doc.getElementById("codeImg");
		codeImg.addEventListener('tap', function(event) {
			console.log("刷新验证码");
			this.src = this.src + '?' + Math.floor(Math.random() * 100);
		})
		accountBox.addEventListener('blur', function(event) {
			plus.nativeUI.toast(app.checkUsrNameRe(this.value).text);
		})
		regButton.addEventListener('tap', function(event) {
			var regInfo = {
				username: accountBox.value,
				password: passwordBox.value,
				email: emailBox.value,
				code: codeBox.value
			};
			var passwordConfirm = passwordConfirmBox.value;
			if (passwordConfirm != regInfo.password) {
				plus.nativeUI.toast('密码两次输入不一致');
				return;
			}
			plus.nativeUI.showWaiting();
			app.reg(regInfo, function(err) {
				if (err) {
					plus.nativeUI.toast(err);
					return;
				}
				plus.nativeUI.toast('注册成功');
				$.openWindow({
					url: 'login.html',
					id: 'login',
					show: {
						aniShow: 'pop-in'
					}
				});
			});
			plus.nativeUI.closeWaiting();
		});
	});
}(mui, document));