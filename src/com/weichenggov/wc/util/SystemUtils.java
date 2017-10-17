package com.weichenggov.wc.util;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import com.weichenggov.wc.main.Application;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.pm.Signature;
import android.telephony.TelephonyManager;

/**
 * 系统工具类
 * @author guohui
 * @date 2016-6-23 下午10:51:14
 */
public class SystemUtils {

	public static String getNumber(Context context) {
		TelephonyManager tm = (TelephonyManager) context
				.getSystemService(Context.TELEPHONY_SERVICE);
		String te1 = tm.getLine1Number();// 获取本机号码
		return te1;
	}

	/**
	 * @note 获得软件本身的版本号code
	 */
	public static int getVersionCode(Context context) {
		try {
			// PackageManager packageManager = context.getPackageManager();
			PackageInfo packInfo = context.getPackageManager().getPackageInfo(
					context.getPackageName(), 0);
			return packInfo.versionCode;
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * @note 根据包名获得程序的uiD
	 */
	public static int getuiD(Context context) {
		int uiD = 0;
		try {
			PackageManager pm = context.getPackageManager();
			ApplicationInfo ai = pm.getApplicationInfo(
					Constants.StaticConstant.PACKAGE_NAME,
					PackageManager.GET_ACTIVITIES);
			uiD = ai.uid;
		} catch (NameNotFoundException e) {
			e.printStackTrace();
		}
		return uiD;
	}

	/**
	 * @note 获得软件本身的版本名
	 */
	public static String getVersionName(Context context) {
		try {
			// PackageManager packageManager = context.getPackageManager();
			PackageInfo packInfo = context.getPackageManager().getPackageInfo(
					context.getPackageName(), 0);
			return packInfo.versionName;
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * @note 获得设备IMEI
	 */
	public static String getIMEI(Context context) {
		TelephonyManager manager = (TelephonyManager) context
				.getSystemService(Activity.TELEPHONY_SERVICE);
		// check if has the permission
		if (PackageManager.PERMISSION_GRANTED == context.getPackageManager()
				.checkPermission(Manifest.permission.READ_PHONE_STATE,
						context.getPackageName())) {
			if (manager.getDeviceId() != null) {
				return manager.getDeviceId();
			} else {
				return "";
			}
		} else {
			return "";
		}
	}

	/**
	 * 弹出拨号盘
	 * */
	public static void dial(String number) {
		Class<TelephonyManager> c = TelephonyManager.class;
		Method getITelephonyMethod = null;
		try {
			getITelephonyMethod = c.getDeclaredMethod("getITelephony",
					(Class[]) null);
			getITelephonyMethod.setAccessible(true);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		}

		try {
			TelephonyManager tManager = (TelephonyManager) Application.applicationContext
					.getSystemService(Context.TELEPHONY_SERVICE);
			Object iTelephony;
			iTelephony = (Object) getITelephonyMethod.invoke(tManager,
					(Object[]) null);
			Method dial = iTelephony.getClass().getDeclaredMethod("dial",
					String.class);
			dial.invoke(iTelephony, number);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 这个是获取SHA1的方法
	 * @param context
	 * @return
     */
	public static String getCertificateSHA1Fingerprint(Context context) {
		//获取包管理器
		PackageManager pm = context.getPackageManager();
		//获取当前要获取SHA1值的包名，也可以用其他的包名，但需要注意，
		//在用其他包名的前提是，此方法传递的参数Context应该是对应包的上下文。
		String packageName = context.getPackageName();
		//返回包括在包中的签名信息
		int flags = PackageManager.GET_SIGNATURES;
		PackageInfo packageInfo = null;
		try {
			//获得包的所有内容信息类
			packageInfo = pm.getPackageInfo(packageName, flags);
		} catch (NameNotFoundException e) {
			e.printStackTrace();
		}
		//签名信息
		Signature[] signatures = packageInfo.signatures;
		byte[] cert = signatures[0].toByteArray();
		//将签名转换为字节数组流
		InputStream input = new ByteArrayInputStream(cert);
		//证书工厂类，这个类实现了出厂合格证算法的功能
		CertificateFactory cf = null;
		try {
			cf = CertificateFactory.getInstance("X509");
		} catch (Exception e) {
			e.printStackTrace();
		}
		//X509证书，X.509是一种非常通用的证书格式
		X509Certificate c = null;
		try {
			c = (X509Certificate) cf.generateCertificate(input);
		} catch (Exception e) {
			e.printStackTrace();
		}
		String hexString = null;
		try {
			//加密算法的类，这里的参数可以使MD4,MD5等加密算法
			MessageDigest md = MessageDigest.getInstance("SHA1");
			//获得公钥
			byte[] publicKey = md.digest(c.getEncoded());
			//字节到十六进制的格式转换
			hexString = byte2HexFormatted(publicKey);
		} catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		} catch (CertificateEncodingException e) {
			e.printStackTrace();
		}
		return hexString;
	}

	/**
	 * 这里是将获取到得编码进行16进制转换
	 * @param arr
	 * @return
     */
	private static String byte2HexFormatted(byte[] arr) {
		StringBuilder str = new StringBuilder(arr.length * 2);
		for (int i = 0; i < arr.length; i++) {
			String h = Integer.toHexString(arr[i]);
			int l = h.length();
			if (l == 1)
				h = "0" + h;
			if (l > 2)
				h = h.substring(l - 2, l);
			str.append(h.toUpperCase());
			if (i < (arr.length - 1))
				str.append(':');
		}
		return str.toString();
	}

}
