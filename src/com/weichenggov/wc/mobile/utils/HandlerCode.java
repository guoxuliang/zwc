package com.weichenggov.wc.mobile.utils;

/**
 * Handler消息处理代号
 * 
 * @author keyz@asiainfo.com
 * @since 2013-03-20
 */
public class HandlerCode {

	/**
	 * 关闭进度条
	 */
	public static final int CLOSE_PROGRESS = 0;

	/**
	 * 开启登录进度条
	 */
	public static final int START_LOGIN_PROGRESS = 1;

	/**
	 * 开启测试连接的进度条
	 */
	public static final int START_CONNECT_PROGRESS = 2;

	/**
	 * 切换webview的URL
	 */
	public static final int CHANGE_URL = 3;

	/**
	 * 下载更新
	 */
	public static final int DOWN_UPDATE = 4;

	/**
	 * 下载完成
	 */
	public static final int DOWN_OVER = 5;

	/**
	 * 开启测试是否有新版本的进度条
	 */
	public static final int START_VERSION_PROGRESS = 6;

	/**
	 * 版本检测——当前版本最新
	 */
	public static final int VERSION_CHECK_IS_LATEST = 7;

	/**
	 * 版本检测——有更新的版本
	 */
	public static final int VERSION_CHECK_IS_OLD = 8;

	/**
	 * 版本检测——出现网络错误
	 */
	public static final int VERSION_CHECK_NET_WRONG = 9;

	/**
	 * 版本检测——发生解析异常
	 */
	public static final int VERSION_CHECK_EXCEPTION = 10;

	/**
	 * 更新文件进度条
	 */
	public static final int FILE_UPDATE = 100;

	public static final int FILE_INIT = 101;

	public static final int FILE_FINISH = 102;

	/**
	 * 服务端异常(400起为服务端的异常代号)
	 */
	public static final int SERVICE_EXCEPTION = 400;

}
