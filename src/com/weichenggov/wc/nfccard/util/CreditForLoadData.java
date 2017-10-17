package com.weichenggov.wc.nfccard.util;



/**

* CreditForLoadData 用于封装执行充值的数据

* @author Administrator

* @Time 2016-06-22 09:49:01

*

*/
public class CreditForLoadData extends Command {

	
	public CreditForLoadData(){//805200000B
		
		this.setCLA((byte)0x80);
		this.setINS((byte)0x52);
		this.setP1((byte)0x00);
		this.setP2((byte)0x00);
		this.setLc((byte)0x0b);
		this.setLe((byte)0x04);
	/*	(byte) 0x80, // CLA Class
		(byte) 0x52, // INS Instruction
		(byte) 0x00, // P1 Parameter 1
		(byte) 0x00, // P2 Parameter 2//20160325 122746
		(byte) 0x0b, // Lc
*/		
		
		
	}
	
	/*(byte) 0x80, // CLA Class
	(byte) 0x52, // INS Instruction
	(byte) 0x00, // P1 Parameter 1
	(byte) 0x00, // P2 Parameter 2//20160325 122746
	(byte) 0x0b, // Lc
	(byte) 0x20,(byte) 0x16,(byte) 0x03, (byte) 0x25,   // Data����20160621
	(byte) 0x12,(byte) 0x27,(byte) 0x46,   // Data ʱ��12 27 46
	(byte) 0x24,(byte) 0x3D,(byte) 0x9C,(byte) 0xF4,// Data MAC2 243D9CF4504947FD
	
	(byte) 0x00,//Le
*/	
	
	private byte[] ALL;

	public byte[] getALL() {
		return ALL;
	}

	public void setALL(byte[] aLL) {
		ALL = aLL;
	}

	public void  AddData(byte[] data) {
		
		this.ALL=new byte[17];
		this.ALL[0]=this.getCLA();
		this.ALL[1]=this.getINS();
		this.ALL[2]=this.getP1();
		this.ALL[3]=this.getP2();
		this.ALL[4]=this.getLc();
		for (int i = 0; i < data.length; i++) {
			this.ALL[5+i]=data[i];
		}
		this.ALL[16]=this.getLe();
	}
	
}
