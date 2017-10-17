/**
 * 页签切换事件
 * @author keyz@asiainfo.com
 * @since 2016-11-07
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	/**
	 * 创建一个container组件来放置页签内容窗口
	 * @param tab 单个页签对象
	 * @param windowId 页签内容窗口id
	 * @param intent 传给页签内容窗口的信息对象
	 */
	function createContainer(tab, windowId, intent){
		
		//页签索引
		var index = tab.index;
		
		//单个页签的内容区域
		var $location = tab.$content;
		
		//页签组件所在的窗口
		var appWindow = tab.tabs.appWindow;
		
		var $containerDom = $("<div id='tabsContainer"+index+"' aigov-auto-init='false' aigov-type='container' aigov-window-id='"+windowId+"'/>").css({
			height : "100%"
		});
		
		//创建container组件
		appWindow.createComponent($containerDom.appendTo($location), function(container){
			
			container.init({
				intent : intent
			});
		});
	}
	
	module.exports = {
		
		
		/**
		 * 在页签中打开指定id的窗口
		 * @param other{
		 * 		tab ： 窗口对应的单个页签对象
		 * 		intent ： 传给窗口的信息对象
		 *	}
		 * @param winId 窗口id
		 */
		openContentByWinId : function(other,winId,intent){
			
			//单个页签对象
			var tab = other.tab;
			
			//传递给容器组件里的窗口的信息
			if(!intent){
				intent = other.intent;
			}
			
			//在页签内容里创建一个容器组件来放置窗口
			createContainer(tab, winId, intent);
		}
	};
});