/**
 * ajax模块
 * @author keyz@aigov.com
 * @since 2016-05-25
 */
define(function(require, exports, module){
	
	//加载工具模块
	var utils = require("utils");
	
	var $ = jQuery;
	
	
	module.exports = {
		
		/**
		 * ajax请求
		 * @param url 请求地址，字符串
		 * @param data 要传递的json数据
		 * @param success(response, textStatus, jqXHR) 请求成功后的回调函数
		 * 		response ： 响应数据
		 * 		textStatus ： 状态字符串
		 *  	jqXHR ： jQuery的jqXHR对象
		 * @param other:{ 其他的一些回调函数
		 * 		timeout 请求超时毫秒数，默认为20000
		 * 		async 是否异步请求，默认为true
		 * 		dataType 响应返回数据的数据类型，默认为"json"
		 * 		type 请求方式，默认为"post"
		 * 		complete : function(jqXHR, textStatus) 请求完成，收到响应后触发，无论请求成功或失败
		 * 		error ： function(jqXHR, textStatus) 请求失败是触发
		 * 		onTimeout ： function(jqXHR, textStatus) 请求超时时触发
		 * 		localOpt{ 请求数据,根据配置决定是取数据的方式
		 * 				  离线情况下,直接请求本地（不管任何配置）
		 * 				  1、优先从本地取，本地没有再请求服务器，且请求之后存在本地
		 * 				  2、直接请求服务器,且请求之后存在本地
		 * 				  3、传统的直接请求服务,且不存本地 
		 * 			tableName string 要请求的表名 必传
		 * 			curPageCount int 当前页数 可为空 默认取全部
		 * 			perPageCount int 每页显示几条 可为空 默认取全部
		 * 			orderByCloums Array 要进行排序的字段 格式为 ['column1 desc','column2']
		 * 			whereStr string 额外的查询条件 可为空
		 * 			priKey  string 主键名称 必传
		 * 			sql     string 完整的查询语句 若有值,则其他字段全无效,除非在本地无法找到数据,
		 * 						   则请求服务端,此时服务端返回的数据需要保存到本地,这时才用到以上的信息
		 *		}
		 * 	}
		 */
		ajax : function(url, data, success, setting){
			var that      = this,
				isOffline = localStorage.getItem('isOffline'),
				localOpt  = setting ? setting.localOpt : null,
				isDirectRequest = setting ? setting.isDirectRequest : null;
			
			if(!isOffline){
				localStorage.setItem('isOffline',false);
				isOffline='false';
			}
			//请求的是物理文件
			if(url.indexOf(".html")>=0 || url.indexOf(".json")>=0){
				
				that.ajaxServer.apply(that,arguments);
				
			}else if(isOffline === 'false' ){//非离线状态
			
				//非直接请求,且有本地获取数据的参数
				if(!isDirectRequest && localOpt && !($.isEmptyObject(localOpt))){
					that.getDataFromLocal.apply(that,arguments);
				} else {//直接请求
					that.ajaxServer.apply(that,arguments);
				}
				
			//离线状态,且有设置从本地取数据的参数
			}else if((localOpt && !$.isEmptyObject(localOpt)) || !url){
				
				that.getDataFromLocal.apply(that,arguments);
				
			//若什么都没有,则直接回调
			}else if(typeof success === 'function'){
				success(that.getResultTempObj());
			}else{
				aigovApp.utils.closeLoading();
			}
		},
		
		/**
		 * ajaxForm请求
		 * 
		 * @param form 表单对象
		 * @param url 请求地址，字符串
		 * @param data 要传递的json数据
		 * @param success(response, textStatus, jqXHR) 请求成功后的回调函数
		 * 		response ： 响应数据
		 * 		textStatus ： 状态字符串
		 *  	jqXHR ： jQuery的jqXHR对象
		 * @param setting:{ 其他的一些回调函数
		 * 		timeout 请求超时毫秒数，默认为20000
		 * 		async 是否异步请求，默认为true
		 * 		dataType 响应返回数据的数据类型，默认为"json"
		 * 		type 请求方式，默认为"post"
		 * 		complete : function(jqXHR, textStatus) 请求完成，收到响应后触发，无论请求成功或失败
		 * 		error ： function(jqXHR, textStatus) 请求失败是触发
		 * 		onTimeout ： function(jqXHR, textStatus) 请求超时时触发
		 *		}
		 * 	}
		 */
		ajaxForm:function(form,url,data,success,setting){
			setting = setting || {};
			var obj;
			
			if(typeof form ==='string'){
				obj=$("#"+form);
			}else{
				obj=form;
			}

			var jsessionid = aigovApp.session.getSession().id || "";
			
			//进行url转换，以保证进行native端的ajax调用
			var urlTrans = function(urlStr){
				var resultUrl;
				var jsessionPrefix = "";
				if(jsessionid){
					jsessionPrefix = ";jsessionid=";
				}
				if(-1 != urlStr.indexOf("?")){
					var arr = urlStr.split("?");
					resultUrl = arr[0] + jsessionPrefix + jsessionid + "?" + arr[1];
				} else {
					resultUrl = urlStr + jsessionPrefix + jsessionid;
				}
				return resultUrl;
			};
			
			url = urlTrans(url);
			

			if(undefined === setting.async){
				setting.async = true;
			}
			
			if(undefined === setting.timeout){
				setting.timeout = 120000;
			}
			
			if(undefined === setting.dataType){
				setting.dataType = "json";
			}
			
			if(undefined === setting.type){
				setting.type = "post";
			}
			
			
			var ajaxOpt = {
				url : url,
				async : setting.async,
				timeout : setting.timeout,
				data : data,
				cache:true,
				dataType : setting.dataType,
				type : setting.type,
				processData: setting.processData,
				complete : function(jqXHR, textStatus){
					
					if(undefined !== setting.complete){
						setting.complete(jqXHR, textStatus);
					}
					
					switch (textStatus) {
					case "success":		//成功时
						
						if(undefined !== success){
							
							var response;
							
							var responseText = jqXHR.responseText;
							
							//根据数据格式的不同，将相应数据转化为对应格式
							switch (setting.dataType) {
							
								case "json":
									
									response = $.parseJSON(responseText);
									
									break;
									
								case "xml":
									
									response = $.parseXML(responseText);
									
									break;
									
								case "html":
									
									response = responseText;
									
									break;
									
								default:
									
									response = responseText;
									
									break;
							}
							
							//保存到本地的标志为true且取数据的参数不为空,则将数据保存到本地
							var localOpt = setting.localOpt;

							if( localOpt && !($.isEmptyObject(localOpt))){
								
								if(!response.success) {
									if(typeof success === 'function'){
										success(response, textStatus, jqXHR);
									}
									return;
								}
								var contents = response.content;
								
								//将数据存到本地数据库
								var storageAssist = require('storageAssist'); 
								storageAssist.saveDataToLocal(localOpt.tableName,localOpt.priKey,contents,function(){
	
									if(typeof success === 'function'){
										success(response, textStatus, jqXHR);
									}
								});
							}else if(typeof success === 'function'){
								success(response, textStatus, jqXHR);
							}
						}
						
						break;
						
					case "error":		//错误时
						
						//关闭可能开启的加载圈
						utils.closeLoading();
						
						if(undefined !== setting.error){
							setting.error(jqXHR, textStatus);
						}
						
						break;
					case "timeout":		//请求超时时
						
						if(undefined !== setting.onTimeout){
							setting.onTimeout(jqXHR, textStatus);
						} else {
							aigovApp.nativeFunc.confirm("请求超时，是否重新发送？", function(state){
								if(1 === state){
									that.ajaxForm(form,url,data,success,setting);
								}
							});
							
						}
						
						break;
					default:
						break;
					}
					
				}
			};
			
			obj.ajaxSubmit(ajaxOpt);
		},
		/**
		 * 从本地获取数据，本地没有再请求服务器
		 * 参数说明参考ajax方法
		 */
		getDataFromLocal : function(url, data, success, setting){
			
			var that = this,
				localOpt  = setting.localOpt,
				tableName = localOpt.tableName,
				curPageCount = localOpt.curPageCount || 0,
				perPageCount = localOpt.perPageCount || 0,
				orderByCloums= localOpt.orderByCloums,
				whereStr     = localOpt.whereStr || '',
				whereStrTemp = ' '+whereStr + ' ',
				sql          = localOpt.sql;
			
			//查询成功的回调函数
			var successFun = function(contents){
				
				var isOffline = localStorage.getItem('isOffline');
				
				//说明本地有数据,直接调用回调数据
				if(contents && contents.length>0){
					
					//TODO组装成和后台的格式一样,否则无法共用同一个回调函数
					var result = that.getResultTempObj(true,contents);
					success(result);
					
				} else if(!sql && isOffline === 'false'){//本地数据库没有数据,且不是离线状态 则请求服务端
					that.ajaxServer(url, data, success, setting);
					
				} else if(typeof success === 'function'){//本地没数据，又是离线状态,则直接回调
					var result = that.getResultTempObj(true);
					success(result);
				}
			};
			
			var storageAssist = require('storageAssist');
			
			//sql语句为空,则需要进行拼接
			if(!sql){
			
				//排序
				if(orderByCloums && $.isArray(orderByCloums) && orderByCloums.length>0){
					
					whereStrTemp += ' ORDER BY '+orderByCloums.join(',');
				}
				
				//分页
				if(curPageCount>=1 && perPageCount >=1){
					whereStrTemp += ' limit '+perPageCount+' offset '+(curPageCount-1)*parseInt(perPageCount);
				}
				
				//从本地数据库中取数据,取不到则请求服务器
				storageAssist.getDataFromLocal(tableName,whereStrTemp,successFun);
			}else{
				
				//有完整的sql语句则直接调用查询方法
				storageAssist.doQuery(sql,successFun);
			}
		},
		
		/**
		 * 向后台请求，没有缓存处理，参数同ajax方法，没有other.localOpt参数
		 */
		ajaxServer : function(url, data, success, other){
			
			other = other || {};
			
			var that = this;
			
			////////////
			//TODO 暂时放这里
			var jsessionid = aigovApp.session.getSession().id || "";
			
			//进行url转换，以保证进行native端的ajax调用
			var urlTrans = function(urlStr){
				
				var resultUrl;
				
				var jsessionPrefix = "";
				if(jsessionid){
					jsessionPrefix = ";jsessionid=";
				}
				if(-1 != urlStr.indexOf("?")){
					var arr = urlStr.split("?");
//						resultUrl = urlStr + jsessionPrefix + jsessionid;
					resultUrl = arr[0] + jsessionPrefix + jsessionid + "?" + arr[1];
				} else {
					resultUrl = urlStr + jsessionPrefix + jsessionid;
				}
//					resultUrl = urlStr + jsessionPrefix + jsessionid;
				return resultUrl;
			};
			
			if(-1 == url.indexOf(".html") && -1 == url.indexOf(".json")){
				url = urlTrans(url);
			}
			
			//////////////
			
			if(undefined === other.async){
				other.async = true;
			}
			
			if(undefined === other.timeout){
				other.timeout = 120000;
			}
			
			if(undefined === other.dataType){
				other.dataType = "json";
			}
			
			if(undefined === other.type){
				other.type = "post";
			}
			
			var ajaxOpt = {
				url : url,
				async : other.async,
				timeout : other.timeout,
				data : data,
				dataType : other.dataType,
				type : other.type,
				processData: other.processData,
				complete : function(jqXHR, textStatus){
					
					if(undefined !== other.complete){
						other.complete(jqXHR, textStatus);
					}
					
					switch (textStatus) {
					case "success":		//成功时
						
						if(undefined !== success){
							
							var response;
							
							var responseText = jqXHR.responseText;
							
							//根据数据格式的不同，将相应数据转化为对应格式
							switch (other.dataType) {
							
								case "json":
									
									response = $.parseJSON(responseText);
									
									break;
									
								case "xml":
									
									response = $.parseXML(responseText);
									
									break;
									
								case "html":
									
									response = responseText;
									
									break;
									
								default:
									
									response = responseText;
									
									break;
							}
							
							//保存到本地的标志为true且取数据的参数不为空,则将数据保存到本地
							var localOpt = other.localOpt;

							if( localOpt && !($.isEmptyObject(localOpt))){
								
								if(!response.success) {
									if(typeof success === 'function'){
										success(response, textStatus, jqXHR);
									}
									return;
								}
								var contents = response.content;
								
								//将数据存到本地数据库
								var storageAssist = require('storageAssist'); 
								storageAssist.saveDataToLocal(localOpt.tableName,localOpt.priKey,contents,function(){
	
									if(typeof success === 'function'){
										success(response, textStatus, jqXHR);
									}
								});
							}else if(typeof success === 'function'){
								success(response, textStatus, jqXHR);
							}
						}
						
						break;
						
					case "error":		//错误时
						
						//关闭可能开启的加载圈
						utils.closeLoading();
						
						if(undefined !== other.error){
							other.error(jqXHR, textStatus);
						}
						
						break;
					case "timeout":		//请求超时时
						
						if(undefined !== other.onTimeout){
							other.onTimeout(jqXHR, textStatus);
						} else {
							aigovApp.nativeFunc.confirm("请求超时，是否重新发送？", function(state){
								if(1 === state){
									that.ajaxServer(url, data, success, other);
								}
							});
							
						}
						
						break;
					default:
						break;
					}
					
				}
			};
			//调用jQuery的ajax方法
			$.ajax(ajaxOpt);
		},
	     /**
          * 获取结果数据模版对象,和后台的格式相关
          * isSuccess 是否是成功的结果
          * content 要返回的数据
          */
         getResultTempObj : function(isSuccess,content){
            var message = '';
            if(!isSuccess){
                isSuccess = false;
                message = '当前处于离线状态,无法获取数据';
            }else{
                isSuccess = true;
            }
            var result = {
                success : isSuccess,
                message : message,
                content : content
            };
            return result;
         },
		/**
		 * 请求加载本地html页面
		 * @param string 本地页面地址，String字符串
		 * @param $parent 页面容器，jQuery对象
		 * @param func(isSuccess) 请求响应后的回调函数，如果请求成功
		 * 		isSuccess ： 请求成功则为true，失败为false，如果url为空则为undefined
		 */	
		loadHtml : function(url, $parent, func){
			
			var that = this;
			
			if(!url){		//如果url为空值，则直接触发回调
				
				if("function" === typeof func){
					func();
					return;
				}
			}
			
			//调用ajax请求
			that.ajax(url, null, function(response, jqXHR){
				
				//容器填充内容
				$parent.append($.parseHTML(response));
				
				if("function" === typeof func){
					func(true);
				}
				
			}, {
				dataType : "html",
				type : "get",
				
				error : function(){
					
					//请求失败时调用
					if("function" === typeof func){
						func(false);
					}
				}
			});
		},
		
		/**
		 * 请求加载本地css
		 * @param url 本地css文件的地址，可为字符串也可为字符串数组，如果为字符串数组则加载多个css
		 * @param $parent 将css加载在何处，jQuery对象
		 * @param func() css加载后的回调函数
		 */
		loadCss : function(url, $parent, func){
			
			if(!url){		//如果css为空，则直接回调
				
				if("function" === typeof func){
					func(null);
					return;
				}
			}
			
			if("object" === typeof url){	//如果url为数组，则循环加载css
				
				var num = url.length;
				
				for(var i=0; i<url.length; i++){
					
					loadSingleCss(url[i], $parent, function(){
						
						num--;
						
						if(0 === num){
							if("function" === typeof func){
								
								func();
							}
						}
					});
				}
				
			} else {		//如果url为字符串，则只需加载一个
				
				loadSingleCss(url, $parent, function(){
					
					if("function" === typeof func){
						
						func();
					}
				});
			}
		}
	};
	
	/**
	 * 加载一个本地css文件
	 * @param url 本地css文件的地址，字符串
	 * @param $parent 将css加载在何处，jQuery对象。该jQuery对象必须在页面上。
	 * @param func() css加载后的回调函数
	 */
	function loadSingleCss(url, $parent, func){
		
		//如果已经加载过该css文件，则不再重复加载
		if(0 === $("head link[href='"+url+"']").length){
			
			//创建一个link标签
			var $link = $("<link type='text/css' rel='stylesheet' href='"+url+"'>");
			
			$parent.append($link);
			
			/**
			 * 通过递归尝试读取link标签的sheet属性，如果不为空，则说明css加载成功
			function poll() {
			    if ($link[0]['sheet']) {
			        
			    	if("function" === typeof func){
						func();
					}
			    } else {
			    	setTimeout(function() {
			    		poll();
			    	}, 50);
			    }
			}
			poll();*/
			
			if("function" === typeof func){
				func();
			}
		} else {
			
			if("function" === typeof func){
				func();
			}
		}
	}
});