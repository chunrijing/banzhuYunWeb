'use strict';
/**
 * upload
 */
angular.module('core').controller('uploadCtrl', ['$scope', 'commonService', '$uibModal',
    function ($scope, commonService, $uibModal) {
        $scope.isAduit = false;
        var dumpVal;//分页器跳转框的值
        var pageSize = ApplicationConfiguration.pagesize.pageSize;
        $scope.pageSize = pageSize;
        var isHighVersion = ApplicationConfiguration.isHighversion.isHighVersion;
        $scope.isHighVersion = isHighVersion;

        $(".upload .main .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
        $(".audit .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
        $(".component-info .clearfix .preview-big>img").attr({"src":"imgs/placeholder.png","_src":""});

        window.onresize = function () {
            $(".tableBody").css("width", $(".container-fluid").css("width"));
        };
        /*
        * 我的上传页面数据
        * */
        //显示加载中
        layer.load(2, { shade: false });
        commonService.uploadList(
            {
                "status": null,
                "componentDisplayName": "",
                "originEpId": null,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
        ).then(function (data) {
            //关
            setTimeout(function () {
                layer.closeAll('loading');
            }, 10);
            $scope.uploadList = data.data.itemList;
            defaultImg($scope.uploadList);
            //所有页面中的项目总数
            $scope.bigTotalItems = data.data.totalRowCount;
            changeStatus($scope.uploadList);
            $scope.totalItems = data.data.totalRowCount;
            $scope.status = null;
            $scope.searchText = "";
            $scope.originEpId = null;
            var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
            if ($scope.uploadList.length == 0) {
                $(".upload .pagination").hide();
                $(".upload .component-list").append(temp);
            } else {
                $(".upload .pagination").show();
            }
        });

        //更改状态数字为中文
        function changeStatus(list) {
            angular.forEach(list, function (data, index, arr) {
                if (data.status == 1) {
                    data.status = "待审核"
                }
                if (data.status == 2) {
                    data.status = "已通过"
                }
                if (data.status == 3) {
                    data.status = "未通过"
                }
            })
        }

        /*
        * 封装数据请求函数
        * */
        var obj = {
            /* "status":$scope.status,
             "componentDisplayName":searchText,
             "originEpId":$scope.originEpId,
             "order":"DESC",
             "currentPage":1,
             "pageSize":60*/
        }
        function getUploadList(obj) {
            $(".upload .main .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
            if ($scope.originEpId == 'null' || $scope.originEpId == '') {
                $scope.originEpId = null
            }
            if ($(".upload .component-list h4").length >= 0) {
                $(".upload .component-list h4").remove();
            }
            //显示加载中
            layer.load(2, { shade: false });
            commonService.uploadList(obj).then(function (data) {
                //关
                setTimeout(function () {
                    layer.closeAll('loading');
                }, 10);
                $scope.uploadList = data.data.itemList;
                defaultImg($scope.uploadList);
                changeStatus($scope.uploadList);
                //所有页面中的项目总数
                $scope.bigTotalItems = data.data.totalRowCount;
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if ($scope.uploadList.length == 0) {
                    $(".upload .pagination").hide();
                    $(".upload .component-list").append(temp);
                } else {
                    $(".upload .pagination").show();
                }
            })
        }

        /*
         * 获取当前登录用户权限码
         * */
        commonService.getPermis().then(function (data) {
            var arr = data.data;
            var orgShow = BzCloudComp.GetEpType();
            if (orgShow == 2 && arr != "") {
                $scope.orgShow = true;
            }
            arr = arr.split(";");
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == "30002003") {
                    $scope.isAduit = true;
                }
            }
        })

        //清空input框的值 20170508注释
        // $('.searchtext').click(function () {
        //     $(this).val('');
        // })

        //默认图
        function defaultImg(arr) {
            arr.map((item) => {
                if (item.attachment.length == 0) {
                    item.attachment[0] = {};
                    item.attachment[0].displayUrl = 'imgs/placeholder.png'
                }
            })
            //$scope.$apply();
        }


        //顶部搜索构件
        $scope.search = function (e, searchText) {
            if (e && e.keyCode != 13 && e.keyCode != 10) {
                return false;
            }
            $scope.searchText = searchText;
            obj = {
                "status": $scope.status,
                "componentDisplayName": searchText,
                "originEpId": null,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
            getUploadList(obj);
        }

        //左侧审核状态切换
        $scope.getComponent = function (status, $event) {
            $scope.currentPage = 1;
            $scope.status = status;
            obj = {
                "status": status,
                "componentDisplayName": "",
                "originEpId": null,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
            getUploadList(obj);
        }

        /*
        * 查看审核意见
        * */
        $scope.getOpinion = function (opinion) {
            if (opinion == '') {
                $scope.opinion = "暂无";
            } else {
                $scope.opinion = opinion;
            }
        }

        /*
         * 分页器
         * */
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function (pageNo) {
            obj = {
                "status": $scope.status,
                "componentDisplayName": $scope.searchText,
                "originEpId": $scope.originEpId,
                "order": "DESC",
                "currentPage": pageNo,
                "pageSize": pageSize
            }
            getUploadList(obj);
            $scope.page = pageNo;
        };
        //分页大小限制号码。
        $scope.maxSize = 5;

        /*分页器跳转
         * params  value
         * return currentPage
         * */
        var dumpVal;
        function getDumpVal() {
            dumpVal = $('.dump-inp input').val();
            return dumpVal;
        }

        /*分页器跳转
         * params  value
         * return currentPage
         * */
        //$scope.setPage(getDumpVal());
        $scope.getDumpOk = function (e, numPages) {
            if (e && e.keyCode != 13) {
                return false;
            }

            var page = parseInt(getDumpVal());
            if (page > numPages) {
                alert('查询页码超出范围，请重新输入');
                $('.dump-inp input').val("");
                return false;
            }
            $scope.setPage(getDumpVal());
            obj = {
                "status": $scope.status,
                "componentDisplayName": $scope.searchText,
                "originEpId": $scope.originEpId,
                "order": "DESC",
                "currentPage": page,
                "pageSize": pageSize
            }
            getUploadList(obj);
            $scope.page = page;
            $('.dump-inp input').val("");
        };

        //返回顶部
        $('.return-top').click(function () {
            $('.componet-base-main').animate({ scrollTop: 0 }, 500);
        });


        /*
         * 上传构件
         * */
        $scope.uploadCom = function () {
            if($scope.isHighVersion){
                let zNodes = BzCloudComp.GetUpLoadDetail();
                if (zNodes == '') {
                    document.title = '提示';
                    alert("当前无可上传构件!");
                    return
                }  
            }else{
                alert("客户端版本过低，请升级到最新版本！");
                return
            }

            var modalInstance = $uibModal.open({
                windowClass: 'uploadCom-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/component/uploadCom.html',
                controller: 'uploadComCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });
        }

        /*按上传时间排序*/
        $scope.order = function ($event) {
            let _dom;
            if ($($event.target).hasClass('glyphicon')) {
                _dom = $($event.target).parent();
            } else {
                _dom = $($event.target);
            }
            $(_dom).toggleClass('showOrder');
            if ($(".showOrder").length == 1) {
                obj = {
                    "status": $scope.status,
                    "componentDisplayName": $scope.searchText,
                    "originEpId": $scope.originEpId,
                    "order": "ASC",
                    "currentPage": $scope.page,
                    "pageSize": pageSize
                }
                getUploadList(obj);
            } else {
                obj = {
                    "status": $scope.status,
                    "componentDisplayName": $scope.searchText,
                    "originEpId": $scope.originEpId,
                    "order": "DESC",
                    "currentPage": $scope.page,
                    "pageSize": pageSize
                }
                getUploadList(obj);
            }
        }

        /*
         * 初始化模态框
         * 初始化参数配置
         * */
        $scope.componetModal = function (componentId) {
            $scope.items = componentId;
            var modalInstance = $uibModal.open({
                windowClass: 'component-modal largePattern-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/largeModal.html',
                controller: 'largeModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if (selectedItem == 'deleteOk') {
                    obj = {
                        "status": $scope.status,
                        "componentDisplayName": $scope.searchText,
                        "originEpId": $scope.originEpId,
                        "order": "DESC",
                        "currentPage": $scope.page,
                        "pageSize": pageSize
                    }
                    //$timeout(function(){
                    getUploadList(obj);
                    //},500)
                }

            }, function () {

            });
        };

        //心跳
        commonService.heartBeat();

    }]);