/**
 * 过滤模块
 * 主要提供一些过滤方法,如欢迎界面与登录界面之间的跳转关系等
 * @author keyz@aigov.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	var appWindow = require("appWindow");
	 
	var exportsMethods = {
			
		/**
		 * 主窗口
		 */
		mainWinId:null,
		
		/**
		 * 欢迎窗口
		 */
		welcomeWinId:null,
		
		/**
		 * 窗口信息
		 */
		config:null,
		
		/**
		 * 得到模块
		 */
		getHash:function(){
			var url=location.href;
			var module=(-1 !== url.indexOf("#") ? url.substring(url.indexOf("#") + 1) : "");
			module=(-1 !== module.indexOf("?") ? module.substring(0,module.indexOf("?")):module);
			return module;
		},
		
		/**
		 * 得到url参数
		 */
		getParam : function() {
			var args = new Object();
			var url=location.href;
			var query = (-1 !== url.indexOf("?") ? url.substring(url.indexOf("?")+1,url.length):"");// 获取查询串
			var pairs = query.split("&");// 在逗号处断开
			for (var i = 0; i < pairs.length; i++) {
				var pos = pairs[i].indexOf('=');// 查找name=value
				if (pos == -1)
					continue;// 如果没有找到就跳过
				var argname = pairs[i].substring(0, pos);// 提取name
				var value = pairs[i].substring(pos + 1);// 提取value
				args[argname] = unescape(value);// 存为属性
			}
			return args;
		},
		
		/**
		 * 得到默认页面
		 */
		goDefault:function () {
			var _this=this;
			var module=_this.getHash();
			
			//判断是否有描点定位
			if(module==""){
				
				//判断是否有欢迎界面
				if(_this.welcomeWinId){
					var use = window.localStorage.use;
					
					//第一次登录则进入欢迎界面
					if(use != 'use'){
						window.localStorage.use = 'use';
						appWindow.open(_this.welcomeWinId,{
							mainWinId : _this.mainWinId
						},_this.config);
						return;
					}
				}
				appWindow.open(_this.mainWinId,null,_this.config);
				return;
			}
			
			var param=_this.getParam();
			appWindow.open(module,param,_this.config);
        },
        
        /**
         * 描点触发事件
         */
        hashchange:function(){
        	var _this=this;
        	$(window).on('hashchange', function(e) {
        		
        		_this.goDefault();
        	});
        },
        
        /**
	 	 * 初始化页面跳转
	 	 * @param mainWinId    主窗口标识
	 	 * @param welcomeWinId 欢迎界面标识
	 	 * 说明：如果没有后缀直接跳转首面，如果有后缀直接跳到后缀模块
	 	 */
		init:function(mainWinId,welcomeWinId,config){
			this.mainWinId=mainWinId;
			this.welcomeWinId=welcomeWinId;
			this.config=config;
			this.goDefault();
			this.hashchange();
		}
	 	
	 };
	 
	//将公共方法导出模块
	module.exports = exportsMethods;
});