package com.weichenggov.wc.mobile.bean;

/**
 * 数据库中的下载信息对象
 * @author keyz@asiainfo.com
 *
 */
public class DownloadInfo {

	/**
	 * 下载器id
	 */
	private int threadId;

	/**
	 * 开始点
	 */
	private int startPos;

	/**
	 * 结束点
	 */
	private int endPos;

	/**
	 * 已下载的文件大小
	 */
	private int compeleteSize;

	/**
	 * 下载地址(用作下载器的标识)
	 */
	private String url;

	/**
	 * 下载的文件名
	 */
	private String fileName;

	/**
	 * 下载的文件大小
	 */
	private int fileSize;

	/**
	 * 存储位置
	 */
	private String localFile;

	public DownloadInfo(int threadId, int startPos, int endPos,
			int compeleteSize, String url, String fileName, int fileSize,
			String localFize) {
		this.threadId = threadId;
		this.startPos = startPos;
		this.endPos = endPos;
		this.compeleteSize = compeleteSize;
		this.url = url;
		this.fileName = fileName;
		this.fileSize = fileSize;
		this.localFile = localFize;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getThreadId() {
		return threadId;
	}

	public void setThreadId(int threadId) {
		this.threadId = threadId;
	}

	public int getStartPos() {
		return startPos;
	}

	public void setStartPos(int startPos) {
		this.startPos = startPos;
	}

	public int getEndPos() {
		return endPos;
	}

	public void setEndPos(int endPos) {
		this.endPos = endPos;
	}

	public int getCompeleteSize() {
		return compeleteSize;
	}

	public void setCompeleteSize(int compeleteSize) {
		this.compeleteSize = compeleteSize;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public int getFileSize() {
		return fileSize;
	}

	public void setFileSize(int fileSize) {
		this.fileSize = fileSize;
	}

	public String getLocalFile() {
		return localFile;
	}

	public void setLocalFile(String localFile) {
		this.localFile = localFile;
	}

	public String toString() {
		return "DownloadInfo [threadId=" + threadId + ", startPos=" + startPos
				+ ", endPos=" + endPos + ", compeleteSize=" + compeleteSize
				+ "]";
	}
}