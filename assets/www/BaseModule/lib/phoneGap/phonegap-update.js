/**
 * 系统更新相关的插件
 * @author keyz@asiainfo.com
 * @since 2013-08-01
 * 
 */ 
var update = function(){};
update.prototype = {
        update:function(projectUrl,versionPath,versionInfoFile,isAlert){
            return cordova.exec(null, null,"UpdatePlugin","update",[projectUrl,versionPath,versionInfoFile,isAlert]);
        },
        
        getVersion : function(success){
        	return cordova.exec(success,null,"UpdatePlugin","getVersion",[]);
        }
};
cordova.addConstructor(function(){
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.UpdatePlugin = new update();
 
});