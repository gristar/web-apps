//mui初始化
/*mui.init();*/
(function($, doc) {
	var subpages = ['main.html', 'mq-chat.html', 'nav-me.html'];
	var subpage_style = {
		top: '0px',
		bottom: '51px'
	};

	var aniShow = {};

	//更新用户信息
	var meBtn = doc.getElementById("nav-me");
	meBtn.addEventListener('tap', function(event) {
		console.log("tap me");
	})

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		for (var i = 0; i < 3; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			if (i > 0) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
			self.append(sub);
		}

		//--设置事件开始
		/*var settingPage = $.preload({
			"id": 'setting',
			"url": '../setting.html'
		});
		//设置
		var settingButton = doc.getElementById('setting');
		//settingButton.style.display = settings.autoLogin ? 'block' : 'none';
		settingButton.addEventListener('tap', function(event) {
			$.openWindow({
				id: 'setting',
				show: {
					aniShow: 'slide-in-left'
				},
				styles: {
					popGesture: 'hide'
				},
				waiting: {
					autoShow: false
				}
			});
		});*/
		//--设置事件结束

	});

	//当前激活选项
	var activeTab = subpages[0];
	var title = document.getElementById("title");
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if (targetTab == activeTab) {
			return;
		}
		//更换标题
		//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		if (mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
		if (defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});
})(mui, document);

var ws = null,
	wc = null;
// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady() {
	ws = plus.webview.currentWebview();
	// 用户点击后
	ws.addEventListener("maskClick", function() {
		wc.close("auto");
	}, false);
}
// 判断扩展API是否准备，否则监听"plusready"事件
if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function showSide() {
	// 防止快速点击可能导致多次创建
	if (wc) {
		return;
	}
	// 开启遮罩
	ws.setStyle({
		mask: "rgba(0,0,0,0.5)"
	});
	// 创建侧滑页面
	wc = plus.webview.create("setting.html", "side", {
		//		left: "30%",
		width: "70%",
		popGesture: "none"
	});
	// 侧滑页面关闭后关闭遮罩
	wc.addEventListener('close', function() {
		ws.setStyle({
			mask: "none"
		});
		wc = null;
	}, false);
	// 侧滑页面加载后显示（避免白屏）
	wc.addEventListener("loaded", function() {
		wc.show("slide-in-left", 200);
	}, false);
}