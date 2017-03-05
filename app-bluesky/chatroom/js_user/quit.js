(function($, doc) {
	//--通用退出事件
	$.oldBack = mui.back;
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
}(mui, document))