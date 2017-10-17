/**
 * 设置功能的js
 * 
 * @author xyl
 */
;define(function(require, exports, module){
	
	var appWindow = null;
	
	var aiMenu=require("aiMenu");
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		onCreate : function(win){

			//设备初始化
			aigovApp.nativeFunc.phoneInit();
	        
			appWindow = win;
			
			//初始化页面的控件
		    var buttonList = appWindow.getComponent('buttonlist');
		    
		    var that = this;
		    
		    //获取配置对象
		    aigovApp.ajax("UserModule/module/mainPage/config.json",null,function(datas){                
		      buttonList.init({datas:datas},function(){
		          //初始化完成后默认选择第三个菜单项
		          buttonList.getButtonList()[2].$dom.trigger('tap');
		          
		          //无线自动连接
		          var session=aigovApp.session.getSession();
		          if(session.id){
						if(aigovApp.phone.type =="ANDROID"){
							var userName = session.userName;
							var pwd = session.passWord ;
							window.plugins.NetWorkPlugin.CheckNet(userName,pwd);
						}
						aigovApp.rLogin(function(){
							that.qryUnReadConsultCount();
						},function(){
							
						});
					}
		          
		      });
		    },{type:"get"});
		},
		
		onBack : function(intent){
			if(intent === "refresh"){	//刷新
				var container = appWindow.getComponent('mainContainer');
				//刷新窗口
				container.reLoadAppWindow(null, true);
			} else if(intent && intent.id && intent.id === "newsMain"){
				var container = appWindow.getComponent('mainContainer');
				//刷新窗口
				container.reLoadAppWindow(null, true);
			} else if(aigovApp.openVideoFlag){
				var container = appWindow.getComponent('mainContainer');
				//刷新窗口
				container.reLoadAppWindow(null, true);
			} else if(intent ==="refresh_user"){
				var session = aigovApp.session.getSession();
        		var isAuth= session.user.isAuth
            	if(isAuth=='0' || isAuth=='00'){
    	       		 $("#userName_st").html("(未认证)")
    	       		 $("#J_real_buton").show();
            	}else if(isAuth=='1'  || isAuth=='01'){
    	       		 $("#userName_st").html("(认证中)")
    	       		 $("#J_real_buton").hide();
            	}else if(isAuth=='2' || isAuth=='02'){
    	       		 $("#userName_st").html("")
    	       		 $("#J_real_buton").hide();
            	}else if(isAuth=='3' || isAuth=='03'){
    	       		 $("#userName_st").html("(不通过)")
    	       		 $("#J_real_buton").show();
            	}
			}
			this.qryUnReadConsultCount();
		},
		
		//获取我的沟通提醒
		qryUnReadConsultCount : function(){
			var that = this;
			var userInfo = aigovApp.session.getSession().user;
			if(typeof userInfo !== "undefined"){
		        aigovApp.ajax(PROJECT_URL + "person/qryUnReadConsultCount",{"userId":userInfo.userId},function(datas){
		        	$("li#my>div:first").removeClass("cricle");// 先清除小红点
		        	if(datas.code == "0") {
		        		var count = datas.unReadCount;
		        		if(count > 0){
		        			$("li#my>div:first").addClass("cricle");
		        		} else {
		        			$("li#my>div:first").removeClass("cricle");
		        		}
		        		that.healthcareBadge();
		            }
		        });
			}
		},
		
		// 获取健康关怀如果存在未坊信息标记小红点
		healthcareBadge : function(){
			aigovApp.ajax(aigovApp.constants.healthcare.HEALTH_CARE_COUNT_URL, null, function(d){
				if(!$("li#my>div:first").hasClass('cricle')){
					if(d.page && d.page.rowCount && d.page.rowCount > 0){
						$("li#my>div:first").addClass("cricle");
					}else{
						$("li#my>div:first").removeClass("cricle");
						$("div.health-cricle").removeClass("health-cricle1");
						$("div.health-cricle").html("");
					}
				}
    		});
		}
		
	};
	
	module.exports = exportsMethods;

});
