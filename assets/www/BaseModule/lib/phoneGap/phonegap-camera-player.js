/**
 * 视频相关的插件
 */
var camera = function(){};
camera.prototype = {
        PlayCamera:function(content,title,img){
        	if(window.cordova){
        		cordova.exec(null, null,"CameraPlayerPlugin","play",[content,title,img]);
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
	    window.plugins.CameraPlayerPlugin = new camera();
	});
}else{
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.CameraPlayerPlugin = new camera();
}