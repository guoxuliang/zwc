package com.weichenggov.wc.framework.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import com.weichenggov.wc.util.ToastUtil;

import android.os.AsyncTask;
import android.util.Log;

/**
 * 版本网络请求
 * 
 * @author guohui
 * @date 2016-6-23 下午5:43:38
 */
public abstract class NetAsyncTask extends AsyncTask<Object, Void, String> {
	private final static String TAG_HTTPGET = "get";
	private final static String TAG_POST = "post";
	private static final String NETWORK_NORMAL = "network_normal";
	private static final String EXCEPTION = "exception";

	protected String jsonStr;

	@Override
	protected String doInBackground(Object... params) {
		try {

			if (params.length < 1)
				throw new IllegalArgumentException("数据请求参数需包含request body 和 redirectUrl提示");
			String path = (String) params[0]; // 请求的地址
			jsonStr = requestByHttpGet(path);

		} catch (ConnectException e) {
			e.printStackTrace();
			ToastUtil.show("无网络连接，请检查网络是否连接");
			return EXCEPTION;

		} catch (ConnectTimeoutException e) {
			e.printStackTrace();
			ToastUtil.show("连接超时，请检查网络环境是否良好");

			return EXCEPTION;
		} catch (SocketTimeoutException e) {
			e.printStackTrace();
			ToastUtil.show("服务器响应超时，请重新连接");

			return EXCEPTION;
		} catch (IOException e) {
			e.printStackTrace();
			ToastUtil.show("数据读写异常");
			return EXCEPTION;
		} catch (Exception e) {
			e.printStackTrace();
			ToastUtil.show("数据获取异常");

			return EXCEPTION;
		}
		return NETWORK_NORMAL;
	}

	@Override
	protected void onPostExecute(String result) {
		super.onPostExecute(result);
		if (EXCEPTION.equals(result)) {
			this.onError();
			return;
		} else {
			this.after(jsonStr);
		}

	}

	/**
	 * 请求结果
	 * 
	 * @author guohui
	 * @date 2016-6-23 下午5:46:02
	 * @param result
	 */
	protected abstract void after(String result);

	/* 网络请求异常 */
	protected abstract void onError();

	public static String requestByHttpPost(String path) throws Exception {
		// String path = "https://reg.163.com/logins.jsp";
		// 新建HttpPost对象
		HttpPost httpPost = new HttpPost(path);
		String result = null;
		// Post参数
		List<NameValuePair> params = new ArrayList<NameValuePair>();
		params.add(new BasicNameValuePair("id", "helloworld"));
		params.add(new BasicNameValuePair("pwd", "android"));
		// 设置字符集
		HttpEntity entity = new UrlEncodedFormEntity(params, HTTP.UTF_8);
		// 设置参数实体
		httpPost.setEntity(entity);
		// 获取HttpClient对象
		HttpClient httpClient = new DefaultHttpClient();
		// 获取HttpResponse实例
		HttpResponse httpResp = httpClient.execute(httpPost);
		// 判断是够请求成功
		if (httpResp.getStatusLine().getStatusCode() == 200) {
			// 获取返回的数据
			result = EntityUtils.toString(httpResp.getEntity(), "UTF-8");

			Log.i(TAG_HTTPGET, "HttpPost方式请求成功，返回数据如下：");
			Log.i(TAG_HTTPGET, result);
		} else {
			Log.i(TAG_HTTPGET, "HttpPost方式请求失败");
		}
		return result;
	}
	
	// HttpGet方式请求
	public static String requestByHttpGet(String path) throws Exception {

		String result = null;
		HttpsURLConnection conn=null;
		InputStream input=null;
		try {
			URL url = new URL(path);
			SSLContext sslctxt = SSLContext.getInstance("TLS");
			sslctxt.init(null, new TrustManager[] { new MyX509TrustManager() },
					new java.security.SecureRandom());
			conn = (HttpsURLConnection) url.openConnection();
			conn.setSSLSocketFactory(sslctxt.getSocketFactory());
			conn.setHostnameVerifier(new MyHostnameVerifier());
			conn.connect();
			int respCode = conn.getResponseCode();
			input = conn.getInputStream();
			result = toString(input);
			
		} catch (Exception e) {
			Log.i(TAG_HTTPGET, "HttpPost方式请求失败");
		}finally{
			if(input!=null){
				input.close();
			}
			if(conn!=null){
				conn.disconnect();
			}
			
		}
		Log.i(TAG_HTTPGET, result);
		return result;
	}
	
	private static String toString(InputStream input){
		String content = null;
		try{
		InputStreamReader ir = new InputStreamReader(input);
		BufferedReader br = new BufferedReader(ir);
		StringBuilder sbuff = new StringBuilder();
		while(null != br){
			String temp = br.readLine();
			if(null == temp)break;
			sbuff.append(temp).append(System.getProperty("line.separator"));
		}
		content = sbuff.toString();
		}catch(Exception e){
			e.printStackTrace();
		}
		return content;
	}
}
