/**
 * 通话录插件
 * @author keyz@asiainfo.com
 * @since 2015-5-9
 * 
 */
var WpsPlugin=function(){};

WpsPlugin.prototype={
	
	/**
	 * 打开Wps
	 * @param param{
	 * 				url:URL路径
	 * 				}
	 */
	open:function(param){
		cordova.exec(null, null,"WpsPlugin","open",[param]);
	}
};

cordova.addConstructor(function(){
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.WpsPlugin = new WpsPlugin();
});