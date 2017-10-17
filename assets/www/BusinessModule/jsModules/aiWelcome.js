/**
 * 欢迎界面的相关方法
 * 主要提供欢迎界面之后进入的页面以及支持滚动的逻辑等
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//模块内部私有方法
	var privateMethods = {
		
		/**
		 * 绑定进入下一页面的事件
		 * @param nextPageId  下一个页面的标识
		 * @param eventSource 点击事件区域的标识或者Dom对象。与jQuery选择器类似
		 */
		bindEnterEvent : function(nextPageId,eventSource){
			
			var $eventSource = this.transformToJQuery(eventSource);
			
			//触发进入下一页面的按钮事件绑定
			$eventSource.on('tap',function(){
				aigovApp.openAppWindow(nextPageId);
			});
		},
		/**
		 * 新建一个滚动
		 * @param wrapper   滚动实例要绑定的位置,与jQuery选择器类似
		 * @param indicator 滚动指示区域,与jQuery选择器类似
		 * @return 滚动实例	
		 */
		newIScroll : function(wrapper,indicator){
			
			wrapper   = wrapper   || '#wrapper';
			indicator = indicator || '#indicator';
			
			//将选择器转成JQuery对象
			var $wrapper   = this.transformToJQuery(wrapper),
				$indicator = this.transformToJQuery(indicator);
			
			//初始化滚动样式,调整滚动区域的宽度以符合IScroll插件所需要的结构
			this.initScrollStyle($wrapper,$indicator);
			
			//新建一个滚动实例
			var iScrollObj = new IScroll($wrapper[0],{
				
					scrollX    : true,
					scrollY    : false,
					momentum   : false,
					snap       : true
			});
			
			if($indicator[0]){
				var tagName = $indicator.find('.active')[0].tagName;
			}
			
			//滚动结束的逻辑
			iScrollObj.on('scrollEnd',function(){
				
				//若没有指示区域,则不对指示区域进行样式切换
				if($indicator){
					
					var $active = $indicator.find('.active');
					$active.removeClass('active');
					$indicator.find(tagName+':eq('+this.currentPage.pageX+')').addClass('active');
				}
			});
			return iScrollObj ;
		},
		/**
		 * 通过滚动进入下一个页面
		 * @param nextPageId  下一个页面的标识
		 * @param iScrollObj  滚动实例对象
		 */
		enterByScroll : function(nextPageId,iScrollObj){
			
			if(!iScrollObj) return ;
				
			//当前滚动的计数器
			iScrollObj.curPageNum = 0;
			
			//滚动结束的逻辑
			iScrollObj.on('scrollEnd',function(){
				if(this.flag){
					//页面跳转
			 		aigovApp.openAppWindow(nextPageId);
					return;
				}
			});
			
			//判断是否是在右边界又进行左移15像素，若是，则说明进入要进入下一页面，否则不做操作
			iScrollObj.on('scrollMove',function(){
				if(-this.wrapperWidth*(this.pages.length-1) - this.x > 15){
					this.flag = true;
				}else{
					this.flag = false;
				}
			});
		},
		/**
		 * 转换成JQuery对象
		 * @param selector 选择器
		 * @return jQuery 对象
		 */
		transformToJQuery : function(selector){
			
			var $selector ;
			if(typeof selector === 'string'){
				$selector = $(selector);
			}else if(typeof selector === 'object' && selector != null){
				$selector = selector;
			}else {
				$selector = $([]);
			}
			
			return $selector;
		},
		/**
		 * 初始化滚动样式,调整滚动区域的宽度以符合IScroll插件所需要的结构
		 */
		initScrollStyle : function($wrapper,$indicator){
			
			
			if($wrapper.length == 0) return ;
				
			//可是区域的宽度以及内容滚动区域对象
			var width     = $wrapper.width(),
				$scroller = $wrapper.children();
			
			if($scroller.length == 0) return ;
				
			//所有需要滚动的对象集合
			var $slide = $scroller.children();
			
			if($slide.length == 0) return ;
				
			//设置每一个的需要滚动的宽度为可视区域的宽度
			$slide.width(width);
			
			//设置内容滚动区域的宽度为可视区域*有几个可以需要滚动
			$scroller.width(width*$slide.length);
			
			//根据有几个滚动来动态生成相应几个指示器
			var indicatorLi = '';
			var activeCls   = '';
			
			for(var i = 0,len = $slide.length;i < len;i++){
				
				if(i == 0){
					activeCls = 'class=active';
				}else{
					activeCls = '';
				}
				indicatorLi += '<li '+activeCls+' ></li>';
			}
			
			//添加到指示器区域
			if($indicator.length > 0){
				$indicator.html($('<ul/>').html(indicatorLi));
			}
		}
	};
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		/**
		 * 进入下一个页面
		 * @param nextPageId  下一个页面的标识 默认是'login'
		 * @param enterModel  进入下一个页面的方式 1、通过滚动到最后一页时再次滚动一次进入下一个页面 2、通过点击事件触发进入 3、前2种都支持 默认是'1'
		 * @param eventSource 点击事件区域的标识或者Dom对象、与jQuery选择器类似 为空则使用方式1
		 * @param wrapper   滚动实例要绑定的位置,与jQuery选择器类似 默认是 '#wrapper'
		 * @param indicator 滚动指示区域,与jQuery选择器类似 默认是 '#indicator'
		 * 
		 */
		enterNextPage : function(nextPageId,enterModel,eventSource,wrapper,indicator){
			
			if(!nextPageId) nextPageId = 'login';
			//新建一个滚动实例
			var iScrollObj = privateMethods.newIScroll(wrapper,indicator);
			
			//通过滚动来进入下一页面
			if (enterModel === '1' || !eventSource) {
				
				privateMethods.enterByScroll(nextPageId,iScrollObj);
				
			} else if(enterModel === '2'){//通过点击事件进入下一页面
				
				privateMethods.bindEnterEvent(nextPageId,eventSource);
				
			} else {//其他情况下默认使用滚动进入下一页面
				privateMethods.bindEnterEvent(nextPageId,eventSource);
					
				privateMethods.enterByScroll(nextPageId,iScrollObj);
			}
		}
	};
	
	//将公共方法导出模块
	module.exports = exportsMethods;
});