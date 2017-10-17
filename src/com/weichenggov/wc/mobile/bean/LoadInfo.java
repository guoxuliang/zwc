package com.weichenggov.wc.mobile.bean;

/**
 * 下载器详细信息的类
 * 
 * @author keyz@asiainfo.com
 */
public class LoadInfo {

	/**
	 * 文件大小
	 */
	public int fileSize;
	
	/**
	 * 已下载的文件大小
	 */
	private int complete;
	
	/**
	 * 下载器标识
	 */
	private String url;
	
	/**
	 * 下载状态
	 */
	private int state;

	public LoadInfo(int fileSize, int complete, String url) {
		this.fileSize = fileSize;
		this.complete = complete;
		this.url = url;
	}

	public LoadInfo() {
	}

	public int getFileSize() {
		return fileSize;
	}

	public void setFileSize(int fileSize) {
		this.fileSize = fileSize;
	}

	public int getComplete() {
		return complete;
	}

	public void setComplete(int complete) {
		this.complete = complete;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String toString() {
		return "LoadInfo [fileSize=" + fileSize + ", complete=" + complete
				+ ", urlstring=" + url + "]";
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

}