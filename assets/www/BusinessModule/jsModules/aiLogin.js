/**
 * 登陆界面的js
 * @author keyz@asiainfo.com
 */
;define(function(require, exports, module){

	//窗口模块
	var appWindow = require("appWindow");

	//模块对外提供的公共方法
	var exportsMethods = {

		/**
		 * 用户名密码数据验证
		 * @param password 密码
		 */
		validate : function(username,password){
			//验证用户是否有绑定
			if("" == username){
				aigovApp.nativeFunc.alert("用户名不能为空！");
				return false;
			} else if("" == password){
				aigovApp.nativeFunc.alert("密码不能为空！");
				return false;
			} /**else if(username.length != 11){
				aigovApp.nativeFunc.alert("手机号格式不正确");
				return false;
			} */else {
				return true;
			}
		},

		 /**
         * 设置推送消息
         */
        setPushConfig : function(){

          //暂时只针对IOS系统进行消息设置，Android采用广播方式
          if(aigovApp.phone.type=="IOS"){
	        	aigovApp.nativeFunc.getPublicData(function(channelID){
	                   aigovApp.nativeFunc.getPublicData(function(userID){
                              var url = aigovApp.constants.otherConfigProperties.SET_IOS_CONFIG;
                              aigovApp.ajax(url,{
                                           userID : userID,
                                           channelID:channelID
                                           },null, null);

                        },null,"mssUserID");

	             },null,"mssChannelID");
          }
        },

		/**
         * 清除推送消息
         */
        clearPushConfig : function(){

		      //暂时只针对IOS系统进行消息设置，Android采用广播方式
		      if(aigovApp.phone.type=="IOS"){

		              var url = aigovApp.constants.otherConfigProperties.CLEAR_IOS_CONFIG;
		              aigovApp.ajax(url,null,null, null);
		      }
        },

		/**
		 * 获取缓存的用户对象
		 * @return 获取缓存的用户对象
		 */
		getUsers : function(){

			//获取已登陆用户列表
			var storage = window.localStorage;
			var userArrStr = storage["loginUsers"];
			if(!userArrStr)
				return null;

			var userArr = eval("("+userArrStr+")");

			userArr = userArr.reverse();

			return userArr;

		},


		/**
		 * 删除用户
		 * @param username String 用户名
		 */
		deleteUser : function(username){
			//直接字符串替换去除要删除的用户名
			var storage = window.localStorage;

			var loginUsers = storage["loginUsers"];
			if(!loginUsers)
				return;

			var userArr = eval("("+loginUsers+")");


			for(var i=0,len=userArr.length; i<len; i++){
				//将存储的信息改为有保存密码的情况下，用户名和密码以逗号分隔。
				var strs = userArr[i].split(",");

				//找到用户名，将用户名删除
				if(username === strs[0]){
					userArr.splice(i,1);
					break;
				}

			}

			loginUsers = $.toJSON(userArr);

			//修改后的结果存回缓存中
			storage["loginUsers"] = loginUsers;

		},


	    /**
         * 将用户账户信息缓存在localStorage中
         * @param account  要保存的帐号的用户名密码信息
         * @param callback 保存完成后的回调函数
         */
        saveAccount : function(account, callback){
            window.localStorage.account = $.toJSON(account);
            callback();

        },

        /**
         * 获取用户账户信息
         * @param callback  获得信息后的回调函数
         */
        getAccount : function(callback){

            if(window.localStorage.account){
                callback($.parseJSON(window.localStorage.account));
            }else{
                callback();
            }
        },
        //登入回调方法
        callback: function(result,userName,password){

        	aigovApp.utils.closeLoading();
            if(result.code == 0){
                //保存登录信息
                aigovApp.session.setSession(result.data,userName,password);

                //窗口模块
            	var stack= appWindow.getWindowStack()

            	//如果只有一个窗口并就是登入窗口
            	if(stack.length!=0 && !(stack.length==1 && stack[0].id=='login')){
            		aigovApp.back("login");
            	}else{
            		window.location.reload();
            	}
            }else{//弹出出错信息
                aigovApp.nativeFunc.alert(result.message);
            }
        },
		/**
		 * 提交登陆信息，进行登陆
		 * @param data 传入的登陆用的数据
		 * {
		 *     userName:用户名
		 *     passWord:用户密码
		 *     targetUrl：登陆后跳转的窗口
		 *     isRememberUser:是否保存用户名，如果true自动保存到localstorage.
		 *     isRememberAll：是否保存用户名和密码，如果true自动保存到localstorage.
		 * }
		 * @param callback 回调函数，登陆完成后调用
		 * @param failback 出错的时候执行的回调
		 */
		submit : function(data, callback, failback){

			//指向对象本身的引用
			var that = this;

			var url = data.actionUrl;

            var password = data.password;

            var userName=data.userName;

            var code = data.checkCode;

            var param=null;

            //是否保存用户名
            //var isRememberUser = data.isRememberUser;

            //是否保存用户名和密码
            //var isRememberAll = data.isRememberAll;

            /**
             * 打开加载圈
             */
            aigovApp.utils.openLoading();

            var _callback=function(result){
            	that.callback(result,userName,password);
            }
            //如果没有传入回调处理，那么使用默认的回调处理。
            if(callback){
               that.callback=callback;
            }

            //如果没有传入出错处理，那么使用默认的出错处理。
            if(!failback){
                failback= {
                    onTimeout : function(){
                    	aigovApp.nativeFunc.alert("网路连接超时！");
                    },
                    error : function(){
                    	aigovApp.nativeFunc.alert("登陆出错！请检查网络连接！");
                    }
                };
            }

            window.MacAddress.getMacAddress(function(macAddress) {
            	param={
                    	password : password,
        				userName : userName,
                        code : code,
                        mac:macAddress
        			};
            	aigovApp.ajax(url,param,_callback, failback);
            });


		}

	};

	module.exports = exportsMethods;

});
