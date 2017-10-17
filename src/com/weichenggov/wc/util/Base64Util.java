package com.weichenggov.wc.util;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

public class Base64Util {

  private static final char[] mBase64EncodeChars = new char[] { 'A', 'B', 'C',
      'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
      'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
      't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6',
      '7', '8', '9', '+', '/'                   };
  private static final byte[] mBase64DecodeChars = new byte[] { -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
      -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1,
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 };

  private Base64Util() {
  }

  /**
   * 将字节数组编码为字符串
   *
   * @param data
   */
  public static String encode(byte[] data) {
    StringBuffer sb = new StringBuffer();
    int len = data.length;
    int i = 0;
    int b1, b2, b3;
    while (i < len) {
      b1 = data[i++] & 0xff;
      if (i == len) {
        sb.append(mBase64EncodeChars[b1 >>> 2]);
        sb.append(mBase64EncodeChars[(b1 & 0x3) << 4]);
        sb.append("==");
        break;
      }
      b2 = data[i++] & 0xff;
      if (i == len) {
        sb.append(mBase64EncodeChars[b1 >>> 2]);
        sb.append(mBase64EncodeChars[((b1 & 0x03) << 4) | ((b2 & 0xf0) >>> 4)]);
        sb.append(mBase64EncodeChars[(b2 & 0x0f) << 2]);
        sb.append("=");
        break;
      }
      b3 = data[i++] & 0xff;
      sb.append(mBase64EncodeChars[b1 >>> 2]);
      sb.append(mBase64EncodeChars[((b1 & 0x03) << 4) | ((b2 & 0xf0) >>> 4)]);
      sb.append(mBase64EncodeChars[((b2 & 0x0f) << 2) | ((b3 & 0xc0) >>> 6)]);
      sb.append(mBase64EncodeChars[b3 & 0x3f]);
    }
    return sb.toString();
  }

  /**
   * 将base64字符串解码为字节数组
   *
   * @param str
 * @throws UnsupportedEncodingException 
   */
  public static byte[] decode(String str) throws UnsupportedEncodingException {
    byte[] data = str.getBytes("UTF-8");
    int len = data.length;
    ByteArrayOutputStream buf = new ByteArrayOutputStream(len);
    int i = 0;
    int b1, b2, b3, b4;
    while (i < len) {
      /* b1 */
      do {
        b1 = mBase64DecodeChars[data[i++]];
      } while (i < len && b1 == -1);
      if (b1 == -1) {
        break;
      }
      /* b2 */
      do {
        b2 = mBase64DecodeChars[data[i++]];
      } while (i < len && b2 == -1);
      if (b2 == -1) {
        break;
      }
      buf.write((int) ((b1 << 2) | ((b2 & 0x30) >>> 4)));
      /* b3 */
      do {
        b3 = data[i++];
        if (b3 == 61) {
          return buf.toByteArray();
        }
        b3 = mBase64DecodeChars[b3];
      } while (i < len && b3 == -1);
      if (b3 == -1) {
        break;
      }
      buf.write((int) (((b2 & 0x0f) << 4) | ((b3 & 0x3c) >>> 2)));
      /* b4 */
      do {
        b4 = data[i++];
        if (b4 == 61) {
          return buf.toByteArray();
        }
        b4 = mBase64DecodeChars[b4];
      } while (i < len && b4 == -1);
      if (b4 == -1) {
        break;
      }
      buf.write((int) (((b3 & 0x03) << 6) | b4));
    }
    return buf.toByteArray();
  }
  
  
  public static String getBaseStringByBitmap(Bitmap bitmapRaw) {
		ByteArrayOutputStream picData = new ByteArrayOutputStream();
		String base64String = "";
		try {
			double ratetmp = bitmapRaw.getWidth() / 360.0;
			int wtmp = bitmapRaw.getWidth();
			int htmp = bitmapRaw.getHeight();
			if (ratetmp > 1.0) {
				wtmp = (int) (bitmapRaw.getWidth() / ratetmp);
				htmp = (int) (bitmapRaw.getHeight() / ratetmp);
			}
			Bitmap bitmap = Bitmap.createScaledBitmap(bitmapRaw, wtmp, htmp,
					true);
			bitmap.compress(Bitmap.CompressFormat.PNG, 100, picData);
			bitmapRaw.recycle();
			bitmapRaw = null;
			bitmap.recycle();
			bitmap = null;
			// 下面获取压缩比例
			BitmapFactory.Options options = new BitmapFactory.Options();
			options.inJustDecodeBounds = true; // 设置了此属性一定要记得将值设置为false
			Bitmap bmap = BitmapFactory.decodeByteArray(picData.toByteArray(),
					0, picData.toByteArray().length, options);
			options.inJustDecodeBounds = false;
			int be = options.outHeight / 360;
			if (be <= 0) {
				be = 1;
			}
			options.inSampleSize = be;
			bmap = BitmapFactory.decodeByteArray(picData.toByteArray(), 0,
					picData.toByteArray().length, options);
			picData.close();

			picData = new ByteArrayOutputStream();// 重新转换
			bmap.compress(Bitmap.CompressFormat.PNG, 100, picData);

			base64String = Base64.encodeToString(picData.toByteArray(),
					Base64.DEFAULT);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return base64String;
	}
}
