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

package com.weichenggov.wc.nfccard;

import com.weichenggov.wc.nfccard.util.PbocCard;

import android.annotation.SuppressLint;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import android.nfc.tech.NfcF;
import android.nfc.tech.NfcV;
import android.os.Parcelable;
import android.util.Log;

@SuppressLint("NewApi") 
public final class CardManager {
	//private static final String SP = "<br />------------------------------<br /><br />";
	private static final String SP = "<br />------------------------------</b><br />";

	public static String[][] TECHLISTS;
	public static IntentFilter[] FILTERS;

	static {
		try {
			TECHLISTS = new String[][] { { IsoDep.class.getName() },
					{ NfcV.class.getName() }, { NfcF.class.getName() }, };

			FILTERS = new IntentFilter[] { new IntentFilter(
					NfcAdapter.ACTION_TECH_DISCOVERED, "*/*") };
		} catch (Exception e) {
		}
	}

	public static String buildResult(String n, String i, String d, String x) {
		if (n == null)
			return null;

		final StringBuilder s = new StringBuilder();

		//s.append("<br/><b>").append(n).append("</b>");
		s.append(n);

		if (d != null)
			s.append(d);

		if (x != null)
			s.append(x);
		
		if (i != null)
			s.append(i);
		
		return s.toString();
	}

	public static String load(Parcelable parcelable, Resources res) {
		final Tag tag = (Tag) parcelable;
		

		Log.d("NFCTAG", "ffff");//isodep.transceive("45".getBytes()).toString());
		
//		final NfcV nfcv = NfcV.get(tag);
//		if (nfcv != null) {
//			return VicinityCard.load(nfcv, res);
//		}
//		
		final IsoDep isodep = IsoDep.get(tag);
		if (isodep != null) {
			return PbocCard.load(isodep, res);
		}

		

//		final NfcF nfcf = NfcF.get(tag);
//		if (nfcf != null) {
//			return OctopusCard.load(nfcf, res);
//		}

		return null;
	}
	
	public static PbocCard load2(Parcelable parcelable, Resources res) {
		final Tag tag = (Tag) parcelable;
		

		Log.d("NFCTAG", "ffff");//isodep.transceive("45".getBytes()).toString());
		
		final IsoDep isodep = IsoDep.get(tag);
		if (isodep != null) {
			return PbocCard.load2(isodep, res);
		}

		return null;
	}
	
}
