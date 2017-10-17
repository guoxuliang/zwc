/**
 * 广告页面
 * @author xyl
 */
;define(function(require, exports, module){

	var second=6;
	function change(){
		second--;
		if(second>-1){
			document.getElementById("second").innerHTML=second;
			timer = setTimeout(change,1000);//调用自身实现
		}else if(second==-1){
			clearTimeout(timer);
			aigovApp.cleanHistory();
			aigovApp.openAppWindow("mainPage")
		}
	}

	module.exports = {
		onCreate : function(winObj){
			change();
			$("#myJ").on("click",function(){
				second=-2;
				clearTimeout(change);
				aigovApp.cleanHistory();
				aigovApp.openAppWindow("mainPage");
			})
		},
		//退回事件
        onBack:function(){
        	
        }

	};
});
