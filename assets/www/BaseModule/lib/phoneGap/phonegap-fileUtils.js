/**
 * 文件相关的插件
 * 
 * @author keyz@asiainfo.com
 * @since 2013-08-01
 * 
 */
var fileUtils = function() {
	
};

fileUtils.prototype = {
	//打开文件
	openFile : function(content) {
		return cordova.exec(null, null, "FileUtilsPlugin", "openFile",
				[content]);
	},

	// 后台下载
	startBackGoundDownload : function(url, localFile, resouceName,fileSize) {
		return cordova.exec(null, null, "FileUtilsPlugin",
				"startBackGoundDownload", [url, localFile, resouceName,fileSize]);
	},
	//打开下载列表
	openDownloadList : function(){
		return cordova.exec(null, null, "FileUtilsPlugin",
				"openDownloadList", []);
	},
	
	//获取文件状态
	getFileState : function(success,url,localFile,resoureName,fileSize){
		return cordova.exec(success, null, "FileUtilsPlugin",
				"getFileState", [url,localFile,resoureName,fileSize]);
	},
	
	// 往文件写内容,以键值对的形式,key-value
	writeFile : function(key, value){
		return cordova.exec(null, null, "FileUtilsPlugin", 
				"writeFile", [key, value]);
	},
	
	// 获取该用户是否要通知
	getValue : function(success,userId){
		return cordova.exec(success, null, "FileUtilsPlugin", 
				"getValue", [userId]);
	},
	// 关闭通知栏
	closeNotification : function(){
		return cordova.exec(null, null, "FileUtilsPlugin",
				"closeNotification", []);
	}
};

cordova.addConstructor(function() {
	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.FileUtilsPlugin = new fileUtils();
});