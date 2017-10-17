/**
 * 撤回
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//组件基类
	var Component = require("component");
	
	//窗口模块
	var appWindow = require("appWindow");
	
	//对象
	var HeaderBack = function(opts){
		
		Component.call(this);
		
		this._setOpts({
			
			//组件id
			id : "",
			
			//组件提供的样式
			style : "default",
			
			//用户自定义的样式
			customStyle : "",
			
			//标题
			title:"",
			 
			//是否自动初始化
			autoInit : true
		});
		
		//合并外部与内部的属性
		this._setOpts(opts);
		
		//该组件的DOM对应的jQuery对象
		this.$dom = this.opts.$dom;
		
		//组件版本
		this._version = '1.0.0';
		
		return this;
	};
	
	//继承基类的方法和属性
	HeaderBack.prototype = new Component();
	
	//将构造器的引用还给Search
	HeaderBack.prototype.constructor = HeaderBack;
	
	/**
	 * 组件初始化方法
	 * @param opts 参数选项
	 * @param initComplete 初始化完成之后的回调函数
	 */
	HeaderBack.prototype.init = function(opts,initComplete){
		
		//合并外部与内部的属性
		this._setOpts(opts);
		
		//初始化完成执行的逻辑
		this._initComplete = initComplete;
		
		//加载组件HTML内容
		this._loadCompHtml();
		
		return this;
	};
	
	/**
	 * 设置标题
	 */
	HeaderBack.prototype.setTitle=function(title){
		var that = this;
		var titleBox=that.$dom.find("#aigov-header-title");
		titleBox.text(title);
	};
	
	/**
	 * 加载组件HTML内容
	 */
	HeaderBack.prototype._loadCompHtml = function(){
			
		var that = this,
			url  = '';
		
		if(that.opts.tplUrl){
			url = that.opts.tplUrl;
		}else if(that.opts.tplId){
			url = TEMPLATE_DIR + that.opts.tplId +'.html';
		}else{
			url = that.componentPath +'headerBack.html';
		}
		
		that._loadHtml(url,function(html){
			var _html=$(html);
			var winSize=appWindow.getWindowStack().length;
			
			if(winSize==0){
				_html.find('#aigov-header-back-btn').hide();
			}
			
			that.$dom.html(_html);
			
			that.setTitle(that.opts.title);
			
			//绑定内部事件
			that._bindEvent();
			
			if(typeof that._initComplete === 'function'){
				that._initComplete.call(that);
			}
		});
	};
	
	/**
	 * 绑定内部事件
	 */
	HeaderBack.prototype._bindEvent = function(){
		
		var that = this,
			$dom = that.$dom,
			$headerBackBtn = $dom.find('#aigov-header-back-btn');
			
		$headerBackBtn.on('click',function(){
			aigovApp.back();
		});
		
		
	};
	
	
	
	/**
	 * @param url     加载html文件
	 * @param success 加载成功之后的回调函数
	 * @param error   加载失败之后的回调函数
	 */
	HeaderBack.prototype._loadHtml = function(url,success,error){
		
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

	//模块对外提供的公共方法
	var exportsMethods = {
		/**
		 * 获取一个实例
		 * @param  opts 外部传入的参数
		 * @return 实例对象
		 */
		getInstance : function(opts) {
			
			var instanceObj = new HeaderBack(opts);
	
			return instanceObj;
		}
	};
	module.exports = exportsMethods;
});