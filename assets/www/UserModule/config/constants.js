
/**
 * 常量模块
 * @author xyl
 *
 */
define(function(require, exports, module){

	/**
     * 项目地址
     */
//	PROJECT_URL = "http://localhost:8080/edot/";  //公司本地环境
    PROJECT_URL = "https://ydt.xy12345.cn/edot/";//公网正式环境
	
    /**
     * 附件下载的根路径
     */
    DOWNLOAD_ROOT = "aigovApp";

    /**
     * PC端上传路径
     */
    UPLOAD_PATH = "upload";

    /**
     * 附件下载的实际路径
     */
    DOWNLOAD_PATH = "aigovApp/download";

    /**
     * 图片路径
     */
    IMG_PATH = "aigovApp/img";

    /**
     * 版本更新路径
     */
    VERSION_PATH = "version/";

    /**
     * 版本更新信息文件名
     */
    VESION_INFO_FILE = "version.json";

    //模块对外提供的公共方法
    var exportsMethods = {
    		
    	DOWNLOAD_URL:PROJECT_URL+"uploadApp.html",

        PROJECT_URL : PROJECT_URL,
        DOWNLOAD_ROOT : DOWNLOAD_ROOT,
        DOWNLOAD_PATH : DOWNLOAD_PATH,
        UPLOAD_PATH : UPLOAD_PATH,
        IMG_PATH : IMG_PATH,
        VERSION_PATH : VERSION_PATH,
        VESION_INFO_FILE : VESION_INFO_FILE,

        /**
         * 登陆属性
         */
        loginProperties :{
            ACTION_URL:PROJECT_URL +"system/user/login",
            ACTION_RE_URL:PROJECT_URL +"system/user/relogin"
        },
    	indexProperties:{
    		CONFIG_URL:PROJECT_URL +"system/feature/selectDatasByZone?id=02_01,02_02",
    		CONFIG_URL2:PROJECT_URL +"system/feature/selectDatas?id=01_05,01_06"
    	}
    };

    module.exports = exportsMethods;
});
