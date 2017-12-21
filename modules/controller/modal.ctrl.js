/**
 * Created by sdergt on 2017/3/9.
 */
angular.module('core').controller('modalCtrl', ['$scope', '$http', '$uibModalInstance','items','$timeout','commonService','$stateParams',
    function ($scope, $http, $uibModalInstance,items,$timeout,commonService,$stateParams) {
    /*
     * 构件库数据展示
     * */
    commonService.comDetails(
        {
            "scope":items.scope,
            "componentId":items.componentId
        }
    ).then(function(data){
        var list = data.data;
        let _tempArr=[];
        $scope.list = data.data;
        $scope.list.attachment.map((item)=>{
            if(item.originalName.match('.png')||item.originalName.match('.jpg')||item.originalName.match('.jpeg')||item.originalName.match('.gif')){
                _tempArr.push(item);
            }
        })
        $scope.list.attachment=_tempArr
        //判断上传、下载、应用按钮显隐
        //console.log(list.subClassName, list.guid, list.md5, list.epId, list.originEpId, list.lastestClientVersion);
        $scope.status = BzCloudComp.GetCompType(list.subClassName, list.guid, list.md5, list.epId, list.originEpId, list.lastestClientVersion);
    })
    $scope.otherList = JSON.parse(BzCloudComp.GetCompDetail(items.componentId)).detail;
    $scope.selected = {
        item: $scope.items
    };

    //构建下载
    $scope.down = function (componentId,epId,originEpId,epName,originEpName) {
        BzCloudComp.DownloadComp(componentId,epId,originEpId,epName,originEpName);
        commonService.comDetails(
            {
                "scope": items.scope,
                "componentId":items.componentId
            }
        ).then(function(data){
            //console.log(data.data);
            var list = data.data;
            $scope.list = data.data;
            //判断上传、下载、应用按钮显隐
            $scope.status = BzCloudComp.GetCompType(list.subClassName, list.guid, list.md5, list.epId, list.originEpId, list.lastestClientVersion);
            var e = {
                componentId: componentId,
                epId: epId,
                orgEpId: originEpId,
                status: $scope.status
            }
        })
        var e = {
            componentId: componentId,
            epId: epId,
            orgEpId: originEpId,
            status: $scope.status
        }
        $uibModalInstance.close(e);
    };

    //应用
    $scope.apply = function(subClassName,guid,epId,originEpId){
        BzCloudComp.UseComp(subClassName,guid,epId,originEpId);
        $uibModalInstance.close();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.$on('listrepeatFinish', function () {
        $timeout(function () {
            $(".preview-small").map(function (i, val){
                $(val).children("span:first-of-type").find("img").css({"borderColor":"red"});
                var pre = $(val).children("span:first-of-type").find("img").attr("src");
                $(val).prev(".preview-big").find("img").attr("src",pre);
            })
            $('.component-modal .modal-left li .preview-small span').hover(function () {
                $('.component-modal .modal-left li .preview-small span img').css({"borderColor":"#ddd"});
                $(this).find("img").css({"borderColor":"red"});
                var previewSrc = $(this).find('img').attr('src');
                $(this).parent().siblings().find('img').attr('src', previewSrc)
            })
        }, 10)
    })

    //心跳
    commonService.heartBeat();
    }])