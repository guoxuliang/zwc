package org.apache.cordova;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;

import com.weichenggov.wc.util.NetUtils;
import com.weichenggov.wc.util.WifiAdmin;

import android.app.ProgressDialog;
import android.content.Context;
import android.net.wifi.ScanResult;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

public class NetWorkPlugin extends CordovaPlugin {

	public static String NETWOKR_ACTION = "check";

	public boolean execute(String action, JSONArray data,
			CallbackContext callbackContext) throws JSONException {
		if (NETWOKR_ACTION.equals(action)) {
			checkNet(data.getString(0),data.getString(1));
		}
		return false;
	}
	
	ProgressDialog proDialog;
	private Context context;
	private void checkNet(String userName,String pwd){
		context = this.cordova.getActivity();
		proDialog = new ProgressDialog(context);
		openH3CWifi();
	}
	
	/**
     * 打开并检测是否有H3C的无线网络
     */
	
	private int TIME_OUT_MAX = 200;
	private int times = 0;
    private void openH3CWifi(){
        if (!NetUtils.isConnected(context)) {
        	times = 0;
        	proDialog.setMessage("搜索网络中...");
        	proDialog.show();
        	boolean isDiscovery = false;
        	WifiAdmin wifiAdmin = new WifiAdmin(context);
            wifiAdmin.openWifi();
            wifiAdmin.startScan();
            List<ScanResult> nets = wifiAdmin.getWifiList();
            //智慧咸阳
            String netName = "智慧咸阳";
            for (ScanResult result : nets) {
                if (result.SSID.contains(netName)) {
                    wifiAdmin.addNetwork(wifiAdmin.CreateWifiInfo(netName, "", 1));
                    isDiscovery = true;
                    break;
                }
            }
            if(!isDiscovery){
            	Toast.makeText(this.cordova.getActivity(), "未找到" + netName, Toast.LENGTH_SHORT).show();
            	proDialog.dismiss();
            	return;
            }else{
            	proDialog.setMessage("连接网络中...");
            }
            new Thread(new Runnable() {
                @Override
                public void run() {
                	boolean isTimeOut = false;
                    while (!NetUtils.isConnected(context)) {
                        try {
                        	if(times < TIME_OUT_MAX){
                        		Thread.currentThread();
                                Thread.sleep(100);
                                times++;
                        	}else{
                        		isTimeOut = true;
                        		break;
                        	}
                            
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    if(isTimeOut){
                    	//TODO 网络连接超时
                        handler.sendEmptyMessage(2);
                    }else{
                    	//TODO 网络连接成功
                        handler.sendEmptyMessage(1);
                    }
                    
                }
            }).start();
            return;
        }

    }


    //用于检测打开当前的无线连接
    private final Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                	if(proDialog != null && proDialog.isShowing()){
                		proDialog.dismiss();
                	}
                	Toast.makeText(context, "网络连接成功", Toast.LENGTH_SHORT).show();
                    break;
                case 2:
                	if(proDialog != null && proDialog.isShowing()){
                		proDialog.dismiss();
                	}
                	Toast.makeText(context, "网络连接超时", Toast.LENGTH_SHORT).show();
                	break;
            }
        }
    };
}
