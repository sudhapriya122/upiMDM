/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var batchModule = angular.module("MDM.batch", ['ngRoute', 'ngMessages']);
batchModule.controller('batchCtrl', ['$scope', '$location', '$routeParams', 'LoginCredsFactory', 'PlatwareRequest', 'parsePlatwareResponse', 'dmDialogueBox', 'entityListService', 'orgIdService', '$filter', function ($scope, $location, $routeParams, LoginCredsFactory, PlatwareRequest, parsePlatwareResponse, dmDialogueBox, entityListService, orgIdService, $filter) {

        $scope.curEntityId = '';
        $scope.entityList = '';
        $scope.batchDataTable = false;
        $scope.currentBatchTable = false;
        var currentEntityId = $routeParams.entityid;
        $scope.curEntityId = currentEntityId;
        $scope.getEntitylist = function () {
            //$scope.showLoader('Loading Entities');
            var orgId = orgIdService.getOrgId();
            var data = [{
                    processName: "SPENTITYLIST",
                    data: [{
                            x_org_id: orgId.orgid
                        }]
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                var entityDetail = parsePlatwareResponse.parse(response);
                //$scope.hideLoader();
              
                
                for (var i = 0; i < entityDetail.length; i++)
                {
                    if (entityDetail[i].isError == "N")
                    {
                        if (entityDetail[i].processName == 'SPENTITYLIST')
                        {

                            $scope.entityList = entityDetail[i].data;
                            $scope.selectedEntity = $filter('byProp')($scope.entityList, 'entityid', $scope.curEntityId);
                            $scope.entityName = $scope.selectedEntity[0].entitydescription;
                          
                        }

                    } else {
                        // alert("response erroalert(r");
                        dmDialogueBox.alertBox({
                            title: 'Server Error',
                            message: "response error",
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }

                    ////console.log($scope.entityList);
                }

            }).error(function () {
                //$scope.hideLoader();
                $scope.serverError();

            });
        };

        $scope.getBatch = function () {


            var data = [
                {
                    processName: "GETBATCHLIST", //"GETSTAGINGDATA",
                    data: [{
                            x_entityid: $scope.curEntityId
                        }]
                }
            ];
            $scope.showLoader('Getting Batch Data');
            PlatwareRequest.callPlatware(data).success(function (response) {
                var stagingDataRes = parsePlatwareResponse.parse(response)
                $scope.batchData = stagingDataRes;
                $scope.hideLoader();
                for (var i = 0, max = stagingDataRes.length; i < max; i++) {
                    if (stagingDataRes[i]["isError"] == "N") {
                        /*if (!callback) {
                         $scope.stagingData = stagingDataRes[i]['data'];
                         } else {
                         $scope.stagingData = stagingDataRes[i]['data'];
                         callback($scope.stagingData);
                         }*/
                        $scope.batchData = stagingDataRes[i]['data'];
                        $scope.batchDataTable = true;
                        $scope.currentBatchTable = false;
                        //alert(JSON.stringify($scope.stagingData));
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Error From Server Side',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        //callback(null);
                    }
                }
            }).error(function () {
                $scope.hideLoader();
                $scope.serverError();

            });
        }

        $scope.dmTableAction = [{
                'column_name': 'view_btn',
                'action_function': 'tableAction'
            }]
        $scope.tableAction = function (row) {
            var rowData = row;
            var batchId = rowData['batch id'];
            if (batchId.length <= 0) {
                dmDialogueBox.alertBox({
                    title: 'Alert',
                    message: 'Batch Id cannot be blank',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
            } else {
                $location.path('/batchData/' + batchId + '/' + $scope.curEntityId);
            }

        }
        $scope.refreshBatchData = function () {
            $scope.getBatch();
        }

        $scope.submitRecords = function (data) {
            var batchIdArr = [];
            var batchIdStr = '';
            for (var i = 0; i < data.length; i++) {
                batchIdArr.push(data[i]['batch id']);
            }
            if (batchIdArr.length > 0) {
                batchIdStr = batchIdArr.join('~');
                var data = [
                    {
                        processName: "INSERTINTOMASTER",
                        data: [{
                                x_entityid: $scope.curEntityId,
                                x_batch_id: batchIdStr
                            }]
                    }
                ];
                $scope.showLoader('Moving Data To Master');
                PlatwareRequest.callPlatware(data).success(function (response) {
                    var masterDataRes = parsePlatwareResponse.parse(response)
                    $scope.hideLoader();
                    for (var i = 0; i < masterDataRes.length; i++)
                    {
                        if (masterDataRes[i].isError == "N")
                        {
                            if (masterDataRes[i].processName == 'INSERTINTOMASTER')
                            {

                                var isMasterDataInsert = masterDataRes[i].data[0]['message'];
                                var info='';
                                if(masterDataRes[i].data[0]['info']&&masterDataRes[i].data[0]['info'].length>0){
                                    info=masterDataRes[i].data[0]['info'];
                                }
                                else{
                                    info='Data has been moved to master successfully';
                                }
                                // //console.log(isMasterDataInsert)
                                if (isMasterDataInsert.toLowerCase() == "success") {
                                    dmDialogueBox.alertBox({
                                        title: 'Proceed',
                                        message: info,
                                        actionlabel: []
                                    }).then(function (res) {
                                        $location.path('/mainpage2');
                                    });
                                    $scope.showScreenControls.optsClass = 'slide-down';
                                    /*$scope.reset();
                                     $scope.removePath(1);*/

                                } else {
                                    dmDialogueBox.alertBox({
                                        title: 'Proceed',
                                        message: 'Some error occured while moving to master',
                                        actionlabel: []
                                    }).then(function (res) {

                                    });
                                }
                            }
                        } else {
                            dmDialogueBox.alertBox({
                                title: 'Proceed',
                                message: 'Some error occured while moving to master',
                                actionlabel: []
                            }).then(function (res) {
                            });
                        }
                    }
                }).error(function () {
                    $scope.hideLoader();
                    $scope.serverError();

                });
            } else {
                dmDialogueBox.alertBox({
                    title: 'Alert',
                    message: 'Select batch id(s) to be moved to master.',
                    actionlabel: []
                }).then(function (res) {
                });
            }
        }
        /*$scope.selectEntity = function (value) {
         $scope.currentEntity = {
         id: value.entityid,
         name: value.entitydescription,
         showStaging: value.showstagingdata,
         showMaster: value.showmasterdata
         };
         $scope.entityName = {};
         $scope.entityName['name'] = $scope.currentEntity.name;
         $scope.entityName['action'] = 'entity';
         $scope.setPath($scope.entityName);
         $scope.showUploadType();
         if ($scope.action_name == "Upload Data") {
         $scope.templateItem = '';
         $scope.editEntity();
         $scope.getTemplate();
         $scope.getStagingData($scope.action_name);
         $scope.getMasterData($scope.action_name);
         $scope.getRejectionData($scope.action_name);
         $scope.showScreenControls.showTemplateOption = true;
         } else if ($scope.action_name == "Create Mapping") {
         $scope.droppedData = [];
         $scope.showScreenControls.showFileUploadButton = true;
         $scope.showScreenControls.showcreateMapping = true;
         } else if ($scope.action_name == "Change Mapping") {
         $scope.droppedData = [];
         $scope.getTemplate();
         $scope.showScreenControls.showTemplateOption = true;
         $scope.showScreenControls.showchangeMapping = false;
         } else if ($scope.action_name == "Staging Data") {
         $scope.getStagingData($scope.action_name, $scope.stagingDataTable);
         $scope.showScreenControls.showStagingTable = true;
         } else if ($scope.action_name == "Master Data") {
         
         $scope.getMasterData($scope.action_name, $scope.masterDataTable);
         } else if ($scope.action_name == "Rejected Data") {
         
         $scope.getRejectionData($scope.action_name, $scope.rejectedDataTable);
         }
         }
         $scope.$watch(function () {
         return $scope.stagingEntityItem;
         }, function (newValue) {
         if (newValue) {
         $scope.selectEntity($scope.stagingEntityItem);
         }
         });*/

        $scope.$on('sessionValidateEvent', function (e, isSessionValid) {
            if (isSessionValid) {
                try {
                     var existing = $filter('byProp')($scope.path.fullPath, 'action','batch');
                     if(existing.length<=0){
                         $scope.action = {};
                    $scope.action['name'] = 'Batch List';
                    $scope.action['action'] = 'batch';
                    $scope.setPath($scope.action);
                     }else{
                        $scope.path.fullPath.pop();
                     }
                    
                    if (currentEntityId.length <= 0) {
                        $scope.showEntityList = true;
                        $scope.entityList = entityListService.getEntityList();
                    } else {
                        $scope.showEntityList = false;
                        $scope.getEntitylist();
                        $scope.getBatch();
                    }

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
