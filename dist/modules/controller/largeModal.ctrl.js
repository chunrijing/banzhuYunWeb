"use strict";angular.module("core").controller("largeModalCtrl",["$scope","$http","$uibModalInstance","items","$timeout","commonService","$stateParams",function(e,t,o,i,n,l,r){console.log(i),l.uploadDetails(i).then(function(t){e.list=t.data}),e.otherList=JSON.parse(BzCloudComp.GetCompDetail(i)).detail,e.cancel=function(){o.close("cancel")},e.$on("listrepeatFinish",function(){n(function(){$(".preview-small").map(function(e,t){$(t).children("span:first-of-type").find("img").css({borderColor:"red"});var o=$(t).children("span:first-of-type").find("img").attr("src");$(t).prev(".preview-big").find("img").attr("src",o)}),$(".component-modal .modal-left li .preview-small span").hover(function(){$(".component-modal .modal-left li .preview-small span img").css({borderColor:"#ddd"}),$(this).find("img").css({borderColor:"red"});var e=$(this).find("img").attr("src");$(this).parent().siblings().find("img").attr("src",e)})},10)}),e.delete=function(){$(".isDelete").show()},e.deleteOk=function(){l.deleteCom({componentId:i}).then(function(e){console.log(e.data),$(".isDelete").hide(),o.close("deleteOk")})},e.deleteCancel=function(){$(".isDelete").hide()},l.heartBeat()}]);