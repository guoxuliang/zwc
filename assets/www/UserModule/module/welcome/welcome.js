/**
 * 欢迎界面的相关脚本
 * @author xyl
 *
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;

	//模块对外提供的公共方法
	var exportsMethods = {
		
		onCreate : function(winObj){
			
			var intent = winObj.getIntent();
			if(intent){
				var mainWinId = intent.mainWinId;
			}
			
			this.enterNextPageByJson({'enter' : mainWinId});
		},
		/**
		 * 根据json配置信息进入下一页
		 * @param cfgJson 配置信息
		 */
		enterNextPageByJson : function(cfgJson){
			
			if(!cfgJson){
				cfgJson = {};
			}
			
			var aiWelcome = require('aiWelcome');
				
			aiWelcome.enterNextPage(cfgJson['enter'], cfgJson['enterModel'],$('#begin'));
			
//			aiWelcome.enterNextPage(nextPageId,enterModel,eventSource,wrapper,indicator);
		}
	};
	
	module.exports = exportsMethods;
});
