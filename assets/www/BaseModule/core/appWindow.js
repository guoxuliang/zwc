/**
 * 窗口模块
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	//ajax模块
	var ajax = require("ajax");
	
	//工具模块
	var utils = require("utils");
	
	//当前激活窗口
	var activatedWindow = null;
	
	//窗口堆栈
	var windowStack = [];
	
	//放置窗口的区域
	var $windowContainer = $("#_windowContainer");
	
	//窗口组件配置
	var config = null;
	
	var exportMethods = {
		//打开中标记
		openingFlag:true,
		
		/**
		 * 打开一个窗口
		 * @param id 窗口的id，字符串
		 * @param intent 窗口间相互传递的json数据
		 * @param cfg App配置对象
		 * @param isHistory 窗口打开后是否压入堆栈，默认为true
		 * @param func(win) 打开窗口之后的回调函数，win为打开的窗口对象
		 */
		open : function(id, intent, cfg, isHistory, func){
			var _this=this;
			//如果打开中就返回不在打开
			if(_this.openingFlag){
				_this.openingFlag=false;
			}else{
				return;
			}
				//将配置缓存起来
				if(!config){
					
					config = cfg;
				}
				
				//根据id从配置中获取特定窗口的配置信息
				var windowConfig = config.appWindows[id];
				
				if(undefined === isHistory){
					
					if(undefined === windowConfig.isHistory){
						isHistory = true;
					} else {
						isHistory = windowConfig.isHistory;
					}
				}
				
				//创建该窗口的dom结构
				var $dom = $("<div/>");
				
				//创建一个窗口实例
				var windowObj = new AppWindow(id, $dom, intent, isHistory);
				
				//加载css
				ajax.loadCss(windowConfig.css, windowObj.$style, function(){
				
					//加载html
					windowObj.loadHtmlAndGetComponent(windowConfig.html, windowObj.$content, function(map){
						
						
						function loadJs(){
							//加载js路径对应窗口模块
							require.async(windowConfig.js, function(windowModule){
								
								//该窗口的组件
								windowObj.components = map;
								
								//onCreate函数的js模块
								windowObj.windowModule = windowModule;
								
								//加入堆栈
								windowStack.push(windowObj);
								
								if("function" === typeof func){
									func(windowObj);
								}
								
								if(windowModule){
									
									//标记已打开
									_this.openingFlag=true;
									
									setTimeout(function(){
										
										//调用窗口模块的onCreate方法
										if("function" === typeof windowModule.onCreate){
											windowModule.onCreate(windowObj);
										}
										
									}, 0);
								}
								
							});
						}
						
						//旧的窗口移出dom结构，新的窗口显示
						if(activatedWindow){
							if(window.cordova){
								activatedWindow.$dom.addClass("leave"),
								windowObj.$dom.addClass("enter"),
								windowObj.$dom.appendTo($windowContainer),
								setTimeout(function() {
									if(activatedWindow){
										activatedWindow.$dom.removeClass("leave")
										activatedWindow.$dom.detach();
									}
									//设置当前激活窗口为该窗口
									windowObj.$dom.removeClass("enter")
									activatedWindow = windowObj;
									loadJs();
					            },300);
							}else{
								if(activatedWindow){
									activatedWindow.$dom.detach();
								}
								$dom.appendTo($windowContainer);
								activatedWindow = windowObj;
								loadJs();
							}
							
						}else{
							windowObj.$dom.appendTo($windowContainer);
							activatedWindow = windowObj;
							loadJs();
						}
						
						
					});
					
				});
		},
		
		/**
		 * 打开嵌套窗口
		 * @param id 窗口的id，字符串
		 * @param $dom 在何处打开窗口，jQuery对象
		 * @param intent 窗口间相互传递的json数据
		 * @param cfg App配置对象
		 * @param func(win) 打开窗口之后的回调函数，win为打开的窗口对象
		 */
		openNestWindow : function(id, $content, intent, func){
			
			//根据id从配置中获取特定窗口的配置信息
			var windowConfig = config.appWindows[id];
			
			if(!windowConfig){
				
				throw new Error("无对应窗口！");
			}
			
			var $dom=$("<div>");
			
			$content.append($dom);
			//创建一个窗口实例
			var windowObj = new AppWindow(id, $dom, intent, false);
			
			//加载css
			ajax.loadCss(windowConfig.css, $content, function(){
			
				//加载html
				windowObj.loadHtmlAndGetComponent(windowConfig.html, windowObj.$content, function(map){
					
					//加载js路径对应窗口模块
					require.async(windowConfig.js, function(windowModule){
						
						//该窗口的组件
						windowObj.components = map;
						
						//onCreate函数的js模块
						windowObj.windowModule = windowModule;
						
						if("function" === typeof func){
							func(windowObj);
						}
						
						if(windowModule){
							
							setTimeout(function(){
								
								//调用窗口模块的onCreate方法
								if("function" === typeof windowModule.onCreate){
									windowModule.onCreate(windowObj);
								}
								
							}, 0);
						}
					});
				});
			});
		},
		
		/**
		 * 窗口回退
		 * @param intent 要传递给前一个窗口的json信息
		 * @returns 回退成功返回true，回退失败返回false
		 */
		back : function(intent){
			aigovApp.utils.closeLoading();
			
			//获取要打开的窗口对象
			var toOpen = getPrevWindow(); 
			
			if(toOpen){
				if(window.cordova){
					activatedWindow.$dom.addClass("leave_back");
					toOpen.$dom.addClass("enter_back"),
					toOpen.$dom.appendTo($windowContainer),
					setTimeout(function() {
						activatedWindow.$dom.removeClass("leave_back")
						activatedWindow.$dom.detach();
						//设置当前激活窗口为该窗口
						toOpen.$dom.removeClass("enter_back")
						activatedWindow = toOpen;
						if("function" === typeof activatedWindow.windowModule.onBack){
							activatedWindow.windowModule.onBack(intent);
						}
		            },300);
				}else{
					setTimeout(function() {
						activatedWindow.$dom.detach();
						toOpen.$dom.appendTo($windowContainer),
						activatedWindow = toOpen;
						if("function" === typeof activatedWindow.windowModule.onBack){
							activatedWindow.windowModule.onBack(intent);
						}
		            },300);
				}
					
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * 获取当前窗口，只能获取顶级窗口，不能获取嵌套窗口
		 * @returns 当前窗口对象
		 */
		getCurrentWindow : function(){
			return activatedWindow;
		},
		
		/**
		 * 清空历史记录
		 */
		cleanHistory : function(){
			if(windowStack && windowStack.length>1){
				var windowObj=windowStack[0];
				windowStack = [];
				windowStack.push(windowObj);
			}else{
				windowStack = [];
			}
			
		},
		
		/**
		 * 得到window队列
		 */
		getWindowStack:function(){
			return windowStack;
		}
	};
	
	/**
	 * 获取上一个窗口对象
	 */
	function getPrevWindow(){

		var length = windowStack.length;
		
		if(1 >= length){
			
			return null;
		}
		
		var num = 0;
		
		while (true) {
			
			var index = windowStack.length - (2+num);
			if(index<0){
				return null;
			}
			var winObj = windowStack[index];
			
			if(winObj.isHistory){
				
				for ( var i = 0; i < num+1; i++) {
					windowStack.pop();
				}
				
				return winObj;
			}
			
			num++;
		}
		
		for ( var i = 0; i < array.length; i++) {
			
		}
		while(true){
			
			var length = windowStack.length;
			
			if(1 >= length){
				
				return null;
			}
			
			var winObj = windowStack[windowStack.length - 2];
			
			if(winObj.isHistory){
				windowStack.pop();
				
				return winObj;
			}
			
		}
	}
	
	/**
	 * 获取dom结构上的组件参数
	 * @param $dom 需要解析的dom结构，jQuery对象
	 */
	function getDomParam($dom){
		
		//获取全部参数
		var namedNodeMap = $dom[0].attributes;
		
		var domParam = {};
		
		//遍历全部参数，符合组件参数形式aigov-xx-yy的则获取，并转为xxYy
		for(var i=0; i<namedNodeMap.length; i++){
			
			var namedNode = namedNodeMap[i];
			
			var name = namedNode.name;
			
			if(0===name.indexOf("aigov-") || "id"===name){
				
				var value = namedNode.value;
				
				var paramName = utils.changeFormat(name);
				
				var numVal = Number(value);
				
				//将字符串转化为相应类型
				if(("true" === value)){
					
					value = true;
				} else if("false" === value){
					
					value = false;
				} else if(numVal === numVal){	//判断是否为NaN, NaN!==NaN
					
					value = numVal;
				}
				
				domParam[paramName] = value;
			}
		}
		//将自身加入参数中
		domParam.$dom= $dom;
		
		return domParam;
	}
	
	/**
	 * 窗口类
	 */
	function AppWindow(id, $dom, intent, isHistory){
		
		//窗口id
		this.id = id;
		
		//窗口组件映射
		this.components = {};
		
		//窗口的dom结构
		this.$dom = $dom;
		
		//窗口dom结构中存放css的区域
		this.$style = $("<div>").appendTo(this.$dom);
		
		//窗口dom结构中存放窗口内容的区域
		this.$content = $("<div>").appendTo(this.$dom);
		
		//上一个窗口传过来的信息
		this.intent = intent;
		
		//窗口对应的脚本js模块
		this.windowModule = null;
		
		//是否被压入堆栈，嵌套窗口不会被压入堆栈，无法被返回
		this.isHistory = isHistory;
		
		//父亲窗口
		this.parent = null;
	}
	
	AppWindow.prototype = {
		
		/**
		 * 刷新
		 */
		refresh : function(){
			
			var that = this;
			
			that.components = {};
			
			var windowConfig =  config.appWindows[that.id];
			
			//modified by ssy,刷新之前必须初始化dom结构
			that.$dom.empty();
			
			//窗口dom结构中存放css的区域
            that.$style = $("<div>").appendTo(this.$dom);
        
            //窗口dom结构中存放窗口内容的区域
            that.$content = $("<div>").appendTo(this.$dom);
            //end modified
        
			//加载css
			ajax.loadCss(windowConfig.css, that.$style, function(){
				
				//加载html
				that.loadHtmlAndGetComponent(windowConfig.html, that.$content, function(map){
					
					that.components = map;
					
					that.windowModule.onCreate(that);
					
				});
			});
		},
	
		/**
		 * 根据id获取组件
		 * @param componentId 组件id
		 * @returns 组件对象
		 */
		getComponent : function(componentId){
			return this.components[componentId];
		},
		
		/**
		 * 获取前一个窗口传过来的信息
		 * @returns 前一个窗口传过来的json信息
		 */
		getIntent : function(){
			return this.intent;
		},
		
		/**
		 * 获取上一个窗口
		 * @returns 前一个窗口窗口对象
		 */
		getPrevAppWindow :function(){
			
			return getPrevWindow();
			
		},
		
		/**
		 * 创建一个组件
		 * @param $dom 组件的dom结构，jQuery对象，为一个div标签，然后将参数写在标签上
		 * @param func(componentObj, id) 组件创建成功后的回调函数
		 * 		componentObj：组件对象
		 * 		id：组件id
		 */
		createComponent : function($dom, func){
			
			var that = this;
			
			//获得dom结构上的组件参数
			var param = getDomParam($dom);
			
			//组件类型
			var type = param.type;
			
			//组件id
			var id = param.id;
			
			//组件对应的js
			var js = config.components[type].js;
			
			require.async(js, function(module){
				
				if(module){
					
					var componentObj = module.getInstance(param);

					that.components[id] = componentObj;
					
					//组件预处理
					if("function" === typeof componentObj.__pre){
						
						componentObj.__pre(config.components[type], that, function(){
							
							if("function" === typeof func){
								func(componentObj, id);
							}
						});
					} else {
						
						if("function" === typeof func){
							func(componentObj, id);
						}
					}
					
				} else {
					throw new Error("找不到对应组件:"+ type);
				}
				
			});
		
		},
		
		/**
		 * 解析dom获得组件，该dom结构里可包含对个组件
		 * @param $dom 要解析的dom结构，jQuery对象
		 * @param func(map) 组件生成后的回调函数，map为组件对象与id映射
		 */
		analysisDomGetComponent : function($dom, func){
			
			var that = this;
			
			//获得组件的dom
			var $componentDomArr = $("[aigov-type]", $dom);
			
			//将jQuery对象转换为纯数组
			var componentDomArr = $.makeArray($componentDomArr);
			
			//组件id与实例映射关系表
			var map = {};
			
			var num = componentDomArr.length;
			
			if(0 === num){
				
				if("function" === typeof func){
					
					//组件实例创建完成， 调用窗口模块的onCreate方法
					func(map);
				}
				
				return;
			}		
			
			for ( var i = 0; i < componentDomArr.length; i++) {
				
				var $componentDom = $(componentDomArr[i]);
				
				that.createComponent($componentDom, function(componentObj, id){
					
					map[id] = componentObj;
					
					num--;
					
					if (0 === num) {
						
						if("function" === typeof func){
							
							//组件实例创建完成， 调用窗口模块的onCreate方法
							func(map);
						}
					}
				});
				
			}
		},
		
		/**
		 * 请求加载本地html页面，并生成组件
		 * @param url 本地页面地址，String字符串
		 * @param $parent 页面容器，jQuery对象
		 * @param func(map) 组件生成后的回调函数，map为组件对象与id映射
		 */	
		loadHtmlAndGetComponent : function(url, $parent, func){

			var that = this;
			
			ajax.loadHtml(url, $parent, function(isSuccess){
				
				if(isSuccess){
					that.analysisDomGetComponent($parent, function(map){
						
						if("function" === typeof func){
							func(map);
						}
					});
				} else {
					if("function" === typeof func){
						func({});
					}
				}
			});
		},
	};
	
	module.exports = exportMethods;
});