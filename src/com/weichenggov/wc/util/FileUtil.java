package com.weichenggov.wc.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import com.weichenggov.wc.main.Application;

//import com.ai.application.MyApplication;

import android.annotation.SuppressLint;
import android.os.Environment;
import android.util.Base64;


public class FileUtil {
	public static final String PATH;

	public static final String APP_PATH;

	static {
		PATH = Environment.getExternalStorageDirectory().getAbsolutePath()
				+ File.separator + "caf";
		APP_PATH = Application.applicationContext.getFilesDir()
				.getAbsolutePath();

	}

	public static File downLoadFile(String httpUrl, String fileName)
			throws Exception {
		return downLoadFile(httpUrl, PATH, fileName);
	}

	// 下载文件
	public static File downLoadFile(String httpUrl, String toPath,
			String fileName) throws Exception {
		File tmpFile = new File(toPath);
		if (!tmpFile.exists()) {
			tmpFile.mkdir();
		}

		File file = new File(toPath + "/" + fileName);

		if (file.exists()) {
			file.delete();
		}

		URL url = new URL(httpUrl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		InputStream is = conn.getInputStream();
		FileOutputStream fos = new FileOutputStream(file);
		byte[] buf = new byte[1024];
		int numRead = -1;

		conn.connect();
		if (conn.getResponseCode() >= 400) {
			throw new Exception("timeout");
		} else {
			if (is != null) {
				while ((numRead = is.read(buf)) != -1) {
					fos.write(buf, 0, numRead);
				}
			}
		}

		conn.disconnect();
		fos.close();
		is.close();

		return file;
	}

	// 保存文件
	public static void saveFile(String content, String fileName,
			boolean isAppend) {
		File tmpFile = new File(PATH);
		
		if (!tmpFile.exists()) {
			tmpFile.mkdir();
		}

		File file = new File(tmpFile, fileName);

		try {
			FileOutputStream fos = new FileOutputStream(file, isAppend);
			fos.write(content.getBytes());
			fos.flush();
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// 读取文件
	static String readFile(String fileName) throws Exception {

		String str = "";
		File targetFile = new File(PATH + fileName);
		if (targetFile != null && targetFile.exists()) {
			FileReader reader = new FileReader(targetFile);
			int len = 0;
			char[] buffer = new char[1024];
			while ((len = reader.read(buffer)) != -1) {
				str += new String(buffer, 0, len);
			}
			reader.close();
		}
		return str;
	}

	/**
	 * 从文件读取对象
	 * 
	 * @param dir
	 * @return
	 */
	public static Object readObject(String fileName) {
		if (fileName == null)
			return null;
		ObjectInputStream ois;
		try {
			ois = new ObjectInputStream(new BufferedInputStream(
					new FileInputStream(new File(APP_PATH, fileName))));
			return ois.readObject();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 保存对象到文件
	 * 
	 * @param dir
	 * @return
	 */
	public static boolean saveObject(Object obj, String fileName) {
		try {
			if (obj == null)
				return false;
			File file = new File(APP_PATH, fileName);
			if (file.exists())
				file.delete();
			if (!file.exists()) {
				file.createNewFile();
			}
			ObjectOutputStream oos = new ObjectOutputStream(
					new BufferedOutputStream(new FileOutputStream(file)));
			oos.writeObject(obj);
			oos.close();
			return true;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return false;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 文件转byte[]
	 * 
	 * @param filePath
	 * @return
	 */
	public static byte[] File2byte(String filePath) {
		byte[] buffer = null;
		try {
			File file = new File(filePath);
			FileInputStream fis = new FileInputStream(file);
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			byte[] b = new byte[1024];
			int n;
			while ((n = fis.read(b)) != -1) {
				bos.write(b, 0, n);
			}
			fis.close();
			bos.close();
			buffer = bos.toByteArray();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return buffer;
	}
	/**
	 * 文件转String
	 * 
	 * @param filePath
	 * @return
	 */
	@SuppressLint("NewApi")
	public static String File2String(String filePath) {
		String string = null;
		byte[] buffer = File2byte(filePath);
		string = Base64.encodeToString(buffer, Base64.DEFAULT);
		return string;
	}

	/**
	 * byte[]转文件
	 * 
	 * @param filePath
	 * @return
	 */
	public static void byte2File(byte[] buf, String filePath, String fileName) {
		BufferedOutputStream bos = null;
		FileOutputStream fos = null;
		File file = null;
		try {
			File dir = new File(filePath);
			if (!dir.exists() && dir.isDirectory()) {
				dir.mkdirs();
			}
			file = new File(filePath + File.separator + fileName);
			fos = new FileOutputStream(file);
			bos = new BufferedOutputStream(fos);
			bos.write(buf);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	
	/**
	 * 读取assets文件
	 * */
	public static String readFileToString(InputStream stream){
		try {
			return new String(InputStreamToByte(stream));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	
	/**
	 * 读取文件
	 * */
	public static byte[] InputStreamToByte(InputStream is) throws IOException {
		ByteArrayOutputStream bytestream = new ByteArrayOutputStream();
		int ch;
		while ((ch = is.read()) != -1) {
			bytestream.write(ch);
		}
		byte imgdata[] = bytestream.toByteArray();
		bytestream.close();
		return imgdata;
	}
}
