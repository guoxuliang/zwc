/**
 * 主界面的js
 * @author xyl
 */
;define(function(require, exports, module){
	
	var aiAppAction=require("aiAppAction");
	
	//所有模板
	var Template={
		indexHead:"{{@child}}<div class='swiper-slide' data_type='{{=_val.type}}' data_content='{{=_val.content}}' data_param='{{=_val.param}}' data_name='{{=_val.name}}'><img alt='{{=_val.name}}' src='{{=_val.icon}}' /></div>{{/@child}}",
		app1:"{{@child}}<a href='javascript:;' class='ai-index-h-app' data_type='{{=_val.type}}' data_content='{{=_val.content}}' data_param='{{=_val.param}}' data_name='{{=_val.name}}' ><div class='ai-index-h-a-img'><img src='{{=_val.icon}}'></div><p class='ai-index-h-a-t'>{{=_val.name}}</p></a>{{/@child}}",
		app2:"{{@child}}<a href='javascript:;' class='ai-index-app-grid' data_type='{{=_val.type}}' data_content='{{=_val.content}}' data_param='{{=_val.param}}' data_name='{{=_val.name}}'><div class='ai-index-icon'><img src='{{=_val.icon}}'></div><div class='ai-index-txt'><div>{{=_val.name}}<div class='ai-index-txt-m'>{{=_val.describe}}</div></div></div></a>{{/@child}}"
	}
	//模块对外提供的方法
	var exportsMethods = {
	   
        /**
         *登陆页面的初始化 
         * @param {Object} appWindow  传入的窗口对象
         */
		onCreate : function(appWindow){
			var isConnection = aigovApp.nativeFunc.checkConnection();
			var width=$("body").width();
			var h=width*0.183;
			$("#J-ai-index-m").height(h);
			h=width*0.362;
			$("#J-ai-index-swiper").height(h);
			if(isConnection){
				var _this=this;
				window.plugins.PositionPlugin.getCurrentPosition(function(data){
					_this.loading(aigovApp.constants.indexProperties.CONFIG_URL,data.District);
				},function(data){
					_this.loading(aigovApp.constants.indexProperties.CONFIG_URL,"");
				});
				_this.loading(aigovApp.constants.indexProperties.CONFIG_URL2);
			}else{
				$("#error_info").show();
			}
			
		},
		//加载事件
		loading : function(url,zoneName){
        	aigovApp.utils.openLoading();
			aigovApp.ajax(url,{"zoneName":zoneName}, function(data){
				aigovApp.utils.closeLoading();
				$("#J-ai-index-box").show();
				$.each(data.data,function(i,o){
					if(o.name=='首页头'){
						var result = new t(Template.indexHead).render(o);
						$("#J-ai-index-head-c").html(result);
						new Swiper('#J-ai-index-swiper', {
							pagination: '.swiper-pagination',
							paginationClickable: true
						});
					}else if(o.name=='广告'){
						var result = new t(Template.indexHead).render(o);
						$("#J-ai-index-ad-c").html(result);
						new Swiper('#J-ai-index-m', {
							pagination: '.swiper-pagination',
							paginationClickable: true
						});
					}else if(o.name=='热门APP'){
						var result = new t(Template.app1).render(o);
						$("#ai-index-h-grids").html(result);
					}
					else if(o.name=='APP'){
						var result = new t(Template.app2).render(o);
						$("#ai-index-app-grids").html(result);
					}
				})
				aiAppAction.bindAction(".ai-index-h-app");
				aiAppAction.bindAction(".ai-index-app-grid");
				aiAppAction.bindAction(".swiper-slide","click");
				
				
			});
		}
	};
	
	module.exports = exportsMethods;

});