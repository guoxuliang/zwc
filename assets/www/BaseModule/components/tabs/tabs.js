/**
 * 页签模块
 * @author keyz@asiainfo.com
 * @since 2016-11-07
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	//组件基类模块
	var Component = require("component");
	
	/**
	 * 模板url
	 */
	var TEMPLATE_URL = "BaseModule/components/tabs/template/tabs.html";
	
	
	//模板字符串
	var template = null;
	
	/**
	 * 页签组件类
	 */
	function Tabs(opts){
		
		//继承组件基类
		Component.call(this);
		
		//设置组件参数默认值
		this._setOpts({
			
			//后台数据请求的url
			url : "",
			
			//数据请求参数
			urlParam : null,
			
			//页签数据
			datas : null,
			
			//最大显示页签数
			maxShowTabNum : 3,
			
			//是否显示上一个下一个提示
			hasPrevNext : true,
			
			//页签切换事件
			onSwitch : null
		});
		
		//设置组件参数
		this._setOpts(opts);
		
		//单个页签对象数组
		this.tabArr = [];

		//页签头部dom对象
		this.$header = null;
		
		//页签内容dom对象
		this.$content = null;
		
		//页签组件的iscroll对象
		this.scroll = null;
		
		//页签组件的iscroll对 
		this.tabsScroll=null;
		
		//当前选中的页签索引
		this.select = 0;
	}
	
	//继承基类方法
	Tabs.prototype = new Component();
	
	Tabs.prototype.constructor = Tabs;
	
	/**
	 * 单个页签类
	 */
	function Tab(tabs, name, content, index, $header, $content){
		
		//页签名
		this.name = name;
		
		//页签内容
		this.content = content;
		
		//页签索引
		this.index = index;

		//头部dom结构
		this.$header = $header;
		
		//内容dom结构
		this.$content = $content;
		
		//是否已加载
		this.isLoad = false;
		
		//页签对象引用
		this.tabs = tabs;
	}
	
	/**
	 * 组件初始化函数，实现基类的init接口
	 * @param opts 组件参数，json对象
	 * @param func() 初始化后的回调函数，必须触发
	 */
	Tabs.prototype.init = function(opts, func){
		
		var that = this;
		
		//设置组件参数
		this._setOpts(opts);
		
		//加载模板
		that._loadTemplate(function(){
			
			//加载数据
			that._getDatas(function(){
				
				//渲染
				that._render();
				
				//创建滚动条
				that._createScroll(function(index){
					
					var tab = that.tabArr[index];
					
					that._onSwitch(tab);

					
				});

				that.scroll.goToPage(that.select, 0);
				
				if("function" === typeof func){
					func();
				}
				
			});
		});
	};
	
	/**
	 * 加载模板
	 * @param func() 加载模板后的回调函数
	 */
	Tabs.prototype._loadTemplate = function(func){
		
		var other = {
			
			type : "get",
			dataType : "html"
		};
		
		if(null === template){		//如果模板字符串变量已经有值，则不再加载
			
			aigovApp.ajax(TEMPLATE_URL, null, function(html){
				
				template = html;
				
				if("function" === typeof func){
					func();
				}
				
			}, other);
		} else {
			
			if("function" === typeof func){
				func();
			}
		}
		
	},
	
	/**
	 * 渲染页签组件
	 */
	Tabs.prototype._render = function(){
		
		var datas = this.opts.datas;
		var $dom = this.opts.$dom;
		
		//遍历页签数据
		for(var i=0; i<datas.length; i++){
			
			if(datas[i].select){
				
				//设置第几个页签被选中
				this.select = i;
			}
			
			//创建单个页签对象
			var tab = new Tab(this, datas[i].name, datas[i].content, i);
			
			this.tabArr.push(tab);
		}
		
		//t.js处理模板字符串
		var html = new t(template).render({
			tabArr : this.tabArr
		});

		$dom.append(html);
		
		//页签组件头部区域
		this.$header = $("#ai-tabs-header", $dom);
		
		//页签组件内容区域
		this.$content = $("#ai-tabs-content", $dom);
		
		//获取每个页签对象和头部和内容
		for(var i=0; i<datas.length; i++){
			
			this.tabArr[i].$header = $("[ai-tabs-header-index='"+i+"']", this.$header);
			this.tabArr[i].$content = $("[ai-tabs-content-index='"+i+"']", this.$content);
		}
		
		var tabHeaderWidth=0;
		for(var i=0;i<this.tabArr.length;i++){
			tabHeaderWidth+=this.tabArr[i].$header.outerWidth();
		}
		$("#ai-tabs-header").width(tabHeaderWidth);
		this.tabsScroll=new IScroll($('.ai-tabs')[0], { snap: "li",eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false });

	};
	
	/**
	 * 获取页签数据
	 * @param func() 获取数据后的回调函数
	 */
	Tabs.prototype._getDatas = function(func){
		
		var that = this;
		
		//如果已经有页签数据了，则不用再经过后台请求，直接返回
		if(that.opts.datas){
			func();
			return;
		}
		
		//到后台请求页签数据
		aigovApp.ajax(that.opts.url, that.opts.urlParam, function(response){
			
			if(response.success){
				
				that.opts.datas = response.content;
				
				if(that.opts.datas){
					func();
				}
				
			} else {
				aigovApp.nativeFunc.alert(response.message);
			}
		});
		
		
		if("function" === typeof func){
			func();
		}
	};
	
	/**
	 * 创建iscroll滚动，来实现切换页签左右滑动切换的效果
	 * @param func(index) 页签滑动切换回调函数，index是页签索引，从0开始
	 */
	Tabs.prototype._createScroll = function(func){
		
		var that = this;
		
		//设置宽度
		var width = that.$content.width();
		
		$("[ai-tabs-content-index]", that.$content).width(width);
		
		that.$content.width(width * that.tabArr.length);
		
		//创建滚动条
		that.scroll = new IScroll(that.$content.parent()[0], {
			
			snap: "li",
			momentum: false,//禁用惯性
			scrollbars : false,//是否有滚动条
			scrollX    : true,
			scrollY    : false //是否垂直滚动
		});
		
		var temp = -1;
		
		that.scroll.on("scrollEnd", function(){
			
			var index = this.currentPage.pageX;
			
			//判断页签是否被切换，如果没有被切换，则直接返回
			if(temp === index){
				return;
			}

			temp = index;
			that.select = index;
			
			//切换效果实现
			$("[ai-tabs-header-index].ai-tabs-select", that.$header).removeClass("ai-tabs-select");
			$("[ai-tabs-header-index]:eq("+(index)+")", that.$header).addClass("ai-tabs-select");
			that.tabsScroll.goToPage(index, 0);
			if("function" === typeof func){
				func(index);
			}
		});
		
		//页签头部点击事件，切换到对应的页签
		$("[ai-tabs-header-index]").on("tap", function(){
			
			that.scroll.goToPage(parseInt($(this).attr("ai-tabs-header-index")), 0);
			
		});
	};
	
	/**
	 * 切换事件
	 * @param tab 单个页签对象
	 */
	Tabs.prototype._onSwitch = function(tab){
		
		var that = this;
		
		if("function" === typeof this.opts.onSwitch){
			that.opts.onSwitch(tab);
		}
		
		if(!tab.isLoad){        
            tab.isLoad = true;   
	        //默认切换触发事件
            that.defaultSwitch(tab);	    
		}

            

	};
	
	/**
	 * 默认切换事件
	 * @param tab 单个页签对象
	 */
	Tabs.prototype.defaultSwitch = function(tab){
		
		//默认切换触发事件
		aigovApp.utils.evalJavaScript(tab.content, {
			tab : tab
		});
	};
	
	module.exports = {
		
		getInstance : function(opts){
			
			//组件实例
			var tabsObj = new Tabs(opts);
			
			return tabsObj;
		}
	};
});