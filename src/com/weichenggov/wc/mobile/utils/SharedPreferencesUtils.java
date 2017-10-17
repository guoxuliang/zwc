package com.weichenggov.wc.mobile.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * SharedPreferences的一个工具类，调用setParam就能保存String, Integer, Boolean, Float, Long类型的参数
 * 同样调用getParam就能获取到保存在手机里面的数据
 * @author keyz@asiainfo.com
 * @since 2014-3-18
 */
public class SharedPreferencesUtils {
	
	/**
	 * 保存数据的方法
	 * @param context 上下文
	 * @param key 键值
	 * @param value 键对应的值
	 */
	public static void save(Context context , String key, Object value){
		
		String type = value.getClass().getSimpleName();
		SharedPreferences sp = context.getSharedPreferences(Constants.SHARED_PREFERENCES_FILE_NAME, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = sp.edit();
		
		if("String".equals(type)){
			editor.putString(key, (String)value);
		}
		else if("Integer".equals(type)){
			editor.putInt(key, (Integer)value);
		}
		else if("Boolean".equals(type)){
			editor.putBoolean(key, (Boolean)value);
		}
		else if("Float".equals(type)){
			editor.putFloat(key, (Float)value);
		}
		else if("Long".equals(type)){
			editor.putLong(key, (Long)value);
		}
		
		editor.commit();
	}
	
	
	/**
	 * 得到保存数据的方法，我们根据默认值得到保存的数据的具体类型，然后调用相对于的方法获取值
	 * @param context 上下文
	 * @param key 键值
	 * @param defaultValue 默认值
	 * @return 返回键对应的值
	 */
	public static Object get(Context context , String key, Object defaultValue){
		String type = defaultValue.getClass().getSimpleName();
		SharedPreferences sp = context.getSharedPreferences(Constants.SHARED_PREFERENCES_FILE_NAME, Context.MODE_PRIVATE);
		
		if("String".equals(type)){
			return sp.getString(key, (String)defaultValue);
		}
		else if("Integer".equals(type)){
			return sp.getInt(key, (Integer)defaultValue);
		}
		else if("Boolean".equals(type)){
			return sp.getBoolean(key, (Boolean)defaultValue);
		}
		else if("Float".equals(type)){
			return sp.getFloat(key, (Float)defaultValue);
		}
		else if("Long".equals(type)){
			return sp.getLong(key, (Long)defaultValue);
		}
		
		return null;
	}
}

