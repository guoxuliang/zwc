package com.weichenggov.wc.main;

import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.content.Context;


public class Application extends android.app.Application{
	public static Context applicationContext;
	public static List<Activity> openActivity = new ArrayList<Activity>();
	@Override
	public void onCreate() {
		applicationContext = getApplicationContext();
		super.onCreate();
	}
	
	public static void exit() {
		for (int i = 0; i < openActivity.size(); i++) {
			if(openActivity.get(i)!=null){
				openActivity.get(i).finish();
			}
		}
		android.os.Process.killProcess(android.os.Process.myPid());
	}

}
