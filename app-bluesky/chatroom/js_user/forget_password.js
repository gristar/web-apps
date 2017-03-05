(function($, doc) {
	$.init();
	$.plusReady(function() {
		var sendButton = doc.getElementById('sendMail');
		var emailBox = doc.getElementById('email');
		sendButton.addEventListener('tap', function() {
			app.forgetPassword(emailBox.value, function(err, info) {
				plus.nativeUI.toast(err || info);
			});
		}, false);
	});
}(mui, document));