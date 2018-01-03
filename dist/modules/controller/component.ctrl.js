"use strict";angular.module("core").controller("componentCtrl",["$scope","$http","$rootScope","$uibModal","commonService","$timeout","$compile","$state","$stateParams",function(e,s,t,n,l,a,o,i,r){function c(){var s={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName};l.getComTypeStyle(s).then(function(s){var t=s.data;e.pubList=t.compClassInfos;var n=[],l=[];if(void 0!=t.compClassInfos&&null!=t.compClassInfos&&0!=t.compClassInfos.length)if(null==e.compClassId&&(e.typeList=t.compClassInfos),null==t.compClassInfos[0].compClassName){e.isType=!1;var a=t.compClassInfos[0].subClassInfo;angular.forEach(a,function(s,t){null==s.parentId?(n.push(s),e.sTypeList=n):(l.push(s),e.types=l)}),p(),null!=e.compClassId&&null==e.subClassId&&0!=e.sTypeList.length?(e.isSType=!0,e.isTypes=!1):e.isSType=!1,null!=e.compClassId&&null!=e.subClassId&&null==e.typeIds&&0!=e.sTypeList.length?e.isTypes=!0:e.isTypes=!1}else e.isType=!0,e.isSType=!1,e.isTypes=!1;else e.isType=!1,e.isSType=!1,e.isTypes=!1;void 0==t.brands||null==t.brands||0==t.brands.length?(e.isBrand=!1,e.filterDown=!1,D=1):(e.isBrand=!0,e.filterDown=!0,D=0,e.brandsList=t.brands),void 0==t.styles||null==t.styles||0==t.styles.length?(e.isStyle=!1,z=1):(z=0,e.isStyle=!0,e.styleList=t.styles),d()})}function p(){var s=[];if(e.types&&e.types.length>0)for(var t=0;t<e.types.length;t++)for(var n=0;n<e.sTypeList.length;n++)e.sTypeList[n].subClassId==e.subClassId&&e.types[t].parentId==e.sTypeList[n].subClassId&&s.push(e.types[t]);e.typesList=s}function d(){a(function(){$(".filter-infoList").length>2?($(".filter-down").addClass("activeShow"),$(".filter-down").find(".moreSelect").html("更多选项"),e.filterDown=!0,e.isBrand=!1):e.filterDown=!1,u()},.1)}function m(){$(".component-info .clearfix .preview-big>img").attr({src:"",_src:""}),e.data.componentList="",layer.load(2,{shade:!1}),$(".component-base .component-info h4").length>=0&&$(".component-base .component-info h4").remove(),e.currentPage=1,l.about({scope:e.scope,orgId:e.orgId,compClassId:null,subClassId:null,typeIds:null,styleIds:null,brandIds:null,componentDisplayName:null,currentPage:1,pageSize:w}).then(function(s){setTimeout(function(){layer.closeAll("loading")},10);s.data.itemList;e.data.componentList=s.data.itemList;0==e.data.componentList.length?($(".component-base .pagination").hide(),$(".component-base .page").hide(),$(".component-base .component-info").append("<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>")):($(".component-base .pagination").show(),$(".component-base .page").show()),componentListUpdata(),g(e.data.componentList),e.pageCount=s.data.pageCount,e.bigTotalItems=s.data.totalRowCount},function(){});var s={scope:e.scope,orgId:e.orgId,compClassId:null,subClassId:null,typeIds:null,styleIds:null,brandIds:null,componentDisplayName:e.componentDisplayName};l.getComTypeStyle(s).then(function(s){var t=s.data;void 0==t.compClassInfos||null==t.compClassInfos||0==t.compClassInfos.length?e.isType=!1:(e.typeList=t.compClassInfos,e.larList=t.compClassInfos),void 0==t.brands||null==t.brands||0==t.brands.length?(e.isBrand=!1,e.filterDown=!1,D=1):(e.isBrand=!0,e.filterDown=!0,D=0,e.brandsList=t.brands),void 0==t.styles||null==t.styles||0==t.styles.length?(e.isStyle=!1,z=1):(z=0,e.isStyle=!0,e.styleList=t.styles),d()})}function u(s){a(function(){var t=$(".component-filter .filter-more"),n=0;$(t).each(function(){var e="",s=($(this).parents(".filter-infoList"),$(this).parents(".filter-condition")),t=$(this).parents(".filter-tool").siblings(".filter-ele");e=$(this).parents(".filter-tool").siblings(".filter-ele").find("span");var l=$(t).find(".check-box").css("display"),a=($(t)[0].childElementCount,$(s).width()-186);e.length<1?n=1:($(e).width()+12)*$(e).length<a||"none"!=l?$(this).hide():$(this).css("display","inline-block")}),e.$$phase||e.$apply(),n&&!s&&setTimeout(function(){u(!0)},10)},.1)}function f(e,s){if(e.push(s.orgId),s.isParent)for(var t in s.children)f(e,s.children[t]);return e}function h(){u(),$(".check-box").hide(),$(".filter-infoList").css({border:"none"}),$(".filter-infoList .filter-ele").css({"max-height":"40px",overflow:"hidden"}),$(".selectTitle").css({height:"40px",background:""}),$(".btns-item").css({display:"none"}),$(".checkMore").attr("data-switch","off"),$(".filter-infoList .filter-ele").children().find(".check-box input").prop("checked",!1),$(".filter-more").addClass("showMore"),$(".filter-infoList .filter-more").find(".glyphicon-menu-up").css({transform:"rotate(180deg)"}),$(".filter-infoList .filter-more").find(".moreBtn").text("更多"),$(".filter-down").addClass("activeShow"),$(".filter-down").find(".moreSelect").html("更多选项"),e.brand_moreBtn=null,e.style_moreBtn=null,e.types_moreBtn=null}function y(){$(".ltype").prev().remove(),$(".ltype").remove(),$(".stype").prev().remove(),$(".stype").remove(),$(".selectType").prev().remove(),$(".selectType").remove(),null==e.componentDisplayName?e.isBlock=!1:e.isBlock=!0}function g(e){e.map(function(e){0==e.attachmentInfo.length&&(e.attachmentInfo[0]={},e.attachmentInfo[0].displayUrl="imgs/placeholder.png")})}function I(){return x=$(".dump-inp input").val()}function b(s,t,n){$(".component-info .clearfix .preview-big>img").attr({src:"",_src:""}),e.data.componentList="","page"!=t&&(c(),e.currentPage=1),$(".component-base .component-info h4").length>=0&&$(".component-base .component-info h4").remove();var a=++e.slideListId;layer.load(2,{shade:!1}),l.about(s).then(function(s){if(e.data.componentList=[],a<e.slideListId)return console.log("This XHR id:",a),console.log("Global XHR id:",e.slideListId),!1;setTimeout(function(){layer.closeAll("loading")},10),e.data.componentList=s.data.itemList,e.pageCount=s.data.pageCount,g(e.data.componentList),e.bigTotalItems=s.data.totalRowCount;0==e.data.componentList.length?($(".component-base .pagination").hide(),$(".component-base .page").hide(),$(".component-base .component-info").append("<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>")):($(".component-base .pagination").show(),$(".component-base .page").show()),componentListUpdata(),"function"==typeof n&&n()})}function C(s){s.on("mouseenter",function(){$(this).children().not(".filter-closeStatus").css({color:"#E5383C","border-color":"#E5383C"}),$(this).children().find(".glyphicon-menu-down").css({transform:"rotate(180deg)"}),$(this).not(".addSearch,.selectTypes,.selectStyle,.selectBrand").find(".filter-trigger").css({height:"33px","border-bottom":"0",background:"#fff"}),$(this).find(".switch-filter").show();$(".addSearch ")&&$(".addSearch").text(),$(".switchFilter").off("click"),$(".switchFilter").on("click",function(){var s=$(this).parents(".ltype"),t=$(this).parents(".stype"),n=$(this).text(),l=$(this).attr("data-id");S(l),$(this).parent().siblings().children("span").text(n),e.styleIds=null,e.brandIds=null,e.typeIds=null,s.length>0&&(e.compClassId=parseInt(l),e.subClassId=null,$(".stype").prev().remove(),$(".stype").remove(),$(".selectType").prev().remove(),$(".selectType").remove(),M={scope:e.scope,orgId:null,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),t.length>0&&(e.subClassId=parseInt(l),e.typeIds=null,$(".selectType").prev().remove(),$(".selectType").remove(),M={scope:e.scope,orgId:null,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),b(M)})}),s.on("mouseleave",function(){$(this).children().css({color:"","border-color":""}),$(this).children().find(".glyphicon-menu-down").css({transform:""}),$(this).find(".filter-trigger").css({height:"30px","border-bottom":"1px solid #c9c9c9",background:""}),$(this).find(".switch-filter").hide()})}function v(s,t){var n='<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType '+t+'"><div class="filter-trigger filter-closeStatus"  title='+s+"><span>"+s+'</span><b class="icon-close"></b></div>',l=angular.element(n),a=o(l)(e);$(".addSearchIcon").length>0?angular.element($(".addSearchIcon").before(a)):angular.element($(".filter-status .filter-ele").append(a))}function k(s){$(".filter-closeStatus").off("click").on("click",function(){$(this).parent().prev().remove(),$(this).parent().remove(),T();var t=$(this).parent();switch($(t).hasClass("selectTypes")&&(t="isTypes"),$(t).hasClass("addSearch")&&(t="isSearch"),$(t).hasClass("selectStyle")&&(t="isStyle"),$(t).hasClass("selectBrand")&&(t="isBrands"),t){case"isTypes":e.typeIds=null,e.isTypes=!0,e.types_moreBtn=null;break;case"isStyle":e.styleIds=null,e.isStyle=!0,e.style_moreBtn=null;break;case"isBrands":e.brandIds=null,e.brand_moreBtn=null,e.isBrand=!0,$(".filter-down.activeShow").removeClass("activeShow"),e.$apply();break;case"isSearch":e.componentDisplayName=null}b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),"function"==typeof s&&s()})}function S(s){var t=e.larList,n=[],l=[];angular.forEach(t,function(t,a){t.compClassId==parseInt(s)&&angular.forEach(t.subClassInfo,function(s,t){null==s.parentId?(n.push(s),e.smaList=n):l.push(s)})})}function T(){0==$(".type-filter").length?e.isBlock=!1:e.isBlock=!0}var w=ApplicationConfiguration.pagesize.pageSize;e.pageSize=w,$(".upload .main .tableBody img").attr({src:"",_src:""}),$(".audit .tableBody img").attr({src:"",_src:""}),$(".component-info .clearfix .preview-big>img").attr({src:"",_src:""});var x,L=0,B="",N=null;e.menusArr=[],e.data={},e.data.componentList=[],e.isType=!0,e.isStyle=!0,e.isBrand=!1,e.isSType=!1,e.isBlock=!1,e.isTypes=!1,e.isUpload=!1,e.isAduit=!1,e.slideListId=0,l.getPermis().then(function(s){var t=s.data;""!=t&&void 0!=t&&null!=t||($(".component-base .main-siderbar").hide(),$(".container-fluid").css({marginLeft:"10px"}),$(".pagination").css({marginLeft:"60px"})),2==BzCloudComp.GetEpType()&&""!=t&&(e.orgShow=!0),t=t.split(";");for(var n=0;n<t.length;n++)"30002001"==t[n]&&(e.isUpload=!0),"30002003"==t[n]&&(e.isAduit=!0)}),a(function(){var e=$(".page").offset().top-80;$(".component-base article.componet-base-main").scroll(function(){var s=$(this).scrollTop();s>=e?$(".page").addClass("pageFix"):s<e&&$(".page").removeClass("pageFix")})},100);var D=0,z=0;e.filterDown=!0,e.scope=1,e.orgId=null,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,e.componentDisplayName=null,null==r.name&&(m(),e.scope=1),$(window).on("resize",function(){u()}),window.componentListUpdata=function(){e.data.componentList.map(function(e){var s=BzCloudComp.GetCompType(e.subClassName,e.guid,e.md5,e.epId-0,e.originEpId-0,e.lastestClientVersion,e.componentId);e.staBtnLoad=!1,e.statusLable=!1,e.staBtnData=!1,e.staBtnApply=!1,e.proContiner=!1,e.staBtnVerson=!1,e.statusVerson=!1,e.staBtnApply=!1,0==s?(e.staBtnLoad=!0,e.statusLable=!1,e.staBtnData=!1):1==s?(e.staBtnData=!0,e.staBtnApply=!1,e.statusLable=!1,e.staBtnLoad=!1):2==s?(e.staBtnApply=!0,e.statusLable=!0):3==s?(e.staBtnVerson=!0,e.statusVerson=!0):s<0&&(e.proContiner=!0)}),e.$$phase||e.$apply()},e.$on("listrepeatFinish",function(){a(function(){u(),componentListUpdata(),$(".filter-infoList ").css({"min-height":"40px","overflow-x":"hidden","overflow-y":"auto"}),$(".filter-infoList .filter-tool").map(function(s,t){$(".component-filter").off("click",".checkMore"),$(".component-filter").on("click",".checkMore",function(){var s=$(this).attr("data-type")+"_moreBtn",t=$(this).attr("data-switch");switch(t){case"off":$(".check-box").hide(),$(".filter-infoList").css({border:"none"}),$(".filter-infoList .filter-ele").css({"max-height":"40px",overflow:"hidden"}),$(".selectTitle").css({height:"40px",background:""}),$(".btns-item").css({display:"none"}),$(".checkMore").attr("data-switch","off"),$(".filter-infoList .filter-ele").children().find(".check-box input").prop("checked",!1),$(".filter-more").addClass("showMore"),$(".filter-infoList .filter-more").find(".glyphicon-menu-up").css({transform:"rotate(180deg)"}),$(".filter-infoList .filter-more").find(".moreBtn").text("更多"),e.brand_moreBtn=null,e.style_moreBtn=null,e.types_moreBtn=null,u(),$(this).parent().parent().find(".check-box").show(),$(this).parent().parent().find(".btns-item").css({display:"block"}),$(this).attr("data-switch","on"),$(this).siblings(".filter-more").hide(),$(this).parent().parent().find(".btn-ok").hide(),e[s]=t,$(this).siblings(".filter-more").parent().parent().parent().find(".filter-ele").css({"max-height":"120px","overflow-y":"auto"});var n=$(this).parent().parent().parent().height();$(this).parent().parent().siblings(".selectTitle").css({height:n,background:"lightgoldenrodyellow"}),$(this).parent().parent().parent().css({border:"1px solid rgba(231, 179, 37, 0.31)"});break;case"on":$(this).parent().parent().find(".check-box").hide(),$(this).parent().parent().parent().find(".filter-ele").css({"max-height":"40px",overflow:"hidden"}),$(this).parent().parent().parent().css({border:"none"}),$(this).parent().parent().find(".btns-item").css({display:"none"}),$(this).attr("data-switch","off"),u(),e[s]=t,$(this).parent().parent().siblings(".selectTitle").css({height:"40px",background:""})}})}),$(".component-filter").off("click",".filter-infoList .check-box input"),$(".component-filter").on("click",".filter-infoList .check-box input",function(s){L=0;var t=[],n=[];$(this).parents(".filter-condition").find(".check-box").map(function(e,s){if(1==$(s).find('input[type="checkbox"]').prop("checked")){var l=$(this).parent().children("i").attr("data-id");B=$(this).parent().children("i").text(),t.push(B),n.push(l),L=1}}),t=t.join(","),n=n.join(","),$(this).parents(".filter-condition").find(".btn-ok").off().click(function(){switch($(this).parent().siblings(".filter-ele").children().find(".check-box").hide(),$(this).parent().siblings(".filter-ele").children().find(".check-box input").prop("checked",!1),$(this).parent().siblings(".filter-tool").find(".checkMore").attr("data-switch","off"),$(this).parent().hide(),T(),$(this).attr("data-type")){case"brand":e.brandIds=n,v(t,"selectBrand"),k("isBrands"),T();break;case"style":e.styleIds=n,v(t,"selectStyle"),k("isStyle"),T();break;case"types":e.typeIds=n,v(t,"selectTypes"),k("isTypes"),T()}b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w})}),0==L?$(this).parent().parent().parent().siblings().find(".btn-ok").hide():$(this).parent().parent().parent().siblings().find(".btn-ok").show()}),$(".component-filter").off("click",".filter-more").on("click",".filter-more",function(){$(this).hasClass("showMore")?($(this).parent().parent().parent().find(".filter-ele").css({"max-height":"120px","overflow-y":"auto"}),$(this).find(".glyphicon-menu-up").css({transform:"rotate(0deg)"}),$(this).find(".moreBtn").text("收起"),$(this).removeClass("showMore")):($(this).parent().parent().parent().find(".filter-ele").css({"max-height":"40px",overflow:"hidden"}),$(this).find(".glyphicon-menu-up").css({transform:"rotate(180deg)"}),$(this).find(".moreBtn").text("更多"),$(this).addClass("showMore"))}),$(".component-filter").off("click",".filter-infoList .btn-cancel"),$(".component-filter").on("click",".filter-infoList .btn-cancel",function(){switch($(this).parent().siblings(".filter-ele").css({"max-height":"40px",overflow:"hidden"}),$(this).parent().parent().parent().css({border:"none"}),$(this).parent().parent().siblings(".selectTitle").css({height:"40px",background:""}),$(this).parent().siblings(".filter-ele").children().find(".check-box").hide(),$(this).parent().siblings(".filter-ele").children().find(".check-box input").prop("checked",!1),$(this).parent().siblings(".filter-tool").find(".checkMore").attr("data-switch","off"),$(this).parent().hide(),u(),$(this).attr("data-type")){case"brand":e.brand_moreBtn=void 0;break;case"style":e.style_moreBtn=void 0;break;case"types":e.types_moreBtn=void 0}$(this).parent().siblings().find(".check-box").hide(),$(this).parent().css({display:"none"}),$(this).parent().siblings().find('input[type="checkbox"]').prop("checked",""),$(this).siblings(".btn-ok").hide(),$(this).parent().parent().siblings(".selectTitle").css({height:"40px",background:""}),$(this).parent().parent().parent().css({border:"none"}),e.$apply()})},10)});var P,_={view:{showIcon:!1,showLine:!1},data:{simpleData:{enable:!0,idKey:"orgId",pIdKey:"parentId"},key:{name:"orgName"}},callback:{onClick:function(s,t,n){h(),e.data.componentList=[],e.bigTotalItems=[],y(),e.scope=null;var l=[];l=f(l,n),e.$apply(),l=l.toString(l),e.orgId=l,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,b(M={scope:null,orgId:l,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w})}}},A=[];l.getComponent().then(function(s){P=s.data,$.fn.zTree.init($(".component-base .ztree"),_,P);var t=$.fn.zTree.getZTreeObj("sourceTree");t.expandAll(!0),$("#sourceTree_1_span").css({color:"white",background:"rgb(73, 144, 226)"});for(var n=t.getNodes(),l=t.transformToArray(n),a=0;a<l.length;a++)A.push(l[a].orgId);if(A=A.toString(A),1==r.name){$(".component-base .source>li.btnActive").removeClass("btnActive"),$(".component-base .source>li:nth-child(2)").addClass("btnActive"),$(".component-base .source>li:nth-child(2) ul").show();var o=$("#sourceTree_1_span").text();$(".filter-status .filter-ele div").eq(0).html(o).attr("title",o),e.orgId=A,e.scope=null,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,e.componentDisplayName=null,m()}var i;$(".main-siderbar ul:not(.line) .node_name").off("click"),$(".main-siderbar ul:not(.line) .node_name").on("click",function(){e.isType=!0,e.isSType=!1,e.isTypes=!1,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null;t.getSelectedNodes();""!=$(this).text()&&void 0!=$(this).text()&&(i=$(this).text()),$(".filter-status .filter-ele div").eq(0).html(i).attr("title",i),$("li").css({background:"",color:"#333"}),$("li span").css({background:"",color:"#333"}),$(this).parent().children().find("span").css({background:"",color:"#333"}),$(this).css({color:"white",background:"rgb(73, 144, 226)"}),e.$apply()})}),e.public=function(s){$(s.target).parent().children("ul").show(),$(".component-base .source>li.btnActive").removeClass("btnActive"),$(s.target).parent().addClass("btnActive"),$(".filter-status .filter-ele div").eq(0).html("公共库").attr("title","公共库"),$(".component-base .source>li:nth-child(2)>ul").hide(),h(),y(),e.scope=1,e.orgId=null,e.isType=!0,e.isSType=!1,e.isTypes=!1,e.isStyle=!0,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,e.currentPage=1;var t={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:e.currentPage,pageSize:w};""==e.componentDisplayName&&(e.isBlock=!1),b(t)},e.company=function(s){$(s.target).parent().children("ul").show(),$(".component-base .source>li.btnActive").removeClass("btnActive"),$(s.target).parent().addClass("btnActive");var t=$("#sourceTree_1_span").text();$(".filter-status .filter-ele div").eq(0).html(t).attr("title",t),h(),y(),e.scope=null,e.isType=!0,e.isSType=!1,e.isTypes=!1,e.isStyle=!0,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,e.orgId=A,e.currentPage=1;var n={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:e.currentPage,pageSize:w};""==e.componentDisplayName&&(e.isBlock=!1),b(n)},e.source=function(){h(),y(),e.isType=!0,e.isSType=!1,e.isTypes=!1,e.isStyle=!0,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null;var s={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:e.currentPage,pageSize:w};""==e.componentDisplayName&&(e.isBlock=!1),b(s)},e.setPage=function(s){e.currentPage=s,console.log(s)},e.pageChanged=function(s){e.data.componentList=[],b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:s,pageSize:w},"page")},e.maxSize=5,e.getDumpOk=function(s,t){if(s&&13!=s.keyCode&&10!=s.keyCode)return!1;var n=parseInt(I());if(n>t)return alert("查询页码超出范围，请重新输入"),$(".dump-inp input").val(""),!1;e.setPage(I()),b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:n,pageSize:w},"page"),$(".dump-inp input").val("")};var M;e.apply=function(e,s,t,n){BzCloudComp.UseComp(e,s,t,n)},e.down=function(e,s,t,n,l,a,o,i,r,c){c.proContiner=!0,BzCloudComp.DownloadComp(e,s,t,n,l);var p=BzCloudComp.GetCompType(a,o,i,s,t,r);console.log("apply",p)},e.search=function(s,t){if(s&&13!=s.keyCode)return!1;if(!(""==t||void 0==t||M&&M.componentDisplayName==t)){$(".addSearch").prev(".glyphicon").remove(),$(".addSearch").remove(),k("isSearch"),e.componentDisplayName=t,b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w});var n='<b class="glyphicon glyphicon-menu-right addSearchIcon"></b><div class="type-filter addSearch"><div class="filter-trigger filter-closeStatus" title='+t+"><span>"+t+'</span><b class="icon-close"></b></div>',l=angular.element(n),a=o(l)(e);$(".addSearchIcon").length>0?angular.element($(".addSearchIcon").before(a)):angular.element($(".filter-status .filter-ele").append(a)),k("isSearch"),T(),componentListUpdata()}},e.isBrandFilter=function(s){if("off"!=e.brand_moreBtn)"I"!=s.target.nodeName&&"I"!=s.target.nodeName||(B=$(s.target).text(),N=$(s.target).attr("data-id"),$(".addSearchIcon").length>0?$(".addSearchIcon").before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus"  title='+B+"><span>"+B+'</span><b class="icon-close"></b></div>'):$(".filter-status .filter-ele").append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus"  title='+B+"><span>"+B+'</span><b class="icon-close"></b></div>'),e.brandIds=N,b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w})),k("isBrands"),T();else{var t=$(s.target).parent("span.ng-scope")||$(s.target);$(t).find(".check-box input").click()}},e.isStyleFilter=function(s){if("off"!=e.style_moreBtn){if("I"==s.target.nodeName||"I"==s.target.nodeName){var t=$(s.target).text();B=$(s.target).attr("data-id"),$(".addSearchIcon").length>0?$(".addSearchIcon").before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title='+t+"><span>"+t+'</span><b class="icon-close"></b></div>'):$(".filter-status .filter-ele").append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title='+t+"><span>"+t+'</span><b class="icon-close"></b></div>'),e.styleIds=B,b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w})}T(),k("isStyle")}else{var n=$(s.target).parent("span.ng-scope")||$(s.target);$(n).find(".check-box input").click()}},e.isTypeFilter=function(s){if("SPAN"==s.target.nodeName||"span"==s.target.nodeName){B=$(s.target).not('input[type="checkbox"]').text(),N=$(s.target).not('input[type="checkbox"]').attr("data-id");e.typeList;var t='<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter ltype"><div class="filter-trigger "><span>'+B+'</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in larList" data-id="{{item.compClassId}}">{{item.compClassName}}</div></div></div>',n=angular.element(t),l=o(n)(e);angular.element($(".filter-status .filter-first-ele").after(l)),e.compClassId=parseInt(N),e.subClassId=null,e.typeIds=null,b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),S(N),e.isType=!1,e.isSType=!0,C($(".component-base .filter-status .filter-ele .type-filter"))}T()},e.isSTypeFilter=function(s){if("SPAN"==event.target.nodeName||"span"==event.target.nodeName){B=$(event.target).not('input[type="checkbox"]').text(),N=$(event.target).not('input[type="checkbox"]').attr("data-id"),e.subClassId=parseInt(N);e.sTypeList;var t='<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter stype"><div class="filter-trigger "><span>'+B+'</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in smaList" data-id="{{item.subClassId}}">{{item.subClassName}}</div></div></div>',n=angular.element(t),l=o(n)(e);angular.element($(".filter-status .ltype").after(l)),e.typeIds=null,b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),e.isSType=!1,e.isTypes=!0,C($(".component-base .filter-status .filter-ele .type-filter"))}T()},e.seltypes=function(s,t){if("off"!=e.types_moreBtn)$(".addSearchIcon").length>0?$(".addSearchIcon").before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title='+s+"><span>"+s+'</span><b class="icon-close"></b></div>'):$(".filter-status .filter-ele").append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title='+s+"><span>"+s+'</span><b class="icon-close"></b></div>'),e.isTypes=!1,e.typeIds=t.toString(),b(M={scope:e.scope,orgId:e.orgId,compClassId:e.compClassId,subClassId:e.subClassId,typeIds:e.typeIds,styleIds:e.styleIds,brandIds:e.brandIds,componentDisplayName:e.componentDisplayName,currentPage:1,pageSize:w}),T(),k("isTypes");else{var n=$(event.target).parent("span.ng-scope")||$(event.target);$(n).find(".check-box input").click()}},e.cancelFilter=function(){$(".type-filter").remove(),$(".filter-status .filter-ele>b").remove(),e.isBlock=!1,e.isSType=!1,e.isTypes=!1,e.compClassId=null,e.subClassId=null,e.typeIds=null,e.styleIds=null,e.brandIds=null,e.componentDisplayName=null,e.searchText=null,b(M={scope:e.scope,orgId:e.orgId,compClassId:null,subClassId:null,typeIds:null,styleIds:null,brandIds:null,componentDisplayName:null,currentPage:1,pageSize:w}),u(),$(".filter-condition").find(".check-box").hide(),$(".filter-condition").find(".check-box input").prop("checked",!1),$(".filter-condition").find(".btns-item").css({display:"none"}),$(".checkMore").attr("data-switch","off"),e.style_moreBtn=null,e.brand_moreBtn=null,e.types_moreBtn=null},$(".component-list").off("click",".filter-down"),$(".component-list").on("click",".filter-down",function(){0==D&&($(this).hasClass("activeShow")?(e.isBrand=!0,$(".filter-down").find(".moreSelect").html("收起"),$(this).removeClass("activeShow")):(e.isBrand=!1,$(".filter-down").find(".moreSelect").html("更多选项"),$(this).addClass("activeShow")),e.$apply(),u())}),e.componetModal=function(s,t,l){console.log(s,t,l);var a;a=-2==t?1:null,e.items={scope:a,componentId:s},n.open({windowClass:"component-modal",backdrop:"static",animation:!1,size:"lg",templateUrl:"template/core/modal.html",controller:"modalCtrl",resolve:{items:function(){return e.items}}}).result.then(function(e){console.log(e),""!=e&&void 0!=e&&(l.proContiner=!0)},function(e){console.log(e)})},e.uploadCom=function(){if(BzCloudComp.GetVersion){if(console.log("新版本"),""==BzCloudComp.GetUpLoadDetail())return document.title="提示",void alert("当前无可上传构件!");n.open({windowClass:"uploadCom-modal",backdrop:"static",animation:!1,size:"lg",templateUrl:"template/component/uploadCom.html",controller:"uploadComCtrl",resolve:{items:function(){return e.items}}}).result.then(function(s){e.selected=s},function(){e.cancel=function(){$uibModalInstance.dismiss("cancel")}})}else alert("客户端版本过低，请升级到最新版本！")},$(".return-top img").hover(function(){$(".return-top .textTop").css("display","block")},function(){$(".return-top .textTop").css("display","none")}),$(".return-top").click(function(){$(".component-list").animate({scrollTop:0},500)}),e.reTop=function(){$(".componet-base-main").animate({scrollTop:0},500)},l.heartBeat()}]);