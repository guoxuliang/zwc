/* NFCardActivity is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

NFCardActivity is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Wget.  If not, see <http://www.gnu.org/licenses/>.

Additional permission under GNU GPL version 3 section 7 */

package com.weichenggov.wc.nfccard.util;

import java.util.ArrayList;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.NfcPlugin;

import com.weichenggov.wc.main.R;
import com.weichenggov.wc.nfccard.util.Iso7816.BerT;
import com.google.gson.Gson;
import com.lidroid.xutils.HttpUtils;
import com.lidroid.xutils.exception.HttpException;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.http.callback.RequestCallBack;
import com.lidroid.xutils.http.client.HttpRequest.HttpMethod;

import android.content.res.Resources;
import android.os.Handler;
import android.util.Log;


public final class HardReader extends PbocCard {
	public static final byte TMPL_PDR = 0x70; // Payment Directory Entry Record
	public static final byte TMPL_PDE = 0x61; // Payment Directory Entry
	
	public static String MAC2 = "";
	public static String dateTimeStr = "";
	public static Card card = new Card();
	public static Iso7816.Tag tmptag;
	
	public static CordovaWebView webView;
	
	private HardReader(Iso7816.Tag tag, byte[] name, Resources res) {
		super(tag);
		this.name = (name != null) ? Util.toHexString(name, 0, name.length)
				: res.getString(R.string.name_unknowntag);
	}
	
	private final static Handler handler = new Handler() {
		public void handleMessage(android.os.Message msg) {
			switch (msg.what) {
			case 0:
				String URL = NfcConfig.GetMac2_URL;// 加密机URL
				getMac2Data(URL, card.toXMLString());
				break;
			case 1:
				String macStr = MAC2;
				String mac2 = macStr.substring(0, 8);

				String dateStr = dateTimeStr.substring(0, 8);
				String timeStr = dateTimeStr.substring(8, dateTimeStr.length());
				byte[] mac = Util.codeMac(mac2);// 4
				byte[] date = Util.codeDate(dateStr);// 45RFCA
				byte[] time = Util.codeTime(timeStr);// 3
				byte[] data = Util.concatAll(date, time, mac);
				
				synchronized(NfcPlugin.type){
					if(NfcPlugin.type.equals(NfcPlugin.NFC_WRITE)){
						CreditForLoadData creditForLoadData = new CreditForLoadData();
						creditForLoadData.AddData(data);
						Log.e("","==FuChanganTong CREDIT FOR LOAD=");
						Iso7816.Response INFO = tmptag.CREDITFORLOAD(creditForLoadData);
						Log.e("","==FuChanganTong CREDIT FOR LOAD RESPONSE==>>" + INFO.toString());
						if(INFO.getBytes()==INFO.getBytes()){
							Log.e("","true");
							NfcPlugin.type=NfcPlugin.NFC_READ;
							webView.sendJavascript("queryAlipayRefundRepeat()");
						}else{
							Log.e("","false");
							NfcPlugin.type=NfcPlugin.NFC_READ;
							webView.sendJavascript("CardRecharge2()");
						}
						//TAC 095DFDB1
						if(INFO.toString().length()>4){
							card.setTac(INFO.toString().substring(0,8));
						}	
					}
				}
				
				
				tmptag.close();

				break;
			}
		}
	};
	
	public static void getMac2Data(String url, String value) {

		HttpUtils http = new HttpUtils();
		RequestParams params = new RequestParams();
		params.addQueryStringParameter("xml", value);
		Log.e("","==FuChanganTong 获取 MAC2=地址=>>" + url);
		Log.e("","==FuChanganTong 获取 MAC2=入参=>>" + value);

		http.send(HttpMethod.GET, url, params, new RequestCallBack<String>() {

			@Override
			public void onSuccess(ResponseInfo<String> responseInfo) {
				Log.e("","==FuChanganTong 获取 MAC2=出参=>>" + responseInfo.result);

				Gson gson = new Gson();// new一个Gson对象
				Response xml = gson.fromJson(responseInfo.result,
						Response.class);
				Log.e("","==FuChanganTong MAC2=>>" + xml.getMac());
				card.setMac2(xml.getMac());
				MAC2 = xml.getMac();
				// --------------------------------------------------------------
				handler.sendEmptyMessage(1);
				// -----------------------------------------------------------------------
			}

			@Override
			public void onFailure(HttpException error, String msg) {
				Log.e("","==FuChanganTong MAC2=失败=>>" + msg);
			}

		});
	}
	
	@SuppressWarnings("unchecked")
	public final static void write(Iso7816.Tag tag,String amount,CordovaWebView webView){
		InitializeForLoadData reInitializeForLoadData = new InitializeForLoadData();
		
		Iso7816.Response INFO, CASH;
		
		// 激活卡片应用
		if (tag.selectByName(DFN_SRV_MONEY).isOkey()) {
			INFO = tag.readBinary(SFI_EXTRA);
			String cardNo = INFO.toString().substring(24, 34);
			card.setCardNo(cardNo);
			card.setCardSerial(cardNo+ "000000");
			
			CASH = tag.getBalance(true);
			
			// 1.校验PIN是否成功
			INFO = tag.verify();
			if ("9000".equals(INFO.toString())) {
				//拼装初始化数据的Data报文
				 reInitializeForLoadData.initData(amount,NfcConfig.TERMINAL_NO);
				 
				// 2 初始化充值数据
				 INFO = tag.initializeForLoad(reInitializeForLoadData);
				 String infoForLoadData = INFO.toString();
				 String moenyHex = infoForLoadData.substring(0, 8);// EP余额
				 card.setTranAmount(Util.parseInt(moenyHex, 16, 1));
				 card.setAmount(Integer.parseInt(amount));// 金额
				 String tranSerialHex = infoForLoadData.substring(8, 12);
				 card.setTranSerial(String.valueOf(Util.parseInt(tranSerialHex, 16, 1)));// 电子钱包联机交易序号
				 card.setTerminalNo(NfcConfig.TERMINAL_NO);
				 String randomHex = infoForLoadData.substring(16, 24);
				 card.setRandomNumber(randomHex);// 随机数
				 String macHex = infoForLoadData.substring(24, 32);
				 card.setMac(macHex);
				 
				 tmptag = tag;
				 
				 HardReader.webView=webView;
				 // 3获取系统时间time
				 String URLTime = NfcConfig.GETTIME_URL;
				 getTimeData(URLTime);
			}
		}
	}
	
	
	public static void getTimeData(String url) {

		HttpUtils http = new HttpUtils();
		RequestParams params = new RequestParams();
		Log.e("","==FuChanganTong 初始化数据系统时间=URL=>>" + url);
		http.send(HttpMethod.GET, url, params, new RequestCallBack<String>() {
			@Override
			public void onSuccess(ResponseInfo<String> responseInfo) {
				Log.e("","==FuChanganTong 初始化数据系统时间=返回报文=>>" + responseInfo.result);
				// --------------------------------------
				Gson gson = new Gson();
				TimeResponse xml = gson.fromJson(responseInfo.result,
						TimeResponse.class);
				Log.e("","==FuChanganTong 初始化数据系统时间==>>" + xml.getTime());
				card.setTradeDateTime(xml.getTime());
				// -----------------------------------------------------------------------
				dateTimeStr = xml.getTime();
				handler.sendEmptyMessage(0);
			}

			@Override
			public void onFailure(HttpException error, String msg) {
				Log.e("","==FuChanganTong 初始化数据系统时间=msg=>>" + msg);
			}

		});
	}
	
	@SuppressWarnings("unchecked")
	final static HardReader load(Iso7816.Tag tag, Resources res) {

		/*--------------------------------------------------------------*/
		// select PSF (1PAY.SYS.DDF01)
		/*--------------------------------------------------------------*/
		if (!tag.selectByName(DFN_PSE).isOkey() && !tag.selectByID(DFI_MF).isOkey())
			return null;		
		
		/*--------------------------------------------------------------*/
		// read balance
		/*--------------------------------------------------------------*/
		Iso7816.Response CASH = getBalance(tag);

		Iso7816.Response INFO = null;
		ArrayList<byte[]> LOG = new ArrayList<byte[]>();
		byte[] name = null;

		/*--------------------------------------------------------------*/
		// try to find AID list
		/*--------------------------------------------------------------*/
		ArrayList<byte[]> AIDs = findAIDs(tag);
		for (final byte[] aid : AIDs) {

			/*--------------------------------------------------------------*/
			// select Main Application
			/*--------------------------------------------------------------*/
			if ((name = selectAID(tag, aid)) != null) {
				/*--------------------------------------------------------------*/
				// read balance
				/*--------------------------------------------------------------*/
				if (!CASH.isOkey())
					CASH = getBalance(tag);

				/*--------------------------------------------------------------*/
				// read card info file, binary (21)
				/*--------------------------------------------------------------*/
				if (INFO == null || !INFO.isOkey())
					INFO = tag.readBinary(SFI_EXTRA);
				
				Log.d("--INFO--", "--INFO--"+INFO.toString());
				/*--------------------------------------------------------------*/
				// read log file, record (24)
				/*--------------------------------------------------------------*/
				LOG.addAll(readLog(tag, SFI_LOG));
			}
		}

		/*--------------------------------------------------------------*/
		// try to PXX AID
		/*--------------------------------------------------------------*/
		if ((INFO == null || !INFO.isOkey())
				&& ((name = selectAID(tag, DFN_PXX)) != null)) {

			if (!CASH.isOkey())
				CASH = getBalance(tag);

			INFO = tag.readBinary(SFI_EXTRA);
			LOG.addAll(readLog(tag, SFI_LOG));
		}

		/*--------------------------------------------------------------*/
		// try to 0x1001 AID
		/*--------------------------------------------------------------*/
		if ((INFO == null || !INFO.isOkey()) && tag.selectByID(DFI_EP).isOkey()) {
			name = DFI_EP;

			if (!CASH.isOkey())
				CASH = getBalance(tag);

			INFO = tag.readBinary(SFI_EXTRA);
			LOG.addAll(readLog(tag, SFI_LOG));
		}

		if (!CASH.isOkey() && INFO == null && LOG.isEmpty() && name == null)
			return null;

		/*--------------------------------------------------------------*/
		// build result string
		/*--------------------------------------------------------------*/
		final HardReader ret = new HardReader(tag, name, res);
		ret.parseBalance(CASH);

		if (INFO != null)
			ret.parseInfo(INFO, 0, false);

		ret.parseLog(LOG);

		return ret;
	}

	private static byte[] selectAID(Iso7816.Tag tag, byte[] aid) {
		if (!tag.selectByName(DFN_PSE).isOkey()
				&& !tag.selectByID(DFI_MF).isOkey())
			return null;

		final Iso7816.Response rsp = tag.selectByName(aid);
		if (!rsp.isOkey())
			return null;

		Iso7816.BerTLV tlv = Iso7816.BerTLV.read(rsp);
		if (tlv.t.match(BerT.TMPL_FCI)) {
			tlv = tlv.getChildByTag(BerT.CLASS_DFN);
			if (tlv != null)
				return tlv.v.getBytes();
		}

		return aid;
	}

	private static ArrayList<byte[]> findAIDs(Iso7816.Tag tag) {
		ArrayList<byte[]> ret = new ArrayList<byte[]>();

		for (int i = 1; i <= 31; ++i) {
			Iso7816.Response r = tag.readRecord(i, 1);
			for (int p = 2; r.isOkey(); ++p) {
				byte[] aid = findAID(r);
				if (aid == null)
					break;

				ret.add(aid);
				r = tag.readRecord(i, p);
			}
		}

		return ret;
	}

	private static byte[] findAID(Iso7816.Response record) {
		Iso7816.BerTLV tlv = Iso7816.BerTLV.read(record);
		if (tlv.t.match(TMPL_PDR)) {
			tlv = tlv.getChildByTag(BerT.CLASS_ADO);
			if (tlv != null) {
				tlv = tlv.getChildByTag(BerT.CLASS_AID);

				return (tlv != null) ? tlv.v.getBytes() : null;
			}
		}
		return null;
	}

	private static Iso7816.Response getBalance(Iso7816.Tag tag) {
		final Iso7816.Response rsp = tag.getBalance(true);
		return rsp.isOkey() ? rsp : tag.getBalance(false);
	}
}
