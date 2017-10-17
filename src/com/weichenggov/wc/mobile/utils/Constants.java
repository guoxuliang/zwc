package com.weichenggov.wc.mobile.utils;

import java.io.File;

import android.annotation.SuppressLint;
import android.os.Environment;

/**
 * 常量类
 * 
 * @author keyz@asiainfo.com
 * @since 2013-03-20
 */
@SuppressLint("NewApi")
public class Constants {


	/**
	 * 文件下载路径 TODO 路径保持一致
	 */
	@SuppressLint("NewApi")
	public static final File DOWNLOAD_FILE = 
				Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
	
	/**
	 * 服务端的更新文件夹路径
	 */
	public static final String UPDATE_SERVICE_PATH = "version" + File.separator;
	
	/**
	 * 服务端更新信息的路径
	 */
	public static final String UPDATE_INFO_SERVICE_PATH = "version.json";

	public static final String PROJECT_URL = "http://127.0.0.1:8080/webApp/";
	
	/**
	 * 附件下载路径 TOOD 前后台各一份配置，复用性差
	 */
	public static final String DOWNLOAD_PATH = "aigovApp/download";

	/**
	 * 百度推送存放信息所在的文件名
	 */
	public static final String SHARED_PREFERENCES_FILE_NAME = "baiduPush";
}
