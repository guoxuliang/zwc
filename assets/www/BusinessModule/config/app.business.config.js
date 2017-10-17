/**
 * app业务组件配置
 */
define(function(require, exports, module){
	
	module.exports = {
		
		/**
		 * 业务组件配置
		 */
		components : {

		},
		
		/**
		 * 业务api配置
		 */
		jsModules : {
			
			"aiFilter"  : "BusinessModule/jsModules/aiFilter",
			
			"aiWelcome": "BusinessModule/jsModules/aiWelcome",
			
			"aiMenu":"BusinessModule/jsModules/aiMenu.js",
			
			"aiLogin":"BusinessModule/jsModules/aiLogin.js",
			
			"aiSmsTimer":"BusinessModule/jsModules/aiSmsTimer.js",
			
			"aiTabs":"BusinessModule/jsModules/aiTabs.js"
		}
	};
});