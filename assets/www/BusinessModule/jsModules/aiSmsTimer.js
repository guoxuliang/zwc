/**
 * 登陆界面的js
 * @author keyz@asiainfo.com
 */
;define(function(require, exports, module){


	//模块对外提供的公共方法
	var exportsMethods = {
		/**
		 * TODO:单位：秒
		 */
		"second":0,
		/**
		 * TODO:结束计时标志
		 */
		"key":0,
		/**
		 * TODO:开始发送验证码的提示信息
		 */
		"startSendTip":0,
		/**
		 * TODO:验证码发送成功的提示信息
		 */
		"endSendTip":0,
		/**
		 * TODO:错误提示信息
		 */
		"errorMsg":0,
		/**
		 * TODO:初始化
		 */
		"init":0,
		/**
		 * TODO:开始计时时做的事情
		 */
		"startDo":0,
		/**
		 * TODO:结束计时时做的事情
		 */
		"endDo":0,
		/**
		 * TODO:倒计时显示的标签Id（注：不可以为input）
		 */
		"clockId":0,
		/**
		 * 
		 * TODO:设置倒计时的秒数
		 * @param newSecond
		 */
		"setSecond":function(newSecond){
			if(newSecond<0){
				this.second = 0;
			}else{
				this.second = newSecond;
			}
		},
		/*
		 *TODO:开始计时
		 * 1、需要先设置timer.second
		 * 2、需要先设置timer.clockId
		 * 3、需要先设置timer.endDo
		 */
		"start":function(){
			var _this=this;
			//开始计时
			eval(''+_this.startDo+'');
			//显示倒计时的秒数
			$("#"+_this.clockId+"").html(_this.second);
			//循环
			var i = 0;
			
			//每次隔一秒判断
			_this.key=window.setInterval(function(){
							$("#"+_this.clockId+"").html(_this.second-1-i);
							i++;
							if(_this.second-i==0){
								_this.stop();
								//结束计时
								eval(''+_this.endDo+'');
							}
						},1000);
		},
		"stop":function(){
			window.clearInterval(this.key);
		},
		/**
		 * 
		 * TODO:发送短信验证码
		 * @param phoneNo TODO:手机号码
		 */
		"send":function(phoneNo){
			var _this=this;
			eval(''+ _this.init+'');
			eval(''+_this.startSendTip+'');
			var code = '';
			var url=aigovApp.constants.reserveProperties.SEND_SMS_URL;
			var param={
            	"phoneNo" : phoneNo,
            	"businessType":"phoneApp"
			};
			aigovApp.utils.openLoading();
        	aigovApp.ajax(url,param,function(data) {
        		aigovApp.utils.closeLoading();
            	if(data.code=="0"){
            		eval(''+_this.endSendTip+'');
            	}else{
            		eval(''+_this.errorMsg+'');
            	}
            	code=data.code
        	},{error:function(){
        		eval(''+_this.errorMsg+'');
        	},async:false});
        	if(code !="0"){
        		return;
        	}
        	_this.start();
        	return code;
			
		}
	};

	module.exports = exportsMethods;

});
