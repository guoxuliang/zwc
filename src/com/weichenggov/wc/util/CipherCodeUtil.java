package com.weichenggov.wc.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

  
  
/******************************************************************************* 
 * AES加解密算法 
 *  
 * @author jueyue 
 *  
 
  加密用的Key 可以用26个字母和数字组成，最好不要用保留字符，虽然不会错，至于怎么裁决，个人看情况而定 
  此处使用AES-128-CBC加密模式，key需要为16位。 
   也是使用<span style="line-height: 1.5; font-size: 1em;">0102030405060708</span>
 */  
  
public class CipherCodeUtil {
    
    public static final String PASSWORD_CRYPT_KEY = "OtUTMq8xjSw4f2v9";
  
    // 加密  
    public static byte[] Encrypt(String sSrc, String sKey) throws Exception {  
        if (sKey == null) {  
            System.out.print("Key为空null");  
            return null;  
        }  
        // 判断Key是否为16位  
        if (sKey.length() != 16) {  
            System.out.print("Key长度不是16位");  
            return null;  
        }  
        byte[] raw = sKey.getBytes("utf-8");  
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");  
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");//"算法/模式/补码方式"  
        IvParameterSpec iv = new IvParameterSpec("0102030405060708".getBytes("utf-8"));//使用CBC模式，需要一个向量iv，可增加加密算法的强度  
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);  
        byte[] encrypted = cipher.doFinal(sSrc.getBytes("utf-8"));  
  
        return encrypted;//此处使用BAES64做转码功能，同时能起到2次加密的作用。  
    }  
  
    // 解密  
    public static byte[] Decrypt(byte[] encrypted1, String sKey) throws Exception {  
        try {  
            // 判断Key是否正确  
            if (sKey == null) {  
                System.out.print("Key为空null");  
                return null;  
            }  
            // 判断Key是否为16位  
//            if (sKey.length() != 16) {  
//                System.out.print("Key长度不是16位");  
//                return null;  
//            }  
            byte[] raw = sKey.getBytes("utf-8");  
            SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");  
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");  
            IvParameterSpec iv = new IvParameterSpec("0102030405060708"  
                    .getBytes("utf-8"));  
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);  
//            byte[] encrypted1 = Base64Util.decode(sSrc);//先用bAES64解密  
            try {  
                byte[] original = cipher.doFinal(encrypted1);  
                
                return original;
            } catch (Exception e) {  
                System.out.println(e.toString());  
                return null;  
            }  
        } catch (Exception ex) {  
            System.out.println(ex.toString());  
            return null;  
        }  
    }  
    
    public static void main(String[] args)
    {
    	String aa = "H4sIAAAAAAAAAAHQAC//GWi8KkoO77BtqsLxGhU+cUIF9E2e53m89uXLVUA0htJG0qj1+IlAzvmDkcvJpCliDUA2VhFvs9pEH0IgC+FcIqYpm7TqrnfC2WTGimTgFKhBfH7ul42/Ne75ZKS5eeUjeSNNGmOGyIMo5fuHHeSEQPmfo96w+kyE7bvTJ/DKgs6n/1+OFUY8rB0VtsVFKroXm4XqQAFgkYaXjvGIDG7NU6tFvEUSQCbfKctXYgpMEZpBh4diIBPINgX85D+knkLUkuPfj0fzmSMGUAS7JkLt0gFclNbQAAAA";
    	String gg = "H4sIAAAAAAAAAAEAAv/9GWi8KkoO77BtqsLxGhU+cUIF9E2e53m89uXLVUA0htJG0qj1+IlAzvmDkcvJpCliDUA2VhFvs9pEH0IgC+FcIqYpm7TqrnfC2WTGimTgFKhBfH7ul42/Ne75ZKS5eeUjeSNNGmOGyIMo5fuHHeSEQPmfo96w+kyE7bvTJ/DKgs5vqSdCo/zusCaQIkJMTmO4PbaArJSDoNDst/lHZoPDbFdpQmHHxQ033243Dw3Y2PWGgTT4vCiv+V9a6b+/7m4W6/1KHPxvcWJheac3QmhFVzliyiNrhjSHh3s/lXsgMPoLy5p22ZEv1aZyTh5Bo2a4LP7XtzY17GIIKqBqPlwRh238PDX4HKl5EmthNeCqAmWTxbOzfXz6qdwEaSgc5xoMioXP1swBDM4SIfzNJbN5YfX8JHSPbrX2ZfmJsHt+LgZekqqB1hxBNAS23FSvL637PO6D4UzYtgFcNM+5ZClow8bB1DyEZIpIh0ZJt4PCoKef6606WdFnS1CU/l8eGjojeFsGwdoVo2IGfbnAa7q721gZ8M4/7YhYJU7O818t1QPxRHqArCyQOtZh+A3VKa5EgascQT1hFcNV3NNN5GqNR4XBowDGEyat75GcSUn6RF9xWPmUch04+0VGcLuqKgLkR33u5Jtl+xItAkimBO9Dpio6T1pVYnx5oSqw+l/B5U3snAcQAAIAAA==";
    	String cc = "\"你好非常好";
    	try {
    	    String bb = new String(CipherCodeUtil.Decrypt(GZipUtils.decompress(Base64Util.decode(aa)), PASSWORD_CRYPT_KEY),"UTF-8");
			System.out.println(bb);
			
    	    String dd = new String(CipherCodeUtil.Decrypt(CipherCodeUtil.Encrypt(cc, PASSWORD_CRYPT_KEY), PASSWORD_CRYPT_KEY),"UTF-8");
			//System.out.println(dd);
    	    
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
  

} 