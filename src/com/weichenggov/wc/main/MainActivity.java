package com.weichenggov.wc.main;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.WindowManager;

import com.weichenggov.wc.framework.net.NetAsyncTask;
import com.weichenggov.wc.mobile.bean.Response;
import com.weichenggov.wc.mobile.manage.UpdateManager;
import com.weichenggov.wc.util.Constants;
import com.weichenggov.wc.util.SystemUtils;
import com.weichenggov.wc.util.ToastUtil;
import com.iflytek.sunflower.FlowerCollector;

import org.apache.cordova.*;
import org.json.JSONObject;

public class MainActivity extends CordovaActivity
{
    private Response response;
    /**
     * 用来处理主界面UI的对象
     */
    private Handler handler = new UiHandler(this);
    /**
     * webView对象
     */
    WindowManager windowManager =null;


    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        windowManager=this.getWindowManager();

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }
        Context context=this.getApplicationContext();
        String SHA1= SystemUtils.getCertificateSHA1Fingerprint(context);
        Log.i("SHA1",SHA1);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                new GetVersionTask().execute(Constants.HTTP_URL_PRE);
            }
        });


    }
    @Override
    protected void onResume() {
        super.onResume();
        FlowerCollector.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
        FlowerCollector.onPause(this);
    }

    public class GetVersionTask extends NetAsyncTask {
        @Override
        protected void after(String result) {
            if(result!= null && !"".equals(result)){
                JSONObject resultJson=null;
                JSONObject jsonObj=null;
                try {
                    resultJson=new JSONObject(result);
                    jsonObj=resultJson.getJSONObject("data");
                    response=new Response();

                    response.setCompatibleVersion(jsonObj.getString("requiredMinimumVer"));
                    response.setIntroduction(jsonObj.getString("remark"));
                    response.setLastVersion(jsonObj.getString("latestVer"));
                    response.setUpdateURL(jsonObj.getString("downloadUrl"));
                    Message msg=new Message();
                    msg.what=1;
                    msg.obj=response;
                    updataHandler.sendMessage(msg);

                } catch (Exception e) {
                    ToastUtil.show("报文解析错误");
                }
            }
        }

        @Override
        protected void onError() {
            ToastUtil.show("获取版本信息失败");
        }
    }

    Handler updataHandler=new Handler(){
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    Response responseM=(Response) msg.obj;
                    UpdateManager.getUpdateManager().checkAppUpdate(appView.getView(),windowManager,MainActivity.this, responseM, false);
                    break;
                default:
                    break;
            }
        };
    };
}
