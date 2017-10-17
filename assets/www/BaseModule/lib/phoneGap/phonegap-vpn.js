/**
 * vpn插件
 * @author keyz@asiainfo.com
 * @since 2015-5-9
 * 
 */
var VpnPlugin=function(){};

VpnPlugin.prototype={
	
	/**
	 * 启动
	 * @param param{
	 * 				ip:VPN地址，
	 * 				port:端口号，
	 * 				user:用户名，
	 * 				pwd:密码
	 * 				}
	 */
	start:function(param){
		cordova.exec(null, null,"VpnPlugin","start",[param]);
	},
	
	/**
	 * 关闭
	 */
	stop:function(){
		cordova.exec(null, null,"VpnPlugin","stop",null);
	}
};

cordova.addConstructor(function(){
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.VpnPlugin = new VpnPlugin();
});