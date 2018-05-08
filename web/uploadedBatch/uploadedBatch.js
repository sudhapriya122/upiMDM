/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var batchDataModule = angular.module("MDM.batchData", ['ngRoute', 'ngMessages']);
batchDataModule.controller('batchDataCtrl', ['$scope', '$location', '$filter', '$routeParams', 'LoginCredsFactory', 'PlatwareRequest', 'parsePlatwareResponse', 'dmDialogueBox', 'entityListService', '$q', function ($scope, $location, $filter, $routeParams, LoginCredsFactory, PlatwareRequest, parsePlatwareResponse, dmDialogueBox, entityListService, $q) {

        var currentBatchId = $routeParams.batchid;
        var currentEntityId = $routeParams.entityid;
        $scope.curEntityId = currentEntityId;
        $scope.showScreenControls.showBatchTable = false;
        $scope.curBatchId = currentBatchId;
        $scope.getBatchData = function (currCall) {
            $scope.showLoader();
            $scope.showScreenControls.showBatchTable = false;
            //var queue = $q.defer();
            var reqObj = [{
                    processName: 'SPGETVIEWDATA',
                    data: [{
                            x_start_index: (parseInt(currCall)) + 1 + '',
                            x_entityid: $scope.curEntityId,
                            x_batch_id: $scope.curBatchId
                        }]
                }]
            PlatwareRequest.callPlatware(reqObj).success(function (res) {
                var data=[];
                var response = parsePlatwareResponse.parse(res);
                for (var i = 0, max = response.length; i < max; i++) {
                    if (response[i]["isError"] == "N") {
                        data = response[i]['data'];
                        var totalCallObj = {}
                        totalCallObj.totalRec = data[0]['total_records'];
                        totalCallObj.recPerRes = data[0]['batch_count'];
                        $scope.collectiveServerCalls = {
                            showServerPagination: true,
                            totalRecordCount: totalCallObj['totalRec'],
                            batchCount: totalCallObj.recPerRes
                        }
//                    $scope.showScreenControls.showBatchTable = true;
                        $scope.hideLoader();
                        $scope.showScreenControls.showBatchTable = true;
                        $scope.batchRowData = data;
                    } else {
                        $scope.hideLoader();
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Error From Server Side',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        //callback(null);
                    }
                }
                //queue.resolve(data)
            }).error(function (error) {
                $scope.hideLoader()
                dmDialogueBox.alertBox({
                    title: 'Alert',
                    message: 'Error From Server Side',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                //return queue.reject();
            })
            //return queue.promise;
        }
        /*  $scope.callPlatwareBatches = function (totBatches, batchcount, responseArr, calledRequestCount) {
         var sumResponseArr = []
         for (var i = 0; i <= 4; i++) {
         $scope.getBatchData(calledRequestCount, batchcount).then(function (res) {
         responseArr = responseArr.concat(res);
         sumResponseArr.push(i);
         console.log(responseArr);
         if (sumResponseArr.length == 5) {
         totBatches--;
         if (totBatches) {
         $scope.callPlatwareBatches(totBatches, batchcount, responseArr, calledRequestCount)
         } else {
         $scope.hideLoader();
         $scope.showScreenControls.showBatchTable = true;
         $scope.batchRowData = responseArr;
         }
         }
         }, function (err) {
         
         })
         calledRequestCount++;
         }
         }*/
        /*$scope.calcPlatwareCalls = function (AggregateCallsObj) {
         var i = 0;
         var j = 0;
         var responseArr = [];
         var sumResponseArr = []
         var batchCount = AggregateCallsObj['recPerRes'];
         var batches;
         var remainingCalls;
         var totalCalls = AggregateCallsObj['totalRec'] / AggregateCallsObj['recPerRes'];
         switch (true) {
         case !Number.isInteger(totalCalls):
         if (AggregateCallsObj['totalRec'] / AggregateCallsObj['recPerRes'] > 1) {
         i = parseInt(totalCalls);
         } else {
         i = 1;
         batchCount = 1;
         }
         break;
         case (Number.isInteger(totalCalls)):
         i = totalCalls;
         break;
         }
         if (i % 5 == 0) {
         batches = i / 5;
         } else {
         batches = parseInt(i / 5);
         remainingCalls = i % 5;
         }
         if (remainingCalls) {
         for (j = 0; j <= remainingCalls; j++) {
         $scope.getBatchData(j, batchCount).then(function (res) {
         responseArr = responseArr.concat(res);
         sumResponseArr.push(j);
         console.log(responseArr)
         if (sumResponseArr.length == remainingCalls + 1) {
         if (batches) {
         $scope.callPlatwareBatches(batches, batchCount, responseArr, j)
         } else {
         $scope.hideLoader();
         $scope.showScreenControls.showBatchTable = true;
         $scope.batchRowData = responseArr;
         }
         
         }
         }, function (err) {
         
         })
         }
         } else {
         $scope.callPlatwareBatches(batches, batchCount, responseArr, j)
         }
         
         
         }*/

        $scope.getCurrentBatchData = function () {

//            var data = [
//                {
//                    processName: "GETVIEWDATA", //"GETSTAGINGDATA",
//                    data: [{
//                            x_entityid: $scope.curEntityId,
//                            x_batch_id: $scope.curBatchId
//                        }]
//                }
//            ];
            var data = [
                {
                    processName: "SPCOUNTRECORD", //"GETSTAGINGDATA",
                    data: [{
                            x_entityid: $scope.curEntityId,
                            x_batch_id: $scope.curBatchId
                        }]
                }
            ];
            $scope.showLoader('Getting Batch Records');
            PlatwareRequest.callPlatware(data).success(function (response) {
                //$scope.hideLoader();
                var totalCallObj = {}
                var resParameters = parsePlatwareResponse.parse(response);
                for (var i = 0; i < resParameters.length; i++) {
                    totalCallObj.totalRec = resParameters[i]['data'][i]['total_records'];
                    totalCallObj.recPerRes = resParameters[i]['data'][i]['batch_count'];
                }
                $scope.collectiveServerCalls = {
                    showServerPagination: true,
                    totalRecordCount: totalCallObj['totalRec'],
                    batchCount: totalCallObj.recPerRes
                }
//                $scope.calcPlatwareCalls(totalCallObj, positionCode1);
                $scope.getBatchData('0')
                //$scope.calcPlatwareCalls(totalCallObj);
            }).error(function () {
                $scope.hideLoader()
                dmDialogueBox.alertBox({
                    title: 'Oops !!',
                    message: 'Some Error occured..Please try again!!',
                    iconType: 'interneterror'
                });
            })
        }
//        PlatwareRequest.callPlatware(data).success(function (response) {
//            var stagingDataRes = parsePlatwareResponse.parse(response)
//            $scope.batchRowData = stagingDataRes;
//            $scope.hideLoader();
//            for (var i = 0, max = stagingDataRes.length; i < max; i++) {
//                if (stagingDataRes[i]["isError"] == "N") {
//                    /*if (!callback) {
//                     $scope.stagingData = stagingDataRes[i]['data'];
//                     } else {
//                     $scope.stagingData = stagingDataRes[i]['data'];
//                     callback($scope.stagingData);
//                     }*/
//                    $scope.batchRowData = stagingDataRes[i]['data'];
//                    $scope.showScreenControls.showBatchTable = true;
//                    //alert(JSON.stringify($scope.stagingData));
//                } else {
//                    dmDialogueBox.alertBox({
//                        title: 'Alert',
//                        message: 'Error From Server Side',
//                        actionlabel: ['Ok']
//                    }).then(function (res) {
//                    });
//                    //callback(null);
//                }
//            }
//        }).error(function () {
//            $scope.hideLoader();
//            $scope.serverError();
//
//        });

        //$scope.getEntitylist();

        //var entityList = $filter('byProp')($scope.entityList , 'entityid', $scope.curEntityId);
        $scope.$on('sessionValidateEvent', function (e, isSessionValid) {

            if (isSessionValid) {
                try {
                    $scope.actionBatch = {};
                    $scope.actionBatch['name'] = 'Batch Data';
                    $scope.actionBatch['action'] = 'batchData';
                    $scope.setPath($scope.actionBatch);
                    $scope.getBatchData('0');
                } catch (e) {
                    // //console.log("hel")
                }
            } else {
                dmDialogueBox.alertBox({
                    title: 'Error',
                    message: 'Invalid user or session, kindly login again',
                    actionlabel: ['Ok']
                }).then(function (res) {
                    $location.path('/login')
                });
            }
        });
    }]);
