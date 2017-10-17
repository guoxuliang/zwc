package org.apache.cordova;

import org.json.JSONArray;
import org.json.JSONException;

import com.weichenggov.wc.main.VideoPlayerActivity;

import android.content.Intent;

public class VideoPlugin extends CordovaPlugin {

	public static String VIDEO_ACTION = "play";

	public boolean execute(String action, JSONArray data,
			CallbackContext callbackContext) throws JSONException {
		if (VIDEO_ACTION.equals(action)) {
			play(data.getString(0), callbackContext);
		}
		return false;
	}

	public synchronized void play(final String url,CallbackContext callbackContext) {
		final CordovaInterface cordova = this.cordova;
		Intent intent = new Intent(this.cordova.getActivity(), VideoPlayerActivity.class);
		intent.putExtra("url", url);
		this.cordova.getActivity().startActivity(intent);
	}
}
