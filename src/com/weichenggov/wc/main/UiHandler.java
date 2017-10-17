package com.weichenggov.wc.main;

import android.app.ProgressDialog;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

import com.weichenggov.wc.mobile.utils.HandlerCode;

/**
 * 用于处理主界面UI变化相关的逻辑
 * 
 * @author zzhan@linewll.com
 */
public class UiHandler extends Handler {

	/**
	 * 进度对话框
	 */
	private ProgressDialog progressDialog;

	/**
	 * 主窗口MainActivity对象
	 */
	private Context context;

	public UiHandler(Context context) {
		this.context = context;
	}

	/**
	 * 消息处理
	 */
	public void handleMessage(Message msg) {
		switch (msg.what) {
		case HandlerCode.CLOSE_PROGRESS:// 关闭进度条
			progressDialog.dismiss();
			break;
		case HandlerCode.START_VERSION_PROGRESS: // 开启版本进度条
			initVersionProgressDialog();
			break;
		case HandlerCode.VERSION_CHECK_EXCEPTION:// 版本检测出现异常
			String execeptionMsg = "自动检查更新出错，请稍候再试！";
			Toast.makeText(context, execeptionMsg, Toast.LENGTH_SHORT).show();
			break;
		case HandlerCode.VERSION_CHECK_IS_LATEST:// 当前版本最新
			String latestMsg = "当前版本最新，无需更新！";
			Toast.makeText(context, latestMsg, Toast.LENGTH_SHORT).show();
			break;
		case HandlerCode.VERSION_CHECK_NET_WRONG:// 连接网络出错
			String wrongMsg = "网络连接出错，请稍候再试！";
			Toast.makeText(context, wrongMsg, Toast.LENGTH_SHORT).show();
			break;
		case HandlerCode.SERVICE_EXCEPTION:// 服务端异常
			String serviceMsg = "服务端异常，请联系管理员！";
			Toast.makeText(context, serviceMsg, Toast.LENGTH_SHORT).show();
			break;
		}
	}

	private void initVersionProgressDialog() {
		progressDialog = ProgressDialog.show(context, null,
				"正在检测是否有最新版本，请稍等...", true, false);

	}
}
