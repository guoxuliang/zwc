/**
 * aigovApp主框架模块
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){

	var $ = jQuery;

	//框架配置
	var config = require("app.config");

	//配置注册文件
	var configRegist = require("regist.config");

	//存储辅助模块
	var storageAssist = require("storageAssist");

	//常量
	var constants = require("constants");

	//窗口模块
	var appWindow = require("appWindow");

	//ajax模块，用来处理ajax请求
	var ajax = require("ajax");

	//工具类
	var utils = require("utils");

	//需要与手机原生代码交互的工具类
	var nativeFunc = require("nativeFunc");
	var session = require("session");
	var iscrollAssist = require('iscrollAssist');


	/**
	 * 要导出的方法
	 */
	var exportsMethods = aigovApp = {

		//框架版本
		version : "1.0.0",

		//常量
		constants : constants,//TODO

		//配置，包括框架配置和用户配置
		config : config,

		/**
		 * 打开窗口
		 * @param id 窗口id，字符串
		 * @param intent 要传递给窗口的json信息
		 * @param isHistory 是否记录到窗口堆栈中，boolean值，默认为true
		 * @param func(win) 打开窗口之后的回调函数，win为打开的窗口对象
		 */
		openAppWindow : function(id, intent, isHistory, func){
			var win=config.appWindows[id];
			if(!win){
				aigovApp.nativeFunc.alert("敬请期待");
				return;
			}
			
			//判断是否到登入页面
			var isLogin=win.isLogin;
			if(isLogin && !window.localStorage.account){
				id="login";
			}
			
			//判断是否打开新页面
			var isBlank=win.isBlank;
			if(isBlank){
				var paramStr="";
				$.each(intent,function(i,content){
					if(paramStr==""){
						paramStr+=("?"+i+"="+content);
					}else{
						paramStr+=("&"+i+"="+content);
					}
				});
				window.open('#'+id+paramStr,'_blank');
			}else{
				appWindow.open(id, intent, config, isHistory, func);
			}
			

		},

		/**
		 * 打开嵌套窗口
		 * @param id 窗口id，字符串
		 * @param $dom 在何处打开窗口，jQuery对象
		 * @param intent 要传递给窗口的json信息
		 * @param func(win) 打开窗口之后的回调函数，win为打开的窗口对象
		 */
		openNestWindow : function(id, $dom, intent, func){

			appWindow.openNestWindow(id, $dom, intent, func);
		},

		/**
		 * 窗口回退
		 * @param intent 要传递给前一个窗口的json信息
		 * @returns 回退成功返回true，回退失败返回false
		 */
		back : function(intent){
			return appWindow.back(intent);
		},

		/**
		 * 获取当前窗口，只能获取顶级窗口，不能获取嵌套窗口
		 * @returns 当前窗口对象
		 */
		getCurrentAppWindow : function(){
			return appWindow.getCurrentWindow();
		},

		/**
		 * 清空历史记录
		 */
		cleanHistory : function(){
			appWindow.cleanHistory();
		},

		/**
		 * ajax请求，详细信息参考ajax.js的ajax方法
		 */
		ajax : function(url, data, success, other){

			ajax.ajax(url, data, function(response, textStatus, jqXHR){

				if("50018" == response.code){	//session过期
					var session=aigovApp.session.getSession();
					if(!session.id){
						aigovApp.openAppWindow("login");
						return;
					}
					window.MacAddress.getMacAddress(function(macAddress) {
						//获取用户名密码
						var userName = session.userName;
						var pwd = session.passWord ;
						var params = {"userName":userName,"password":pwd,"mac":macAddress,"id":session.id};
						//登录
						ajax.ajax(aigovApp.constants.loginProperties.ACTION_RE_URL,
								params, function(res){
							
							//避免死循环
							if(res.code!=0){
								aigovApp.utils.closeLoading();
								aigovApp.session.clearSession();
								aigovApp.openAppWindow("login");
							} else {
								aigovApp.session.setSession(res.data,userName,pwd);
								ajax.ajax(url, data, success, other);
							}
	
						});
					});
				} else if("function" === typeof success){
					success(response, textStatus, jqXHR);
				}

			},other);
		},
		
		/**
		 * 重新登入
		 */
		rLogin:function(successFn,failFn){
			//重新登入
        	aigovApp.utils.openLoading();
        	var session=aigovApp.session.getSession();
			window.MacAddress.getMacAddress(function(macAddress) {
				//获取用户名密码
				var userName = session.userName;
				var pwd = session.passWord ;
				var params = {"userName":userName,"password":pwd,"mac":macAddress,"id":session.id};
				//登录
				ajax.ajax(aigovApp.constants.loginProperties.ACTION_RE_URL,
						params, function(res){
					if(res.code==0){
						aigovApp.utils.closeLoading();
						aigovApp.session.setSession(res.data,userName,pwd);
						if(typeof successFn =="function"){
							successFn(res);
						}
					}else{
						aigovApp.utils.closeLoading();
						aigovApp.session.clearSession();
						if(typeof failFn =="function"){
							failFn(res);
						}
					}
				});
			});
		},
		
		/**
		 * ajaxForm请求，详细信息参考ajax.js的ajaxForm方法
		 */
		ajaxForm : function(form,url, data, success, other){

			ajax.ajaxForm(form,url, data, function(response, textStatus, jqXHR){

				if("50018" == response.code){	//session过期
					var session=aigovApp.session.getSession();
					if(!session.id){
						aigovApp.openAppWindow("login");
						return;
					}
					window.MacAddress.getMacAddress(function(macAddress) {
						//获取用户名密码
						var userName = session.userName;
						var pwd = session.passWord ;
						var params = {"userName":userName,"password":pwd,"mac":macAddress,"id":session.id};
						//登录
						ajax.ajax(aigovApp.constants.loginProperties.ACTION_RE_URL,
								params, function(res){
							
							//避免死循环
							if(res.code!=0){
								aigovApp.utils.closeLoading();
								aigovApp.session.clearSession();
								aigovApp.openAppWindow("login");
							} else {
								aigovApp.session.setSession(res.data,userName,pwd);
								ajax.ajaxForm(form,url, data, success, other);
							}
	
						});
					});
				} else if("function" === typeof success){
					success(response, textStatus, jqXHR);
				}

			},other);
		},

		/**
		 * 请求加载本地html页面
		 * @param url 本地页面地址，String字符串
		 * @param $parent 页面容器，jQuery对象
		 * @param func(isSuccess) 请求响应后的回调函数，如果请求成功
		 * 		isSuccess ： 请求成功则为true，失败为false，如果url为空则为undefined
		 */
		loadHtml : function(url, $parent, func){

			ajax.loadHtml(url, $parent, function(isSuccess){

				if("function" === typeof func){
					func(isSuccess);
				}
			});
		},

		/**
		 * 请求加载本地css，加载在当前窗口中
		 * @param url 本地css文件的地址，可为字符串也可为字符串数组，如果为字符串数组则加载多个css
		 * @param func() css加载后的回调函数
		 */
		loadCss : function(url, func){

			var $parent = this.getCurrentAppWindow().$style;

			ajax.loadCss(url, $parent, function(){

				if("function" === typeof func){
					func();
				}
			});
		},

        iscrollAssist:iscrollAssist,
        session:session,

        //工具对象
		utils : utils,

		//与手机原生代码有关的工具对象
		nativeFunc : nativeFunc,

		//终端信息
		phone : {
			type : "ANDROID",
			fileRoot : ""
		}
	};

	/**
	 * 读取用户配置
	 * @param func function 读取完配置后执行的回调函数
	 */
	function readConfig(func){

		var num = configRegist.length;

		if(0 === num){

			//执行回调
			if("function" === typeof func){

				func();
			}
		}

		// 遍历每一个配置文件路径
		for ( var i = 0; i < configRegist.length; i++) {

			//加载配置文件
			require.async(configRegist[i], function(eachConfig){

				if(eachConfig){		//与框架默认配置合并

					config.appWindows = $.extend(config.appWindows, eachConfig.appWindows);
					config.components = $.extend(config.components, eachConfig.components);
					config.jsModules = $.extend(config.jsModules, eachConfig.jsModules);

					delete eachConfig.appWindows;
					delete eachConfig.components;
					delete eachConfig.jsModules;

					$.extend(config, eachConfig);
				}

				num--;

				if(0 === num){

					//执行回调
					if("function" === typeof func){

						func();
					}
				}
			});
		}

	}

	/**
	 * 主函数
	 */
	function main(){

		//读取配置
		readConfig(function(){
			//应用seajs模块配置
			seajs.config({
				alias : config.jsModules
			});

			//获得主窗口id
			var mainWindowId = config.mainWindow;

			if(mainWindowId){

				//加载过滤模块
				require.async('aiFilter',function(aiFilter){
					//对欢迎界面相关进行过滤
					aiFilter.init(mainWindowId,config.welcomeWinId,config);
				});

			} else {
				throw new Error("缺少主窗口！");
			}
		});

	}

	//执行主函数
	main();

	module.exports = exportsMethods;
});
