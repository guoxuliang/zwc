/**
 */
var nfcScan = function(){};
nfcScan.prototype = {
        NFCScan:function(){
        	if(window.cordova){
        		return cordova.exec(null, null,"NFCScanPlugin","scan",[]);
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
	    window.plugins.NFCScanPlugin = new nfcScan();
	});
}else{
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.NFCScanPlugin = new nfcScan();
}
