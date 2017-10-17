/**
 * 吐司相关的插件
 * @author keyz@asiainfo.com
 * @since 2013-08-01
 * 
 */
var toast = function(){};
toast.prototype = {
        ShowToast:function(content,length){
        	if(window.cordova){
        		cordova.exec(null, null,"ToastPlugin","toast",[content,length]);
        	}else{
        		alert(content);
        	}
            
        }
};
if(window.cordova){
	cordova.addConstructor(function(){
	    if (!window.plugins) {
	        window.plugins = {};
	    }
	    window.plugins.ToastPlugin = new toast();
	});
}else{
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.ToastPlugin = new toast();
}

