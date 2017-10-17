package com.weichenggov.wc.util;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

public class LocationUtil {

	private LocationManager localmanager;
	private double latitude = 0.0;
	private double longitude = 0.0;
	private Location location;
	private Context ctx;
	private Activity acty;

	public String getAddressByGeocoder(Activity activity,Context context) {
		this.ctx = context;
		this.acty = activity;
		String addres = "";
		LocationManager locationManager = this.getLocationManager(context);
		Criteria criteria = new Criteria();
		// 获得最好的定位效果
		criteria.setAccuracy(Criteria.ACCURACY_FINE);
		criteria.setAltitudeRequired(false);
		criteria.setBearingRequired(false);
		criteria.setCostAllowed(false);
		// 使用省电模式
		criteria.setPowerRequirement(Criteria.POWER_LOW);
		String provider = locationManager.getBestProvider(criteria, true);
		//System.out.println("provider>>>>>>"+provider.toLowerCase());
		//Log.i("provider>>>>>>", provider.toLowerCase());
		if(null!=provider && provider.toLowerCase().indexOf("gps")>-1){
			//System.out.println(">>>>>>开启GPS。。。");
			turnGPSOn(context);
		}
		
		if(null!=provider){
			// 获得当前位置 location为空是一直取 从onLocationChanged里面取
			while (location == null) {
				//System.out.println(provider+"定位中...");
				location = locationManager.getLastKnownLocation(provider);
			}
			
			System.out.println("位置对象信息：LocationUtil.this.location==="+LocationUtil.this.location);
			
			// locationListener
			LocationListener locationListener = new LocationListener() {
				@Override
				public void onLocationChanged(Location location) {
					LocationUtil.this.location = location;
					//定时刷新位置，暂时不做处理
				}
				@Override
				public void onProviderDisabled(String provider) {
				}
				@Override
				public void onProviderEnabled(String provider) {
				}
				@Override
				public void onStatusChanged(String provider, int status,
						Bundle extras) {
				}
			};
			locationManager.requestLocationUpdates(provider, 1000, 10,
					locationListener);
			Geocoder geo = new Geocoder(context, Locale.getDefault());
			try {
				
				this.latitude = location.getLatitude();
				this.longitude = location.getLongitude();
				List<Address> address = geo.getFromLocation(location.getLatitude(),
						location.getLongitude(), 1);
				if (address.size() > 0) {
					addres = address.get(0).getAddressLine(0);
				}			
				System.out.println("this.latitude==="+this.latitude);
				System.out.println("this.longitude==="+this.longitude);
				System.out.println("addres==="+addres);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return addres;
	}

	private static LocationManager getLocationManager(Context context) {
		return (LocationManager) context
				.getSystemService(context.LOCATION_SERVICE);
	}

	
	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}


	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}


	

	public void updateLocaltionInfo(Activity activity, double latitude,
			double longitude, String address) {
//		if (latitude != 0 && longitude != 0) {
//			DataManager dm = new DataManager(activity);
//			String TABLE_NAME = "fds_location";
//			DBHelper dbHelper = dm.getDB();
//			if (null != dm && null != dbHelper) {
//				SQLiteDatabase db = dbHelper.getReadableDatabase();
//				System.out.println(">>>>>更新当前地理位置");
//				// 更新当前地理位置
//				ContentValues cv = new ContentValues();
//				cv.put("latitude", latitude);// 经度
//				cv.put("longitude", longitude);// 纬度
//				cv.put("address", address);// 地点
//				db.update(TABLE_NAME, cv, null, null);
//				db.close();
//				dbHelper.close();
//			}
//		}
	}

	public void turnGPSOn(Context context) {
		Intent intent = new Intent("android.location.GPS_ENABLED_CHANGE");
		intent.putExtra("enabled", true);
		context.sendBroadcast(intent);

		String provider = Settings.Secure.getString(
				context.getContentResolver(),
				Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
		if (!provider.contains("gps")) { // if gps is disabled
			final Intent poke = new Intent();
			poke.setClassName("com.android.settings",
					"com.android.settings.widget.SettingsAppWidgetProvider");
			poke.addCategory(Intent.CATEGORY_ALTERNATIVE);
			poke.setData(Uri.parse("3"));
			context.sendBroadcast(poke);
		}
	}

	
	
	
	
	
	
	
	

	
	/**
	 * 百度获取地址
	 * @param activity
	 * @return
	 */
	public String getAddressByBaidu(Activity activity) {
		String address = null;
		// gps
		if (localmanager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
			System.out.println(">>>>>>>>>>>>>>>GPS");
			Location location = localmanager
					.getLastKnownLocation(LocationManager.GPS_PROVIDER);
			System.out.println(">>>>>>>>>>>>>>>location=" + location);
			if (location != null) {
				latitude = location.getLatitude();
				longitude = location.getLongitude();
			}
		} else {
			System.out.println(">>>>>>>>>>>>>>>NETWORK");
			// 网络
			LocationListener locationListener = new LocationListener() {
				// 当坐标改变时触发此函数，如果Provider传进相同的坐标，它就不会被触发
				@Override
				public void onLocationChanged(Location location) {
					if (location != null) {
						latitude = location.getLatitude(); // 经度
						longitude = location.getLongitude(); // 纬度
						System.out.println(">>>>>>>>>>>>>>>>经度:" + latitude);
						System.out.println(">>>>>>>>>>>>>>>>纬度:" + longitude);
						Log.e("Map",
								"Location changed : Lat: "
										+ location.getLatitude() + " Lng: "
										+ location.getLongitude());
					}
				}

				// Provider的状态在可用、暂时不可用和无服务三个状态直接切换时触发此函数
				@Override
				public void onStatusChanged(String provider, int status,
						Bundle extras) {
				}

				// Provider被enable时触发此函数，比如GPS被打开
				@Override
				public void onProviderEnabled(String provider) {
				}

				// Provider被disable时触发此函数，比如GPS被关闭
				@Override
				public void onProviderDisabled(String provider) {
				}
			};
			// parameter: 1. provider 2. 每隔多少时间获取一次 3.每隔多少米 4.监听器触发回调函数
			localmanager
					.requestLocationUpdates(LocationManager.NETWORK_PROVIDER,
							1000, 0, locationListener);
			Location location = localmanager
					.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
			if (location != null) {
				latitude = location.getLatitude(); // 经度
				longitude = location.getLongitude(); // 纬度
			}
		}

		if (latitude != 0 && longitude != 0) {
			String baiduAPI = "http://api.map.baidu.com/geocoder?output=json&location="
					+ latitude
					+ ","
					+ longitude
					+ "&key=FTb1eMiEQl8GvLnPqm7KRMZd";
			System.out.println("baiduAPI==" + baiduAPI);
			UrlUtil parse = new UrlUtil();
			String content = parse.getContentFromUrl(baiduAPI);
			System.out.println("百度获取地址json===" + content);
			//????还没有进行解析，json格式
			
			// 写入SQLite数据库 fds_location表 latitude 和 longitude字段
			if (latitude != 0 && longitude != 0) {
				updateLocaltionInfo(activity, latitude, longitude, address);
			}
			address = "";
		}

		return address;
	}

}
