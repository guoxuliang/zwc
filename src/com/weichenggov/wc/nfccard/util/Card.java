package com.weichenggov.wc.nfccard.util;

public class Card {

	
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getCardSerial() {
		return cardSerial;
	}
	public void setCardSerial(String cardSerial) {
		this.cardSerial = cardSerial;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	
	
	
	@Override
	public String toString() {
		return "Card [cardNo=" + cardNo + ", cardSerial=" + cardSerial
				+ ", balance=" + balance + "]";
	}

	public String toXMLString() {
		return "<Request>"+
	    "<CardNo>"+cardNo+"</CardNo>"+
	    "<Amount>"+Amount+"</Amount>"+
	    "<CardSerial>"+cardSerial+"</CardSerial>"+
	    "<RandomNumber>"+RandomNumber+"</RandomNumber>"+
	    "<TranSerial>"+TranSerial+"</TranSerial>"+
	    "<TranAmount>"+TranAmount+"</TranAmount>"+
	   " <TranType>2</TranType>"+
	    "<TerminalNo>"+TerminalNo+"</TerminalNo>"+
	    "<Mac>"+Mac+"</Mac>"+
	    "<PsamNo>1234567890</PsamNo>"+
	    "<TradeDateTime>"+tradeDateTime+"</TradeDateTime>"+
	    "<OperatorId>001</OperatorId>"+
	"</Request>";
	}



	private String cardNo;
	private String cardSerial;
	private String balance;
	private Number Amount;
	private String RandomNumber;
	private String TranSerial;
	private String tradeDateTime;
	private String mac2;
	private String tac;

	public String getMac2() {
		return mac2;
	}
	public void setMac2(String mac2) {
		this.mac2 = mac2;
	}
	public String getTradeDateTime() {
		return tradeDateTime;
	}
	public void setTradeDateTime(String tradeDateTime) {
		this.tradeDateTime = tradeDateTime;
	}


	private Number TranAmount;
	private String TranType;
	private String TerminalNo;
	private String Mac;
	
	public Number getAmount() {
		return Amount;
	}
	public void setAmount(Number amount) {
		Amount = amount;
	}
	public String getRandomNumber() {
		return RandomNumber;
	}
	public void setRandomNumber(String randomNumber) {
		RandomNumber = randomNumber;
	}
	public String getTranSerial() {
		return TranSerial;
	}
	public void setTranSerial(String tranSerial) {
		TranSerial = tranSerial;
	}
	public Number getTranAmount() {
		return TranAmount;
	}
	public void setTranAmount(Number tranAmount) {
		TranAmount = tranAmount;
	}
	public String getTranType() {
		return TranType;
	}
	public void setTranType(String tranType) {
		TranType = tranType;
	}
	public String getTerminalNo() {
		return TerminalNo;
	}
	public void setTerminalNo(String terminalNo) {
		TerminalNo = terminalNo;
	}
	public String getMac() {
		return Mac;
	}
	public void setMac(String mac) {
		Mac = mac;
	}
	public String getTac() {
		return tac;
	}
	public void setTac(String tac) {
		this.tac = tac;
	}
	
}
