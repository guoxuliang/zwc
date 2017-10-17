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

import java.util.Arrays;

public final class Util {
	private final static char[] HEX = { '0', '1', '2', '3', '4', '5', '6', '7',
			'8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

	private Util() {
	}

	public static byte[] toBytes(int a) {
		return new byte[] { (byte) (0x000000ff & (a >>> 24)),
				(byte) (0x000000ff & (a >>> 16)),
				(byte) (0x000000ff & (a >>> 8)), (byte) (0x000000ff & (a)) };
	}

	public static int toInt(byte[] b, int s, int n) {
		int ret = 0;

		final int e = s + n;
		for (int i = s; i < e; ++i) {
			ret <<= 8;
			ret |= b[i] & 0xFF;
		}
		return ret;
	}

	public static int toIntR(byte[] b, int s, int n) {
		int ret = 0;

		for (int i = s; (i >= 0 && n > 0); --i, --n) {
			ret <<= 8;
			ret |= b[i] & 0xFF;
		}
		return ret;
	}

	public static int toInt(byte... b) {
		int ret = 0;
		for (final byte a : b) {
			ret <<= 8;
			ret |= a & 0xFF;
		}
		return ret;
	}

	public static String toHexString(byte[] d, int s, int n) {
		final char[] ret = new char[n * 2];
		final int e = s + n;

		int x = 0;
		for (int i = s; i < e; ++i) {
			final byte v = d[i];
			ret[x++] = HEX[0x0F & (v >> 4)];
			ret[x++] = HEX[0x0F & v];
		}
		return new String(ret);
	}

	public static String toHexStringR(byte[] d, int s, int n) {
		final char[] ret = new char[n * 2];

		int x = 0;
		for (int i = s + n - 1; i >= s; --i) {
			final byte v = d[i];
			ret[x++] = HEX[0x0F & (v >> 4)];
			ret[x++] = HEX[0x0F & v];
		}
		return new String(ret);
	}

	public static int parseInt(String txt, int radix, int def) {
		int ret;
		try {
			ret = Integer.valueOf(txt, radix);
		} catch (Exception e) {
			ret = def;
		}

		return ret;
	}

	public static String toAmountString(float value) {
		return String.format("%.2f", value);
	}

	public static byte[] codeTerminalCode(String data) {
		StringBuilder sb = new StringBuilder(data);
		String rs = sb.toString();
		byte[] bts = new byte[6];
		for (int index = 0; index < 6; index++) {
			String tmp = ("0x" + rs.substring(index, 2 * (index + 1)));
			byte b = (byte) Integer.parseInt(tmp.substring(2), 16);
			bts[index] = b;
		}
		return bts;

	}

	public static byte[] codeMoney(String amount) {

		String amountHex = Integer.toHexString(Integer.parseInt(amount));
		StringBuilder sb = new StringBuilder();
		int oCnt = 8 - amountHex.length();
		for (int index = 0; index < oCnt; index++) {
			sb.append("0");
		}
		sb.append(amountHex);

		String rs = sb.toString();
		byte[] bts = new byte[4];
		for (int index = 0; index < 4; index++) {
			String tmp = ("0x" + rs.substring(index, 2 * (index + 1)));
			byte b = (byte) Integer.parseInt(tmp.substring(2), 16);
			bts[index] = b;
		}
		return bts;
	}
	
	/**
	 * java字节码转16进制字符串
	 *
	 * @param b
	 * @return
	 */

	public static String byte2HexString(byte[] b) { // 一个字节的数
		// 转成16进制字符串
		String hs = "";
		String tmp = "";
		for (int n = 0; n < b.length; n++) {
			// 整数转成十六进制表示
			tmp = (Integer.toHexString(b[n] & 0XFF));
			if (tmp.length() == 1) {
				hs = hs + "0" + tmp;
			} else {
				hs = hs + tmp;
			}
		}

		tmp = null;
		return hs.toUpperCase(); // 转成大写
	}
	
	public static byte[] codeMac(String amount){
        StringBuilder sb = new StringBuilder();
        int oCnt =8-amount.length();
        for(int index=0;index<oCnt;index++){
            sb.append("0");
        }
        sb.append(amount);

        String rs = sb.toString();
        byte[] bts = new byte[4];
        for(int index=0;index<4;index++){
            String tmp = ("0x"+rs.substring(index,2*(index+1)));
            byte b = (byte) Integer.parseInt(tmp.substring(2), 16);
            bts[index] = b;
        }
        return  bts;
    }
	
	public static byte[] codeDate(String amount){
        StringBuilder sb = new StringBuilder();
        int oCnt =8-amount.length();
        for(int index=0;index<oCnt;index++){
            sb.append("0");
        }
        sb.append(amount);

        String rs = sb.toString();
        byte[] bts = new byte[4];
        for(int index=0;index<4;index++){
            String tmp = ("0x"+rs.substring(index,2*(index+1)));
            byte b = (byte) Integer.parseInt(tmp.substring(2), 16);
            bts[index] = b;
        }
        return  bts;
    }
	
	public static byte[] concatAll(byte[] first, byte[]... rest) {  
        int totalLength = first.length;  
        for (byte[] array : rest) {  
          totalLength += array.length;  
        }  
        byte[] result = Arrays.copyOf(first, totalLength);  
        int offset = first.length;  
        for (byte[] array : rest) {  
          System.arraycopy(array, 0, result, offset, array.length);  
          offset += array.length;  
        }  
        return result;  
      } 
	
	public static byte[] codeTime(String amount){
        StringBuilder sb = new StringBuilder();
        int oCnt =6-amount.length();
        for(int index=0;index<oCnt;index++){
            sb.append("0");
        }
        sb.append(amount);

        String rs = sb.toString();
        byte[] bts = new byte[3];
        for(int index=0;index<3;index++){
            String tmp = ("0x"+rs.substring(index,2*(index+1)));
            byte b = (byte) Integer.parseInt(tmp.substring(2), 16);
            bts[index] = b;
        }
        return  bts;
    }
}
