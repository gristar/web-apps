(function($, owner) {
	var URL = {
		"login": "http://192.168.1.102:8080/auth/login.json",
		"register": "http://192.168.1.102:8080/auth/register.json",
		"checkUsername": "http://192.168.1.102:8080/auth/chkUsername.json",
		"imgcode": "http://192.168.1.102:8080/auth/getcode.json",
		"sendMail": "http://192.168.1.102:8080/auth/findByEmail.json"
	}

	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.username = loginInfo.username || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.username.length < 3) {
			return callback('账号最短为 3 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		//成功响应的回调函数
		var success = function(response) {
			plus.nativeUI.closeWaiting();
			if (response.success) {
				return owner.createState(loginInfo.username, callback);
			} else {
				return callback(response.statusText);
			}
		};
		if(jQuery("#autoLogin").hasClass("mui-active")){
			loginInfo.remberMe = true;
		}
		else{
			loginInfo.remberMe = false;
		}
		/*远程验证用户名密码*/
		plus.nativeUI.showWaiting();
//		$.post(URL.login, loginInfo, success, 'json');
		//md5加密
		loginInfo.password = hex_md5(loginInfo.password);
		console.log("开始登陆" + JSON.stringify(loginInfo) + "地址：" + URL.login);
		jQuery.ajax({
			url: URL.login,
			data: loginInfo,
			type: 'post',
			dataType: 'json',
			async: false,
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				plus.nativeUI.closeWaiting();
				return callback('网络连接失败');
			},
			success: success
		});
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.code = regInfo.code || '';
		if (regInfo.username.length < 4) {
			return callback('账号最短需要 4 个字符');
		}
		var checkUsrRst = this.checkUsrNameRe(regInfo.username);
		if (!checkUsrRst.result) {
			return callback(checkUsrRst.text);
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		if (regInfo.code == '') {
			plus.nativeUI.toast("请输入验证码");
		}

		//成功响应的回调函数
		var success = function(response) {
			if (!response.success) {
				//				document.getElementById('reg').text("注册");
				return callback(response.statusText);
			} else {
				var users = JSON.parse(localStorage.getItem('$users') || '[]');
				users.push(regInfo);
				localStorage.setItem('$users', JSON.stringify(users));
				return callback();
			}
		};
		//设置全局beforeSend
		$.ajaxSettings.beforeSend = function(xhr, setting) {
			//beforeSend演示,也可在$.ajax({beforeSend:function(){}})中设置单个Ajax的beforeSend
			//			document.getElementById('reg').innerHTML("注册中...");
			console.log('beforeSend:::' + JSON.stringify(setting));
		};
		//设置全局complete
		$.ajaxSettings.complete = function(xhr, status) {
				console.log('complete:::' + status);
			}
			/*发送请求开始*/
		var url = URL.register;
		//md5加密
		regInfo.password = hex_md5(regInfo.password);
		$.post(url, regInfo, success, 'json');
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	//验证用户名是否重复
	owner.checkUsrNameRe = function(value) {
		console.log(value);
		var checkRst = {
			result: false,
			text: "验证失败"
		};
		jQuery.ajax({
			//url:'http://jike1102.sinaapp.com/forum.php',
			url: URL.checkUsername,
			data: {
				username: value
			},
			type: 'post',
//			dataType: 'json',
			async: false,
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				checkRst = {
					result: false,
					text: "验证用户名超时"
				};
			},
			success: function(response) {
				if (response.success) {
					checkRst = {
						result: true,
						text: "用户名可用"
					};
				} else {
					checkRst = {
						result: false,
						text: response.statusText
					};
				}
			}
		});

		return checkRst;
	}

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		console.log("验证邮箱");
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		jQuery.ajax({
			url: URL.sendMail,
			data: {
				email: email
			},
			type: 'post',
			dataType: 'json',
			async: false,
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				return callback("连接超时");
			},
			success: function(response) {
				console.log(JSON.stringify(response));
				if (response.success) {
					return callback(null, response.statusText);
				} else {
					return callback(response.statusText);
				}
			}
		})
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));