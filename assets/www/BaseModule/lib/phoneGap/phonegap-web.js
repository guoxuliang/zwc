/**
*	打开网页显示
*/
var WebUtil = function(){
};

WebUtil.prototype = {
	open: function(title,url) {
		if(window.cordova){
			cordova.exec(    
				function(pos){}, 
				function(err){},
				"WebPlugin",
				"open",
				[url,title]
			)
		}else{
			aigovApp.openAppWindow("openUrl",{"url":aigovApp.constants.DOWNLOAD_URL});
		}
	}
}

if(window.cordova){
	cordova.addConstructor(function() {
		if (!window.plugins) {
			window.plugins = {};
		}
		window.plugins.webPlugin = new WebUtil();
	});
}else{
	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.webPlugin = new WebUtil();
}
