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

import com.weichenggov.wc.main.R;

import android.content.res.Resources;
import android.util.Log;


final class ChanganTong extends PbocCard {
	private final static byte[] DFN_SRV_MONEY = { (byte) 0xA0, (byte) 0x00,
			(byte) 0x00, (byte) 0x00, (byte) 0x03, (byte) 0x86, (byte) 0x98,
			(byte) 0x07, (byte) 0x01, };

	private final static byte[] DFN_SRV_CARDNO = {(byte) 0x88, (byte) 0x89 , 
		(byte) 0x89 , (byte) 0x75 , (byte) 0x84 , (byte) 0x46 ,
		(byte) 0x68 , (byte) 0x68 , (byte) 0x70 , (byte) 0x56,};
	
	
	private ChanganTong(Iso7816.Tag tag, Resources res) {
		super(tag);
		name = res.getString(R.string.name_cac);
	}

	@SuppressWarnings("unchecked")
	final static ChanganTong load(Iso7816.Tag tag, Resources res) {
	    ChanganTong ret =null ;
		/*--------------------------------------------------------------*/
		// select PSF (1PAY.SYS.DDF01)
		/*--------------------------------------------------------------*/
		if (tag.selectByName(DFN_PSE).isOkey()) {

			Iso7816.Response INFO, CASH;

			/*--------------------------------------------------------------*/
			// select Main Application
			/*--------------------------------------------------------------*/
			if (tag.selectByName(DFN_SRV_CARDNO).isOkey()) {

				
				/*--------------------------------------------------------------*/
				// read card info file, binary (21)
				/*--------------------------------------------------------------*/
				INFO = tag.readBinary(SFI_EXTRA);
				Log.d("--INFO--", "--INFO--"+INFO.toString().substring(188,222));
				/*--------------------------------------------------------------*/
				// read balance
				/*--------------------------------------------------------------*/
				char[] chars = INFO.toString().substring(188,222).toCharArray();
				StringBuilder sb = new StringBuilder();
				for(int index=0;index<chars.length;index++){
					if(index%2!=0){
						sb.append(chars[index]);
					}
				}
				
				/*--------------------------------------------------------------*/
				// read log file, record (24)
				/*--------------------------------------------------------------*/
				ArrayList<byte[]> LOG = readLog(tag, SFI_LOG);

				/*--------------------------------------------------------------*/
				// build result string
				/*--------------------------------------------------------------*/
				ret = new ChanganTong(tag, res);
				if(ret!=null&&LOG!=null){
				ret.parseInfo(INFO,sb.toString(),2, false);
//				ret.parseInfo(INFO, 0, true);
				ret.parseLog(LOG);
				}
			}
			
			if (tag.selectByName(DFN_SRV_MONEY).isOkey())
			{
				CASH = tag.getBalance(true);
				ret.parseBalance(CASH);
			}
			
			return ret;
		}

		return null;
	}
}
