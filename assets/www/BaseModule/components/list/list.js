/**
 * 列表组件
 * 负责查找模版文件获取内容,进行数据的渲染,控制上拉下拉,滚动相关
 * 模版的查找优先级为recordTpl>tplUrl>tplId
 * (tplId的路径是固定的,必须放在UserApp/component/list/template/下)
 * @author keyz@asiainfo.com
 * @since 2016-05-27
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//组件基类
	var Component = require("component");
	
	//模版文件路径
	var TEMPLATE_DIR  = 'BaseModule/components/list/template/';
	
	//对象
	var List = function(opts){
		
		Component.call(this);
		
		this._setOpts({
			
			//列表模版标识、即模版对应的文件名称
			tplId : '',
			
			//列表的模版路径
			tplUrl : '',
			
			//下拉执行的逻辑,若为false,则没有下拉的功能
			pulldownAction : null, 
			
			//上拉执行的逻辑,若为false,则没有上拉的功能
			pullupAction   : null, 
			
			//需要渲染的数据,值为数组
			datas : null,
			
			//一条记录的模版内容,与通过tplId获取到的模版HTML内容一样,优先级高于tplId
			recordTpl : '',
			
			//上拉下拉状态的文字
			pullText : {
				
				//下拉刷新文字
				pulldownRefresh   : '下拉刷新...',
				
				//上拉加载更多文字
				pullupLoadingMore : '上拉加载更多...',
				
				//松开开始刷新文字
				releaseToRefresh  : '松手开始刷新...',
				
				//松开开始加载文字
				releaseToLoading  : '松手开始加载...',
				
				//加载中文字
				loading           : '加载中...',
			},
			
			//是否可以滚动 默认为是
			hasScroll : true,
			
			//无数据时的提示			
			noDataMsg : '<div class="aigov-list-no-data">暂无记录</div>',
			
			/*
			 针对列表的每一条记录使用不同模版
			 格式 {'tplKey':'这里放数据中需要做判断的字段key名','tpl':{这里放字段key值1:对应的模版1,这里放字段key值2:对应的模版2}}
			 */
			tplForEachRecord : null,
			
			/*
			 一页显示几条
			 用来控制上拉加载更多的显示隐藏
			 若得到的数据少于此参数,则说明后面没有数据了
			 */
			pageCount : 15,
			
			//每条记录的事件,格式为[{'type':'tap','handle': function}]
			recordEvents : null
		});
		
		//合并外部与内部的属性
		this._setOpts(opts);
		
		//该组件的DOM对应的jQuery对象
		this.$dom = this.opts.$dom;
		
		//组件版本
		this._version = '1.0.0';
		
		this._opts = {
			
			//在找不到任何模版时使用此模版
			recordTpl : '',
			
			//上拉Dom的引用
			$pullup  : null
		};
		
		return this; 
	};
	
	//继承基类的方法和属性
	List.prototype = new Component();
	
	//将构造器的引用还给List
	List.prototype.constructor = List;
	
	/**
	 * 组件初始化方法
	 * @param opts 参数选项
	 * @param initComplete 初始化完成之后的回调函数
	 */
	List.prototype.init = function(opts,initComplete){
		
		//合并外部与内部的属性
		this._setOpts(opts);
		
		//初始化完成执行的逻辑
		this._initComplete = initComplete;
		
		//加载组件HTML内容
		this._loadCompHtml();
		
		//绑定内部事件
		this._bindEvent();
		
		return this;
	};
	/**
	 * 加载组件HTML内容
	 */
	List.prototype._loadCompHtml = function(){
			
		var that = this;
		
		that._loadHtml(that.componentPath +'list.html',function(html){
			
			that.$dom.html(html);
			
			that._loadTplHTML();
		});
	};
	/**
	 * 加载模版的HTML内容
	 */
	List.prototype._loadTplHTML = function(){
			
		var that = this,
			opts = that.opts;
			
		//若有记录的模版内容,或者针对每条记录有不同模版的情况,则直接以此为模版开始渲染具体业务数据
		if(opts.recordTpl || (opts.tplForEachRecord && $.isEmptyObject(opts.tplForEachRecord))){
			
			//渲染数据
			that.renderData(opts.datas);
			
		} else if(opts.tplUrl){//若模版路径存在
			
			that._loadTplHtmlByUrl(opts.tplUrl);
			
		} else if(opts.tplId){//若没有记录的模版,则根据标识找到对应的物理模版文件
			
			that._loadTplHtmlByUrl(TEMPLATE_DIR + opts.tplId +'.html');
			
		} else {//既没有外部传进来模版,也无法根据标识找到对应的物理模版则加载默认的模版文件
			
			that._loadTplHtmlByUrl(that.componentPath+'defaultTpl.html',true);
		} 
	};
	/**
	 * 根据模版路径获取对应模版的内容
	 * @param htmlUrl 模版文件的完整路径
	 */
	List.prototype._loadTplHtmlByUrl = function(htmlUrl,isDefaultTpl){
		
		var that = this;
		
		var error = function(){
			console.log('查找模版文件失败,请确定模版文件名称');
		};
		
		var success = function(html){
			
			//是否渲染数据
			if(that.opts.datas){
				
				if(isDefaultTpl){
					that._opts.recordTpl = html;
				}else{
					that.opts.recordTpl = html;
				}
				
				//渲染数据
				that.renderData(that.opts.datas);
			}else{
				
				//若没有数据,则直接调用初始化完成回调
				if('function' === typeof that._initComplete){
					that._initComplete.call(that);
				}
				aigovApp.utils.closeLoading();
			}
		};
		
		that._loadHtml(htmlUrl,success,error);
	};
	/**
	 * 渲染数据
	 * @param datas    要渲染的数组数据
	 * @param isAppend 是否是追加 默认是false
	 */
	List.prototype.renderData = function(datas,isAppend){
		
		var that      = this,
			opts      = that.opts,
			result    = that._assembleData(datas),
			$pullup   = that.$dom.find('#aigov-list-pullup'),
			$pulldown = that.$dom.find('#aigov-list-pulldown'),
			$content  = that.$dom.find('#aigov-list-content');
		
		//根据情况隐藏上拉加载更多
		that._controlUpAndDown(datas);
			
		//追加
		if(isAppend){
			
			$content.append(result);
			
			that.refreshScroll();
			
		} else {//重新渲染
			
			//没有数据时
			if(!result){
				result = opts.noDataMsg ;
			}
			
			$content.html(result);
			
			//若已经有滚动实例了,则不再创建
			if(!that.iScrollObj && opts.hasScroll){
				
				//滚动辅助模块
				that.iScrollObj = aigovApp.iscrollAssist.newVerScrollForPull(
						that.$dom,opts.pulldownAction,opts.pullupAction,null,opts.pullText);
			}	
			
			//滚动刷新,且回到顶端
			that.refreshScroll(true);
			
			//渲染完组件之后执行的逻辑
			if('function' === typeof that._initComplete){
				that._initComplete.call(that);
			}
		}
		
		aigovApp.utils.closeLoading();
		
		return that;
	};
	/**
	 * 控制上拉下拉的显示隐藏
	 * @param datas 要渲染的数据
	 */
	List.prototype._controlUpAndDown = function(datas){
			
		var that      = this,
			opts      = that.opts,
			$pulldown = that.$dom.find('#aigov-list-pulldown'),
			$pullup   = that.$dom.find('#aigov-list-pullup'),
			$content  = that.$dom.find('#aigov-list-content');
			
		//控制下拉
		if(typeof opts.pulldownAction === 'function'){
			$pulldown.show();
		}else{
			$pulldown.remove();
		}
		
		//控制上拉
		if(typeof opts.pullupAction === 'function'){
			
			//若要渲染的数据小于每页显示的条数,说明后面没有数据了,则隐藏上拉加载更多的DOM
			if(datas){
				if(opts.pageCount > datas.length){
					that._opts.$pullup = $pullup.detach();
				}else if(that._opts.$pullup && that._opts.$pullup.length>0){
					$content.after(that._opts.$pullup.show());
				}else{
					$content.after($pullup.show());
				}
			}else{
				that._opts.$pullup = $pullup.detach();
			}
		}else{
			that._opts.$pullup = $pullup.detach();
		}
	};
	/**
	 * 组装数据和HTML
	 * @param  datas  要组装的数据
	 * @return result 数据的组装结果HTML
	 */
	List.prototype._assembleData = function(datas){
		
		var that  = this,
		    opts  = that.opts,
		    result     = '',
			recordTpl  = opts.recordTpl,
			tplForEachRecord = opts.tplForEachRecord;
			
		if(!datas || datas.length === 0 ) return '';
		
		//针对每一条记录获取记录对应的模版进行组装
		if(tplForEachRecord && !$.isEmptyObject(tplForEachRecord)){
			
			//某一个类型对应一种模版
			var tplKey = tplForEachRecord['tplKey'],
				tpl    = tplForEachRecord['tpl'];
				
			for(var i=0,len=datas.length;i<len;i++){
				
				var data = datas[i];
				if(!tpl[data[tplKey]]) continue;
				
				result += new t(tpl[data[tplKey]]).render({
					data : data
				});
			}
		} else if (recordTpl){//若没有针对每一条记录不同情况下渲染不同模版的需求,则直接对数据统一一个模版组装
			
			result = new t(recordTpl).render({
				datas : datas
			});
		} else {//若找不到任何模版,则采用默认的的模版渲染
			
			result = that._defaultTplRender(datas);
		}
		
		return result;
	};
	/**
	 * 默认的模版渲染组装
	 * @param datas 要处理的业务数据
	 * @return 采用默认模版组装完成的字符串
	 */
	List.prototype._defaultTplRender = function(datas){
		
		var result = '';
		var newDatas = [];
		
		for(var j=0,jLen=datas.length;j<jLen;j++){
				
			var count    = 0,
				jsonTemp = {};
				
			for(var key in datas[j]){
				
				if(count === 3) break;
				
				jsonTemp[count] = datas[j][key];
				
				count ++;
			}
			newDatas.push(jsonTemp);
		}
		
		result = new t(this._opts.recordTpl).render({
				datas : newDatas
		});
		
		return result;
	};
	/**
	 * 绑定事件
	 */
	List.prototype._bindEvent = function(){
		
		var that    = this,
			opts    = that.opts,
			events  = opts.recordEvents;
			
		//列表每条记录的事件绑定
		if(!events || events.length === 0) return ;
			
		for(var i=0,len=events.length;i<len;i++){
			
			(function(event){
				
				if(!event['type']) return ;
				
				that.$dom.on(event['type'],'[aigov-is-record="true"]',event['data'],function(e){
					if(typeof event['handle'] === 'function'){
						event['handle'].call(that,$(this),e);
					}
					return false;
				});
			})(events[i]);
		}
	};
	/**
	 * @param url     加载html文件
	 * @param success 加载成功之后的回调函数
	 * @param error   加载失败之后的回调函数
	 */
	List.prototype._loadHtml = function(url,success,error){
		
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

	/**
	 * 滚动刷新
	 * @param isScrollToTop 是否滚动到顶部
	 */
	List.prototype.refreshScroll = function(isScrollToTop){
			
		if(this.iScrollObj){
			
			this.iScrollObj.refresh();
		
			if(isScrollToTop){
				this.iScrollObj.scrollTo(0,this.iScrollObj.minScrollY);
			}
		}
	};
	/**
	 * 取得滚动对象
	 */
	List.prototype.getIScrollObj = function(){
			
		return this.iScrollObj;
	};
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		/**
		 * 获取一个实例
		 * @param  opts 外部传入的参数
		 * @return 实例对象
		 */
		getInstance : function(opts){
			
			var instanceObj = new List(opts);
			
			return instanceObj;
		}
	};
		
	module.exports = exportsMethods;
});
