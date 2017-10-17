/**
 * seajs配置
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
seajs.config({

	//将base目录设置为www目录
	base : "./",
	
	// 别名seajs配置
	alias: {
		"aigovApp" : "BaseModule/core/aigovApp",
		"app.config" : "BaseModule/config/app.config",
		"appWindow" : "BaseModule/core/appWindow",
		"component" : "BaseModule/core/component",
		"history" : "BaseModule/core/history",
		"ajax" : "BaseModule/core/ajax",
		"utils" : "BaseModule/core/utils",
		"nativeFunc" : "BaseModule/core/nativeFunc",
		"iscrollAssist":"BaseModule/core/iscrollAssist",
		"storageAssist" : "BaseModule/core/storageAssist",
		"store"    : "BaseModule/core/store",
		"session"    : "BaseModule/core/session",
		"regist.config" : "UserModule/config/regist.config",
		"constants" : "UserModule/config/constants",
	}

});