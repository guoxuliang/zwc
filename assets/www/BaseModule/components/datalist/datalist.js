/**
 * 记录列表组件
 * @author keyz@asiainfo.com
 * @since 2016-05-26
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//组件基类
	var Component = require("component");
	
	//对象
	var Datalist = function (opts){
		
		var that = this;
		
		Component.call(that);
		
		that._setOpts({
			
			//获取配置信息
			cfgUrl     : '',
			
			//获取业务数据
			datasUrl   : '',
			
			//数据参数
			dataParam  :null,
			
			//记录列表唯一标识,用于取数据或者找列表模版文件
			datalistId : '',
			
			//每条记录的模版内容,与通过datalistId获取到的模版HTML内容一样,优先级高于datalistId
			recordTpl : '',
			
			//模版页面地址
			tplUrl : '',
			
			//上拉下拉状态的文字
			pullText : {
				
				//下拉刷新文字
				pulldownRefresh   : '',
				
				//上拉加载更多文字
				pullupLoadingMore : '',
				
				//松开开始刷新文字
				releaseToRefresh  : '',
				
				//松开开始加载文字
				releaseToLoading  : '',
				
				//加载中文字
				loading           : '',
			},
			
			//是否有搜索
			hasSearch : false,
			
			//是否是自动搜索,即是输入的时候实时搜索还是由用户触发搜索
			autoSearch : false,
			
			//按钮信息
			buttonList : null,
			
			//查询字段
			searchColumns : null,
			
			//外部传递进来的数据,此属性若有值,则说明此记录列表由用户自己获取数据,程序直接传递给列表组件进行渲染
			datas      : null,    
			
			//在渲染之前处理下数据,需要return
			handleDatas: null,
			
			//搜索内容
			extraCon:null,
			
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
			
			//是否将当前的数据保存起来
			saveToCurDatas  : false,
			
			//查询的默认提示
			placeholder : '请输入关键字',
			
			//下拉执行的逻辑
			pulldownAction : function(){
						
				that.extraCon = '';
				
				that.getDatas();
			},
			
			//上拉执行的逻辑
			pullupAction   : function(){
				
				that.getDatas(true);
			},
			
			//查询事件
			searchEvent : function(search){
				
				that._search(search);
			},
			
			//每条记录的事件,格式为[{'type':'tap','handle': function}]
			recordEvents : null,
			
			//本地存储的相关属性
			localOpt : {
				
				//要操作的表名
				tableName : '',
				
				//排序字段集合，格式为['column1 desc','column2']
				orderByColumns : null,
				
				//要操作表的柱间字段,在操作时若查找不到目标表,则程序默认创建表时需要此字段进行主键唯一性设置
				priKey : '',
				
				//额外查询条件
				whereStr : ''
			}
		});
		
		//合并外部与内部的属性
		that._setOpts(opts);
		
		//该组件的DOM对应的jQuery对象
		that.$dom = that.opts.$dom;
		
		//组件版本
		that._version = '1.0.0';
		
		//组件私有属性
		that._opts = {
			
			//取得当前组件的标识,用于子组件的标识命名,防止冲突
			prefix : that.$dom.attr('id'),
			
			//子组件实例的临时存放处
			compIdObjMap : {},
			
			//当前页数
			curPageNum : 1
		};
		
		//查询条件
		that.extraCon = '';
		
		return that;
	};
	
	//继承基类的方法和属性
	Datalist.prototype = new Component();
	
	//将构造器的引用还给Datalist
	Datalist.prototype.constructor = Datalist;
	
	/**
	 * 组件初始化方法
	 * @param opts 参数选项
	 * @param initComplete 初始化完成之后的回调函数
	 */
	Datalist.prototype.init = function(opts,initComplete){
		
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
	Datalist.prototype._loadCompHtml = function(){
		
		var that = this;
		
		that.extraCon=that.opts.extraCon||"",
		
		that._loadHtml(that.componentPath +'datalist.html',function(html){
			
			//添加前缀
			html = that._addPrefix(html,that._opts.prefix);
			
			that.$dom.html(html);
			
			//解析Dom并且获取相关子组件
			that.appWindow.analysisDomGetComponent(that.$dom, function(compIdObjMap){
					
				//子组件数组
				$.extend(that._opts.compIdObjMap,compIdObjMap);
				
				//若url为空,则说明不需要配置信息,直接初始化子组件
				if(that.opts.cfgUrl){
					
					//获取记录列表信息
					that._getDatalist();
					
				}else{
					
					//初始化子组件
					that._initSubComp();
				}
			});
		});
	};
	/**
	 * 获取记录列表配置信息
	 */
	Datalist.prototype._getDatalist = function(){
	
		var that = this,
			opts = that.opts;
			
		//传递到后台的参数
		var data = {
			datalistId  : opts.datalistId
		};
		
		var callback = function(data){
			
			//若获取失败,打印失败信息
			if(data.code!="0") {
				
				aigovApp.nativeFunc.alert(data.message);
				aigovApp.utils.closeLoading();
				
				return;
			}
			
			var datalist   = data.data;
			opts.pageCount = datalist.pageCount || 15;
			opts.name = datalist.name;
			
			opts.buttonList = datalist.buttonList;
			opts.searchColumns = datalist.searchColumns;
			
			//初始化子组件
			that._initSubComp();
		}
		
		//请求数据
		aigovApp.ajax(opts.cfgUrl,data,callback);
	};
	/**
	 * 获取记录列表数据
	 * @param isAppend 是否是追加
	 * @param cbFun    获取数据的回调函数
	 */
	Datalist.prototype.getDatas = function(isAppend,cbFun){
		
		var that = this,
			_opts = that._opts;
			
		aigovApp.utils.openLoading();
		
		//是否翻页
		if(!isAppend){
			_opts.curPageNum = 1;
		}else{
			_opts.curPageNum ++ ;
		}
		
		var callback = function(content){
			
			if(typeof that.opts.handleDatas === 'function'){
				
				content = that.opts.handleDatas(content);
			}
			
			//缓存列表内容。
			that._updateCurDatas(content,isAppend);
			
			//有回调则执行回调否则获取子组件进行数据渲染
			if(typeof cbFun === 'function'){
				cbFun.call(this,content);
			}else{
				that.getComp('list').renderData(content,isAppend);
			}
		}
		
		//获取操作本地数据库的相关属性
		var localOpt = that.getLocalOpt();
		
		that.getDatasByPage(_opts.curPageNum,callback,localOpt);
	};
	/**
	 * 获取操作本地数据库的相关属性
	 */
	Datalist.prototype.getLocalOpt = function(){
		
		var that = this;
		var localOpt = that.opts.localOpt;
		
		if(localOpt && localOpt.tableName){
			localOpt.curPageCount = that._opts.curPageNum;
			localOpt.perPageCount = that.opts.pageCount;
		}else{
			localOpt = null;
		}
		
		return localOpt;
	};
	/**
	 * 更新当前数据缓存
	 * @contents 数据内容
	 * @isAppend 是否是追加
	 */
	Datalist.prototype._updateCurDatas = function(contents,isAppend){
		
		if(!this.opts.saveToCurDatas) return ;
		
		if(!isAppend)
			this._curDatas = contents;
		else{
			this._curDatas = this._curDatas.concat(contents);
		}
	};
	/**
	 * 获取当前的数据
	 */
	Datalist.prototype.getCurDatas = function(){
		
		return this._curDatas;
	};
	/**
	 * 根据页数获取相应的数据
	 * @param pageNum  获取此页数的数据
	 * @param callback 成功之后的回调
	 * @param localOpt 操作本地数据库的相关属性
	 */
	Datalist.prototype.getDatasByPage = function(pageNum,callback,localOpt){
		
		var that = this,
			opts = that.opts;
		
		var data = {
			datalistId : opts.datalistId,
			pageCount  : opts.pageCount,
			curPageNum : pageNum
		};
		
		/**
		 * 判断传入参数是不是对象，如果是对象合并
		 */
		if( typeof that.extraCon!='object'){
			data.extraCon=that.extraCon;
		}else{
			if(that.extraCon){
	            $.extend(true, data, that.extraCon);
	        }
		}
		
		if(typeof opts.dataParam=='object'){
			 $.extend(true, data, opts.dataParam);
		}
		
		var cbFun = function(data){
			
			//若获取失败,打印失败信息
			if(!data.code=="0") {
				
				aigovApp.nativeFunc.alert(data.message);
				aigovApp.utils.closeLoading();
				that.getIScrollObj().refresh();
				return;
			}
			
			if(typeof callback === 'function'){
				callback(data.data);
			}
		}
		//请求后台
		aigovApp.ajax(opts.datasUrl, data , cbFun,{localOpt:localOpt,isDirectRequest:true});
	};
	/**
	 * 查询逻辑
	 * extraCon 查询条件
	 */
	Datalist.prototype._search = function(extraCon){
		
		this.extraCon = extraCon;
		
		this.getDatas();
	};
	/**
	 * 初始化子组件
	 */
	Datalist.prototype._initSubComp = function(){
		
		var that = this,
			opts = that.opts,
			$search = that.$dom.find('#'+that._getFullName('search')),
			$button = that.$dom.find('#'+that._getFullName('button')),
			$list   = that.$dom.find('#'+that._getFullName('list'));
			
		//控制查询的显示隐藏
		if(opts.hasSearch){
			$search.show();
			that._initSearchComp();
		}else{
			$search.hide();
		}
		
		//控制按钮的显示隐藏
		if(opts.buttonList && opts.buttonList.length > 0){
			$button.show();
			that._initButtonComp();
		}else{
			$button.hide();
		}
			
		//列表的高度等于父级高度-查询高度-按钮高度
		var height = $list.parent().height() 
						- ($search[0]?$search[0].offsetHeight:0) 
						- ($button[0]?$button[0].offsetHeight:0);
		
		//设置列表高度
		if(height > 0){
			$list.css('height',height);
		}
		
		//初始化列表组件
		that._initListComp();
	};
	/**
	 * 初始化列表组件
	 */
	Datalist.prototype._initListComp = function(){
		
		var that = this;
		var opts = that.opts;
		
		//获取数据之后的回调
		var callback = function(datas){

			var options = {
				
				tplId : opts.datalistId,
				
				recordTpl : opts.recordTpl,
				
				tplUrl    : opts.tplUrl ,
				
				pullText  : opts.pullText,
				
				noDataMsg : opts.noDataMsg,
				
				tplForEachRecord : opts.tplForEachRecord,
				
				pageCount : opts.pageCount,
				
				pulldownAction : opts.pulldownAction,
				
				pullupAction   : opts.pullupAction,
				
				recordEvents   : opts.recordEvents,
	
				datas          : datas
			};
			
			 options = aigovApp.utils.removeEmptyObj(options);
			
			//取得list组件,并调用init进行初始化操作
			that.getComp('list').init(options,function(){
				
				//由于是组合组件,需要将初始化完成的的回调的作用域改变成当前组件
				if(typeof that._initComplete === 'function'){
					
					that._initComplete.call(that);
				}
			});
		}
		
		//若外部有传递数据,则表示用户自己获取数据,不需要请求程序去请求,则直接传递给列表组件进行渲染
		if(opts.datas && opts.datas.length>0){
			callback(opts.datas);
		}else{
			
			//根据数据来源路径获取数据
			that.getDatas(false,callback);
		}
	};
	/**
	 * 初始化查询组件
	 */
	Datalist.prototype._initSearchComp = function(){
		
		var that = this,
			opts = that.opts;

		if (that.$dom[0].id == "busDatalist") {
            that.opts.placeholder = "请输入线路名称(如：59)" ;
        }
	
		var options = {
			
			searchEvent : that.opts.searchEvent,
			
			columns     : that.opts.searchColumns,
			
			placeholder : that.opts.placeholder,
			
			autoSearch  : that.opts.autoSearch,
			
			extraCon:that.opts.extraCon
		};
		
		var searchObj = that.getComp('search');
		
		searchObj.init(options);
	};
	/**
	 * 初始化按钮组件
	 */
	Datalist.prototype._initButtonComp = function(){
		
		var that = this;
		
		var opts = {
			
			datas : that.opts.buttonList
		};
		
		var buttonObj = that.getComp('button');
		
		buttonObj.init(opts);
	};
	/**
	 * @param url     加载html文件
	 * @param success 加载成功之后的回调函数
	 * @param error   加载失败之后的回调函数
	 */
	Datalist.prototype._loadHtml = function(url,success,error){
		
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
	 * 添加前缀
	 * @param html   要添加前缀的字符串内容
	 * @param prefix 前缀
	 * @return 添加完前缀的字符串内容
	 */
	Datalist.prototype._addPrefix = function(html,prefix){
		
		html = new t(html).render({
			searchId : prefix+'_search',
			listId   : prefix+'_list',
			buttonId : prefix+'_button'
		});
		
		return html;
	};
	/**
	 * 获取当前页数
	 * @return 当前页数
	 */
	Datalist.prototype.getCurPageNum = function(){
		
		return this._opts.curPageNum;
	};
	/**
	 * 获取组件对象
	 * @param compName 组件名称
	 * @return 组件对象
	 */
	Datalist.prototype.getComp = function(compName){
		
		if(!compName) return null;
		
		var _opts = this._opts;
		
		compName = this._getFullName(compName);
		
		return _opts.compIdObjMap ? _opts.compIdObjMap[compName] : null ;
	};
	/**
	 * 获取全名 即加上前缀之后的名称
	 * @param 名称
	 */
	Datalist.prototype._getFullName = function(name){
		
		name = name ? name : '';
		
		var prefix = this._opts.prefix && this._opts.prefix + '_' || '';
		
		return prefix+name;
	};
	/**
	 * 刷新
	 */
	Datalist.prototype.refresh = function(){
		
		//获取记录列表信息
		this._loadCompHtml();
	};
	/**
	 * 滚动刷新
	 * @param isScrollToTop 是否滚动到顶部
	 */
	Datalist.prototype.refreshScroll = function(isScrollToTop){
		
		var comp = this.getComp('list');
		comp.refreshScroll.apply(comp,arguments);
	};
	/**
	 * 取得滚动对象
	 */
	Datalist.prototype.getIScrollObj = function(){
		
		var comp = this.getComp('list');
		return comp.getIScrollObj.apply(comp,arguments);
	}
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		/**
		 * 获取一个实例
		 * @param  opts 外部传入的参数
		 * @return 实例对象
		 */
		getInstance : function(opts){
			
			var instanceObj = new Datalist(opts);
			
			return instanceObj;
		}
	};
		
	module.exports = exportsMethods;
});