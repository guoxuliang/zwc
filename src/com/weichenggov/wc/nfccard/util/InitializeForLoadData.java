package com.weichenggov.wc.nfccard.util;



/**

* InitializeForLoadData 用于封装初始化充值数据

* @author Administrator

* @Time 2016-06-22 09:49:01

*

*/
public class InitializeForLoadData extends Command {
	
	public InitializeForLoadData(){//805000020B    00
		
		this.setCLA((byte)0x80);
		this.setINS((byte)0x50);
		this.setP1((byte)0x00);
		this.setP2((byte)0x02);
		this.setLc((byte)0x0B);
		this.setLe((byte)0x10);
		
		
	}
	
	private byte[] ALL;//整个ADPU指令数据

	public byte[] getALL() {
		return ALL;
	}

	public void setALL(byte[] aLL) {
		ALL = aLL;
	}
	
	public void initData(String amount,String terminal_no){
		 byte[] moneyData = Util.codeMoney(amount);
		 byte[] terminalData = Util.codeTerminalCode(terminal_no);
		 
		 byte[] InitializeData2 = new byte[11];
		 InitializeData2[0] = (byte) 0x01;
		 for(int index=1;index<5;index++){
			 InitializeData2[index] = moneyData[index-1];
		 }
		 
		 for(int index=5;index<11;index++){
			 InitializeData2[index] = terminalData[index-5];
		 }
		 AddData(InitializeData2);
	}
	
    //加载Data
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