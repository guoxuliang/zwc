
/**
 * 对session进行操作的js
 *
 * @author keyz@asiainfo.com
 * @since 2016-05-25
 */
define(function(require, exports, module){

    //模块对外提供的方法
    var exportsMethods =  {
        /**
         * 获取session
         * @return 返回session对象
         */
        getSession : function(){
            var sessionStorage = window.localStorage;
            var session = sessionStorage.account;
            if(!session){
            	session={};
            }else{
            	session=$.evalJSON(session);
            }

            return session;
        },

        /**
         * 设置session
         * @param session session对象
         */
        setSession : function(session,userName,password){
            var sessionStorage = window.localStorage;
            
            if(sessionStorage && session){
            	
            	session.id = session.sessionId;
                session.userName=userName;
                session.passWord=password;
                window.localStorage.userName = userName;
                
            	sessionStorage.account=$.toJSON(session);
            }
        },

        /**
         * 清除session
         */
        clearSession : function(){
            var sessionStorage = window.localStorage;
            if(sessionStorage){
            	sessionStorage.removeItem("account");
            }
        }
    };

    module.exports = exportsMethods;
});
