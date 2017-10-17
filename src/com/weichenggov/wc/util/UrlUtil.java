package com.weichenggov.wc.util;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
/**
 * 获取服务器版本控制xml信息
 * @author keyz@asiainfo.com
 * @date   2015-08-07
 */
public class UrlUtil {
	static String xml = null;
	// constructor
	public UrlUtil() {

	}

	/**
	 * Getting XML from URL making HTTP request
	 * @param url
	 * string
	 * */
	public String getContentFromUrl(final String url) {
		
		new Thread() {
			public void run() {
				try {
					HttpGet httpRequst = new HttpGet(url);
					// new DefaultHttpClient()在主线程无法访问网络
					HttpResponse httpResponse = new DefaultHttpClient().execute(httpRequst);
					if (httpResponse.getStatusLine().getStatusCode() == 200) {
						HttpEntity httpEntity = httpResponse.getEntity();
						xml = EntityUtils.toString(httpEntity,"utf-8");
						System.out.println(xml);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			};
		}.start();
		//等待子线程运行完毕再运行朱线程
		boolean res=true;
		while(res){ 
			//这里判断子线程是否运行完了 
			if(xml!=null&&!"".equals(xml)){ 
				res=false; 
			} 
		}
		return xml;
	}
}
