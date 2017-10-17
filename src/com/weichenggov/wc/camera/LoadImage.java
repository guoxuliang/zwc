package com.weichenggov.wc.camera;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;

import com.weichenggov.wc.framework.net.MyX509TrustManager;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;

/**
 * 加载图片操作
 * @author 柯永锥
 * @email keyz@asiainfo.com
 * @createTime 2016-07-07 22:02:00
 */
public class LoadImage extends AsyncTask<String, Integer, Bitmap> {
	
	private final static String TAG = "LoadImage";
	
	private ImageView imageView;

	public LoadImage(ImageView imageView) {
		this.imageView = imageView;
	}

	@Override
	protected Bitmap doInBackground(String... params) {
		String url = params[0];
		URL myFileUrl = null;
		Bitmap bitmap = null;
		try {
			myFileUrl = new URL(url);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		HttpsURLConnection conn=null;
		InputStream input=null;
		try {
			
			SSLContext sslctxt = SSLContext.getInstance("TLS");
			sslctxt.init(null, new TrustManager[] { new MyX509TrustManager() },
					new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sslctxt.getSocketFactory());
            
            conn=(HttpsURLConnection)myFileUrl.openConnection();
            conn.setDoInput(true);
            int responseCode = conn.getResponseCode();    // 鑾峰彇鏈嶅姟鍣ㄥ搷搴斿�
            if (responseCode == HttpURLConnection.HTTP_OK) {        //姝ｅ父杩炴帴
            	input = conn.getInputStream();
            	bitmap = BitmapFactory.decodeStream(input);
            }
			
		} catch (IOException e) {
			Log.e(TAG, e.toString());
		} catch (NoSuchAlgorithmException e) {
			Log.e(TAG, e.toString());
		} catch (KeyManagementException e) {
			Log.e(TAG, e.toString());
		}finally{
			if(input!=null){
				try {
					input.close();
				} catch (IOException e) {
					Log.e(TAG, e.toString());
				}
			}
			if(conn!=null){
				conn.disconnect();
			}
		}
		return bitmap;
	}

	@Override
	protected void onPostExecute(Bitmap result) {
		imageView.setImageBitmap(result);
	}
}
