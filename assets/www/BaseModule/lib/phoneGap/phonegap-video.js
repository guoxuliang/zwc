/**
 * 视频相关的插件
 */
var video = function(){};
video.prototype = {
        PlayVideo:function(content){
        	if(window.cordova){
        		cordova.exec(null, null,"VideoPlugin","play",[content]);
        	}else{
        		aigovApp.nativeFunc.alert("您想获得更多的服务体验，请下载客户端");
        		aigovApp.openAppWindow("openUrl",{"url":aigovApp.constants.DOWNLOAD_URL});
        	}
        }
};
if(window.cordova){
	cordova.addConstructor(function(){
	    if (!window.plugins) {
	        window.plugins = {};
	    }
	    window.plugins.VideoPlugin = new video();
	});
}else{
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.VideoPlugin = new video();
}