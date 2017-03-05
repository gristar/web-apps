(function($, doc) {
	//添加自定义事件监听
	window.addEventListener('refresh', function(event) {
		console.log("列表刷新");
		//获得事件参数
		//var url = event.detail.url;
	})

	$.plusReady(function() {

		var URL = {
			"qq_guonei": "http://news.qq.com/newsgn/rss_newsgn.xml",
			"qq_gundong": "http://finance.qq.com/financenews/breaknews/rss_finance.xml",
			"qq_keji": "http://n.rss.qq.com/rss/tech_rss.php",
			"qiushibaike": "http://www.qiushibaike.com/"

		}
		var item1 = doc.getElementById('item1mobile');
		var item2 = doc.getElementById('item2mobile');
		var item3 = doc.getElementById('item3mobile');

		mui.init({
			pullRefresh: {
				container: "#item1mobile", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
					callback: onRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		});

		/*ws = plus.webview.currentWebview();
		ws.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			top: "50px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);*/
		// 刷新页面
		function onRefresh() {
			var title = jQuery('#sliderSegmentedControl .mui-active').text();
			if (title == '资讯') {
				setContent(item1, URL.qq_guonei);
			} else if (title == '笑话') {
				//				setContent(item2, URL.qq_gundong);
				jQuery.ajax({
					url: URL.qiushibaike,
					type: 'get',
					dataType: 'html',
					async: false,
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log("连接失败");
						plus.nativeUI.toast("网络连接失败");
					},
					success: function(response) {
						//							jQuery(item2.querySelector('.mui-scroll')).html(response);
						var jQuerycontent = jQuery('<ul class="mui-table-view">');
						var content = jQuery(response).find("article");
						jQuery(content).each(function(index, v) {
							var titles = jQuery(v).find(".content-text").text();
							var links = jQuery(v).find("a").attr("href");
							var image = jQuery(v).find("img.w-xl").attr("src");
							var description = jQuery(v).find(".content-text").text();
							var content = '<li class="u-joke-li" title="' + titles + '" id="' + index + '"><a href="javascript:void(0)">';
							if (image) {
								content += '<img class="u-joke-img" src="' + image + '">';
							}
							content += '<div><p>' + description + '</p></div></a></li>';
							jQuerycontent.append(content);
						});
						jQuery(item2.querySelector('.mui-scroll')).html(jQuerycontent);
						jQuery(".u-slider-group .mui-active").css({
							"height": jQuery(item2.querySelector('.mui-scroll')).height()
						});
					}
				})
			} else if (title == '科技') {
				setContent(item3, URL.qq_keji);
			}
			var list = jQuery(".mui-slider-group .mui-active .mui-table-view");
			var item = jQuery("<span class='u-refresh-time'>刷新时间 " + ((new Date()).toLocaleTimeString()) + "</span>");
			list.prepend(item);
			jQuery(".u-slider-group .mui-active").css({
				"height": list.parent().height()
			});
			mui('#item1mobile').pullRefresh().endPulldownToRefresh();
			//			ws.endPullToRefresh();

		}

		var detailPage = $.preload({
			url: "detail.html",
			id: 'detail.html'
		});
		console.log(detailPage);

		/*var detailPage = null;*/
		mui(".mui-scroll").on('tap', '.mui-table-view-cell', function() {
			console.log("详情");
			var url = this.getAttribute("link");
			var title = jQuery('#sliderSegmentedControl .mui-active').text();
			if (url) {
				//传值给详情页面，通知加载新数据
				mui.fire(detailPage, 'getDetail', {
					url: url,
					title: title
				});
				//打开新闻详情
				mui.openWindow({
					url: 'detail.html'
				})
			}
		})

		var formatContent = function(response) {
			jQuerycontent = jQuery('<ul class="mui-table-view">');
			jQuery(response).find("channel").find("item").each(function(index, ele) {
				var titles = jQuery(ele).find("title").text();
				var links = jQuery(ele).find("link").text();
				var description = jQuery(ele).find("description").text();
				description = description.substr(0, 50);
				//console.log(titles + '-----');
				var num = parseInt(10*Math.random());
				var content = '<li class="mui-table-view-cell mui-media" title="' + titles + '" id="' + index + '" link="' + links + '"><a href="javascript:void(0)"><img class="mui-media-object mui-pull-left" src="../images_user/000'+num+'.jpg"><div class="mui-media-body">' + titles + '<p class="mui-ellipsis">' + description + '</p></div></a></li>';
				jQuerycontent.append(content);
				//console.log(content);
			});
			return jQuerycontent;
		}

		var setContent = function(ele, url) {
			/*console.log("设置内容");
			console.log(ele);
			console.log(url);*/
			jQuery.ajax({
				url: url,
				type: 'get',
				dataType: 'xml',
				async: false,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("连接失败");
				},
				success: function(response) {
					var content = formatContent(response);
					jQuery(ele.querySelector('.mui-scroll')).html(content);
					jQuery(".u-slider-group .mui-active").css({
						"height": jQuery(ele.querySelector('.mui-scroll')).height()
					});
				}
			})
		}

		setContent(item1, URL.qq_guonei);

		doc.getElementById('slider').addEventListener('slide', function(e) {
			if (e.detail.slideNumber === 1) {
				//querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素。
				if (item2.querySelector('.mui-loading')) {
					console.log("获取选项卡2内容");
					//					setContent(item2, URL.qq_gundong);
					jQuery.ajax({
						url: URL.qiushibaike,
						type: 'get',
						dataType: 'html',
						async: false,
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("连接失败");
							plus.nativeUI.toast("网络连接失败");
						},
						success: function(response) {
							//							jQuery(item2.querySelector('.mui-scroll')).html(response);
							var jQuerycontent = jQuery('<ul class="mui-table-view">');
							var content = jQuery(response).find("article");
							jQuery(content).each(function(index, v) {
								console.log(jQuery(v).attr("id"));
								var titles = jQuery(v).find(".content-text").text();
								var links = jQuery(v).find("a").attr("href");
								var image = jQuery(v).find("img.w-xl").attr("src");
								var description = jQuery(v).find(".content-text").text();
								//description = description.substr(0, 50);
								//console.log(titles + '-----');
								var content = '<li class="u-joke-li" title="' + titles + '" id="' + index + '"><a href="javascript:void(0)">';
								if (image) {
									content += '<img class="u-joke-img" src="' + image + '">';
								}
								content += '<div><p>' + description + '</p></div></a></li>';
								jQuerycontent.append(content);
							});
							jQuery(item2.querySelector('.mui-scroll')).html(jQuerycontent);
						}
					})
					jQuery(".u-slider-group .mui-active").css({
						"height": jQuery(item2.querySelector('.mui-scroll')).height()
					});
				}
			} else if (e.detail.slideNumber === 2) {
				console.log("获取选项卡3");
				setContent(item3, URL.qq_keji);
				if (item3.querySelector('.mui-loading')) {
					//setContent(item3, URL.qq_keji);
				}
			}
		});
	})

	var now = function() {
		var myDate = new Date();
		myDate.getYear(); //获取当前年份(2位)
		myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		myDate.getMonth(); //获取当前月份(0-11,0代表1月)
		myDate.getDate(); //获取当前日(1-31)
		myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
		myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
		myDate.getHours(); //获取当前小时数(0-23)
		myDate.getMinutes(); //获取当前分钟数(0-59)
		myDate.getSeconds(); //获取当前秒数(0-59)
		myDate.getMilliseconds(); //获取当前毫秒数(0-999)
		myDate.toLocaleDateString(); //获取当前日期
		var mytime = myDate.toLocaleTimeString(); //获取当前时间
		myDate.toLocaleString(); //获取日期与时间
		var result = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate(); //拼写出的日期2015-3-27
		return mytime;
	}
})(mui, document);