package com.weichenggov.wc.mobile.manage;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;

import com.weichenggov.wc.data.GlobalStore;
import com.weichenggov.wc.main.R;
import com.weichenggov.wc.mobile.bean.Response;
import com.weichenggov.wc.util.SystemUtils;
import com.weichenggov.wc.util.ToastUtil;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * 应用程序更新工具包
 * 
 */
public class UpdateManager {

	private static final int DOWN_NOSDCARD = 0;

	private static final int DOWN_UPDATE = 1;

	private static final int DOWN_OVER = 2;

	private static final int DIALOG_TYPE_LATEST = 0;

	public static final int DIALOG_TYPE_FAIL = 1;

	private static final String DEFAULT_FOLDER_NAME = Environment.getExternalStorageDirectory().getAbsolutePath()
			+ "/aigov/update/";

	private static UpdateManager updateManager;

	private Context mContext;

	// 进度条
	private ProgressBar mProgress;

	// 显示下载数值
	private TextView mProgressText;

	// 进度值
	private int progress;

	// 终止标记
	private boolean interceptFlag;

	// 提示语
	private String updateMsg = "";

	// 返回的安装包url
	private String apkUrl = "";

	// 下载包保存路径
	private String savePath = "";

	// apk保存完整路径
	private String apkFilePath = "";

	// 临时下载文件路径
	private String tmpFilePath = "";
	// 下载文件大小
	private String apkFileSize;
	// 已下载文件大小
	private String tmpFileSize;
	// 下载线程
	private Thread downLoadThread;

	private ImageView ivUpdate;
	private TextView tvUpdate;
	private TextView tvCurrentVersion;

	private String curVersionName = "";

	private boolean isShowDialog = true;

	private boolean isForceUpdate = false;// 是否强制升级

	/**
	 * 检查App更新
	 * 
	 * @param context
	 * @param isShowMsg
	 *            是否显示提示消息
	 */
	public void checkAppUpdate(View locationId, WindowManager windowManager, Context context, Response response, boolean isShowMsg) {
		this.mContext = context;
		this.locationId = locationId;
		this.windowManager = windowManager;
		curVersionName = SystemUtils.getVersionName(context);
		if (!TextUtils.isEmpty(response.getCompatibleVersion())
				&& judgeVersion(response.getCompatibleVersion(), SystemUtils.getVersionName(context))) {
			isForceUpdate = true;
			updateMsg = response.getIntroduction();
			apkUrl = response.getUpdateURL();
			showMsgPop();
		} else if (!TextUtils.isEmpty(response.getLastVersion())
				&& judgeVersion(response.getLastVersion(), SystemUtils.getVersionName(context))) {
			isForceUpdate = false;
			updateMsg = response.getIntroduction();
			apkUrl = response.getUpdateURL();
			showMsgPop();
		} else {
			GlobalStore.setUpdateVersion(false);
		}
	}

	public View selectTip;
	public PopupWindow selectTipPopup;
	public PopupWindow updatePop;
	public static int ScreenWidth, ScreenHeight;
	WindowManager windowManager;
	public View locationId;
	public View updateTip;

	private void showMsgPop() {
		// 弹出框
		Display display = windowManager.getDefaultDisplay();
		ScreenWidth = display.getWidth();
		ScreenHeight = display.getHeight();
		selectTip = LayoutInflater.from(mContext).inflate(R.layout.dialog_normal_msg, null);
		selectTipPopup = new PopupWindow(selectTip, ScreenWidth, ScreenHeight);
		selectTipPopup.setContentView(selectTip);
		selectTipPopup.setFocusable(true);
		// selectTip.getBackground().setAlpha(160);
		TextView title=(TextView) selectTip.findViewById(R.id.tv_dialog_title);
		title.setText(updateMsg);
		Button leftBtn=(Button) selectTip.findViewById(R.id.btn_left);
		Button rightBtn=(Button) selectTip.findViewById(R.id.btn_right);
		LinearLayout leftBtnBlock=(LinearLayout) selectTip.findViewById(R.id.ll_btn_left);
		if (isForceUpdate) {
			//强制升级不出现取消按钮
			leftBtnBlock.setVisibility(View.GONE);
		}
		leftBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				GlobalStore.setUpdateVersion(true);
				setUpdateGone();
				selectTipPopup.dismiss();
			}
		});
		rightBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				selectTipPopup.dismiss();
				showUpdatePop();
			}
		});
		
		selectTipPopup.showAtLocation(locationId, Gravity.CENTER, 0, 0);
		
	}

	private static boolean judgeVersion(String newVersion, String oldVersion) {
		try {
			String[] newStr = newVersion.split("\\.");
			String[] oldStr = oldVersion.split("\\.");
			if (newStr.length != oldStr.length) {
				return true;
			}
			for (int i = 0; i < newStr.length; i++) {
				if (Integer.parseInt(newStr[i]) > Integer.parseInt(oldStr[i])) {
					return true;
				} else if (Integer.parseInt(newStr[i]) < Integer.parseInt(oldStr[i])) {
					return false;
				}
			}
			return false;
		} catch (Exception e) {

			return false;
		}
	}

	@SuppressLint("HandlerLeak")
	private Handler mHandler = new Handler() {
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case DOWN_UPDATE:
				mProgress.setProgress(progress);

				if (tmpFileSize.equals(apkFileSize)) {
					mProgress.setProgress(100);
				}
				// mProgressText.setText(tmpFileSize + "/" + apkFileSize);
				mProgressText.setText(progress + "%");
				break;
			case DOWN_OVER:
				updatePop.dismiss();
				installApk();
				break;
			case DOWN_NOSDCARD:
				updatePop.dismiss();
				ToastUtil.show("无法下载安装文件，请检查SD卡是否挂载");
				break;
			}
		}
	};

	public static UpdateManager getUpdateManager() {
		if (updateManager == null) {
			updateManager = new UpdateManager();
		}
		updateManager.interceptFlag = false;
		return updateManager;
	}


	

	public void dismissDialog() {
		isShowDialog = false;
	}
	private void showUpdatePop(){
		Display display = windowManager.getDefaultDisplay();
		ScreenWidth = display.getWidth();
		ScreenHeight = display.getHeight();
		updateTip = LayoutInflater.from(mContext).inflate(R.layout.layout_update_progress, null);
		updatePop = new PopupWindow(updateTip, ScreenWidth, ScreenHeight);
		updatePop.setContentView(updateTip);
		updatePop.setFocusable(true);
//		updatePop.getBackground().setAlpha(160);
		mProgress = (ProgressBar) updateTip.findViewById(R.id.update_progress);
		mProgressText = (TextView) updateTip.findViewById(R.id.update_progress_text);
		mProgress.setProgress(0);
		updatePop.showAtLocation(locationId, Gravity.CENTER, 0, 0);
		Button rightBtn=(Button) updateTip.findViewById(R.id.btn_left);
		LinearLayout leftBtnBlock=(LinearLayout) updateTip.findViewById(R.id.ll_btns);
		if (isForceUpdate) {
			//强制升级不出现取消按钮
			leftBtnBlock.setVisibility(View.GONE);
		}
		rightBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				updatePop.dismiss();
				interceptFlag = true;//停止下载
			}
		});
		downloadApk();
	}

	private Runnable mdownApkRunnable = new Runnable() {
		@Override
		public void run() {
			try {
				String saveApkName = mContext.getResources().getString(R.string.app_name) + "_";
				String apkName = saveApkName + curVersionName + ".apk";
				String tmpApk = saveApkName + "checkRequest.versionName" + ".tmp";
				// 判断是否挂载了SD卡
				String storageState = Environment.getExternalStorageState();
				if (storageState.equals(Environment.MEDIA_MOUNTED)) {
					savePath = DEFAULT_FOLDER_NAME;
					File file = new File(savePath);
					if (!file.exists()) {
						file.mkdirs();
					}
					apkFilePath = savePath + apkName;
					tmpFilePath = savePath + tmpApk;
				}

				// 没有挂载SD卡，无法下载文件
				if (apkFilePath == null || apkFilePath == "") {
					mHandler.sendEmptyMessage(DOWN_NOSDCARD);
					return;
				}

				File ApkFile = new File(apkFilePath);

				// 输出临时下载文件
				File tmpFile = new File(tmpFilePath);
				FileOutputStream fos = new FileOutputStream(tmpFile);

				URL url = new URL(apkUrl);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.connect();
				int length = conn.getContentLength();
				InputStream is = conn.getInputStream();

				// 显示文件大小格式：2个小数点显示
				DecimalFormat df = new DecimalFormat("0.00");
				// 进度条下面显示的总文件大小
				apkFileSize = df.format((float) length / 1024 / 1024) + "MB";

				int count = 0;
				byte buf[] = new byte[1024];

				do {
					int numread = is.read(buf);
					count += numread;
					// 进度条下面显示的当前下载文件大小
					tmpFileSize = df.format((float) count / 1024 / 1024) + "MB";
					// 当前进度值
					progress = (int) (((float) count / length) * 100);
					// 更新进度
					mHandler.sendEmptyMessage(DOWN_UPDATE);
					if (numread <= 0) {
						// 下载完成 - 将临时下载文件转成APK文件
						if (tmpFile.renameTo(ApkFile)) {
							// 通知安装
							mHandler.sendEmptyMessage(DOWN_OVER);
						}
						break;
					}
					fos.write(buf, 0, numread);
				} while (!interceptFlag);// 点击取消就停止下载

				fos.close();
				is.close();
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}

		}
	};

	/**
	 * 下载apk
	 * 
	 * @param url
	 */
	private void downloadApk() {
		downLoadThread = new Thread(mdownApkRunnable);
		downLoadThread.start();
	}

	/**
	 * 安装apk
	 * 
	 * @param url
	 */
	private void installApk() {
		File apkfile = new File(apkFilePath);
		if (!apkfile.exists()) {
			return;
		}
		Intent i = new Intent(Intent.ACTION_VIEW);
		i.setDataAndType(Uri.parse("file://" + apkfile.toString()), "application/vnd.android.package-archive");
		mContext.startActivity(i);
	}

	public void setWidget(ImageView ivUpdate, TextView tvUpdate, TextView tvCurrentVersion) {
		this.ivUpdate = ivUpdate;
		this.tvUpdate = tvUpdate;
		this.tvCurrentVersion = tvCurrentVersion;
	}

	private void setUpdateGone() {
		if (ivUpdate == null) {
			return;
		}
		if (GlobalStore.isUpdateVersion()) {
			ivUpdate.setVisibility(View.VISIBLE);
			tvUpdate.setVisibility(View.VISIBLE);
			tvCurrentVersion.setText("（当前版本：" + GlobalStore.getmVersion() + "）");
		} else {
			ivUpdate.setVisibility(View.GONE);
			tvUpdate.setVisibility(View.GONE);
			tvCurrentVersion.setText("（当前已经是最新版本：" + GlobalStore.getmVersion() + "）");
		}
	}
}
