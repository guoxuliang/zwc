package com.weichenggov.wc.util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;

/**
 * 网络状态的监听
 * @author xuepf
 *
 */
public final class NetUtils {
	
	private NetUtils(){}
	
	private static ConnectivityManager getConnectivityManager(Context context)
	{
		return (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
	}
	
	
	/**
	 * 判断当前的网络的状态是否可用
	 * @param context
	 * @return
	 */
	public static boolean isAvalible(Context context)
	{
		ConnectivityManager connectivityManager = getConnectivityManager(context);
		if(connectivityManager!=null)
		{
			NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
			if(networkInfo!=null)
			{
				return networkInfo.isAvailable();
			}
		}
		return false;
	}
	
	/**
	 * 判断当期那的网络是否连接
	 * @param context
	 * @return
	 */
	public static boolean isConnected(Context context)
	{
		ConnectivityManager connectivityManager = getConnectivityManager(context);
		if(connectivityManager!=null)
		{
			NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
			if(networkInfo!=null)
			{
				return networkInfo.isConnected();
			}
		}
		return false;
	}

	/**
	 * 获取所有当前设备
	 * @param context
	 * @return
	 */
	public static NetworkInfo[] getNetInfolist(Context context){
		ConnectivityManager connectivityManager = getConnectivityManager(context);
		if(null!=connectivityManager){
			return connectivityManager.getAllNetworkInfo();
		}
		return null;
	}


	/**
	 * 连接指定网络
	 * @param netId
	 * @param context
	 * @return
	 */
	public static boolean enableNetworkInfo(int netId,Context context){
		WifiManager manager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		return manager.enableNetwork(netId,true);
	}
}
