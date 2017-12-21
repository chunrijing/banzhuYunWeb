angular.module('core').controller('largeModalCtrl', ['$scope', '$http', '$uibModalInstance','items','$timeout','commonService','$stateParams',
    function ($scope, $http, $uibModalInstance,items,$timeout,commonService,$stateParams) {
        /*
         * 构件库数据展示
         * */
        console.log(items);
        commonService.uploadDetails(items).then(function(data){
            $scope.list = data.data;
        })

        $scope.otherList = JSON.parse(BzCloudComp.GetCompDetail(items)).detail;

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
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

        $scope.delete = function(){
            $('.isDelete').show();
        }
        /*var testParam = {
            componentId:items
        }*/
        $scope.deleteOk = function(){
            commonService.deleteCom(
                {
                    "componentId":items
                }
            ).then(function(data){
                console.log(data.data);
                $('.isDelete').hide();
                $uibModalInstance.close('deleteOk');
            })
        }

        $scope.deleteCancel = function(){
            $('.isDelete').hide();
        }


        //心跳
        commonService.heartBeat();
    }])