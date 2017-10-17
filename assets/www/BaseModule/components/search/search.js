/**
 * 简单搜索组件
 * @author keyz@asiainfo.com
 * @since 2016-05-26
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//组件基类
	var Component = require("component");
	
	//模版文件路径
	var TEMPLATE_DIR  = 'BaseModule/components/search/template/';
	
	//对象
	var Search = function(opts){
		
		Component.call(this);
		
		this._setOpts({
			
			//模版文件标识
			tplId       : '',
			
			//模版路径
			tplUrl : '',
			
			//要搜索的字段集合
			columns     : null,
			
			//查询输入框中的默认文字
			placeholder : '请输入关键字',
			
			//查询事件
			searchEvent : null,
			
			//是否是自动搜索,即是输入的时候实时搜索还是由用户触发搜索
			autoSearch  : false
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
	Search.prototype = new Component();
	
	//将构造器的引用还给Search
	Search.prototype.constructor = Search;
	
	/**
	 * 组件初始化方法
	 * @param opts 参数选项
	 * @param initComplete 初始化完成之后的回调函数
	 */
	Search.prototype.init = function(opts,initComplete){
		
		//合并外部与内部的属性
		this._setOpts(opts);
		
		//初始化完成执行的逻辑
		this._initComplete = initComplete;
		
		//加载组件HTML内容
		this._loadCompHtml();
		
		return this;
	};
	/**
	 * 加载组件HTML内容
	 */
	Search.prototype._loadCompHtml = function(){
			
		var that = this,
			url  = '';
		
		if(that.opts.tplUrl){
			url = that.opts.tplUrl;
		}else if(that.opts.tplId){
			url = TEMPLATE_DIR + that.opts.tplId +'.html';
		}else{
			url = that.componentPath +'search.html';
		}
		
		that._loadHtml(url,function(html){
			
			that.$dom.html(html);
			
			that.$dom.find('#aigov-search-input').attr('placeholder',that.opts.placeholder);
			
			if(typeof that.opts.extraCon !='object'){
				that.$dom.find('#aigov-search-input').val(that.opts.extraCon);
			}
			
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
	Search.prototype._bindEvent = function(){
		
		var that = this,
			opts = that.opts,
			$dom = that.$dom,
			$searchCloseBtn = $dom.find('#aigov-search-close-btn'),
			$searchInput    = $dom.find('#aigov-search-input'),
			$searchIcon     = $dom.find('#aigov-search-icon');
			
		var oldVal ;
		
		//输入框的输入事件
		$searchInput.on('input',function (e,flag) {
			
	        var val   = this.value;
	        var where = '';
	        
	        //若值为空,则说明是复原
	        if(val === ''){
	        	
	        	//移除删除按钮样式,复原搜索样式
	        	$searchCloseBtn.hide();
	        	
	        	if(typeof opts.searchEvent === 'function'){
	        		
	        		//若是自动搜索,则直接调用搜索回调函数或者是点击删除返回,也直接执行
	        		if(flag || opts.autoSearch){
	        			
	        			//若是自动搜索,则直接调用搜索回调函数
	        			//TODO 
//			            if(opts.autoSearch && typeof opts.searchEvent === 'function'){
			            if(typeof opts.searchEvent === 'function'){
							opts.searchEvent.call(null,that.assembleExtraCon(val));
			            }
	        		}
	        	}
	        	
	        	//将旧值置空
	        	oldVal = '';
	        	
	        } else {
	        	
	        	//有输入,则开启删除的样式,关闭搜索样式
	        	$searchCloseBtn.show();
	        	
	        	//防止按其他不是输入的按键,如按了大小写切换,这时候新值和旧值一样,不处理
		        if (val !== oldVal) {
		            oldVal = val;
		            
		            //若是自动搜索,则直接调用搜索回调函数
		            if(opts.autoSearch && typeof opts.searchEvent === 'function'){
						opts.searchEvent.call(null,that.assembleExtraCon(val));
		            }
		        }
	        }
	        
	        return false;
	    });
		
		//若不是自动查询,则说明由用户手动触发搜索
		if(!opts.autoSearch){
			
			$searchIcon.on('tap',function(){
		
				if(typeof opts.searchEvent === 'function'){
					
					var keyword = $searchInput.val();
					
					opts.searchEvent.call(null,that.assembleExtraCon(keyword));
					
					return false;
				}
			});
		}
		
		//删除返回
		$searchCloseBtn.on('tap',function(){
			that.cleanValEvent();
			return false;
		});
	};
	
	/**
	 * 清空关键字之后的要执行的逻辑
	 */
	Search.prototype.cleanValEvent = function(){
		
		var $searchInput = this.$dom.find('#aigov-search-input');
		
		$searchInput.val('');
	    $searchInput.trigger('input',[true]);
	};
	
	/**
	 * 组装查询条件
	 * @param keyword 要查询的关键字
	 * @return 组装好的查询条件
	 */
	Search.prototype.assembleExtraCon = function(keyword){
		
		var datas = this.opts.columns;
		
		if($.trim(keyword) === '' || !datas || datas.length == 0) return keyword;
		
		var extraCon = '';
		
		for(var i = 0, len = datas.length; i < len; i++ ){
			if(extraCon == ''){
			    extraCon =  datas[i]+ ' like %' + keyword +'% ' ;
		    } else {
			    extraCon += ' or ' + datas[i]+ ' like %' + keyword +'% ';
		    }
		}
		
		return extraCon ;
	};
	
	/**
	 * @param url     加载html文件
	 * @param success 加载成功之后的回调函数
	 * @param error   加载失败之后的回调函数
	 */
	Search.prototype._loadHtml = function(url,success,error){
		
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
			
			var instanceObj = new Search(opts);
	
			return instanceObj;
		}
	};
	module.exports = exportsMethods;
});