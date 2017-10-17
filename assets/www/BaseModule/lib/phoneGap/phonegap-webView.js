/**
*	打开网页显示
*/
var WebView = function(){
};

WebView.prototype = {
	open: function(url) {
		if(window.cordova){
			cordova.exec(    
				function(pos){}, 
				function(err){},
				"WebViewPlugin",
				"open",
				[url]
			)
		}else{
			aigovApp.nativeFunc.alert("您想获得更多的服务体验，请下载客户端");
			aigovApp.openAppWindow("openUrl",{"url":aigovApp.constants.DOWNLOAD_URL});
		}
	},
	close:function(){
		cordova.exec(    
				function(pos){}, 
				function(err){},
				"WebViewPlugin",
				"close",
				[]
			)
	}
}

if(window.cordova){
	cordova.addConstructor(function() {
		if (!window.plugins) {
			window.plugins = {};
		}
		window.plugins.webViewPlugin = new WebView();
	});
}else{
	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.webViewPlugin = new WebView();
}
