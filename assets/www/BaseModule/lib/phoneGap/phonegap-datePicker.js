/**
 * 日期/时间选择器插件
 * @author keyz@asiainfo.com
 * @since 2015-7-3
 * 
 */
var DatePicker = function() {

}  
DatePicker.prototype.showDateOrTime = function(action, successCallback,  
        failureCallback) {  
    return PhoneGap.exec(successCallback, // 成功后的回调函数  
    failureCallback, // 失败后的回调函数 
    'DatePickerPlugin', // 注册的插件名（java端）  
    action, // action  
    []); // 传给Java端的参数  
};  
  
//注册插件  
PhoneGap.addConstructor(function() {  
    // 如果不支持window.plugins,则创建并设置  
    if (!window.plugins) {  
        window.plugins = {};  
    }  
    window.plugins.datePickerPlugin = new DatePicker();  

}); 