package org.apache.cordova;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.weichenggov.wc.main.R;
import com.weichenggov.wc.nfccard.CardManager;
import com.weichenggov.wc.nfccard.util.HardReader;
import com.weichenggov.wc.nfccard.util.Iso7816;
import com.weichenggov.wc.nfccard.util.PbocCard;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.nfc.NdefMessage;
import android.nfc.NfcAdapter;
import android.nfc.NfcEvent;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.util.Log;

@SuppressLint("NewApi")
public class NfcPlugin extends CordovaPlugin implements NfcAdapter.OnNdefPushCompleteCallback {
	public static final String NFC_READ = "read";
	public static final String NFC_WRITE="write";
	private static final String ENABLED = "enabled";
	private static final String INIT = "init";
	private static final String SHOW_SETTINGS = "showSettings";

	private static final String TAG_DEFAULT = "tag";

	private static final String TAG = "NfcPlugin";
	private final List<IntentFilter> intentFilters = new ArrayList<IntentFilter>();
	private final ArrayList<String[]> techLists = new ArrayList<String[]>();
	
	//事件回调脚本
	private String javaScriptEventTemplate = "var e = document.createEvent(''Events'');\n"
			+ "e.initEvent(''{0}'');\n"
			+ "e.tag = {1};\n"
			+ "document.dispatchEvent(e);";

	private NdefMessage p2pMessage = null;
	private PendingIntent pendingIntent = null;

	private CallbackContext shareTagCallback;
	private CallbackContext handoverCallback;
	
	private Tag tag=null;
	
	public static String type="read";
	
	private String amount="0";
	@Override
	public boolean execute(String action, JSONArray data,
			CallbackContext callbackContext) throws JSONException {
		String tmpType=data.getString(0);
		if(NFC_WRITE.equals(tmpType)){
			type=NFC_WRITE;
			amount=data.getString(1);
		}else{
			type=NFC_READ;
		}

		Log.d(TAG, "execute " + action);
		

		if (action.equalsIgnoreCase(SHOW_SETTINGS)) {
			showSettings(callbackContext);
			return true;
		}
		
		//判断状态
		int status= getNfcStatus();
		if (status!=R.string.tip_nfc_enabled) {
			Resources r=getActivity().getResources();
			callbackContext.error(r.getString(status));
			return true;
		}

		createPendingIntent();

		if (action.equalsIgnoreCase(INIT)) {
			init(callbackContext);
			
		} else if (action.equalsIgnoreCase(ENABLED)) {
			Resources r=getActivity().getResources();
			callbackContext.success(r.getString(status));

		} else {
			return false;
		}

		return true;
	}
	
	/**
	 * 得到nfc状态
	 * @return
	 */
	private int getNfcStatus() {
		NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(getActivity());
		if (nfcAdapter == null) {
			return R.string.tip_nfc_notfound;
		} else if (!nfcAdapter.isEnabled()) {
			return R.string.tip_nfc_disabled;
		} else {
			return R.string.tip_nfc_enabled;
		}
	}

	/**
	 * 初始化NFC
	 * 
	 * @param callbackContext
	 */
	private void init(CallbackContext callbackContext) {
		Log.d(TAG, "Enabling plugin " + getIntent());

		startNfc();
		if (!recycledIntent()) {
			parseMessage();
		}
		callbackContext.success();
	}

	private void showSettings(CallbackContext callbackContext) {
		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN) {
			Intent intent = new Intent(
					android.provider.Settings.ACTION_NFC_SETTINGS);
			getActivity().startActivity(intent);
		} else {
			Intent intent = new Intent(
					android.provider.Settings.ACTION_WIRELESS_SETTINGS);
			getActivity().startActivity(intent);
		}
		callbackContext.success();
	}

	private void createPendingIntent() {
		if (pendingIntent == null) {
			Activity activity = getActivity();
			Intent intent = new Intent(activity, activity.getClass());
			intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP
					| Intent.FLAG_ACTIVITY_CLEAR_TOP);
			pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);
		}
	}
	
	/**
	 * 开启NFC
	 */
	private void startNfc() {
		createPendingIntent(); // onResume can call startNfc before execute

		NfcAdapter nfcAdapter = NfcAdapter
				.getDefaultAdapter(getActivity());

		if (nfcAdapter != null && !getActivity().isFinishing()) {
			try {
				nfcAdapter.enableForegroundDispatch(getActivity(),
						getPendingIntent(), getIntentFilters(),
						getTechLists());

				if (p2pMessage != null) {
					nfcAdapter.setNdefPushMessage(p2pMessage,
							getActivity());
				}
			} catch (IllegalStateException e) {
				Log.w(TAG, e);
			}

		}
	}
	
	/**
	 * 停止NFC
	 */
	private void stopNfc() {
		Log.d(TAG, "stopNfc");
		NfcAdapter nfcAdapter = NfcAdapter
				.getDefaultAdapter(getActivity());

		if (nfcAdapter != null) {
			try {
				nfcAdapter.disableForegroundDispatch(getActivity());
			} catch (IllegalStateException e) {
				// issue 125 - user exits app with back button while nfc
				Log.w(TAG, e);
			}
		}
	}
	
	private PendingIntent getPendingIntent() {
		return pendingIntent;
	}

	private IntentFilter[] getIntentFilters() {
		return intentFilters.toArray(new IntentFilter[intentFilters.size()]);
	}

	private String[][] getTechLists() {
		return techLists.toArray(new String[0][0]);
	}

	void parseMessage() {
				Log.d(TAG, "parseMessage " + getIntent());
				Intent intent = getIntent();
				String action = intent.getAction();
				Log.d(TAG, "action " + action);
				tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
				if (action == null) {
					return;
				}
					
				if (action.equals(NfcAdapter.ACTION_TAG_DISCOVERED)) {
					this.getActivity().runOnUiThread(new Runnable() {
			            public void run() {
			            		fireTagEvent(tag);
			            }
					});
					
				}

				setIntent(new Intent());
	}

	

	/**
	 * 启动事件
	 * 
	 * @param tag
	 */
	private void fireTagEvent(Tag tag) {
		if(tag!=null){
			final Resources res = getActivity().getResources();
			if(NFC_WRITE.equals(type)){
				final IsoDep isodep = IsoDep.get(tag);
				final Iso7816.Tag isotag = new Iso7816.Tag(isodep);
				try {
					isotag.connSect();
					HardReader.write(isotag,amount,this.webView);
				} catch (Exception e) {
					Log.e(TAG, e.toString());
				}
				
			}else{
				PbocCard card= CardManager.load2(tag, res) ;
				Log.i(TAG, card.toString());
				if(card!=null){
					JSONObject json = new JSONObject();
					
					try {
						json.put("id", card.getSerl());
						json.put("serl", card.getId());
						json.put("cash", Double.valueOf(card.getCash())*100.00);
						json.put("count", card.getCount());
						json.put("name", card.getName());
						json.put("chip", card.getName());
					} catch (JSONException e) {
						Log.e(TAG, e.toString());
					}
					
					// 得到格式化javasctip
					String command = MessageFormat.format(javaScriptEventTemplate,
							TAG_DEFAULT,json.toString());
					Log.v(TAG, command);
					//
					this.webView.sendJavascript(command);
				}
			}
		}
			
		
	}


	private boolean recycledIntent() {

		int flags = getIntent().getFlags();
		if ((flags & Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) == Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) {
			Log.i(TAG, "Launched from history, killing recycled intent");
			setIntent(new Intent());
			return true;
		}
		return false;
	}

	@Override
	public void onPause(boolean multitasking) {
		Log.d(TAG, "onPause " + getIntent());
		super.onPause(multitasking);
		if (multitasking) {
			// nfc can't run in background
			stopNfc();
		}
	}

	@Override
	public void onResume(boolean multitasking) {
		Log.d(TAG, "onResume " + getIntent());
		super.onResume(multitasking);
		startNfc();
	}

	@Override
	public void onNewIntent(Intent intent) {
		Log.d(TAG, "onNewIntent " + intent);
		super.onNewIntent(intent);
		setIntent(intent);
		parseMessage();
	}

	private Activity getActivity() {
		return this.cordova.getActivity();
	}

	private Intent getIntent() {
		return getActivity().getIntent();
	}

	private void setIntent(Intent intent) {
		getActivity().setIntent(intent);
	}

	@Override
	public void onNdefPushComplete(NfcEvent event) {

		// handover (beam) take precedence over share tag (ndef push)
		if (handoverCallback != null) {
			PluginResult result = new PluginResult(PluginResult.Status.OK,
					"Beamed Message to Peer");
			result.setKeepCallback(true);
			handoverCallback.sendPluginResult(result);
		} else if (shareTagCallback != null) {
			PluginResult result = new PluginResult(PluginResult.Status.OK,
					"Shared Message with Peer");
			result.setKeepCallback(true);
			shareTagCallback.sendPluginResult(result);
		}

	}
}
