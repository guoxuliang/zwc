package org.apache.cordova;

import org.json.JSONArray;
import org.json.JSONException;

import com.weichenggov.wc.main.CameraPlayerActivity;

import android.content.Intent;

public class CameraPlayerPlugin extends CordovaPlugin {

	public static String VIDEO_ACTION = "play";

	public boolean execute(String action, JSONArray data,
			CallbackContext callbackContext) throws JSONException {
		if (VIDEO_ACTION.equals(action)) {
			play(data.getString(0),data.getString(1),data.getString(2), callbackContext);
		}
		return false;
	}

	public synchronized void play(final String url,String title,String imgUrl,CallbackContext callbackContext) {
		final CordovaInterface cordova = this.cordova;
		Intent intent = new Intent(this.cordova.getActivity(), CameraPlayerActivity.class);
		intent.putExtra("url", url);
		intent.putExtra("title", title);
		intent.putExtra("img", imgUrl);
		this.cordova.getActivity().startActivity(intent);
	}
}
