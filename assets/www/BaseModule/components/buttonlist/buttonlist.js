/**
 * 设置功能的js
 * 
 * @author keyz@asiainfo.com
 * @since 2016-05-26
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
    
    var Component = require("component");
	
	//原型对象
	var ButtonList = function(opts){
		
		//继承组件对象
		Component.call(this);
		
		//合并默认与内部的属性
		this._setOpts({  
            componentID:"mainMenu",
            template: "template/formButton.html",  //默认样式
            style:"formButton",                    //按钮列表的样式
            radiotype:false,                       //是否是可以选中的
            maxcount:"0",                           //按钮列表最多能显示多少个按钮，太多则用更多表示
            buttonclick:null,
            $dom : $(document)
        });
        
        //事件来源默认为自己
        this.eventSource = this;
        
		//子按钮列表
		this.buttonList = [];

        //当前选中的按钮
        this.curSelBtn = null;
        
        //合并外部与内部的属性
        this._setOpts(opts);

        //组件版本
        this._version = "1.0.0";
	};
	
	ButtonList.prototype = new Component();
    
    ButtonList.prototype.constructor = ButtonList;
    

	/**
	 * 初始化
	 * @param datas 初始化用的列表数据
	 * @param initComplete 控件初始化完成后的回调函数
	 */
	ButtonList.prototype.init = function(opts,initComplete){

		var that = this;
		
		//合并外部与内部的属性
        this._setOpts(opts);
    
        //控件初始化完毕后的回调函数
        this.initComplete=initComplete;
        

        //可以采用url配置渲染和直接传数据渲染的方式
        if(that.opts.dataUrl){
            //获取远程资源
            that._getData(that.opts.dataUrl, that.opts.urlParam, function(buttonData){
                                   
                that._render(buttonData,initComplete);

            });
        }else if(that.opts.datas){	
            //如果已经传入了数据，那么直接渲染该数据
		    that._render(that.opts.datas,initComplete);
		}else{
            if(initComplete)
              initComplete.call();
        };

	};
	/**
	 *获取远程数据 
	 * @param url    远程连接地址
	 * @param param  获取参数
	 * @param func   回调函数
	 */
    ButtonList.prototype._getData = function(url, param, func){		
          
        aigovApp.ajax(url, param, function(response){
            
            if(response){
                
                if("function" === typeof func){
                    
                    func(response);
                }
                
            } else {
            	aigovApp.nativeFunc.alert("读取数据失败");
            }
        });
    };
       /**
     * 重新排序
     * @param datas 要排序的数据
     */
    ButtonList.prototype._reSort=function(datas){
        if(datas){
            var result = [];
            var temp ;
            for (var i = datas.length - 1; i > 0; --i) {
                var isSort=false;
                for (var j = 0; j < i; ++j) {
                    if (datas[j + 1]['position'] < datas[j]['position']) {
                        temp = datas[j];
                        datas[j] = datas[j + 1];
                        datas[j + 1] = temp;
                        isSort=true;
                    }
                }
                if(!isSort)break;
            }
            return datas;
        }
    };
    /**
     *渲染数据 
     * @param datas  数据内容
     */
    ButtonList.prototype._render = function(datas,initComplete){
        
        var that = this;
        
        //构造模板对象
        var tamplateMap = {
            
            buttonTemplate : {
                str : "",
                url : that.componentPath + that.opts.template
            }
        };
        
        //获取模板
        aigovApp.utils.getTemplate(tamplateMap, function(){
            
            //按钮列表
            var subButtons = [];
            //更多按钮
            var moreButtons = [];
            for(var i=0; i<datas.length; i++){
            
                var renderData = datas[i];
                
                //如果超过最多显示的按钮数目，那么加入更多按钮
                if(that.opts.maxcount>0 && i+1>that.opts.maxcount){
                    if(i==that.opts.maxcount){
                        var moreButton = {id:"morebtn",name:"更多",content:"directEval::$('#morediv').toggle();"};
                    
                        subButtons.push(moreButton);
                        
                        //组建button对象并将其缓存                                
                        that.buttonList.push(new SingleButton(null, 
                        moreButton.id, moreButton.name, 
                        moreButton.content));
                    }
                    //加入更多按钮面板中
                    moreButtons.push(renderData);
                }else{
                    //加入普通列表中
                    subButtons.push(renderData);
                }         
                
                
                //组建button对象并将其缓存
                var singleButtonObj = new SingleButton(null, 
                renderData.id, renderData.name, 
                renderData.content, renderData.pictrue, 
                renderData.pictrueSelected, renderData.style,renderData.notSelectCss);
                        
                that.buttonList.push(singleButtonObj);
                
            }
            
            //利用tjs渲染模板
            that.opts.$dom.append(new t(tamplateMap.buttonTemplate.str).render({
                
                singleButtonListMark : that.opts.componentID, subbuttons: subButtons, morebuttons: moreButtons
                
            }));
                   
                    
            //绑定事件
            that._bindEvent();

            //如果有初始化结束后的回调函数，那么执行
            if(that.initComplete)
                that.initComplete.call();
        

        });
    };
    
    /**
     *进行事件绑定 
     */
    ButtonList.prototype._bindEvent = function(){
        var that =this;
   
        var $singleBttonList = $("#" + that.opts.componentID, that.opts.$dom);
                    
        //对每个button添加dom结构
        for(var i=0; i<that.buttonList.length; i++){
            
            var subButton= that.buttonList[i];
            
            subButton.$dom = $("#"+subButton.id);
            
            (function(subButton){
                //添加点击效果
                if(!that.opts.radiotype){
                    
                    subButton.$dom.on("mousedown touchstart",function(){
        			
                        $(this).addClass("cur");
                        
                    }).on("mouseup touchend", function(){
                    
                        $(this).removeClass("cur");
                        
                    });
                }
        
                //按钮的点击事件
                subButton.$dom.on("tap", function(e){
                	try{
                        //如果用户自定义了事件，那么触发用户自定义传入的事件（是否必要？）
                        if(typeof that.opts.buttonclick== "function"){
                        	try{
                        		that.opts.buttonclick.call(subButton);
                        	}catch(e){
                        		aigovApp.nativeFunc.alert("目前暂不提供该方法!");  
                            }
                        }else{
                            //执行按钮事件
                        	aigovApp.utils.evalJavaScript(subButton.content,that.eventSource);                      
                        }
                        
                        //如果是单选框这样可以选中  notSelectCss没有出现选中的样式
                        if(that.opts.radiotype && !subButton.notSelectCss){
                            //加上选中的显示效果
                            $singleBttonList.children().removeClass('select');
                            $(this).addClass('select'); 
                            that.curSelBtn = subButton;           
                        }
                	}catch(e){
                		aigovApp.nativeFunc.alert("请登录!");
                	}
    
                });
            })(subButton);
        }
             
    };
    
    
    /**
     *获取组件中的按钮列表 
     *@renturn 返回按钮列表对象
     */
    ButtonList.prototype.getButtonList= function(){
        return this.buttonList;
    };

    /**
     *获取组件中的按钮列表 
     * @return 返回当前选中的按钮对象
     */
    ButtonList.prototype.getCurSelBtn= function(){
        return this.curSelBtn;
    };
    
	function SingleButton($dom, id, name, content, picture, pictureSelected, style,notSelectCss){
        
        this.$dom = $dom;
        
        this.name = name;
        
        this.id = id;
        
        this.content = content;
        
        this.picture = picture;
        
        this.pictureSelected = pictureSelected;
        
        this.style = style;
        
        this.notSelectCss = notSelectCss;
    }
	//模块对外提供的公共方法
	var exportsMethods = {

		/**
		 * 新建一个实例
		 * @param {Object} opts 外部传入的参数
		 * @return {TypeName} 实例对象
		 */
		getInstance : function(opts){
			return new ButtonList(opts);
		}
	};
		
	module.exports = exportsMethods;
});
