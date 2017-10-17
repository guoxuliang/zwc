package org.apache.cordova;

import org.json.JSONArray;
import org.json.JSONException;

import com.weichenggov.wc.main.WebActivity;


import android.content.Intent;

public class WebPlugin extends CordovaPlugin {

	public boolean execute(String action, JSONArray data,
		CallbackContext callbackContext) throws JSONException {
		final CordovaInterface cordova = this.cordova;
		Intent intent = new Intent(this.cordova.getActivity(), WebActivity.class);
		intent.putExtra("url", data.getString(0));
		intent.putExtra("title", data.getString(1));
		this.cordova.getActivity().startActivity(intent);
		callbackContext.success();
		return true;
	}

}
