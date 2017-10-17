package com.weichenggov.wc.nfccard.util;

/**

* Command 用于封装基本命令的结构

* @author Administrator

* @Time 2016-06-22 09:49:01

*

*/

public class Command {
	
	private byte CLA;
	private byte INS;
	private byte P1;
	private byte P2;
	private byte Lc;
	private byte Le;
	private byte Data[];
	public byte getCLA() {
		return CLA;
	}
	public void setCLA(byte cLA) {
		CLA = cLA;
	}
	public byte getINS() {
		return INS;
	}
	public void setINS(byte iNS) {
		INS = iNS;
	}
	public byte getP1() {
		return P1;
	}
	public void setP1(byte p1) {
		P1 = p1;
	}
	public byte getP2() {
		return P2;
	}
	public void setP2(byte p2) {
		P2 = p2;
	}
	public byte getLc() {
		return Lc;
	}
	public void setLc(byte lc) {
		Lc = lc;
	}
	public byte getLe() {
		return Le;
	}
	public void setLe(byte le) {
		Le = le;
	}
	public byte[] getData() {
		return Data;
	}
	public void setData(byte[] data) {
		Data = data;
	}
	

}
