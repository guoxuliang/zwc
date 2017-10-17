/**
 * store 
 * HTML5本地存储模块,DB实例
 * 操作本地数据库
 * 提供基本的增删该查等等
 * @author keyz@aigov.com
 * @since 2016-05-25
 */
;define(function(require, exports, module){
	
	var $ = window.jQuery;
	
	//存储模块
	var Store = function(){
		
		//数据库对象实例
		this._db =  window.openDatabase.apply(null,arguments);
	};
	
	//存储原型
	Store.prototype = {
		
		/**
		 * 获取db对象
		 */
		getDb  : function(){
			
			return this._db;
		},
		/**
		 * 切换到此表，如果存在则返回，不存在则创建表
		 * tableName 表名
		 * columns 字段 [{name:字段名,type:字段类型}] 可以为空 为空则直接切换到目标表,不为空则创建表字段
		 * 主键唯一且是文本 type: TEXT PRIMARY KEY UNIQUE
		 */
		switchTable : function(tableName,columns,callback){
			
			var that = this;
			//解析方法参数,找到对应的参数位置
			if(typeof columns === 'function'){
				callback = columns;
				columns = [];
			}
			
			//判断是否存在表的成功回调函数
			var successCallback = function(result){
				
				var table = new Table(tableName,that);
				
				//不存在此表,则创建
				if (result && result[0]['formCount'] == 0){
					
					table.createTable(columns,callback);
					
				//存住此表,直接执行回调
				}else if(typeof callback === 'function'){
					
					callback.call(table,true);
				}
			};
			
			that.isExistsTable(tableName,successCallback);
		},
		/**
		 * 判断表是否存在
		 * tableName 表名
		 * callback 回调
		 */
		isExistsTable : function(tableName,callback){
			
			if(!tableName) {
				if(typeof callback === 'function'){
					callback.call(this);
				}
			}else{
				var sql = 'SELECT count(*) as formCount FROM sqlite_master WHERE type="table" AND name="'+tableName+'" ';
				this.doQuery(sql,callback);
			}
		},
		/**
		 * 查询 
		 * sql 要查询的语句
		 * callback 查询成功之后的回调函数
		 */
		doQuery : function(sql,callback){
			var affected = [],
				that     = this;
				
			var success = function(b,result){
				
				var rows = result.rows,
					len  = rows.length;
					
				if (len > 0){
					for (var i=0;i<len;i++){
						affected.push(rows.item(i));
					}
				}else{
//					affected.push(result.rowsAffected);
				}
				if (typeof callback === 'function'){
					callback.call(that,affected);
				}
			};
			
			//开启一个事务
			that.getDb().transaction(function (trans) { 
				
				trans.executeSql(sql,[],success,function(t,e){
					
					console.log('Store error:'+e.message);
					
					if(typeof callback === 'function'){
						callback.call(that,null,e);
					}
				}) ;
			});
		},
		/**
		 * 删除所有表,便于清除所有本地数据库缓存
		 * @param tableNames 表名数组 有值则只删除传进来的几张表
		 * @param callback 回调
		 */
		dropAllTable : function(tableNames,callback){
			
			var that = this;
			
			var result = {
				success : true,
				message : '',
				content : ''
	     	};
			
			 //TODO 待优化
			 //无值则删除全部表
			if(!tableNames || tableNames.length == 0){
				
				var sql = 'select count(name) as tableCount,name  FROM sqlite_master ' +
								'WHERE type="table"  AND name <> "__WebKitDatabaseInfoTable__"';
				
				that.doQuery(sql,function(data){
					
					if(data && data[0]['tableCount'] == 0) return ;
					
					//打开一个事务
					that.getDb().transaction(function (t) {
						
						for(var i=0,len=data.length;i<len;i++){
							
							var sqlTemp = ' DROP TABLE IF EXISTS '+data[i].name;
							
							t.executeSql(sqlTemp,[],null,function(t,e){
								console.log('sqlite error:'+e.message);
								result.success = false;
								result.message = '删除表'+data[i].name+'失败';
							});
						}
						
						//执行回调函数
						if(typeof callback === 'function'){
							callback.call(that,result);
						}
					});
				});
			} else {
				that.getDb().transaction(function (t) {
					for(var i=0,len=tableNames.length;i<len;i++){
						var sqlTemp = ' DROP TABLE IF EXISTS '+tableNames[i];
						t.executeSql(sqlTemp,[],null,function(t,e){
							console.log('sqlite error:'+e.message);
							result.success = false;
							result.message = '删除表'+tableNames[i]+'失败';
						});
					}
					if(typeof callback === 'function'){
						callback(result);
					}
				});
			}
		}
	};
	
	//表模块
	var Table = function(tableName,storeObj){
		
		this._tableName = tableName;
		
		this._storeObj = storeObj;
	};
	
	//表原型
	Table.prototype = {

		/**
		 * 条件
		 */
		_where : '',
		/**
		 * 错误
		 */
		_error : '',
		
		/**
		 * 获取表名
		 */
		getTableName  : function(){
			
			return this._tableName;
		},
		/**
		 * 获取数据库对象
		 */
		getDb   : function(){
			
			return this._storeObj.getDb();
		},
		/**
		 * 创建表
		 * colums 字段格式[{name:字段名,type:字段类型}]
		 * callback 回调
		 * TODO 数据量大的情况下可考虑创建索引
		 */
		createTable : function(colums,callback){
			
			var that = this,
				sql  = 'CREATE TABLE IF NOT EXISTS ' + that._tableName ,
				temp = [];
				
			if (colums instanceof Array && colums.length>0){
				for (var i in colums){
					temp.push(colums[i].name+' '+colums[i].type);
				}
				temp = temp.join(', ');
				sql  = sql +' (' + temp + ')';
				
				that.getDb().transaction(function (trans) { 
					trans.executeSql(sql,[],function(){
						callback.call(that);
					}) ;
            	});
			} else {
				callback.call(that);
			}
		},
		/**
		 * where语句，支持字符串和以对象属性值对的形式
		 * @param where   查询语句
		 */
		where : function(where){
			
			if (typeof where === 'string'){
				this._where += ' '+where+' ';
			}
			return this;
		},
		/**
		 * 保存数据(插入和更新)，如果存在则更新，不存在则插入数据
		 * data 属性值对形式
		 * callback 回调函数
		 */
		saveData : function(data,callback){
			var that = this,
				sqls = [];
			
			//有数据	
			if (data instanceof Array && data.length>0){
				var cols=[];
				for (var i in data[0]){
					cols.push(i);
				}
				
				//sql语句前半部分都是一样的
				var sql = 'REPLACE INTO ' + this._tableName + ' ('+ cols.join(",") +') VALUES ',
					d   = data,
					pLenth = 0;
				//遍历所有记录
				for (var i=0,dLength=d.length;i<dLength;i++){
					var p = [];
					var k = [];
					for (var j in d[i]){
						var value = d[i][j];
						
						//将字段值里的单引号替换成2个单引号 ,否则会解析出错,执行会失败
						if(value != undefined && value != null && typeof value ==='string'){
							p.push("'"+value.replace(/'/g,"''")+"'");
						}else{
							p.push("'"+value+"'");
						}
					}
					sqls.push(sql +"("+p.join(',')+")"); 
				}
			} else {
				return false;
			}
			//打开一个事务，最好在一个事务里面把操作都作完
			//这样保证数据的完整性,又提高性能(每打开一个事务都是对文件的IO操作,非常费时)
			that.getDb().transaction(function (t) {
				for(var i=0,len=sqls.length;i<len;i++){
					t.executeSql(sqls[i],[],null,function(t,e){
						that.onfail.call(that,t,e,callback);
					});
				}
				if(typeof callback === 'function'){
					callback.call(that);
				}
			});
		},
		/**
		 * 获取数据
		 * callback 回调函数
		 */
		getData : function(callback){
			
			var that = this,
				sql = 'SELECT * FROM '+that._tableName + that._where;
			
			that._storeObj.doQuery(sql,function(){
				
				if(typeof callback === 'function'){
					callback.apply(that,arguments);
				}
			});
		},
		/**
		 * 根据条件删除数据
		 * callback 回调函数
		 */
		deleteData : function(callback){
			
			var that = this,
				sql  = 'DELETE FROM '+ that._tableName + that._where;
			that._storeObj.doQuery(sql,function(){
				
				if(typeof callback === 'function'){
					callback.apply(that,arguments);
				}
			});
		},
		/**
		 * 删除表
		 * callback 回调函数
		 */
		dropTable : function(callback){
			
			var that = this,
				sql  = 'DROP TABLE IF EXISTS ' + that._tableName;
			
			that._storeObj.doQuery(sql,function(){
				
				if(typeof callback === 'function'){
					callback.apply(that,arguments);
				}
			});
		},
		/**
		 * 添加一个字段
		 * @param column
		 * callback 回调函数
		 */
		addClomn  : function(column,callback){
			
			var that = this,
				sql = ' ALTER TABLE '+that._tableName+' ADD '+column;
			
			that._storeObj.doQuery(sql,function(){
				
				if(typeof callback === 'function'){
					callback.apply(that,arguments);
				}
			});
		},
		/**
		 * 失败的回调函数
		 * @param trans 事务对象
		 * @param error 异常对象
		 * @param callback 回调函数
		 */
		onfail:function(t,error,callback){
			
			this._error = error.message;
			console.log('sqlite error:'+ error.message);
			
			if(typeof callback === 'function'){
				callback.call(this,error);
			}
		},
		/**
		 * 转成数组
		 * @param obj 对象
		 */
		toArray:function(obj){
			var t   = [],
				reg = /["|']/ig,
				value = '';
				
			obj = obj || {};
			for (var i in obj){
				var result = reg.exec(obj[i]);
				if(result && result[0] === '"'){
					value = i+"='"+obj[i]+"'";
				}else{
					value = i+'="'+obj[i]+'"';
				}
				t.push(value);
			}
			return t;
		}
	};
	
	//模块对外提供的公共方法
	var exportsMethods = {
		
		/**
		 * 获取数据库对象,若存在直接返回,若不存在则创建一个数据库对象之后返回
		 * @param dbName   数据库名称
		 * @param version  数据库版本
		 * @param describe 描述文字
		 * @param size     容量大小
		 * @param callback 回调函数
		 * @return 数据库对象
		 */
		getDatabase : function(dbName,version,describe,size){
			
			if(!dbName) {
				console.log('数据库名称为空!');
				return ;
			}
			
			dbName   = dbName   || 'wadb';
			version  = version  || '1.0.0';
			describe = describe || '';
			size     = size     || 1024*1024*10;
			
			//判断是否支持
			if(window.openDatabase){
				
				//建立一个名为dbname的数据库连接
				//数据库名称、版本号、描述、大小、回调函数(可省略)；初次调用时创建数据库，以后就是建立连接了。
				//PhoneGap做了拦截，回调不支持,这里就算设置了回调也不起作用
				return new Store(dbName,version,describe,size);
				
			} else {
				
				console.log('不支持本地数据库!');
			}
		}
	};
	
	//模块导出的方法
	module.exports = exportsMethods;
});