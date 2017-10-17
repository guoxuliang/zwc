/**
 * 通话录插件
 * @author keyz@asiainfo.com
 * @since 2015-5-9
 * 
 */
var ContractPlugin=function(){};

ContractPlugin.prototype={
	
	/**
	 * 添加联系人
	 * @param param{
	 * 				name:联系人名称，
	 * 				phone:联系人电话，
	 * 				email:电子邮箱，
	 * 				tertiaryPhone:单位电话
	 * 				}
	 */
	add:function(param){
		cordova.exec(null, null,"ContactPlugin","add",[param]);
	}
};

cordova.addConstructor(function(){
	if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.ContractPlugin = new ContractPlugin();
});