/**
 * 用户配置
 */
define(function(require, exports, module){

    module.exports = {

        /**
         * 欢迎界面标识
         */
        welcomeWinId  : "welcome",

        /**
         * 主窗口
         */
        mainWindow : "advert",

        /**
         * 窗口页面配置
         */
        appWindows : {

            /**
             * 欢迎页面
             */
            "welcome"  : {
                html : "UserModule/module/welcome/welcome.html",
                css : "UserModule/module/welcome/style/welcome.css",
                js : "UserModule/module/welcome/welcome.js",
                isHistory : false
            },
            /**
             * 主窗口页面
             */
            "mainPage" : {
                html : "UserModule/module/mainPage/mainPage.html",
                css : "UserModule/module/mainPage/style/mainPage.css",
                js : "UserModule/module/mainPage/mainPage.js"
            },
            /**
             * 首页
             */
            "index" :{
                html : "UserModule/module/index/index.html",
                css : "UserModule/module/index/style/index.css",
                js : "UserModule/module/index/index.js"
            },
            /**
             * 广告
             */
            "advert" :{
                html : "UserModule/module/advert/advert.html",
                css : "UserModule/module/advert/style/advert.css",
                js : "UserModule/module/advert/advert.js",
                isHistory : false
            }
        },


        /**
         * 用户二次开发的js模块配置
         */
        jsModules : {
            "aiAppAction":"UserModule/jsModules/aiAppAction"
        }
    };
});
