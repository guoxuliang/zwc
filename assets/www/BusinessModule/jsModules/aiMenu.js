/**
 * 系统菜单按钮的相关js方法
 * @author keyz@asiainof.com
 * @since 2016-05-26
 */
;define(function(require, exports, module){
	var ajax = require("ajax");
	//模块对外提供的公共方法
	var exportsMethods = {
		/**
		 * 在指定的区域中打开相应模块
		 * @param eventSource 事件来源
		 * @param htmlUrl     存放要加载的模块ID
		 */
		openModule : function(eventSource,htmlUrl,intent){
			var isLogin=aigovApp.config.appWindows[htmlUrl].isLogin;
			if(isLogin && !window.localStorage.account){
				aigovApp.openAppWindow("login");
				throw new error("未登录");
			}else{
				//获取窗口对象
				var winObj = eventSource.appWindow;
				
				var container = winObj.getComponent('mainContainer');
				
				//打开窗口
                if (htmlUrl == 'busSameRoute' || htmlUrl == 'busMore' || htmlUrl == 'busStationNear') {
					aigovApp.openAppWindow(htmlUrl,intent,true);
				} else {
                    container.openAppWindow(htmlUrl, intent, true);
				}
			}
		},
		
		
		/**
		 * 打开窗口(全屏显示)
         * @param eventSource 事件来源
         * @param htmlUrl     存放要加载的模块ID
		 */
		openWin : function(eventSource,htmlUrl){
			
			//加载外部框模板
			var winTemplate = "threePage";
			var intent = {
 				contentId : htmlUrl
 			};
	 		//页面跳转
	 		aigovApp.openAppWindow(winTemplate,intent);
		},
		
		///////////
		openWithoutFooter : function(eventSource,htmlUrl,title){
			
			//加载外部框模板
			var winTemplate = "threePage";
			var intent = {
 				contentId : htmlUrl,
 				contentIntent : {
 					hasFooter : false,
 					headerTitle : title
 				}
 				
 			};

	 		//页面跳转
	 		aigovApp.openAppWindow(winTemplate,intent);
		},
		
		openCurrentContainter: function(eventSource,requestUrl) {
			aigovApp.ajax(requestUrl,null,function(data){
			});
		}

	};
	
	module.exports = exportsMethods;

});