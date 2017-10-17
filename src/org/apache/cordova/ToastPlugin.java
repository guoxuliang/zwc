package org.apache.cordova;


import org.json.JSONArray;
import org.json.JSONException;
import android.widget.Toast;

/**
 * 吐司插件
 * @author keyz@asiainfo.com
 * 
 */
public class ToastPlugin extends CordovaPlugin {

	public static String TOAST_ACTION = "toast";
	public static String LENGTH_TYPE = "long";

	public boolean execute(String action, JSONArray data,
			CallbackContext callbackContext) throws JSONException {
		if (TOAST_ACTION.equals(action)) {
			toast(data.getString(0), data.getString(1), callbackContext);
		}
		return false;
	}

	public synchronized void toast(final String message, final String length,
			CallbackContext callbackContext) {
		final CordovaInterface cordova = this.cordova;
		Runnable runnable = new Runnable() {
			public void run() {
				int length = 0;
				if (LENGTH_TYPE.equals(length)) {
					length = Toast.LENGTH_LONG;
				} else {
					length = Toast.LENGTH_SHORT;
				}
				Toast.makeText(cordova.getActivity(), message, length).show();
			}
		};
		this.cordova.getActivity().runOnUiThread(runnable);
	}
}
