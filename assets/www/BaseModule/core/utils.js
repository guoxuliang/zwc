/**
 * 工具类的js
 * 
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){
	
	var $ = jQuery;
	
	//图片显示框dom结构
	var $phoneBox=$('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" id="ai-phone"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div>\</div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
	//加载圈dom结构
	var $loading = $("<div class='weui_loading_toast'><div class='weui_mask_transparent'></div>" +
			"<div class='weui_toast'><div class='weui_loading'>" +
			"<div class='weui_loading_leaf'></div>" +
			"</div><p class='weui_toast_content'>正在加载</p></div></div>");
	
	var $screen = $("<div class='weui_loading_toast'><div class='weui_mask_transparent'></div></div>");
	
	//加载圈打开标记
	var loadingFlag = false;
	
	//屏蔽打开标记
	var screenFlag = false;
	
	//模块对外提供的方法
	var exportsMethods =  {
			
			/**
			 * 根据url获取json形式的参数对象
			 * @param url 要获取的url字符串，不传该字段则使用浏览器地址
			 * @returns paramJson {object} json形式的参数对象
			 */
			getParamJsonByUrl : function(url){

				var paramJson = {};
				
				var paramStr = url;
				if(!url||""===url){
                    //获得参数字符串
                    paramStr = window.location.search.slice(1);				    
				}

				
				var paramStrArr = paramStr.split("&");
				for(var i=0; i<paramStrArr.length; i++){
					var index = paramStrArr[i].indexOf("=");
					
					//获取参数名
					var paramName = paramStrArr[i].slice(0, index);
					
					//获取参数值
					var paramValue = paramStrArr[i].slice(index+1);
					
					//组装对象
					paramJson[paramName] = paramValue;
				}
				
				return paramJson;
			},
	
			/**
			 *用户获取当前的url的指定参数
			 * @param name   要获取的参数名称
			 * @param url 要获取的url地址字符串，不传该字段则使用浏览器地址
			 * @return 返回获取的参数值
			 */
			getUrlParameter : function(name,url) {
				var params = null;
				if(url){
					url = url.replace(/~\$\*\$~/g,"&");  
					params = url.replace(/[^\?\&]*(\?|&)/,"").split('&');
				}else{
					var winUrl = window.location.search.slice(1);
					winUrl = winUrl.replace(/~\$\*\$~/g,"&");
					params = winUrl.split('&');
				}
				for (var i = 0; i < params.length; i++) {
					var temp = params[i].split("=");
					if (temp[0] == name) {
						//支持值里面有=，如&purl=id=123&，取出的值为id=123 mdf by jc 20110311
						return params[i].replace(/^[\w]*=/,"");
					}
				}
				return "";
			},

			/**
			 * 创建一个遮罩，然后延迟半秒消失，用于防止事件穿透
			 */
			mask : function(){
				var $mask = $('<div style="position:absolute; width:100%; height:100%; z-index:9999;"/>');
				$mask.appendTo("body");
				setTimeout(function(){
					$mask.remove();
				}, 500);
			},
			/**
			 *进行JS对象的深拷贝
			 * @param obj 要进行拷贝的JS对象
			 * @return 返回拷贝的对象 
			 */
			clone : function(obj) {
			    //如果不是对象结构，直接返回值
		        if (typeof (obj) != 'object' || obj == null)  
		            return obj;  
		  
		        var re = {};  
		        if (obj.constructor==Array)  
		            re = [];  
		  
		        //遍历每个子对象，递归进行调用拷贝
		        for ( var i in obj) {  
		            re[i] = this.clone(obj[i]);  
		        }  
		  
		        return re;  
		  
		    },
			

		 	/**
		 	 * 执行js脚本，会自动加载脚本的命名空间。如果要直接执行脚本，而不是用命名空间的方式，那么需要
		 	 * 在脚本前加上“directEval::”前缀，这样程序将直接执行脚本。
		 	 * @param js           要执行的js脚本
		 	 * @param eventSource  触发事件源
		 	 */
		 	evalJavaScript : function(js,eventSource) {
		 		
		 		if (typeof js == "undefined" || js == "")
		 			
		 			return true;
		 		
				if(!eventSource) eventSource = window;
				
	 			var that = this;
	 			
	 			//如果有直接执行的标志的话，那么直接执行
	 			if(js.indexOf('directEval::') == 0){
	 			    var jsExecute = js.slice(12);
	 			    return eval(jsExecute);
	 			}
	 			
	 			//以左括号分组
	 			var contentArr = js.split('(');
				
				//系统通用JS代码库 			
	 			var funclib = contentArr[0].split('.');
	 			
	 			//如果有点号分割，说明有命名空间
	 			if(funclib.length>1){
	 				var funclibString = funclib[0];
	 				
	 				var funcPath = funclibString;
	 				
	 				require.async(funcPath,function(ref){
	 					if(ref)
	 						window[funclibString] = ref;
	 					else
	 						return true;
	 					
	 					//若没有左括号或者右半部分是以右括号开头,则说明这个js方法没有参数,直接拼接一个右括号即可
	 					if(contentArr[1] == undefined || contentArr[1].indexOf(')') == 0){
							contentArr[1] = ')';
							
						//若有半部分的右括号不在第一个字符,则说明有参数,则在前面加个逗号
						}else if(contentArr[1].indexOf(')') != 0){
							contentArr[1] = ','+contentArr[1];
						}
						
	 					//解决按钮配置调用js参数有值，调用不到js方法
	 					//反转义替换为（小于号<、大于号>、与&、单引号'、双引号"）
						contentArr[1] = that.specialCharRep(contentArr[1]);
	 					
	 					//获取到JS方法
	 					var clickMethod = eval(contentArr[0]);
	 					
	 					//若是函数则利用call将事件源以及方法本身的参数进行传递
	 					if(typeof clickMethod === 'function'){
	 						eval('clickMethod.call(ref,eventSource'+contentArr[1]);
	 					}else{
	 						return eval(js);
	 					}
	 				});
	 			}else{//如果前面没有命名空间，直接调用
	 				js = that.specialCharRep(js);
	 				return eval(js);
	 			}
		 		
		 	},
		    /**
		     * 实体编号:（"&#60;"、"&#62;"、"&#38;"、"&#39;"、"&#34;"）反转义替换
		     * 为（小于号<、大于号>、与&、单引号'、双引号"）
		     */
		    specialCharRep : function(replaceStr) {
			   	 var returnStr = replaceStr;
			   	 if (returnStr) {
			   		 returnStr = returnStr.replace(/&#38;/g,"&");
			   		 returnStr = returnStr.replace(/&#60;/g,"<").replace(/&#62;/g,">")
										.replace(/&#39;/g,"\'").replace(/&#34;/g,"\"");
			   	 }
			   	 return returnStr;
		    },
		    
		    /**
		     * 对字符串中的组件标签的id添加前缀,防止冲突
		     * 如<div aigov-type=search id=search></div> 前缀为datalist
		     * 则处理之后 <div aigov-type=search id=datalist_search></div>
		     * @param htmlStr 要处理的字符串
		     * @param prefix  前缀
		     * @return 添加完前缀的HTML
		     */
		    addPrefix : function(htmlStr,prefix){
		    	
		    	prefix = prefix && prefix+'_' || '';
		    	
		    	var $htmlStr = $('<div/>').html(htmlStr);
				var $waType = $htmlStr.find('[aigov-type]');
				
				for(var i=0,len=$waType.length;i<len;i++){
					
					var oldId = $($waType[i]).attr('id');
					if(!oldId) continue;
						
					var id =  prefix + oldId;
					$($waType[i]).attr('id',id);
				}
				
				htmlStr = $htmlStr.html();
				
				return htmlStr;
		    },
		    
		    /**
			 * 转换格式 将 aigov-aa-bb 转换成 aaBb
			 * @param todoStr 待转换的字符串
			 * @return 转换后的字符串
			 */
			changeFormat : function(todoStr){
				
				if(!todoStr) return '';
				
				if(/^aigov-/ig.test(todoStr)){
					
					var strArr = todoStr.split('-');
					
					strArr[0] = '';
					
					for(var i=2,len=strArr.length;i<len;i++){
						strArr[i] = strArr[i].substring(0,1).toUpperCase()+strArr[i].substring(1,strArr[i].length);
					}
					return strArr.join('');
				}else{
					return todoStr;
				}
			},
			/**
			 * 移除空对象（json对象）
			 * @param jsonObj 要移除的json对象
			 */
			removeEmptyObj : function(jsonObj){
				
				if($.isEmptyObject(jsonObj)) return ;
				
				for(var key in jsonObj){
					if(jsonObj[key] === null || jsonObj[key] === undefined 
							|| jsonObj[key] === '' ){
						delete jsonObj[key];
					}else if($.isPlainObject(jsonObj[key])){
						
						if($.isEmptyObject(jsonObj[key])){
							delete jsonObj[key];
						}else{
							jsonObj[key] = this.removeEmptyObj(jsonObj[key]);
						}
					}
				}
				return jsonObj;
			},
			
			/**
			 * 打开加载圈
			 */
			openLoading : function(){
				
				if(!loadingFlag){
					$loading.appendTo("body");
					loadingFlag = true;
				}
			},
			
			/**
			 * 打开屏蔽层
			 */
			openScreen : function(){
				
				if(!screenFlag){
					$screen.appendTo("body");
					screenFlag=true;
				}
			},
			
			/**
			 * 打开图片
			 */
			openPhone:function(url){
				this.openLoading();
				if(!$("#ai-phone")[0]){
					$phoneBox.appendTo("body");
				}
				var pswpElement = $("#ai-phone")[0];
				 var items = [];
				 $("<img/>").attr("src", url).load(function() {
					 var pic_real_width, pic_real_height;
					 pic_real_width = this.width;
					 pic_real_height = this.height;
					 var item = {
				        src: url,
				        w: pic_real_width,
				        h:pic_real_height
				    }
					 items.push(item);
					 var options = {
					    index: 0 // start at first slide
					 };
					 var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
					 gallery.init();
					 this.closeLoading();
				 });
			},
			
			/**
			 * 关闭加载圈
			 */
			closeLoading : function(){
				
				if(loadingFlag){
					$loading.detach();
					loadingFlag = false;
				}
			},
			
			/**
			 * 关闭屏蔽层
			 */
			closeScreen : function(){
				if(screenFlag){
					$screen.detach();
					screenFlag=false;
				}
			},
			
			/**
             * 获取模板
             * @param map   模板对象
             * @param func  获取完成后的回调函数
             */
            getTemplate : function(map, func){
                
                var keyArr = [];
                
                //将模板压入数组中
                for(var i in map){
                    
                    keyArr.push(i);
                }
                
                //构造加载模板参数
                var other = {
                    type : "get",
                    dataType : "text"   
                };
                
                var getSingleTemplate = function(){
                    var key = keyArr.shift();
                    
                    if(key){
                        aigovApp.ajax(map[key].url, null, function(html){
                            
                            map[key].str = html;
                            
                            //循环获取下一个模板
                            getSingleTemplate();
                        }, other);
                    } else {
                        
                        if("function" === typeof func){
                            //获取模板完成，调用回调函数
                            func();
                        }
                    }
                };
                
                getSingleTemplate();
                
            }
		};
		module.exports = exportsMethods;
});
