'use strict';
var hostUrl = BzCloudComp.GetServerUrl();
let _promise=[];
let pageSize;
let isHighVersion=false;
if(BzCloudComp.GetVersion){
	const version = BzCloudComp.GetVersion();	
	const bool = compare(version,"5.7.1");
	isHighVersion = bool;
}else{
	isHighVersion = false;
}
console.log('isHighVersion',isHighVersion)
function compare(curV,reqV){  
  var arr1 = curV.split('.'),  
      arr2 = reqV.split('.');  
  var minLength=Math.min(arr1.length,arr2.length),  
      position=0,  
      diff=0;  
  while(position<minLength && ((diff=parseInt(arr1[position])-parseInt(arr2[position]))==0)){  
      position++;  
  }  
  diff=(diff!=0)?diff:(arr1.length-arr2.length);  
  //若curV大于reqV，则返回true  
  return diff>=0;  
}
_promise.push(new Promise((resolve, reject) => {
  getCode(resolve);
}))

Promise.all(_promise).then((pagesizeObj)=>{
	ApplicationConfiguration.pagesize=(function(){
		return {
			pageSize:pagesizeObj[0]
		}
	})();
})

function getCode(resolve){
	var pageSize;
	var url = hostUrl+"/rs/";
	$.ajax({
	    type: "GET",
	    url: url + 'component/getAuthCode',
	    contentType:'application/json;',
	    success: function(data){
	        var arr = data.data;
	        if(arr == '' || arr == undefined || arr == null){
	            if(window.screen.width > 1280){
	                if(window.screen.width == 1920){
	                    pageSize = 35;
	                }else{
	                    pageSize = 30;
	                }
	            }else{
	                pageSize = 24
	            }
	        }else{
	        	if(window.screen.width > 1280){
					pageSize = 30
				}else{
					pageSize = 24
				}
	        } 
	        resolve(pageSize);
	    },
	    error:function(error){
	        console.log(error);
	    }
	});

}

// console.log(window.screen.width);
       
var ApplicationConfiguration = (function(){
	// 应用程序名和依赖
	var applicationModuleName = 'appname';
	var applicationModuleVendorDependencies = ['ui.router','ui.bootstrap'];
	var tempList = [];

	// 添加新模块
	var registerModule = function(moduleName, dependencies) {
		angular.module(moduleName, dependencies || []);
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	var urls = {
        apiUrl: hostUrl
        // wwwUrl: 'https://www.suncloud.cn',
        // panelApiUrl: 'https://panel.suncloud.cn/api/index.php?r=',
        // loginUrl: 'https://passport.suncloud.cn/index.php?client_id=panel'
    };
  
    var pagesize = {
		pageSize: pageSize
	};
	var isHighversion = {
		isHighVersion: isHighVersion
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,
		urls:urls,
		tempList:tempList,
		pagesize:pagesize,
		isHighversion:isHighversion
	};


})();

