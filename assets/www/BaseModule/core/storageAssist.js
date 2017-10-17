/**
 * 本地数据库存储辅助模块脚本逻辑
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//获取存储实例对象
	var wadb = require('store').getDatabase('wadb');
	
	var privateMethods = {
		/**
		 * 获取字段列表 且设置主键唯一
		 * priKeyName 要设置成主键的字段
		 * contents 数据内容列表,主要为了取字段名
		 */
		getColums : function(priKeyName,contents){
			var content = contents[0];
			var colums = [];
			for(var i in content){
				var temp = '';
				if(i === priKeyName){
					temp = {'name':i,'type':'TEXT PRIMARY KEY UNIQUE'};
				}else{
					temp = {'name':i,'type':'TEXT'};
				}
				colums.push(temp);
			}
			return colums;
		}
	};
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		/**
		 * 从本地数据库获取数据
		 * @tableName 要获取数据的目标表名
		 * @whereStr  获取数据时的查询条件
		 * @callback  从本地获取数据之后的回调
		 */
		getDataFromLocal : function(tableName,whereStr,callback){
			
			//初始化表
			wadb.switchTable(tableName,function(isExist){
				
				//表存在，则拼接拼接条件,然后获取数据
				if(isExist){
					
					//查询条件
					this.where(whereStr).getData(function(data){
							if(typeof callback === 'function'){
								callback(data);
							}
						});
				} else {//直接回调
					if(typeof callback === 'function'){
						callback();
					}
				}
			});
		},
		/**
		 * 保存内容到数据库
		 * @tableName 要保存数据的目标表名
		 * @priName   主键名(用于在第一次要保存到数据库时,表还未存在,需要设置唯一性字段)
		 * @contents  要存的数据内容 JSON
		 * @callback  保存成功回调函数
		 */
		saveDataToLocal : function(tableName,priName,contents,callback){
			if((!contents || contents.length == 0) && typeof callback ==='function'){
				callback();
				return ;
			}
			var colums = privateMethods.getColums(priName,contents);
			wadb.switchTable(tableName,colums,function(){
				this.saveData(contents,callback);
			});
		},
		/**
		 * 查询
		 * @param sql 要查询的sql语句
		 * @param callback 
		 */
		doQuery : function(sql,callback){
			
			wadb.doQuery(sql,callback);
		}
	};
	
	//模块导出的方法
	module.exports = exportsMethods;
});
