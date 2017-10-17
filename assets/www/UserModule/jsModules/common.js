

Date.getDayOfMonth = function (y, Mm) {
    if (typeof y == 'undefined') { y = (new Date()).getFullYear(); }
    if (typeof Mm == 'undefined') { Mm = (new Date()).getMonth(); }
    var Feb = (y % 4 == 0) ? 29 : 28;
    var aM = new Array(31, Feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    return  aM[Mm];
};

/**
 * 日期格式化
 * @param format    yyyy-MM-dd hh:mm:ss
 * @returns
 */
Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

/**
 * 返回上个月日期
 */
Date.getDateOfPreMonth = function (dt,subMonth) {
    if (typeof dt == 'undefined' || dt == null) { dt = (new Date()); }
    if (typeof subMonth == 'undefined' || subMonth == null) { subMonth = 1; }
    subMonth--;
    var y = (dt.getMonth()-subMonth == 0) ? (dt.getFullYear() - 1) : dt.getFullYear();
    var m = (dt.getMonth()-subMonth == 0) ? 11-subMonth : dt.getMonth() -subMonth - 1;
    var preM = Date.getDayOfMonth(y, m);
    var d = (preM < dt.getDate()) ? preM : dt.getDate();
    return new Date(y, m, d);
};

/**
 * 返回下个月日期
 */
Date.getDateOfNextMonth = function (dt, subMonth) {
    if (typeof dt == 'undefined' || dt == null) { dt = (new Date()); }
    if (typeof subMonth == 'undefined' || subMonth == null) { subMonth = 1; }
    subMonth--;
    var y = (dt.getMonth()+subMonth == 11) ? (dt.getFullYear() + 1) : dt.getFullYear();
    var m = (dt.getMonth()+subMonth == 11) ? subMonth : dt.getMonth() + subMonth + 1;
    var preM = Date.getDayOfMonth(y, m);
    var d = (preM < dt.getDate()) ? preM : dt.getDate();
    return new Date(y, m, d);
};

/**
 * 身份证校验
 */
function checkIdcard(idcard) {
	if(idcard) idcard = idcard.toUpperCase();
    var Errors = new Array(
    "验证通过!",
    "请输入18位身份证号!",
    "身份证号码出生日期超出范围或含有非法字符!",
    "身份证号码校验错误!",
    "身份证地区非法!"
    );
    var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
    //身份号码位数及格式检验
    switch (idcard.length) {
        /*case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
            } else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
            }
            if (ereg.test(idcard)) return Errors[0];
            else return Errors[2];
            break;*/
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
            } else {
                ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {//测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                    + parseInt(idcard_array[7]) * 1
                    + parseInt(idcard_array[8]) * 6
                    + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1); //判断校验位
                if (M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                else return Errors[3];
            }
            else return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}

/**
 * 相隔月份
 * @param subMonth
 * @returns {String}
 */
function getSubMonth(subMonth){
    var daysInMonth = new Array([0],[31],[28],[31],[30],[31],[30],[31],[31],[30],[31],[30],[31]);
    var date = new Date();
    var strYear = date.getFullYear();
    var strMonth = date.getMonth()+ 2 + parseInt(subMonth);
    if(subMonth > 0 && strMonth > 12){
        strYear += parseInt((strMonth-1)/12);
        strMonth = strMonth%12;
    }else if(subMonth <0 && strMonth <0){
        strYear -= -parseInt((strMonth)/12)+1;
        strMonth = 12 + strMonth%12;
    }else if(strMonth == 0){
        strYear--;
    }
    strMonth = strMonth == 0 ? 12 : strMonth;
    if(strYear%4 == 0 && strYear%100 != 0) daysInMonth[2] = 29;
    if(strMonth - 1 == 0){
        strYear -= 1;
        strMonth = 12;
    }
    else strMonth -= 1;
    if(strMonth < 10) strMonth = "0" + strMonth;
    datastr = strYear + "" + strMonth;
    return datastr;
}

function _get_time(){
    return new Date().getTime();
}

function getFontCount(str, length, renderDIV){
	var realLength = 0, len = str.length, charCode = -1;
	for (var i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) realLength += 1;
		else realLength += 2;
	}
	$("#" + renderDIV).html("<span>"+realLength+"</span>/200");
	if(realLength > length){
		return true;
	} else {
		return false;
	}
}

//参数分别为日期对象，增加的类型，增加的数量 
function dateAdd(date,strInterval, Number) {  
	var dtTmp = date;  
	switch (strInterval) {   
		case 'second':
		case 's' :
			return new Date(Date.parse(dtTmp) + (1000 * Number));  
		case 'minute':
		case 'n' :
			return new Date(Date.parse(dtTmp) + (60000 * Number));  
		case 'hour':
		case 'h' :
			return new Date(Date.parse(dtTmp) + (3600000 * Number)); 
		case 'day':                           
		case 'd' :
			return new Date(Date.parse(dtTmp) + (86400000 * Number)); 
		case 'week':                           
		case 'w' :
			return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
		case 'month':
		case 'm' :
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
		case 'year':
		case 'y' :
			return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
	}  
}

function getSex(cardNo){
	if(cardNo && cardNo.length==18){
		//获取性别 
		if (parseInt(cardNo.substr(16, 1)) % 2 == 1) { 
			return "男"; 
		} else { 
			return "女"; 
		} 
	}
	return null;
}
