/**
 * Created by Administrator on 2017/4/23.
 */
/**
 * Created by sdergt on 2017/3/9.
 */
angular.module('core').controller('modalAuditCtrl', ['$scope', '$http', '$uibModalInstance','items','$timeout','commonService','$stateParams',
    function ($scope, $http, $uibModalInstance,items,$timeout,commonService,$stateParams) {
        /*
         * 审核意见修改
         * */
        $scope.check = false;
        $scope.pass = false;
        $scope.opinion = items.opinion;
        if(items.status == "待审核"){
            $scope.pass = true;
        }else if(items.status == "已通过" || items.status == "未通过"){
            $scope.check = true;
        }
        $scope.audited = function (status) {
            var opinion = $(".modal-audit textarea").val();
            commonService.idea(
                {
                    "componentId":items.componentId,
                    "opinion":opinion
                }).then(function(data){
                //console.log(data);
            })
            var componentId = items.componentId;
            if(status != 1){
                commonService.auditStatus(
                    {
                        "componentIds": [componentId],
                        "status": status
                    }
                ).then(function(data){
                    //console.log(data);
                })
            }
            $uibModalInstance.close(opinion);
        };
        $scope.selected = {
            item: $scope.items
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //心跳
        commonService.heartBeat();
    }])