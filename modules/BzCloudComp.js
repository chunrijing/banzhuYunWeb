var BzCloudComp; 
	if(!BzCloudComp) 
	BzCloudComp = {};	
	(function() {
		// 获取构件的状态 返回值(0 下载 1 更新 2 应用 3 版本过高 负数 正在下载（取正是百分比）)
		BzCloudComp.GetCompType = function(type, strCompGUID, strCompMd5, strCompID, strSourceCompId, strVersion)
		{
			// type 构件的小类
			// strCompGUID 构件的GUID
			// strCompMd5 构件的MD5值
			// strCompID 构件的企业ID
			// strSourceCompId 构件来源Id
			// strVersion 版本号
			//native function GetCompType(type, strCompGUID, strCompMd5, strCompID, strSourceCompId, strVersion);
			//return GetCompType(type, strCompGUID, strCompMd5, strCompID, strSourceCompId, strVersion);
		};

		// 应用构件
		BzCloudComp.UseComp = function(type, strCompGUID, strCompID, strSourceCompId)
		{
			// type 构件的小类
			// strCompGUID 构件的GUID
			// strCompID 构件的企业ID
			// strSourceCompId 构件来源Id（没有时设为0）
			//native function UseComp(type, strCompGUID, strCompID, strSourceCompId);
			//return UseComp(type, strCompGUID, strCompID, strSourceCompId);
		};

		// 获取构件的详细信息 返回值(json{"detail":[{"key":"","value":"","name":""}]})
		BzCloudComp.GetCompDetail = function(Id)
		{
			// Id 构件Id
			//native function GetCompDetail(Id);
			//return GetCompDetail(Id);
		};
		
		// 下载
		BzCloudComp.DownloadComp = function(Id, epId, orgEpId, strEpName, strOrgEpName)
		{
			// Id 构件Id
			//native function DownloadComp(Id, epId, orgEpId, strEpName, strOrgEpName);
			//return DownloadComp(Id, epId, orgEpId, strEpName, strOrgEpName);
		};


		// 批量下载
		BzCloudComp.BatchDownloadComp = function(strJson)
		{
			// strJson(json{[{"id":"","epId":"","orgEpId":"","epName":"", "orgEpName":""}]})
			//native function BatchDownloadComp(strJson);
			//return BatchDownloadComp(strJson);
		};

		// 获取上传构件 返回值({"name":"","identify":"","tier":"","type":"", "status":"","children":""})
		BzCloudComp.GetUpLoadDetail = function()
		{
			//native function GetUpLoadDetail();
			//return GetUpLoadDetail();
		};

		// 上传
		BzCloudComp.UpLoadDetail = function(IsPublic, strJson, strStruct)
		{
			// IsPublic 是否公开构件
			// strJson(json[{"identify":"","type":"","status":""}])
			// strStruct 组织结构Id
			//native function UpLoadDetail(IsPublic, strJson, strStruct);
			//return UpLoadDetail(IsPublic, strJson, strStruct);
		};
		
		// 取消上传
		BzCloudComp.CancelUpLoad = function()
		{
			//native function CancelUpLoad();
			//return CancelUpLoad();
		};

		// 取消上传
		BzCloudComp.CancelUpLoad = function()
		{
			//native function CancelUpLoad();
			//return CancelUpLoad();
		};

		// 获取企业类别(0: 普通用户 1：特殊企业用户 2: 其他企业用户)
		BzCloudComp.GetEpType = function()
		{
			//native function GetEpType();
			//return GetEpType();
		};

		// 获取服务器地址
		BzCloudComp.GetServerUrl = function()
		{
			//native function GetServerUrl();
			return "http://192.168.3.103:9000/banzhucls";
		};

})();	