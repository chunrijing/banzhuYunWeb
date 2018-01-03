'use strict';
/**
 * audit
 */
angular.module('core').controller('auditCtrl', ['$scope', '$http', '$rootScope', '$uibModal', 'commonService', '$timeout', '$compile', '$state',
    function ($scope, $http, $rootScope, $uibModal, commonService, $timeout, $compile, $state) {
        $scope.sidebar = 'audit';
        $scope.flag = {}
        $scope.status = null;
        $scope.isUpload = false;

        $(".upload .main .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
        $(".audit .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
        $(".component-info .clearfix .preview-big>img").attr({"src":"imgs/placeholder.png","_src":""});

        var pageSize = ApplicationConfiguration.pagesize.pageSize;
        $scope.pageSize = pageSize;

        window.onresize = function () {
            $(".tableBody").css("width", $(".container-fluid").css("width"));
        };

        //获取auditList
        function aduit() {
            //显示加载中
            layer.load(2, { shade: false });
            commonService.aduitList(
                {
                    status: null,
                    componentDisplayName: "",
                    originEpId: null,
                    order: "DESC",
                    currentPage: 1,
                    pageSize: pageSize
                }
            ).then(function (data) {
                //关
                setTimeout(function () {
                    layer.closeAll('loading');
                }, 10);
                //所有页面中的项目总数
                $scope.bigTotalItems = data.data.totalRowCount;
                $scope.statusCount = data.data.totalRowCount;
                $scope.auditList = data.data.itemList;
                //componentListUpdata();
                defaultImg($scope.auditList);
                componentListUpdata();
                //console.log(data.data);
                changeStatus($scope.auditList);
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if ($scope.auditList.length == 0) {
                    $(".audit .pagination").hide();
                    $(".audit .table-body").append(temp);
                } else {
                    $(".audit .pagination").show();
                }
            });
            $scope.statusCheck = "记录";
            $scope.order = "DESC";
            $scope.status = null;
            $scope.searchText = "";
            $scope.comSource = null;
            $scope.currentPage = 1;
        }

        aduit();
        //左侧抽屉切换
        /*$(".component-base .source>li p").click(function(){
            $(this).next("ul").show();
            $(".component-base .source>li p").removeClass("btnActive");
            $(this).addClass("btnActive");
        })*/

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
                if (arr[i] == "30002001") {
                    $scope.isUpload = true;
                }
            }
        })

        /*
         * 封装数据请求函数
         * */
        var obj = {};
        function getAduitList(obj, callback) {
            $(".audit .tableBody img").attr({"src":"imgs/placeholder.png","_src":""});
            if ($scope.comSource == 'null' || $scope.comSource == '') {
                $scope.comSource = null
            }
            if ($(".audit .table-body h4").length >= 0) {
                $(".audit .table-body h4").remove();
            }

            //显示加载中
            layer.load(2, { shade: false });
            //关
            setTimeout(function () {
                layer.closeAll('loading');
            }, 10);
            commonService.aduitList(obj).then(function (data) {
                //关
                setTimeout(function () {
                    layer.closeAll('loading');
                }, 10);
                $scope.statusCount = data.data.totalRowCount;
                $scope.auditList = data.data.itemList;
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if ($scope.auditList.length == 0) {
                    $(".audit .pagination").hide();
                    $(".audit .table-body").append(temp);
                } else {
                    $(".audit .pagination").show();
                }
                defaultImg($scope.auditList);
                changeStatus($scope.auditList);
                //所有页面中的项目总数
                $scope.bigTotalItems = data.data.totalRowCount;
                componentListUpdata();
                if (typeof callback == 'function') {
                    callback();
                }
            })
        }

        //监听ng-repeat是否完成
        /*$scope.$on('listrepeatFinish', function () {
            //console.log("listrepeatFinish + aduit.js")
            $timeout(function () {
                componentListUpdata();
            })
        })*/
        //构建列表状态更新
        window.componentListUpdata = function componentListUpdata() {
            $scope.auditList.map(function (val) {
                //console.log(val.subClassName,val.guid,val.md5,val.epId,val.originEpId,val.lastestClientVersion)
                var status = BzCloudComp.GetCompType(val.subClassName, val.guid, val.md5, val.epId - 0, val.originEpId - 0, val.lastestClientVersion, val.componentId);
                //console.log(status);
                //val.comStatus = status;
                if (status == 0) {
                    val.nUpload = true;
                    val.yUpload = false;
                    //val.statusLable=false;
                } else if (status == 1) {
                    val.nUpload = true;
                    val.yUpload = false;
                    //val.statusLable=true;
                } else if (status == 2) {
                    val.nUpload = false;
                    val.yUpload = true;
                    //val.statusLable=true;
                } else if (status == 3) {
                    val.nUpload = false;
                    val.yUpload = false;
                    val.versonHigh = true;
                } else if (status < 0) {
                    val.proContiner = true;
                    val.nUpload = false;
                    val.yUpload = false;
                }

            })

            if (!$scope.$$phase) {
                $scope.$apply();
            }

        }


        //应用
        $scope.apply = function (subClassName, guid, epId, originEpId) {
            BzCloudComp.UseComp(subClassName, guid, epId, originEpId);
        }

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


        /*
        * 判断共多少条什么状态的记录
        * */
        function checkStatus(status) {
            if (status == null) {
                $scope.statusCheck = "记录";
            } else if (status == 1) {
                $scope.statusCheck = "待审核";
            } else if (status == 2) {
                $scope.statusCheck = "已通过";
            } else {
                $scope.statusCheck = "未通过";
            }
        }

        /*
        * 特殊企业不显示企业来源
        * */
        $scope.sourceStatus = BzCloudComp.GetEpType();

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

        //顶部搜索构件
        $scope.search = function (e, searchText) {
            if (e && e.keyCode != 13 && e.keyCode != 10) {
                return false;
            }
            $scope.searchText = searchText;
            obj = {
                "status": $scope.status,
                "componentDisplayName": searchText,
                "originEpId": $scope.comSource,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
            getAduitList(obj);
            checkStatus($scope.status);
        }


        commonService.getSourceList().then(function (data) {
            $scope.sourceList = data.data;
        })
        //根据构件来源查询构件
        $scope.companySelect = function (originEpId) {
            var ele = originEpId;
            if (ele == 'null') {
                ele = null;
            }
            if (typeof (ele) == "string") {
                parseInt(ele);
            }
            $scope.comSource = ele;
            obj = {
                "status": $scope.status,
                "componentDisplayName": $scope.searchText,
                "originEpId": ele,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
            getAduitList(obj);
            checkStatus($scope.status);
        }

        //左侧审核状态切换
        $scope.getComponent = function (status) {
            $(".table-list label>input").prop("checked", false);
            $scope.currentPage = 1;
            $scope.status = status;
            if (status == '' || status == undefined) {
                status = null;
            }
            obj = {
                "status": status,
                "componentDisplayName": $scope.searchText,
                "originEpId": $scope.comSource,
                "order": "DESC",
                "currentPage": 1,
                "pageSize": pageSize
            }
            getAduitList(obj);
            checkStatus(status);
        }

        //审核菜单点击其他区域隐藏
        $('body').off('click');
        $('body').on('click', function (e) {
            if (!$(e.target).hasClass('aduitStatus') && !$(e.target).parents('.aduitStatus').length && $scope.listStatusArr) {
                $scope.listStatusArr.map((item) => {
                    console.log(item)
                    $('.aduitStatus ul').hide();
                    item.listStatus = false;
                })

                $scope.listStatusArr = [];
            }
        });

        //审核菜单展示
        $scope.showAudit = function (status, listStatus, item) {
            if (!$scope.listStatusArr) {
                $scope.listStatusArr = [];
            }
            $scope.listStatusArr.map((item) => {
                $('.aduitStatus ul').hide();
                item.listStatus = false;
            })
            $scope.listStatusArr = [];

            $('.aduitStatus ul').show();
            if (status == '待审核') {
                $scope.listStatusArr.push(item);
                return !listStatus;
            }
        }

        //单个修改审核状态
        $scope.getAuditList = function (source, componentId) {
            $scope.flag.auditStatus = false;
            $scope.listStatus = false;
            commonService.auditStatus(
                {
                    "componentIds": [componentId],
                    "status": source
                }
            ).then(function (data) {
                obj = {
                    "status": $scope.status,
                    "componentDisplayName": $scope.searchText,
                    "originEpId": $scope.comSource,
                    "order": "DESC",
                    "currentPage": $scope.currentPage,
                    "pageSize": pageSize
                }
                getAduitList(obj);
                //componentListUpdata();
                checkStatus($scope.status);
            })
        }

        $scope.flag.auditStatus = false;
        $scope.editAudit = function () {
            $scope.flag.auditStatus = !$scope.flag.auditStatus;
            $('.audit .edi .glyphicon-menu-down').css({ 'transform': 'rotate(180deg)' });
        }

        /*
         * 分页器
         * */
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function (pageNo) {
            $scope.auditList = [];
            obj = {
                "status": $scope.status,
                "componentDisplayName": $scope.searchText,
                "originEpId": $scope.comSource,
                "order": "DESC",
                "currentPage": pageNo,
                "pageSize": pageSize
            }
            getAduitList(obj);
            //componentListUpdata();
            checkStatus($scope.status);
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
                "originEpId": $scope.comSource,
                "order": "DESC",
                "currentPage": page,
                "pageSize": pageSize
            }
            getAduitList(obj);
            checkStatus($scope.status);
            //componentListUpdata();
            $scope.currentPage = page;
            $('.dump-inp input').val("");
        };

        function setFilterStyle(obj, event) {
            obj.on(event, function () {
                $(this).parent().siblings().css({ 'height': 'auto', 'overflow': '' })
            })
        }

        //全选
        $scope.allSelected = function () {
            $(".table-list label>input").prop("checked", true);
        }
        //反选
        $scope.invertSelected = function () {
            //$(".table-list label>input").prop("checked",!$(".table-list label>input").prop("checked"));
            $(".table-list label>input").each(function () {
                $(this).prop("checked", !$(this).prop("checked"));
            });
        }

        /*
         * 批量下载
         * */
        $scope.downMuch = function () {
            var arr = [];
            var json = {};
            var arrs = [];
            var jsons = {};
            var list = $("input:checked");
            for (var i = 0; i < list.length; i++) {
                var id = $(list[i]).parent().parent().parent().attr("data-id");
                id = id.split(",");
                json = {
                    "id": id[0],
                    "epId": id[1],
                    "orgEpId": id[2],
                    "epName": id[3],
                    "orgEpName": id[4]
                }
                jsons = {
                    "id": id[0],
                    "epId": id[1],
                    "orgEpId": id[2]
                }
                if ($(list[i]).parent().parent().parent().find(".proTd").children(".nUpload").css("display") == "inline-block") {
                    arr.push(json);
                    arrs.push(jsons);
                }
            }
            if (arr.length == 0) {
                return;
            } else {
                BzCloudComp.BatchDownloadComp(JSON.stringify(arr));
            }
            $(".table-list label>input").prop("checked", false);

            //console.log(arrs);
            $scope.auditList.map(function (val) {
                var obj = {
                    "epId": val.epId.toString(),
                    "id": val.componentId.toString(),
                    "orgEpId": val.originEpId.toString()
                }
                for (var i = 0; i < arr.length; i++) {
                    if (obj.id == arr[i].id && obj.epId == arr[i].epId && obj.orgEpId == arr[i].orgEpId) {
                        val.nUpload = false;
                        val.proContiner = true;
                        //val.statusLable=false;
                    }
                }

            })

        }

        /*
        * 批量修改状态
        * */
        $scope.getAuditLists = function (source) {
            $scope.flag.auditStatus = false;
            var arr = [];
            var list = $("input:checked");
            for (var i = 0; i < list.length; i++) {
                var id = $(list[i]).parent().parent().parent().attr("ids");
                arr.push(parseInt(id));
            }
            console.log(arr);
            if (arr.length == 0) {
                return;
            } else {
                commonService.auditStatus(
                    {
                        "componentIds": arr,
                        "status": source
                    }
                ).then(function (data) {
                    obj = {
                        "status": $scope.status,
                        "componentDisplayName": $scope.searchText,
                        "originEpId": $scope.comSource,
                        "order": "DESC",
                        "currentPage": $scope.currentPage,
                        "pageSize": pageSize
                    }
                    getAduitList(obj);
                    //componentListUpdata();
                    checkStatus($scope.status);
                })
            }

            $(".table-list label>input").prop("checked", false);
        }

        //auditStatusShow
        //$scope.auditStatusShow = function () {
        //    $scope.flag.auditStatus = !$scope.flag.auditStatus
        //}

        //点击审核的其他区域，收起下拉
        $(document).click(function (event) {
            if ($(event.target).attr("class") && $(event.target).attr("class").indexOf("pop-signal") !== -1) {
                return false;
            }
            if ($scope.flag.auditStatus) {
                $scope.flag.auditStatus = false;
                $scope.$apply();
            }
            if ($scope.listStatus) {
                $scope.listStatus = false;
                $scope.$apply();
            }
        });
        $(document).click(function (event) {
            /*if($(event.target).attr("class") && $(event.target).attr("class").indexOf("pop-signal")!==-1){
                return false;
            }*/
            if ($scope.listStatus) {
                $scope.listStatus = false;
                $scope.$apply();
            }

        });

        /*按上传时间排序*/
        $scope.orderList = function ($event) {
            //console.log([$event.target]);
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
                    "originEpId": $scope.comSource,
                    "order": "ASC",
                    "currentPage": $scope.currentPage,
                    "pageSize": pageSize
                }
                getAduitList(obj);
                $scope.order = 'ASC';
            } else {
                obj = {
                    "status": $scope.status,
                    "componentDisplayName": $scope.searchText,
                    "originEpId": $scope.comSource,
                    "order": "DESC",
                    "currentPage": $scope.currentPage,
                    "pageSize": pageSize
                }
                getAduitList(obj);
                $scope.order = 'DESC';
            }
        }


        /*
        * 初始化模态框
        * 初始化参数配置
        * */
        $scope.showModal = function (componentId, opinion, status) {
            $scope.items = {
                componentId: componentId,
                opinion: opinion,
                status: status
            };

            var modalInstance = $uibModal.open({
                windowClass: 'component-modal audit-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/modalAudit.html',
                controller: 'modalAuditCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                $timeout(function () {
                    obj = {
                        "status": $scope.status,
                        "componentDisplayName": $scope.searchText,
                        "originEpId": $scope.comSource,
                        "order": "DESC",
                        "currentPage": $scope.currentPage,
                        "pageSize": pageSize
                    }
                    getAduitList(obj);
                }, 300)
            }, function () {

            });
        };

        /*
         * 上传构件
         * */
        $scope.uploadCom = function () {
            if (BzCloudComp.GetVersion) {
                console.log("新版本");
                let zNodes = BzCloudComp.GetUpLoadDetail();
                if (zNodes == '') {
                    document.title = '提示';
                    alert("当前无可上传构件!");
                    return
                }
            } else {
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

        //下载
        $scope.down = function (componentId, epId, originEpId, epName, originEpName, subClassName, guid, md5, lastestClientVersion, $event, obj) {
            obj.nUpload = false;
            obj.proContiner = true;
            //$($event.target).siblings('.proContiner').show();
            BzCloudComp.DownloadComp(componentId, epId, originEpId, epName, originEpName);
            var status = BzCloudComp.GetCompType(subClassName, guid, md5, epId, originEpId, lastestClientVersion);
        }

        /*
         * 返回顶部
         * */
        $('.return-top').click(function () {
            $('.componet-base-main').animate({ scrollTop: 0 }, 500);
        })

        //心跳
        commonService.heartBeat();

    }]);