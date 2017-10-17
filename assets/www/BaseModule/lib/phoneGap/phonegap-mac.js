

/**
 * @return 返回mac地址
 */
 var MacAddress = {

 	getMacAddress: function(successCallback, failureCallback){
 		if(window.cordova){
 			cordova.exec(successCallback, failureCallback, 'MacAddressPlugin',
 		 			'getMacAddress', []);
 		}else{
 			successCallback("");
 		}
 		
 	}
 };

