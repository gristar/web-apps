//添加自定义事件监听
window.addEventListener('getDetail', function(event) {
	console.log("进入详情页事件");
	//获得事件参数
	var url = event.detail.url;
	var title = event.detail.title;
	$('.mui-title').text(title);

	jQuery.ajax({
		url: url,
		type: 'get',
		dataType: 'html',
		async: false,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			plus.nativeUI.toast("网络连接失败");
			console.log("连接失败");
		},
		success: function(response) {
//			console.log(response);
			var title = jQuery(response).find("#C-Main-Article-QQ h1").text();
			var articleTime = jQuery(response).find(".tit-bar .article-time").text();
			var from = jQuery(response).find(".tit-bar .color-a-1").text();
			console.log(title + articleTime + from);
			var titleBar = jQuery('<div class="u-content-bar"></div>').append('<span class="u-content-title">'+title+'</span>')
				if(from){
					titleBar.append('<span class="u-content-from">'+from+'</span>')
				}
				if(articleTime){
					titleBar.append('<span class="u-content-time">'+articleTime+'</span>')
				}
				
			jQuery(".mui-content").append(titleBar);
			var content = jQuery(response).find("#Cnt-Main-Article-QQ");
			jQuery(content).find("a").remove();
			jQuery(".mui-content").append(content);
		}
	})
})

mui.plusReady(function(){
	mui.init({
		beforeback: function() {
			jQuery(".mui-content").html('');
			console.log("关闭详情页");
			//获得列表界面的webview
			var main = plus.webview.getWebviewById('main.html');
			//触发列表界面的自定义事件（refresh）,从而进行数据刷新
			mui.fire(main, 'refresh');
			//返回true，继续页面关闭逻辑
			return true;
		}
	});
})