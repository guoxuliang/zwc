package com.weichenggov.wc.data;


public class GlobalStore {
	/**
	 * RF卡号
	 */
	private static String mIDCardNo;
	/**
	 * 手机IMEI
	 */
	private static String mIMEI;
	/**
	 * 客户端IP
	 */
	private static String mClientIP;
	/**
	 * 客户端版本号
	 */
	private static String mVersion;
	/**
	 * 接口调用授权信息
	 */
	private static String mAward;
	/**
	 * 有效会话ID字符串
	 */
	private static String mSessionId;
	/**
	 * 机主号码
	 */
	private static String mSvcNum;

	
	


	private static String ClintVersion;
	private static String HardwareBrand;
	private static String HardwareModel;
	private static String IMSI;
	private static String OSVersion;
	private static String NewClintVersionUrl;
	private static String NewClintVersion;

	/**
	 * 是否需要更新版本
	 */
	private static boolean isUpdateVersion = true;

	public static String getmVersion() {
		return mVersion;
	}

	public static void setmVersion(String mVersion) {
		GlobalStore.mVersion = mVersion;
	}

	public static String getmIDCardNo() {
		return mIDCardNo;
	}

	public static void setmIDCardNo(String mIDCardNo) {
		GlobalStore.mIDCardNo = mIDCardNo;
	}

	public static String getmIMEI() {
		return mIMEI;
	}

	public static void setmIMEI(String mIMEI) {
		GlobalStore.mIMEI = mIMEI;
	}

	public static String getmClientIP() {
		return mClientIP;
	}

	public static void setmClientIP(String mClientIP) {
		GlobalStore.mClientIP = mClientIP;
	}

	public static String getmAward() {
		return mAward;
	}

	public static void setmAward(String mAward) {
		GlobalStore.mAward = mAward;
	}

	public static String getmSessionId() {
		return mSessionId;
	}

	public static void setmSessionId(String mSessionId) {
		GlobalStore.mSessionId = mSessionId;
	}

	public static String getmSvcNum() {
		return mSvcNum;
	}

	public static void setmSvcNum(String mSvcNum) {
		GlobalStore.mSvcNum = mSvcNum;
	}

	public static String getClintVersion() {
		return ClintVersion;
	}

	public static void setClintVersion(String clintVersion) {
		ClintVersion = clintVersion;
	}

	public static String getHardwareBrand() {
		return HardwareBrand;
	}

	public static void setHardwareBrand(String hardwareBrand) {
		HardwareBrand = hardwareBrand;
	}

	public static String getHardwareModel() {
		return HardwareModel;
	}

	public static void setHardwareModel(String hardwareModel) {
		HardwareModel = hardwareModel;
	}

	public static String getIMSI() {
		return IMSI;
	}

	public static void setIMSI(String iMSI) {
		IMSI = iMSI;
	}

	public static String getOSVersion() {
		return OSVersion;
	}

	public static void setOSVersion(String oSVersion) {
		OSVersion = oSVersion;
	}

	public static String getNewClintVersionUrl() {
		return NewClintVersionUrl;
	}

	public static void setNewClintVersionUrl(String newClintVersionUrl) {
		NewClintVersionUrl = newClintVersionUrl;
	}

	public static String getNewClintVersion() {
		return NewClintVersion;
	}

	public static void setNewClintVersion(String newClintVersion) {
		NewClintVersion = newClintVersion;
	}

	public static boolean isUpdateVersion() {
		return isUpdateVersion;
	}

	public static void setUpdateVersion(boolean isUpdateVersion) {
		GlobalStore.isUpdateVersion = isUpdateVersion;
	}






}
