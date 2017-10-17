/**
 * 容器组件
 * @author keyz@asiainfo.com
 * @since 2016-05-26
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	//组件基类
	var Component = require("component");
	
	/**
	 * 容器组件类
	 */
	function Container(opts){
		
		//继承组件基类
		Component.call(this);
		
		//设置组件参数默认值
		this._setOpts({
			
			//容器里面的窗口id
			windowId : null,
			
			//传给窗口的通信对象
			intent : {},
			
			//是否拥有滚动条，默认不滚动
			hasScroll : false,
			
			//自动刷新滚动条
			autoRefreshScroll : false
		});
		
		//设置组件参数
		this._setOpts(opts);
		
		//放置窗口的区域
		this.$content = null;
		
		//滚动区域
		this.$wrapper = null;
		
		//滚动条对象
		this.scroll = null;
		
		//内容窗口引用
		this.contentWindow = null;
		
		//窗口缓存
		this._windowCache = {};
	}
	
	//继承基类
	Container.prototype = new Component();
	
	Container.prototype.constructor = Container;
	
	/**
	 * 初始化函数
	 * @param opts 组件参数，json对象
	 * @param func() 组件创建完成后的回调函数
	 */
	Container.prototype.init = function(opts, func){
		
		var that = this;

		//设置组件参数
		this._setOpts(opts);
		
		that.$wrapper = $("<div/>").appendTo(this.opts.$dom);
		
		that.$content = $("<div/>").appendTo(that.$wrapper);
		
		if(that.opts.hasScroll){		//创建滚动条
			
			that.createScroll();
			
		}
		
		//打开窗口
		this.openAppWindow(that.opts.windowId, that.opts.intent);
		
		if("function" === typeof func){
			func();
		}
	};
	
	/**
	 * 打开窗口
	 * @param windowId 窗口id，String字符串
	 * @param intent 要传递给窗口的信息对象
	 * @param cache 是否从缓存中打开，boolean值
	 */
	Container.prototype.openAppWindow = function(windowId, intent, cache){
		
		var that = this;
		
		if(windowId){
			
			//如果要打开的窗口已经打开了，则直接返回
			if(that.contentWindow && that.contentWindow.id === windowId){
				
				return;
			}
			
			//是否从缓存中打开
			if(cache){
				//清空内容
				if(that.contentWindow){
					that.contentWindow.$dom.detach();
				}
				//从缓存获取窗口对象
				var cacheWindow = that._windowCache[windowId];
				
				if(cacheWindow){
					
					//显示窗口
					cacheWindow.$dom.appendTo(that.$content);
					cacheWindow.$dom.fadeIn(800)
					
					that.opts.windowId = windowId;
					that.contentWindow = cacheWindow;
					return;
				}
				//打开内容区域中打开嵌套窗口
				aigovApp.openNestWindow(windowId, that.$content, intent, function(appWindow){
					
					that.opts.windowId = windowId;
					that.contentWindow = appWindow;
					
					//设置父窗口
					appWindow.parent = that.appWindow;
					
					//设置组件引用
					appWindow.container = that;
					
					that._windowCache[windowId]=appWindow;
				});
			}else{
				//清空内容
				that.$content.html("");
				//打开内容区域中打开嵌套窗口
				aigovApp.openNestWindow(windowId, that.$content, intent, function(appWindow){
					
					that.opts.windowId = windowId;
					that.contentWindow = appWindow;
					
					//设置父窗口
					appWindow.parent = that.appWindow;
					
					//设置组件引用
					appWindow.container = that;
					
				});
			}
			
			
		}
	};
	
	
	/**
	 * 刷新窗口
	 * @param windowId 窗口id，String字符串
	 * @param intent 要传递给窗口的信息对象
	 * @param cache 是否从缓存中打开，boolean值
	 */
	Container.prototype.reLoadAppWindow = function(intent, cache){
		
		var that = this;
		
		//如果为空直接跳出
		if(!that.contentWindow){
			return;
		}
		var windowId=that.contentWindow.id;
		if(windowId){
			
			//清空内容
			that.$content.html("");
			
			if(cache){		//从缓存中开打
				
				//从缓存获取窗口对象
				var cacheWindow = that._windowCache[windowId];
				
				if(cacheWindow){
					
					//显示窗口
					cacheWindow.$dom.appendTo(that.$content);
					
					that.contentWindow = appWindow;
					return;
				}
			}
			
			//打开内容区域中打开嵌套窗口
			aigovApp.openNestWindow(windowId, that.$content, intent, function(appWindow){
				
				that.opts.windowId = windowId;
				that.contentWindow = appWindow;
				
				//设置父窗口
				appWindow.parent = that.appWindow;
				
				//设置组件引用
				appWindow.container = that;
			});
		}
	};
	
	/**
	 * 创建滚动条
	 */
	Container.prototype.createScroll = function(){
		
		var that = this;
		
		that.$wrapper.addClass("wa-container-wrapper");
		
		//创建iscroll滚动条
		that.scroll = aigovApp.iscrollAssist.newVerScroll(that.$wrapper[0]);
		
		//判断是否自动刷新滚动条
		if(that.opts.autoRefreshScroll){
			
			var contentHeight = that.$content.height();

			//自动刷新滚动条
			setInterval(function(){
				
				var height = that.$content.height();
				
				if(height !== contentHeight){
					
					contentHeight = height;
					
					that.scroll.refresh();
				}
				
			}, 200);
		}
	};	
	
	//导出的方法
	module.exports = {

		/**
		 * 获取实例，与aigovApp框架的接口
		 * @param opts 组件参数
		 * @returns 组件对象
		 */
		getInstance : function(opts){
				
			return new Container(opts);
		}
	};
});