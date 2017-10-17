/**
 * App操作事项
 * @author keyz@aigov.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	 
	 var exportsMethods = {
	 	
	 	/**
	 	 * 打开页面事件
	 	 * @param 
	 	 */
	 	open : function(){
	 		var _this=$(this);
	 		var type=_this.attr("data_type");
	 		var content=_this.attr("data_content");
	 		var name=_this.attr("data_name");
	 		var param="";
	 		
	 		//1表示模块打开
	 		if(content==""){
	 			return;
	 		}
	 		if(type==1){
 				try{
 					param=$.evalJSON(_this.attr("data_param"));
 				}catch(e){
 					param=_this.attr("data_param");
 				}
	 			aigovApp.openAppWindow(content,param);
	 		//纳里健康
	 		}else if(type==2){
	 			if(!window.localStorage.account){
	 				aigovApp.nativeFunc.alert("未登录");
					aigovApp.openAppWindow("login");
				}
	 			var session = aigovApp.session.getSession();
        		var isAuth = session.user.isAuth;
        		//未认证或不通过
            	/*if((isAuth=='0' || isAuth=='00') || (isAuth=='3' || isAuth=='03')){
            		aigovApp.nativeFunc.alert("未实名认证");
            		aigovApp.openAppWindow('kAuthentification','ngariHealth');
            	} else if(isAuth=='1'  || isAuth=='01'){
            		aigovApp.nativeFunc.alert("您的实名认证还在审核中，请耐心等待...");
            	} else {*/
            		var params = {
            			"patientName":aigovApp.session.getSession().user.realName/*"张一天"*/,
            			"mobile":aigovApp.session.getSession().user.phoneNo/*"13584675644"*/,
            			"tid":aigovApp.session.getSession().user.userId/*"6654"*/,
            			"idcard":aigovApp.session.getSession().user.idCardNo/*"330101199912249351"*/
            		};
            		var url= PROJECT_URL+"ngariHealth/createPageUrl";
            		aigovApp.utils.openLoading();
            		aigovApp.ajax(url, params, function(data){
                        aigovApp.utils.closeLoading();
                        window.plugins.webPlugin.open(name,data.data);
                        
            		});
//            	}
	 		}else{
	 			aigovApp.openAppWindow("openUrl2",{
	 				title:name,
	 				url:content
	 			});
	 		}
	 	},
	 
	 	/**
	 	 * 绑定事件
	 	 * @param 查询字符串
	 	 */
	 	bindAction:function(selector,e){
	 		if(!e){
	 			e="click";
	 		}
	 		$(selector).on(e,this.open);
	 	}
	 };
	 
	//将公共方法导出模块
	module.exports = exportsMethods;
});