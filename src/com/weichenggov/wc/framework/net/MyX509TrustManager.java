package com.weichenggov.wc.framework.net;

import java.math.BigInteger;
import java.security.Principal;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.X509TrustManager;

public class MyX509TrustManager implements X509TrustManager{

	@Override
	public void checkClientTrusted(X509Certificate[] chain, String authType)
			throws CertificateException {
		if(null != chain){
			for(int k=0; k < chain.length; k++){
				X509Certificate cer = chain[k];
				print(cer);
			}
		}
	}

	@Override
	public void checkServerTrusted(X509Certificate[] chain, String authType)
			throws CertificateException {
		if(null != chain){
			for(int k=0; k < chain.length; k++){
				X509Certificate cer = chain[k];
				print(cer);
			}
		}
	}

	@Override
	public X509Certificate[] getAcceptedIssuers() {
		return null;
	}
	
	
	private void print(X509Certificate cer){
		int version = cer.getVersion();
		String sinname = cer.getSigAlgName();
		String type = cer.getType();
		String algorname = cer.getPublicKey().getAlgorithm();
		BigInteger serialnum = cer.getSerialNumber();
		Principal principal = cer.getIssuerDN();
		String principalname = principal.getName();
	}
	
}