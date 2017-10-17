/**
 */
var network = function(){};
network.prototype = {
        CheckNet:function(username,pwd){
        	if(window.cordova){
        		cordova.exec(null, null,"NetWorkPlugin","check",[username,pwd]);
        	}else{
        		return;
        	}
        }
};
if(window.cordova){
	cordova.addConstructor(function(){
	    if (!window.plugins) {
	        window.plugins = {};
	    }
	    window.plugins.NetWorkPlugin = new network();
	});
}else{
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.NetWorkPlugin = new network();
}