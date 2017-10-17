package com.weichenggov.wc.nfccard.util;

import com.lidroid.xutils.util.LogUtils;


public class NfcConfig {

	//获取MacL系统地址
	public static String GetMac2_URL = "http://61.185.20.72:8181/ecard/RechargeServiceHttp/CardRecharge1.ajax";
	//获取系统时间地址
	public static String GETTIME_URL = "http://61.185.20.72:8181/ecard/RechargeServiceHttp/getSysTime.ajax";	
	//充值金额单位为分
	public static String AMOUNT = "100";
	//终端编号16进制12位
	public static String TERMINAL_NO = "0050C231B585";
	
	public static void initConfigParamALL(String getMac2Url,String getTimeUrl,String amount){
		GetMac2_URL = getMac2Url;
		GETTIME_URL = getTimeUrl;
		AMOUNT = amount;
	}

	/**
	 * 设置交易金额
	 * @param fen
	 */
	public static void setAmount(String fen){
		AMOUNT = fen;
	}
	
	
	/**
	 * 默认log关闭所有log级别
	 */
	static{
		LogUtils.allowD = false;
		LogUtils.allowE = false;
		LogUtils.allowI = false;
		LogUtils.allowV = false;
		LogUtils.allowW = false;
	}

	/**
	 * 设置打开Log的打印级别为Debug级别
	 */
	public static void allowLogDebug(){
		LogUtils.allowD = true;
	}
	
	/**
	 * 设置打开Log的打印级别为Debug级别
	 */
	public static void allowLogError(){
		LogUtils.allowE = true;
	}
	/**
	 * 设置打开Log的打印级别为Debug级别
	 */
	public static void allowLogInfo(){
		LogUtils.allowI = true;
	}
	/**
	 * 设置打开Log的打印级别为Debug级别
	 */
	public static void allowLogVerbose(){
		LogUtils.allowV = true;
	}
	/**
	 * 设置打开Log的打印级别为Debug级别
	 */
	public static void allowLogWarn(){
		LogUtils.allowW = true;
	}
	
	
	
}
