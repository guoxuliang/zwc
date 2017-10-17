﻿/**
 * 与移动终端交互的工具类
 * 
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){
	
	//模块对外提供的方法
	var exportsMethods =  {
		
			/**
			 * 获取版本号信息
			 * @param versionFun 回调函数，参数为版本号，如1.0.11
			 */
			getVersion : function(versionFun){
       
                if(aigovApp.phone.type == "ANDROID"){//安卓
                    window.plugins.UpdatePlugin.getVersion(versionFun);
                }else if(aigovApp.phone.type == "IOS"){//ios
                    window.plugins.VersionPlugin.getVersion(versionFun);
                }
				
			},
			/**
			 * 弹出警告框
			 * @param String message 警告信息
			 * @param String duration 消息持续间隔，值为short或long，默认为short
			 */
			alert : function(message,duration){
				
				//关闭可能存在的加载圈
				aigovApp.utils.closeLoading();
				
				if(/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
					duration = duration || "short";
				    window.plugins.ToastPlugin.ShowToast(message,duration);
				}else{
					alert(message);
				};
			},
			
			/**
			 * 弹出确认框
			 * @param String message 对话框信息
			 * @param function confirmCallback 按下按钮后触发的回调函数，返回按下按钮的索引（1、2或3）
			 *					如：confirmCallback = function(buttonKey){
			 *						if(1==buttonKey)alert("确认");
			 *					}
			 * @param String title 对话框标题，可选项
			 * @param String buttonLabels 逗号分隔的按钮标签字符串（可选项，默认值为“确定,取消”）
			 */
			confirm : function(message,confirmCallback,title,buttonLabels){
				
				//关闭可能存在的加载圈
                aigovApp.utils.closeLoading();
                if(/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && navigator.notification){
					var _title = (title || "确认框");
					var _buttonLabels = (buttonLabels || ["确定","取消"]);
					navigator.notification.confirm(
					   	message,          // 显示信息
					   	confirmCallback,  // 按下按钮后触发的回调函数，返回按下按钮的索引
					   	_title,            // 标题
					    _buttonLabels    // 按钮标签
	   				);
				}else{
					if(confirm(message)){
						confirmCallback(1);
					} else {
						confirmCallback(2);
					}
				};
			},
			
			/**
			 * PhoneGap加载完毕后添加按钮事件，如搜索，返回，菜单键等
			 */
			deviceReady : function(){
				
				var isExist = false;
				
				var that = this;
				
				// 等待加载PhoneGap
				document.addEventListener("deviceready", onDeviceReady, false); 
				
				// PhoneGap加载完毕
				function onDeviceReady() {
					//按钮事件
					document.addEventListener("backbutton", eventBackButton, false); //返回键
				}
				
				//返回键
				function eventBackButton(){
					
					//触发返回功能
					if(aigovApp.back()){
						return;
					}
					if(isExist) {
						navigator.app.exitApp();
						// 表示系统已经退出,推送的条数设为空
						window.plugins.FileUtilsPlugin.writeFile("count", "0");
						return;
					}
					that.alert('再按一次返回键关闭程序');
					isExist = true;
					
					//3秒后
					var intervalID = window.setInterval(function() {
						window.clearInterval(intervalID);
						isExist = false;
					},3000);
				}
			},
			
			/**
			 * 设备初始化--private
			 */
			phoneInit : function(){
			    
                var initFileSystem = function(){
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
                        function(fileSystem){
                            //初始化文件下载的根路径
                            aigovApp.phone.fileRoot = fileSystem.root.fullPath;
                        }, 
                        function(error){ 
                            console.log(error.code);
                        }
                    );
                };
				
				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    aigovApp.phone.type = "IOS";
                    if(window.cordova){
                    	initFileSystem();
                    }
				}else if(/(Android)/i.test(navigator.userAgent)){
				                
                    aigovApp.phone.type = "ANDROID";
                    if(window.cordova){
                    	initFileSystem();
                    	this.deviceReady();
                    }
				}else{
					aigovApp.phone.type = "OTHER";
				}
			},
			/**
			 * 获取网络连接状态
			 * @returns Connection.UNKNOWN\ETHERNET\WIFI\CELL_2G\CELL_3G\CELL_4G\NONE
			 */
			getConnectionType : function(){
				var networkState = navigator.network.connection.type;
				return networkState ;
			},
			
			/**
			 * 测试网络连接
			 * callback 回调
			 */
			checkConnection : function(callback) {
				if(!navigator.network){
					return true;
				}
		    	var networkState = navigator.network.connection.type;
		    	//有回调则返回当前网络状态以及所有网络类型,由外部自己定义要怎么处理
		    	if(typeof callback === 'function'){
		    		callback(networkState,Connection);
		    	}else{//没有回调则默认只判断是不是无网络状态,无网络状态则做出提示,且关闭加载中
		    		 var states = {};
		        
			        //TODO 其他用途 暂时没用到
			        states[Connection.UNKNOWN]    = '未知的网络连接';
			        states[Connection.ETHERNET]   = '以太网网络连接';
			        states[Connection.WIFI]       = '无线网络连接';
			        states[Connection.CELL_2G]    = '2G网络连接';
			        states[Connection.CELL_3G]    = '3G网络连接';
			        states[Connection.CELL_4G]    = '4G网络连接';
			        states[Connection.NONE]       = '无网络连接';
					
					if(networkState === Connection.NONE){
						 return false;
					}
					return true;
		    	}
		     },
			
			/**
			 * 进入后台下载
			 * @param String url 文件下载路径
			 * @param String path  文件下载路径
			 * @param String name  文件名
			 * @param int size  文件大小
			 */
			startBackGoundDownload : function(url,path,name,size){
				//TODO 省略文件大小的参数，在后台用is.available()调用
				//判断是否为wifi状态下
				var connType = this.getConnectionType();
				//wifi状态下
				if(connType != Connection.WIFI){
					this.confirm("当前非wifi状态，是否确定下载？", function(buttonKey){
						if( 1== buttonKey){
							window.plugins.FileUtilsPlugin.startBackGoundDownload(url,path,name,size);
						}else{
							aigovApp.utils.closeLoading();
						}
					});
				}else{
					window.plugins.FileUtilsPlugin.startBackGoundDownload(url,path,name,size);
				}
			},
			
			/**
			 * 打开文件（Android可用）
			 * @param String path  文件路径
			 */
			openFile : function(path){
				window.plugins.FileUtilsPlugin.openFile(path);
			},
			
			/**
			 * 预览或打开文件（可预览的文件直接预览，反之选择应用程序打开--IOS可用）
			 * @param Funtion success 成功的回调函数
			 * @param Funtion fail 成功的回调函数
			 * @param String path  文件路径
			 */
			previewDocument : function(success,fail,path){
				window.plugins.FilePlugin.previewDocument(success, fail, path);
			},
			
			/**
	        *
	        * @param Funtion success 成功的回调函数
	        * @param Funtion fail 成功的回调函数
	        * @param String key
	        */
	       getPublicData : function(success,fail,key){
	            window.plugins.FilePlugin.getPublicData(success, fail, key);
	       },
			
			/**
			 * 获取文件状态
			 * @param Funtion success 回调函数,参数为文件状态值0：原始状态 1：文件正在下载中 2：文件已存在
			 * @param String url 文件下载源的路径
			 * @param String path  文件下载到本地终端的路径
			 * @param String name  文件名
			 * @param int size  文件大小
			 */
			getFileState : function(success,url,path,name,size){
				//TODO fileSize可以去掉
				window.plugins.FileUtilsPlugin.getFileState(success,url,path,name,size);
			},
			
	    	/**
			 * 打开附件(适用于IOS和Android)
			 * @param FileEntry fileEntry phoneGap的FileEntry对象
			 */
			openFileFacade : function(fileEntry){
				var that = this;
				//文件存在直接打开
				var fullpath = fileEntry.fullPath;
				fileEntry.file(function(curFile){
					if(curFile.size == 0){
						that.alert("文件不存在!");
						fileEntry.remove();
						return;
					}else{
						if(aigovApp.phone.type == "ANDROID"){//安卓
	                        that.openFile(fullpath);
	                    }else if(aigovApp.phone.type == "IOS"){//ios
	                        that.previewDocument(null, null, fullpath);
	                    }
					}
				});
			},
			/**
			 * WPS文档打开操作
			 * @param fileName
			 * @param fileUrl
			 * @param fileSize
			 */
			wpsFileOpen:function(fileName,fileUrl,fileSize,id,appid){
				var downloadPath = aigovApp.phone.fileRoot + "/" + aigovApp.constants.DOWNLOAD_PATH;//文件实际下载路径
				var localFile = aigovApp.constants.DOWNLOAD_PATH+"/"+fileName;//文件相对下载路径，相对于phonegap根路径
				//文件状态：0-从未下载过  1-文件 已存在 2-文件在下载中
				var fileState = 0;
				
				var that   = this;
				
				var success = function(data){
					fileState = data;
					if(fileState == 0 || fileState == 1){//开始下载
						var uploadUrl=aigovApp.constants.UploadFile.UPLOAD_URL+"?id="+unid+"&appid="+appid;
						exportsMethods.downloadAndOpenFile(fileName, fileUrl,fileSize,true,uploadUrl);
					}else if(fileState == 2){//文件在下载中
						window.plugins.FileUtilsPlugin.openDownloadList();
					}
				};
				
				//TODO fileSize可以去掉
				that.getFileState(success,fileUrl,downloadPath,fileName,fileSize);
			},
			/**
			 * ios和android不同终端下的文件处理(适用于IOS和Android)
			 * @param String fileName 文件名
			 * @param String fileUrl  文件下载路径
			 * @param int fileSize  文件大小
			 */
			handleFileFacade : function(fileName,fileUrl,fileSize){
				if(aigovApp.phone.type == "ANDROID"){//安卓
					this.handleFileByState(fileName,fileUrl,fileSize);
                }else if(aigovApp.phone.type == "IOS"){//ios
                	this.downloadAndOpenFile(fileName,fileUrl,fileSize);
                }
			},
			
			/**
			 * 根据文件状态处理点击文件的事件，一共有三种情况：
			 * 文件状态为0：该文件从未下载过，点击进入后台下载
			 * 文件状态为1：该文件已经存在，点击直接打开
			 * 文件状态为2：改文件正在下载，点击打开下载进度
			 * @param String fileName 文件名
			 * @param String fileUrl  文件下载路径
			 * @param int fileSize  文件大小
			 */
			handleFileByState : function(fileName,fileUrl,fileSize) {
				
				var downloadPath = aigovApp.phone.fileRoot + "/" + aigovApp.constants.DOWNLOAD_PATH;//文件实际下载路径
				var localFile = aigovApp.constants.DOWNLOAD_PATH+"/"+fileName;//文件相对下载路径，相对于phonegap根路径
				//文件状态：0-从未下载过  1-文件 已存在 2-文件在下载中
				var fileState = 0;
				
				var that   = this;
				
				var success = function(data){
					fileState = data;
					if(fileState == 0 || fileState == 1){//开始下载
						privateMethods.downloadBySize(fileUrl,downloadPath,fileName,fileSize);
					}else if(fileState == 2){//文件在下载中
						window.plugins.FileUtilsPlugin.openDownloadList();
					}
				};
				
				//TODO fileSize可以去掉
				that.getFileState(success,fileUrl,downloadPath,fileName,fileSize);
	    	},
	    	
		    /**
			 * 直接下载并打开附件,若文件存在则直接打开，不存在则下载
			 * @param String fileName 文件名
			 * @param Sstring fileUrl  文件下载路径
			 * @param boolean isWps 是否用WPS操作
			 */
			downloadAndOpenFile : function(fileName,fileUrl,fileSize,isWps,uploadUrl) {
				
				//进度条处理
				aigovApp.utils.openLoading();
				var that = this;
				
	        	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){ 
	        
		        	var directoryRoot = aigovApp.constants.DOWNLOAD_ROOT;
		        	var downloadPath = aigovApp.constants.DOWNLOAD_PATH;
		        	var _localFile = downloadPath+"/"+fileName;
		        	
					//创建目录
					fileSystem.root.getDirectory(directoryRoot, {create:true});
					fileSystem.root.getDirectory(downloadPath, {create:true});
					
					 //查找文件,如果不存在则创建该目录。
					fileSystem.root.getFile(_localFile, null,
						function(fileEntry){
							//关闭加载中
							aigovApp.utils.closeLoading();
							if(isWps){
								window.plugins.WpsPlugin.open({path:fileEntry.fullPath,SendSaveBroad:true,SendCloseBroad:true,uploadUrl:uploadUrl});
							}else{
								that.openFileFacade(fileEntry);
							}
							
						},
						function(){ 
			                fileSystem.root.getFile(_localFile, {create:true}, 
			                	function(fileEntry){
			                	
				                	//判断是否为wifi状态下
									var connType = that.getConnectionType();
									//wifi状态下
									if(connType != Connection.WIFI){
										that.confirm("当前非wifi状态，是否确定下载？", function(buttonKey){
											if( 1== buttonKey){
												privateMethods.downloadDirect(fileSize,fileUrl,fileEntry);
											}else{
												fileEntry.remove();
												aigovApp.utils.closeLoading();
											}
										});
									}else{
										privateMethods.downloadDirect(fileSize,fileUrl,fileEntry);
									}
								                    	 
				                 },function(error){  
				                    console.log("下载错误");
				                 });  
							});	
			
				}, function(evt){
					console.log("加载文件系统出现错误");
				}); 
	    	},
	    	 /**
			 * 下载图片
			 * @param String fileName 图片文件名
			 * @param String fileUrl  图片下载路径
			 * @param String imgPath  图片载路径
			 * @param Object $img  页面上渲染图片的dom对象
			 */
			downloadImg : function(fileName,fileUrl,imgPath,$img) {
				//lbsp.utils.openLoading();
	        	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){ 
	        
	        		var constants = aigovApp.constants;
		        	var directoryRoot = constants.DOWNLOAD_ROOT;
		        	var imgRootPath = constants.IMG_PATH;
		        	var personPhotoRoot = constants.DOWNLOAD_ROOT + "/userphoto";
		        	var _localFile = imgPath+"/" + fileName;
	
					//创建目录
					fileSystem.root.getDirectory(directoryRoot, {create:true});
					fileSystem.root.getDirectory(imgRootPath, {create:true});
					fileSystem.root.getDirectory(personPhotoRoot, {create:true});
					fileSystem.root.getDirectory(imgPath, {create:true});
					 //查找文件,如果不存在则创建该目录。
					fileSystem.root.getFile(_localFile, null,
						function(fileEntry){
							$img.attr("src",fileEntry.fullPath+"?"+Math.random());
							//关闭加载中
							aigovApp.utils.closeLoading();
						},
						function(){ 
			                fileSystem.root.getFile(_localFile, {create:true}, 
			                	function(fileEntry){  
			                   	 	var targetUrl = fileEntry.fullPath;  
			                    	var fileTransfer = new FileTransfer(); 
									var uri = encodeURI(fileUrl);  
									fileTransfer.download(uri,targetUrl,
										function(entry){ 
											$img.attr("src",entry.fullPath+"?"+Math.random());
											//关闭加载中
											aigovApp.utils.closeLoading();
										},function(error){
											//删除空文件
											fileEntry.remove();
											$img.attr("src",constants.ERROR_IMG_PATH);
											console.log("下载网络图片出现错误");
											//关闭加载中
											aigovApp.utils.closeLoading();
										});  
								                    	 
				                 },function(error){  
				                	console.log(error.code);
				                	$img.attr("src",constants.ERROR_IMG_PATH);
									//关闭加载中
				                	aigovApp.utils.closeLoading();
				                 });  
							});	
			
				}, function(evt){
					//关闭加载中
					aigovApp.utils.closeLoading();
					console.log("加载文件系统出现错误");
				}); 
	    	},
	    	
	    	/**
			 * 显示通知
			 * @param isNotice 是否要通知
			 */
			 noticeCheck : function(isNotice) {
			 	if(aigovApp.phone.type == "ANDROID"){//安卓
	        		// 获取当前用户标识
					var userId = aigovApp.session.getSession().user.userId;
					if(isNotice) {
						window.plugins.FileUtilsPlugin.writeFile("userId", userId);
					} else {
						window.plugins.FileUtilsPlugin.writeFile("userId", "");
					}
					
					// 每个用户对应通知配置
					window.plugins.FileUtilsPlugin.writeFile(userId, isNotice);
	            }
			 },
			 
			 /**
			 * 注销用户
			 */
			 userLogout : function() {
			 	if(aigovApp.phone.type == "ANDROID"){//安卓
			 		// 注销后表示当前没有登录的用户信息
					window.plugins.FileUtilsPlugin.writeFile("userId", "");
					// 关闭通知栏
					window.plugins.FileUtilsPlugin.closeNotification();
					// 通知条数设置为0
					window.plugins.FileUtilsPlugin.writeFile("count", 0);
			 	}
			 }
		};
	
		//模块私有方法
		var privateMethods = {
			
			downloadBySize : function(fileUrl,downloadPath,fileName,fileSize){
				if(fileSize - 3*1024*1024 <=0){//附件小于3m，直接进入下载
					exportsMethods.downloadAndOpenFile(fileName, fileUrl,fileSize);
				}else{
					exportsMethods.startBackGoundDownload(fileUrl,downloadPath,fileName,fileSize);
				}
			},
			
			downloadDirect : function(fileSize,fileUrl,fileEntry){
    
				if(fileSize - 5*1024*1024 <=0){//附件小于5m，直接进入下载
					var targetUrl = fileEntry.fullPath;  
		        	var fileTransfer = new FileTransfer(); 
					var uri = encodeURI(fileUrl);
					fileTransfer.download(uri,targetUrl,
						function(entry){ 
							//关闭加载中
							aigovApp.utils.closeLoading();
							exportsMethods.openFileFacade(entry);
						},function(error){
							//删除空文件
							fileEntry.remove();
							console.log("下载错误");
							//关闭加载中
							aigovApp.utils.closeLoading();
						});  
				}else{
					exportsMethods.alert("IOS大附件下载功能稍后推出，敬请期待!");
					//删除空文件
					fileEntry.remove();
					//关闭加载中
					aigovApp.utils.closeLoading();
				}
	       	 	
			}
		};
		module.exports = exportsMethods;
});
