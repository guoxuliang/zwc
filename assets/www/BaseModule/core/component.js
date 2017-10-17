/**
 * 组件基类
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	//ajax模块
	var ajax = require("ajax");
	
	/**
	 * 组件基类
	 */
	function Component(){
		
		//用于存放组件参数
		this.opts = {
		
			//组件id
			id : "",
			
			//组件类型
			type : "",
			
			//组件dom结构
			$dom : null,
			
			//组件提供的样式
			style : "default",
			
			//用户自定义的样式
			customStyle : "",
			
			//是否自动初始化
			autoInit : true
		};
		
		//组件版本
		this._version = "1.0.0";
		
		//该组件的配置信息
		this.config = null;
		
		//该组件属于哪个窗口
		this.appWindow = null;
		
		//组件的目录路径
		this.componentPath ="";
	}
	
	/**
	 * 加载组件样式
	 * @param func() 样式加载完后的回调函数
	 */
	Component.prototype.__setStyle = function(func){
		
		var that = this;
		
		var componentStyleDir = that.componentPath + "style/";
		
		var customStyleDir = "UserApp" + componentStyleDir.slice(componentStyleDir.indexOf("/"));
		
		//如果有用户样式，则只加载用户样式
		if(that.opts.customStyle){
			
			//加载css
			ajax.loadCss(customStyleDir + that.opts.customStyle + ".css", that.appWindow.$style, function(){
				
				if("function" === typeof func){
					func();
				}
			});
			
		} else if("none" !== that.opts.style){		//样式不为none，则加载样式
			
			//加载css
			ajax.loadCss(componentStyleDir + that.opts.style + ".css", that.appWindow.$style, function(){
				
				if("function" === typeof func){
					func();
				}
			});
		} else {	//不加载样式
			
			if("function" === typeof func){
				func();
			}
		}		
	};
	
	/**
     * 合并组件参数
     * @param opts 组件参数，json格式
     */
	Component.prototype._setOpts = function(opts){
	
        if(opts){
            $.extend(true, this.opts, opts);
        }
    };
    
	/**
	 * 组件实例化方法的接口，新创建的组件继承Component类后要实现这个方法
	 * @param opts 组件参数，json对象
	 * @param func() 回调函数
	 */
	Component.prototype.init = function(opts, func){
		
		throw new Error("init接口未实现！");
	};
	
	/**
	 * 组件预处理
	 * @param config 组件配置
	 * @param appWindow 窗口对象
	 * @param func() 预处理完的回调函数
	 */
	Component.prototype.__pre = function(config, appWindow, func){
		
		var that = this;
		
		that.config = config;
		
		that.appWindow = appWindow;
		
		that.componentPath =that.config.js.slice(0, that.config.js.lastIndexOf("/"))+"/";
		
		//加载样式
		that.__setStyle(function(){
			
			//判断是否自动init
			if(that.opts.autoInit){
				
				//自动执行init方法
				that.init(null, function(){
					
					if("function" === typeof func){
						func();
					}
				});
			} else {
				if("function" === typeof func){
					func();
				}
			}
			
		});
	};
	
	/**
	 * @param url     加载html文件
	 * @param success 加载成功之后的回调函数
	 * @param error   加载失败之后的回调函数
	 */
	Component.prototype._loadHtml = function(url,success,error){
		
		var opts = {
			dataType  : 'html',
			type      : 'get',
			error     : error
		};
		
		//发送请求
		aigovApp.ajax(url,null,function(data,jqXHR){
			
			if(typeof success === 'function'){
				success(data);
			}
		},opts);
	};
	
	module.exports = Component;
});