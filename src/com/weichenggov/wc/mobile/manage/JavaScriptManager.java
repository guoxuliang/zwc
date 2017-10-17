package com.weichenggov.wc.mobile.manage;

import org.apache.cordova.CordovaWebView;

import android.content.Context;
import android.os.Handler;

/**
 * android调用js处理逻辑
 * @author keyz@asiainfo.com
 *
 * @sine 2014-4-2
 */
public class JavaScriptManager {
    Context mContext;

    public JavaScriptManager(Context c) {
        mContext = c;
    }
    
    /**
     * 打开待办事项列表
     * @param handler Handler处理对象
     * @param webView  CordovaWebView 对象
     * @param isPush 是否是推送
     */
    public void showTodoList(Handler handler, final CordovaWebView webView, final boolean isPush) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                // 调用js脚本
                webView.loadUrl("javascript:openTodoList('"+ isPush +"')");
                
            }
        });
    }
}
