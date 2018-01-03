'use strict';
/**
 * largePattern
 */
angular.module('core').controller('largePatternCtrl', ['$scope', '$http', '$rootScope', '$uibModal', 'commonService', '$timeout', '$compile', '$state',
    function ($scope, $http, $rootScope, $uibModal, commonService, $timeout, $compile, $state) {
        $scope.isUpload = false;
        var pageSize = ApplicationConfiguration.pagesize.pageSize;
        $scope.pageSize = pageSize;

        $(".upload .main .tableBody img").attr({"src":"","_src":""});
        $(".audit .tableBody img").attr({"src":"","_src":""});
        $(".component-info .clearfix .preview-big>img").attr({"src":"","_src":""});
        /*
         * 构件库数据展示
         * */
        function getCom() {
            $(".component-info .clearfix .preview-big>img").attr({"src":"","_src":""});
            //显示加载中
            layer.load(2, { shade: false });
            commonService.largePattern(
                {
                    "componentDisplayName": null,
                    "status": null,
                    "compClassId": null,
                    "subClassId": null,
                    "typeIds": null,
                    "brandIds": null,
                    "styleIds": null,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
            ).then(function (data) {
                //关
                setTimeout(function () {
                    layer.closeAll('loading');
                }, 10);
                $scope.componentList = data.data.itemList;
                defaultImg($scope.componentList);
                //所有页面中的项目总数
                $scope.bigTotalItems = data.data.totalRowCount;
                $scope.pageCount = data.data.pageCount;
                $scope.currentPage = 1;
                $scope.status = null;
                $scope.componentDisplayName = null;
                $scope.compClassId = null;
                $scope.subClassId = null;
                $scope.brandIds = null;
                $scope.styleIds = null;
                $scope.typeIds = null;
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if ($scope.componentList.length == 0) {
                    $(".component-base .pagination").hide();
                    $(".component-base .page").hide();
                    $(".component-base .component-info").append(temp);
                } else {
                    $(".component-base .pagination").show();
                    $(".component-base .page").show();
                }
            })

            //初次请求保存大类,小类(小类见下)
            var param = {
                "componentDisplayName": null,
                "status": null,
                "compClassId": null,
                "subClassId": null,
                "typeIds": null,
                "brandIds": null,
                "styleIds": null,
            }
            commonService.getTypeStyle(param).then(function (data) {
                var list = data.data;
                if (list.compClassInfos == undefined || list.compClassInfos == null || list.compClassInfos.length == 0) {
                    $scope.isType = false;
                } else {
                    $scope.typeList = list.compClassInfos;
                    $scope.larList = list.compClassInfos;
                }
                if (list.brands == undefined || list.brands == null || list.brands.length == 0) {
                    $scope.isBrand = false;
                    $scope.filterDown = false;
                    brandsNum = 1;
                } else {
                    $scope.isBrand = false;
                    $scope.filterDown = true;
                    brandsNum = 0;
                    $scope.brandsList = list.brands;
                }
                if (list.styles == undefined || list.styles == null || list.styles.length == 0) {
                    $scope.isStyle = false;
                    styleNum = 1;
                } else {
                    styleNum = 0;
                    $scope.isStyle = true;
                    $scope.styleList = list.styles;
                }
            })
        }

        getCom();

        $timeout(function () {
            //获取要定位元素距离浏览器顶部的距离
            var navH = $(".page").offset().top - 80;
            //滚动条事件
            $(".component-base article.componet-base-main").scroll(function () {
                console.log('1234')
                //获取滚动条的滑动距离
                var scroH = $(this).scrollTop();
                // console.log(navH,scroH)
                //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
                if (scroH >= navH) {
                    // $(".page").css({"position":"fixed","top":"80px","z-index":"100"});
                    $(".page").addClass("pageFix");
                } else if (scroH < navH) {
                    // $(".page").css({"position":"absolute","top = 'inherit'"});
                    $(".page").removeClass("pageFix");
                }
            })
        }, 100)


        // js生成列表，已弃
        function getDom() {
            $('.component-info .clearfix').empty();
            $scope.componentList.map((itemList) => {
                let html = `<li id="${itemList.componentId}">
                        <div class="preview-model">
                            <div style="cursor: pointer" class="preview-big">
                                <img src="imgs/placeholder.png" _src="${itemList.attachmentInfo[0].displayUrl}?${name = itemList.attachmentInfo[0].fileName}"/>
                            </div>
                        </div>
                        <div class="preview-tool">
                            <a style="cursor: pointer" class="conName" title="${itemList.componentDisplayName}">${itemList.componentDisplayName}</a>
                        </div>
                    </li>`
                var template = angular.element(html);
                var pagination = $compile(template)($scope);
                angular.element($('.component-info .clearfix').append(pagination));
            })
            $(".component-info .clearfix .preview-big").map((i, v) => {
                $(v).click((e) => {
                    let id = $(v).parents("li").attr("id");
                    $scope.componetModal(parseInt(id));
                })
            })
            $(".component-info .clearfix .preview-tool .conName").map((i, v) => {
                $(v).click((e) => {
                    let id = $(v).parents("li").attr("id");
                    $scope.componetModal(parseInt(id));
                })
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

        /*
         * 左侧菜单
         * param:一个带有数据的数组
         * return 一个字符串拼接的变量
         * */
        var siderbarArr = [];//菜单项
        var filterCount = 0;//筛选开关
        var dumpVal;//分页器跳转框的值
        var showBtn = 0;//控制筛选条件控制按钮是否显示
        var textFilter = '';//筛选条件生成筛选标签的内容
        var idFilter = null;
        //$scope.menusArr = [];//菜单数组
        $scope.componentList = [];//组件展示数组
        $scope.isType = true;
        $scope.isStyle = true;
        $scope.isBrand = false;
        $scope.isSType = false;
        $scope.isBlock = false;

        $scope.slideListId = 0;//接口滑动判断

        //大类、风格、品牌数据实时更新
        var brandsNum = 0;
        var styleNum = 0;
        function getTypeStyle() {
            var param = {
                "componentDisplayName": $scope.componentDisplayName,
                "status": $scope.status,
                "compClassId": $scope.compClassId,
                "subClassId": $scope.subClassId,
                "typeIds": $scope.typeIds,
                "brandIds": $scope.brandIds,
                "styleIds": $scope.styleIds
            }
            commonService.getTypeStyle(param).then(function (data) {
                var list = data.data;
                var sList = [];
                var types = [];
                if (list.compClassInfos != undefined && list.compClassInfos != null && list.compClassInfos.length != 0) {
                    if ($scope.compClassId == null) {
                        $scope.typeList = list.compClassInfos;
                    }
                    if (list.compClassInfos[0].compClassName == null) {
                        $scope.isType = false;
                        let type = list.compClassInfos[0].subClassInfo;
                        angular.forEach(type, function (value, index) {
                            if (value.parentId == null) {
                                sList.push(value);
                                //小类
                                $scope.sTypeList = sList;
                            } else {
                                types.push(value);
                                $scope.types = types;
                            }
                        })
                        updataTypes();
                        if ($scope.compClassId != null && $scope.subClassId == null && $scope.sTypeList.length != 0) {
                            $scope.isSType = true;
                            $scope.isTypes = false;
                        } else {
                            $scope.isSType = false;
                        }
                        if ($scope.compClassId != null && $scope.subClassId != null && $scope.typeIds == null && $scope.sTypeList.length != 0) {
                            $scope.isTypes = true;
                        } else {
                            $scope.isTypes = false;
                        }
                    } else {
                        $scope.isType = true;
                        $scope.isSType = false;
                        $scope.isTypes = false;
                    }
                } else {
                    $scope.isType = false;
                    $scope.isSType = false;
                    $scope.isTypes = false;
                }
                if (list.brands == undefined || list.brands == null || list.brands.length == 0) {
                    $scope.isBrand = false;
                    $scope.filterDown = false;
                    brandsNum = 1;
                } else {
                    $scope.isBrand = true;
                    $scope.filterDown = true;
                    brandsNum = 0;
                    $scope.brandsList = list.brands;
                }
                if (list.styles == undefined || list.styles == null || list.styles.length == 0) {
                    $scope.isStyle = false;
                    styleNum = 1;
                } else {
                    styleNum = 0;
                    $scope.isStyle = true;
                    $scope.styleList = list.styles;
                }
                filterDown();
            })
        }

        //类型实时刷新
        function updataTypes() {
            var typesList = [];
            if ($scope.types && $scope.types.length > 0) {
                for (var i = 0; i < $scope.types.length; i++) {
                    for (var j = 0; j < $scope.sTypeList.length; j++) {
                        if (($scope.sTypeList[j].subClassId == $scope.subClassId) && ($scope.types[i].parentId == $scope.sTypeList[j].subClassId)) {
                            typesList.push($scope.types[i]);
                        }
                    }
                }
            }
            $scope.typesList = typesList;
        }

        $scope.filterDown = true;
        //判断更多选项是否出现
        function filterDown() {
            $timeout(function () {
                var length = $(".filter-infoList").length;
                if (length > 2) {
                    $(".filter-down").addClass('activeShow');
                    $('.filter-down').find('.moreSelect').html("更多选项");
                    $scope.filterDown = true;
                    $scope.isBrand = false;
                } else {
                    $scope.filterDown = false;
                }
                checkMoreBtn();
            }, 0.1)
        }

        //封装搜索函数
        function getSearchList() {
            $(".component-info .clearfix .preview-big>img").attr({"src":"","_src":""});
            getTypeStyle();
            if ($(".component-base .component-info h4").length >= 0) {
                $(".component-base .component-info h4").remove();
            }
            $scope.slideListId++;
            let _slideListId = $scope.slideListId;
            //显示加载中
            layer.load(2, { shade: false });
            $scope.currentPage = 1;
            commonService.largePattern(
                {
                    "componentDisplayName": $scope.componentDisplayName,
                    "status": $scope.status,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds": $scope.typeIds,
                    "brandIds": $scope.brandIds,
                    "styleIds": $scope.styleIds,
                    "currentPage": $scope.currentPage,
                    "pageSize": pageSize
                }
            ).then(function (data) {
                checkMoreBtn();
                //滑动窗口判断,防止旧请求覆盖新请求
                if (_slideListId < $scope.slideListId) {
                    console.log('This XHR id:', _slideListId)
                    console.log('Global XHR id:', $scope.slideListId)
                    return false;
                }

                //关
                setTimeout(function () {
                    layer.closeAll('loading');
                }, 10);
                $scope.componentList = data.data.itemList;
                $scope.pageCount = data.data.pageCount;
                defaultImg($scope.componentList);
                //所有页面中的项目总数
                $scope.bigTotalItems = data.data.totalRowCount;
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if ($scope.componentList.length == 0) {
                    $(".component-base .pagination").hide();
                    $(".component-base .page").hide();
                    $(".component-base .component-info").append(temp);
                } else {
                    $(".component-base .pagination").show();
                    $(".component-base .page").show();
                }
                checkMoreBtn();
            })
        }


        //切换收起全部已展开标签项
        function clearMore() {
            $(".check-box").hide();
            $(".filter-infoList").css({ 'border': 'none' });
            $(".filter-infoList .filter-ele").css({ 'max-height': '40px', 'overflow': 'hidden' });
            $(".selectTitle").css({ 'height': '40px', 'background': '' });
            $(".btns-item").css({ 'display': 'none' });
            $(".checkMore").attr('data-switch', 'off');
            $(".filter-infoList .filter-ele").children().find(".check-box input").prop('checked', false);
            $(".filter-more").addClass("showMore");
            $(".filter-infoList .filter-more").find('.glyphicon-menu-up').css({ 'transform': 'rotate(180deg)' });
            $(".filter-infoList .filter-more").find(".moreBtn").text("更多");
            $(".filter-down").addClass('activeShow');
            $('.filter-down').find('.moreSelect').html("更多选项");
            $scope.brand_moreBtn = null;
            $scope.style_moreBtn = null;
            $scope.types_moreBtn = null;
            checkMoreBtn();
        }


        //左侧审核状态切换
        $scope.getComponent = function (status, $event) {
            clearMore();
            $scope.currentPage = 1;
            var text = $($event.target).text();
            $('.filter-status .filter-ele div').eq(0).html(text).attr("title", text)//把值改变到筛选条件的路径监听框
            $(".largePattern .uploadClick .menusName").removeClass("side-active");
            $($event.target).addClass("side-active");
            $scope.status = status;
            //$scope.componentDisplayName=null;
            $scope.compClassId = null;
            $scope.subClassId = null;
            $scope.brandIds = null;
            $scope.styleIds = null;
            $scope.typeIds = null;
            getSearchList();

            $scope.isType = true;
            $scope.isSType = false;
            $scope.isTypes = false;
            $scope.isSType = false;

            sorceClick();
        }

        $scope.source = function () {
            clearMore();
            sorceClick();
            //$scope.componentDisplayName = null;
            $scope.compClassId = null;
            $scope.subClassId = null;
            $scope.brandIds = null;
            $scope.styleIds = null;
            $scope.typeIds = null;

            $scope.isType = true;
            $scope.isSType = false;
            $scope.isTypes = false;
            $scope.isStyle = true;
            getSearchList();
        }

        /*
         * 点击构件来源移除除搜索外的条件
         * */
        function sorceClick() {
            $('.ltype').prev().remove();
            $('.ltype').remove();
            $('.stype').prev().remove();
            $('.stype').remove();
            $('.selectType').prev().remove();
            $('.selectType').remove();
            if ($scope.componentDisplayName == null) {
                $scope.isBlock = false;
            } else {
                $scope.isBlock = true;
            }
        }

        //更多按钮单行不显示
        function checkMoreBtn(once) {
            let _obj = $('.component-filter .filter-more');
            let _flag = 0;
            $(_obj).each(function () {
                let _eleSpan = "";
                let _eleList = $(this).parents('.filter-infoList');
                let _eleCondition = $(this).parents('.filter-condition');
                let _ele = $(this).parents('.filter-tool').siblings('.filter-ele');
                _eleSpan = $(_ele).find('span');
                let _eleCheck = $(_ele).find('.check-box').css('display');
                var width = $(_eleCondition).width() - 186;
                if (_eleSpan.length < 1) {
                    _flag = 1;
                } else {
                    if (($(_eleSpan).width() + 12) * $(_eleSpan).length < width || _eleCheck != 'none') {
                        $(this).hide();
                    } else {
                        $(this).css('display', 'inline-block');
                    }
                }
            })
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            if (_flag && !once) {
                setTimeout(function () {
                    checkMoreBtn(true);
                }, 10)
            }
        }
        $(window).on('resize', function () {
            checkMoreBtn();
        })


        /*
         * 分页器
         * */
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function (pageNo) {
            $(".component-info .clearfix .preview-big>img").attr({"src":"","_src":""});
            commonService.largePattern(
                {
                    "componentDisplayName": $scope.componentDisplayName,
                    "status": $scope.status,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds": $scope.typeIds,
                    "brandIds": $scope.brandIds,
                    "styleIds": $scope.styleIds,
                    "currentPage": pageNo,
                    "pageSize": pageSize
                }
            ).then(function (data) {
                $scope.componentList = data.data.itemList;
                defaultImg($scope.componentList);
                $scope.bigTotalItems = data.data.totalRowCount;

            })
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
            $(".component-info .clearfix .preview-big>img").attr({"src":"","_src":""});
            commonService.largePattern(
                {
                    "componentDisplayName": $scope.componentDisplayName,
                    "status": $scope.status,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds": $scope.typeIds,
                    "brandIds": $scope.brandIds,
                    "styleIds": $scope.styleIds,
                    "currentPage": page,
                    "pageSize": pageSize
                }
            ).then(function (data) {
                $scope.componentList = data.data.itemList;
                defaultImg($scope.componentList);
            })
            $('.dump-inp input').val("");
        };

        //默认图
        function defaultImg(arr) {
            arr.map((item) => {
                if (item.attachmentInfo.length == 0) {
                    item.attachmentInfo[0] = {};
                    item.attachmentInfo[0].displayUrl = 'imgs/placeholder.png'
                }
            })
        }

        /*
         * 条件标签样式及切换
         * */
        function setFilterStyle(obj) {
            obj.on('mouseenter', function () {
                $(this).children().not('.filter-closeStatus').css({ 'color': '#E5383C', 'border-color': '#E5383C' });
                $(this).children().find('.glyphicon-menu-down').css({ 'transform': 'rotate(180deg)' });
                // $(this).not('.filter-closeStatus').find('.filter-trigger').css({'height':'33px','border-bottom':'0','background':'#fff'});
                $(this).not('.addSearch,.selectTypes,.selectStyle,.selectBrand').find('.filter-trigger').css({ 'height': '33px', 'border-bottom': '0', 'background': '#fff' });
                $(this).find('.switch-filter').show();
                var searchText;
                if ($(".addSearch ")) {
                    searchText = $(".addSearch").text();
                } else {
                    searchText = "";
                }
                $('.switchFilter').off('click');
                $('.switchFilter').on('click', function () {
                    var _parentLtype = $(this).parents('.ltype');//大类
                    var _parentStype = $(this).parents('.stype');//小类
                    var text = $(this).text();
                    var id = $(this).attr("data-id");
                    sType(id);
                    $(this).parent().siblings().children('span').text(text);
                    $scope.styleIds = null;
                    $scope.brandIds = null;
                    $scope.typeIds = null;
                    if (_parentLtype.length > 0) {
                        $('.stype').prev().remove();
                        $('.stype').remove();
                        $('.selectType').prev().remove();
                        $('.selectType').remove();
                        $scope.compClassId = parseInt(id);
                        $scope.subClassId = null;
                    }
                    if (_parentStype.length > 0) {
                        $('.selectType').prev().remove();
                        $('.selectType').remove();
                        $scope.subClassId = parseInt(id);
                        $scope.typeIds = null;
                    }
                    getSearchList();
                })
            });
            obj.on('mouseleave', function () {
                $(this).children().css({ 'color': '', 'border-color': '' });
                $(this).children().find('.glyphicon-menu-down').css({ 'transform': '' });
                $(this).find('.filter-trigger').css({ 'height': '30px', 'border-bottom': '1px solid #c9c9c9', 'background': '' });
                $(this).find('.switch-filter').hide();
            })
        }



        /*
         * 搜索关键字生成条件标签
         * */
        $scope.search = function (e, searchText) {
            if (e && e.keyCode != 13 && e.keyCode != 10) {
                return false;
            }
            $('.addSearch').prev('.glyphicon').remove();//删除原有搜索条件DOM
            $('.addSearch').remove();//删除原有搜索条件DOM

            //setBlank(searchText);
            var html = '<b class="glyphicon glyphicon-menu-right addSearch_icon"></b><div class="type-filter addSearch"><div class="filter-trigger filter-closeStatus" title=' + searchText + '><span>' + searchText + '</span><b class="icon-close"></b></div>';
            var template = angular.element(html);
            var pagination = $compile(template)($scope);
            angular.element($('.filter-status .filter-ele').append(pagination));
            closeStatus('isSearch');
            isShow();

            $scope.componentDisplayName = searchText;
            getSearchList();
        }


        /*
         * 筛选条件（无下拉功能）生成条件标签
         * params function
         * */
        function setBlank(textFilter, type) {
            var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType ' + type + '"><div class="filter-trigger filter-closeStatus" title=' + textFilter + '><span>' + textFilter + '</span><b class="icon-close"></b></div>';
            var template = angular.element(html);
            var pagination = $compile(template)($scope);
            if ($('.filter-status .filter-ele .addSearch_icon').length > 0) {
                angular.element($('.filter-status .filter-ele .addSearch_icon').before(pagination));
            } else {
                angular.element($('.filter-status .filter-ele').append(pagination));
            }

        }

        /*
         * 关闭筛选条件
         * */
        function closeStatus(callback) {
            $('.filter-closeStatus').off('click').on('click', function () {
                $(this).parent().prev().remove();
                $(this).parent().remove();
                isShow();

                //type
                let _type = $(this).parent();
                if ($(_type).hasClass('selectTypes')) {
                    _type = 'isTypes'
                }
                if ($(_type).hasClass('addSearch')) {
                    _type = 'isSearch'
                }
                if ($(_type).hasClass('selectStyle')) {
                    _type = 'isStyle'
                }
                if ($(_type).hasClass('selectBrand')) {
                    _type = 'isBrands'
                }

                switch (_type) {
                    case 'isTypes':
                        $scope.isTypes = true;
                        $scope.typeIds = null;
                        $scope.types_moreBtn = undefined;
                        break;
                    case 'isStyle':
                        $scope.isStyle = true;
                        $scope.styleIds = null;
                        $scope.style_moreBtn = undefined;
                        break;
                    case 'isBrands':
                        $scope.isBrand = true;
                        $scope.brandIds = null;
                        $scope.brand_moreBtn = undefined;
                        $('.filter-down.activeShow').removeClass('activeShow');
                        filterDown();
                        break;

                    case 'isSearch':
                        $scope.componentDisplayName = null;
                        //$scope.searchText = "";
                        break;
                }
                getSearchList();
                setTimeout(function () {
                    checkMoreBtn();
                }, 10)
                $scope.$apply();

                if (typeof callback == 'function') {
                    callback();
                }
            })
        }

        //筛选品牌
        $scope.isBrandFilter = function (event) {

            //多选状态下为勾选
            if ($scope.brand_moreBtn == 'off') {
                let _obj = $(event.target).parent('span.ng-scope') || $(event.target);
                $(_obj).find('.check-box input').click();
                return false;
            }

            if (event.target.nodeName == 'I' || event.target.nodeName == 'I') {
                textFilter = $(event.target).text();
                idFilter = $(event.target).attr("data-id");
                if ($('.filter-status .filter-ele .addSearch_icon').length > 0) {
                    $('.filter-status .filter-ele .addSearch_icon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus" title=' + textFilter + '><span>' + textFilter + '</span><b class="icon-close"></b></div>');
                } else {
                    $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus" title=' + textFilter + '><span>' + textFilter + '</span><b class="icon-close"></b></div>');
                }

                //$scope.isBrand = false;

                //获取列表
                $scope.brandIds = idFilter;
                getSearchList();
                filterDown();
            }
            isShow();
            closeStatus('isBrands');
        };

        //筛选风格
        $scope.isStyleFilter = function (event) {
            //多选状态下为勾选
            if ($scope.style_moreBtn == 'off') {
                let _obj = $(event.target).parent('span.ng-scope') || $(event.target);
                $(_obj).find('.check-box input').click();
                return false;
            }

            if (event.target.nodeName == 'I' || event.target.nodeName == 'I') {
                let _text = $(event.target).text();
                textFilter = $(event.target).attr('data-id');
                if ($('.filter-status .filter-ele .addSearch_icon').length > 0) {
                    $('.filter-status .filter-ele .addSearch_icon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title=' + _text + '><span>' + _text + '</span><b class="icon-close"></b></div>');
                } else {
                    $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title=' + _text + '><span>' + _text + '</span><b class="icon-close"></b></div>');
                }

                //$scope.isStyle = false;

                //获取列表
                $scope.styleIds = textFilter;
                getSearchList();
            }
            isShow();
            closeStatus('isStyle');
        };
        //筛选大类
        $scope.isTypeFilter = function (event) {
            if (event.target.nodeName == 'SPAN' || event.target.nodeName == 'span') {
                textFilter = $(event.target).not('input[type="checkbox"]').text();
                idFilter = $(event.target).not('input[type="checkbox"]').attr("data-id");
                var typeList = $scope.typeList;
                var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter ltype"><div class="filter-trigger "><span>' + textFilter + '</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in larList" data-id="{{item.compClassId}}">{{item.compClassName}}</div></div></div>'
                var template = angular.element(html);
                var pagination = $compile(template)($scope);
                angular.element($('.filter-status .filter-first-ele').after(pagination));

                //获取列表
                $scope.compClassId = parseInt(idFilter);
                $scope.subClassId = null;
                $scope.typeIds = null;
                getSearchList();

                //显示小类
                sType(idFilter);
                $scope.isType = false;
                $scope.isSType = true;
                setFilterStyle($('.component-base .filter-status .filter-ele .type-filter'));//筛选条件切换
            }
            isShow();
            filterDown();
        };
        //初次请求保存公共库小类，获取切换数据
        function sType(idFilter) {
            var list = $scope.larList;
            var sList = [];
            var types = [];
            angular.forEach(list, function (value, index) {
                if (value.compClassId == parseInt(idFilter)) {
                    angular.forEach(value.subClassInfo, function (values, indexs) {
                        if (values.parentId == null) {
                            sList.push(values);
                            //小类
                            $scope.smaList = sList;
                        } else {
                            types.push(values);
                            //$scope.types = types;
                        }
                    })
                }
            })
        }
        //筛选小类
        $scope.isSTypeFilter = function (even) {
            if (event.target.nodeName == 'SPAN' || event.target.nodeName == 'span') {
                textFilter = $(event.target).not('input[type="checkbox"]').text();
                idFilter = $(event.target).not('input[type="checkbox"]').attr("data-id");
                var sTypeList = $scope.sTypeList;
                var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter stype"><div class="filter-trigger "><span>' + textFilter + '</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in smaList" data-id="{{item.subClassId}}">{{item.subClassName}}</div></div></div>'
                var template = angular.element(html);
                var pagination = $compile(template)($scope);
                // angular.element($('.filter-status .filter-ele').append(pagination));
                angular.element($('.filter-status .ltype').after(pagination));
                $scope.isSType = false;

                //获取列表
                $scope.subClassId = parseInt(idFilter);
                getSearchList();

                setFilterStyle($('.component-base .filter-status .filter-ele .type-filter'));//筛选条件切换

            }
            isShow();
        }

        //筛选类型
        $scope.seltypes = function (name, id) {
            //多选状态下为勾选
            if ($scope.types_moreBtn == 'off') {
                let _obj = $(event.target).parent('span.ng-scope') || $(event.target);
                $(_obj).find('.check-box input').click();
                return;
            }

            if ($('.filter-status .filter-ele .addSearch_icon').length > 0) {
                $('.filter-status .filter-ele .addSearch_icon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title=' + name + '><span>' + name + '</span><b class="icon-close"></b></div>');
            } else {
                $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title=' + name + '><span>' + name + '</span><b class="icon-close"></b></div>');
            }

            $scope.isTypes = false;
            $scope.typeIds = id.toString();
            getSearchList();
            isShow();
            closeStatus('isTypes');
        }

        //清空筛选显隐
        function isShow() {
            if ($('.type-filter').length == 0) {
                $scope.isBlock = false;
            } else {
                $scope.isBlock = true;
            }
        }

        //清空筛选
        $scope.cancelFilter = function () {
            $('.type-filter').remove();
            $('.filter-status .filter-ele>b').remove();
            $scope.isBlock = false;
            $scope.isSType = false;
            $scope.isTypes = false;
            //$scope.isBrand = false;

            $scope.componentDisplayName = null;
            //$scope.status=null;
            $scope.compClassId = null;
            $scope.subClassId = null;
            $scope.brandIds = null;
            $scope.styleIds = null;
            $scope.typeIds = null;
            $scope.searchText = null;

            //清除多选
            $('.filter-condition').find('.check-box').hide();
            $('.filter-condition').find('.check-box input').prop('checked', false);
            $('.filter-condition').find('.btns-item').css({ 'display': 'none' });
            $('.checkMore').attr('data-switch', 'off');
            $scope.style_moreBtn = null;
            $scope.brand_moreBtn = null;
            $scope.types_moreBtn = null;

            //获取列表
            getSearchList();
            checkMoreBtn();
        };

        //多选
        //监听是否 菜单选项repeat 完成
        //$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $timeout(function () {
            checkMoreBtn();
            $('.filter-infoList ').css({ 'overflow-x': 'hidden', 'overflow-y': 'auto' });
            $('.filter-infoList .filter-tool').map(function (i, val) {
                $('.component-filter').off('click', '.checkMore');
                $('.component-filter').on('click', '.checkMore', function () {
                    let _type = $(this).attr('data-type') + '_moreBtn';
                    let _switch = $(this).attr('data-switch');
                    switch (_switch) {
                        case 'off':
                            $(".check-box").hide();
                            $(".filter-infoList").css({ 'border': 'none' });
                            $(".filter-infoList .filter-ele").css({ 'max-height': '40px', 'overflow': 'hidden' });
                            $(".selectTitle").css({ 'height': '40px', 'background': '' });
                            $(".btns-item").css({ 'display': 'none' });
                            $(".checkMore").attr('data-switch', 'off');
                            $(".filter-infoList .filter-ele").children().find(".check-box input").prop('checked', false);
                            $(".filter-more").addClass("showMore");
                            $(".filter-infoList .filter-more").find('.glyphicon-menu-up').css({ 'transform': 'rotate(180deg)' });
                            $(".filter-infoList .filter-more").find(".moreBtn").text("更多");
                            $scope.brand_moreBtn = null;
                            $scope.style_moreBtn = null;
                            $scope.types_moreBtn = null;
                            checkMoreBtn();

                            $(this).parent().parent().find('.check-box').show();
                            $(this).parent().parent().find('.btns-item').css({ 'display': 'block' });
                            $(this).attr('data-switch', 'on');
                            $(this).siblings('.filter-more').hide();
                            $(this).parent().parent().find('.btn-ok').hide();//确定按钮隐藏
                            $scope[_type] = _switch;

                            //展开
                            $(this).siblings('.filter-more').parent().parent().parent().find('.filter-ele').css({ 'max-height': '120px', 'overflow-y': 'auto' });
                            var height = $(this).parent().parent().parent().height();
                            $(this).parent().parent().siblings(".selectTitle").css({ "height": height, "background": "lightgoldenrodyellow" });
                            $(this).parent().parent().parent().css({ "border": "1px solid rgba(231, 179, 37, 0.31)" });
                            break;
                        case 'on':
                            $(this).parent().parent().find('.check-box').hide();
                            $(this).parent().parent().parent().find(".filter-ele").css({ 'max-height': '40px', 'overflow': 'hidden' });
                            $(this).parent().parent().parent().css({ "border": "none" });
                            $(this).parent().parent().find('.btns-item').css({ 'display': 'none' });
                            $(this).attr('data-switch', 'off');
                            checkMoreBtn();
                            $scope[_type] = _switch;
                            $(this).parent().parent().siblings(".selectTitle").css({ 'height': '40px', 'background': '' });
                            break;
                    }
                })
            });
            //是否选中筛选多选框 选中的话可以提交
            $('.component-filter').off('click', '.filter-infoList .check-box input');
            $('.component-filter').on('click', '.filter-infoList .check-box input', function (event) {
                showBtn = 0;
                var i = 0;
                var arr = [];
                var idArr = [];
                $(this).parents('.filter-condition').find('.check-box').map(function (i, val) {
                    if ($(val).find('input[type="checkbox"]').prop('checked') == true) {
                        textFilter = ($(this).parent().children('i').text());
                        var _id = $(this).parent().children('i').attr('data-id');
                        arr.push(textFilter);
                        idArr.push(_id);
                        i = 1;
                        showBtn = i;
                    }
                });
                arr = arr.join(",");
                idArr = idArr.join(",");

                $(this).parents('.filter-condition').find('.btn-ok').off().click(function () {
                    $(this).parent().siblings(".filter-ele").children().find(".check-box").hide();
                    $(this).parent().siblings(".filter-ele").children().find(".check-box input").prop('checked', false);
                    $(this).parent().siblings(".filter-tool").find('.checkMore').attr('data-switch', 'off');
                    $(this).parent().hide();

                    isShow();
                    let _type = $(this).attr('data-type');
                    switch (_type) {
                        case 'brand':
                            //$scope.isBrand=false;
                            $scope.brandIds = idArr;
                            setBlank(arr, 'selectBrand');
                            closeStatus('isBrands');
                            isShow();
                            break;
                        case 'style':
                            //$scope.isStyle=false;
                            $scope.styleIds = idArr;
                            setBlank(arr, 'selectStyle');
                            closeStatus('isStyle');
                            isShow();
                            break;
                        case 'types':
                            $scope.typeIds = idArr;
                            //$scope.isTypes=false;
                            setBlank(arr, 'selectTypes');
                            closeStatus('isTypes');
                            isShow();
                            break;

                    }
                    getSearchList();
                    $scope.$apply();

                })
                if (showBtn == 0) {
                    $(this).parent().parent().parent().siblings().find('.btn-ok').hide();
                } else {
                    $(this).parent().parent().parent().siblings().find('.btn-ok').show();
                }
            });
            //筛选条件点击更多显示全部
            $('.component-filter').off('click', '.filter-more').on('click', '.filter-more', function () {
                if ($(this).hasClass('showMore')) {
                    $(this).parent().parent().parent().find('.filter-ele').css({ 'max-height': '120px', 'overflow-y': 'auto' });
                    $(this).find('.glyphicon-menu-up').css({ 'transform': 'rotate(0deg)' });
                    $(this).find(".moreBtn").text("收起");
                    $(this).removeClass("showMore");
                } else {
                    $(this).parent().parent().parent().find('.filter-ele').css({ 'max-height': '40px', 'overflow': 'hidden' });
                    $(this).find('.glyphicon-menu-up').css({ 'transform': 'rotate(180deg)' });
                    $(this).find(".moreBtn").text("更多");
                    $(this).addClass("showMore");
                }
            });
            //  取消选择的时候条件清空
            $('.component-filter').off('click', '.filter-infoList .btn-cancel')
            $('.component-filter').on('click', '.filter-infoList .btn-cancel', function () {
                $(this).parent().siblings(".filter-ele").css({ 'max-height': '40px', 'overflow': 'hidden' });
                $(this).parent().parent().parent().css({ "border": "none" });
                $(this).parent().parent().siblings(".selectTitle").css({ 'height': '40px', 'background': '' });
                $(this).parent().siblings(".filter-ele").children().find(".check-box").hide();
                $(this).parent().siblings(".filter-ele").children().find(".check-box input").prop('checked', false);
                $(this).parent().siblings(".filter-tool").find('.checkMore').attr('data-switch', 'off');
                $(this).parent().hide();
                checkMoreBtn();
                let _type = $(this).attr('data-type');
                switch (_type) {
                    case 'brand':
                        //$scope.isBrand=false;
                        $scope.brand_moreBtn = undefined;
                        break;
                    case 'style':
                        //$scope.isStyle=false;
                        $scope.style_moreBtn = undefined;
                        break;
                    case 'types':
                        //$scope.isTypes=false;
                        $scope.types_moreBtn = undefined;
                        break;
                }
                var height = $(this).parent().parent().height();
                $(this).parent().parent().siblings(".selectTitle").css({ "height": height, "background": "" });
                $(this).parent().parent().parent().css({ "border": "none" });
                $scope.$apply();
            });

            checkMoreBtn();

        }, 0.1)

        /*
         * .filter-down更多选项
         * */
        $('.filter-down').bind('click', function () {
            if ($(this).hasClass('activeShow')) {
                $scope.isBrand = true;
                $('.filter-down').find('.moreSelect').html("收起");
                $(this).removeClass("activeShow");
            } else {
                $scope.isBrand = false;
                $('.filter-down').find('.moreSelect').html("更多选项");
                $(this).addClass("activeShow");
            }
            $scope.$apply();
            checkMoreBtn();
        });

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
                    getSearchList();
                }
            }, function () {
                //getSearchList();
                //console.info('Modal dismissed at: ' + new Date());
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

        /*
         * 返回顶部
         * */
        $('.return-top').click(function () {
            $('.componet-base-main').animate({ scrollTop: 0 }, 500);
        })


        //心跳
        commonService.heartBeat();

    }]);