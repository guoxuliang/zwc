package com.weichenggov.wc.nfccard.util;

import java.io.Serializable;

public class  Response implements Serializable {
	private String resultCode;
	
	private String errMsg;
	private String mac;
	public String getResultCode() {
		return resultCode;
	}
	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}
	public String getErrMsg() {
		return errMsg;
	}
	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
	public String getMac() {
		return mac;
	}
	public void setMac(String mac) {
		this.mac = mac;
	}

	
}
