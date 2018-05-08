var mainpageModule = angular.module("MDM.mainpage2", ['ngRoute']);
mainpageModule.controller('mainpageCtrl', ['$scope', '$filter', 'LoginCredsFactory', 
'PlatwareRequest', 'parsePlatwareResponse', 'validateFileData', 'dmDialogueBox', '$location', 
'prepareDwnldData', 'batchDataService', 'entityListService', 'orgIdService', function ($scope, $filter, LoginCredsFactory, PlatwareRequest, parsePlatwareResponse, validateFileData, dmDialogueBox, $location, prepareDwnldData, batchDataService, entityListService, orgIdService) {
     

   

        $scope.item=null;
        $scope.isShownFromToDate=false;
        $scope.showSearchBy=false;
        $scope.dataType="";
        $scope.searchValueData="";
        $scope.isRecordOccurs="false";
        $scope.showScreenControls.proceedEntity = false;
        $scope.showScreenControls.showProceedButtons = false;
        $scope.showScreenControls.showTemplateOption = false;
        $scope.showScreenControls.showFileUploadButton = false;
        $scope.showScreenControls.showTable = false;
        $scope.showScreenControls.showSlideUpIcon = false;
        $scope.showScreenControls.showBatchId = false;
        $scope.showMappingIcons = false;
        $scope.getFromDateTime=$scope.fromDate+""+$scope.fromTime;
        $scope.showScreenControls.showFileUploadResult = false;
        $scope.showScreenControls.showcreateMapping = false;
        $scope.showScreenControls.showchangeMapping = false;
        $scope.showScreenControls.createMappingSection = false;
        $scope.showScreenControls.showStagingTable = false;
        $scope.showScreenControls.showStaging = false;
        $scope.showScreenControls.showMaster = false;
        $scope.showScreenControls.showRejected = false;
        $scope.showNotification = false;
       $scope.showScreenControls.showcreateMappingResults = false;
        $scope.showCreateResultSection1 = false;
        $scope.showCreateResultSection3 = false;
        $scope.showCreateResultSection2 = false;
        $scope.showScreenControls.showfileUpload = false;
        $scope.showScreenControls.showRejectedTable = false;
        $scope.generatedFileTable = false;
        $scope.showScreenControls.showMasterTable = false;
        $scope.showScreenControls.showOrgOptions = false;
        $scope.showScreenControls.showProceedAction = true;
        $scope.showScreenControls.showSubmitButton = false;
        $scope.slideIcon = 'fa-chevron-down'
        $scope.templateName = '';
        $scope.curBatchId = '';
        $scope.filePath = "";
        $scope.masDataTable=null;
        $scope.excelcolheader = [];
        $scope.changeMappedHeaders = [];
        $scope.tableData = [];
        $scope.droppedData = [];
        $scope.mappingAttributeId = [];
        $scope.mappingRecordId = [];
        $scope.entityExcelMapping = [];
        $scope.path.fullPath = [];
        $scope.icon = [{"iconname": "fa-chevron-right"}, {"iconname": "fa-chevron-left"}, {"iconname": "fa-arrow-left"}, {"iconname": "fa-arrow-right"}];
        $scope.mappingOptions = [{"id": "1", "type": "One to One"}, {"id": "2", "type": "Map All"}];
        $scope.stagingData = [];
        $scope.finalFromDate="";
        $scope.finalToDate="";
        var fromDate=$scope.fromDate
        var toDate=$scope.toDate;
        var fromTime=$scope.fromTime;
        var toTime=$scope.toTime;
       
        $scope.showScreenControls.sheetsObj = {
            selectedSheet: '',
            sheets: []
        };

       
       


        $scope.$emit("MyEventshowSearchBy",$scope.showSearchBy); 

        //$scope.$on('showDateDiv',function(e,data){
         //   $scope.isShownFromToDate=data;
        //})
        
        $scope.$on('sessionValidateEvent', function (e, isSessionValid) {

          //  $scope.$on('itemData', function(e, data) {
            //    $scope.item=data;});

        
            if (isSessionValid) {
                $scope.init();
                try {


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

        /*
         * 
         * @returns {undefined}
         */
        $scope.serverError = function ()
        {
            dmDialogueBox.alertBox({
                title: 'Server Error',
                message: 'Server not responding',
                actionlabel: ['Ok']
            }).then(function (res) {
            });
        }


        $scope.getCall = function()
        {
            if($scope.searchValueData.length<1)
            {
                dmDialogueBox.alertBox({
                    title: 'Incomplete Data',
                    message: 'Search field cannot be  blank',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }
             $scope.getMasterData('0',$scope.action_name, $scope.masterDataTable);
           console.log("*************");
        }
      
        $scope.getMasterDataWithDate = function()
        {
           
             var date = new Date($scope.fromDate);
            let mnth = ("0" + (date.getMonth()+1)).slice(-2);
            let day  = ("0" + date.getDate()).slice(-2);
            let finalDate = [ date.getFullYear(), mnth, day ].join("-");
            let requestDataFromTime = finalDate+' '+$scope.fromTime+":00";
            $scope.finalFromDate=requestDataFromTime;
            // $scope.fromDate="";
            // $scope.fromTime="";
            

            var date = new Date($scope.toDate);
            let mnth1 = ("0" + (date.getMonth()+1)).slice(-2);
            let day1  = ("0" + date.getDate()).slice(-2);
            let toDate1 = [ date.getFullYear(), mnth1, day1 ].join("-");
            let requestDataToTime = toDate1+' '+$scope.toTime+":00";
            $scope.finalToDate=requestDataToTime;
            // $scope.toDate="";
            // $scope.toTime="";


            if(($scope.finalFromDate === "NaN-aN-aN 00:00:00") || ($scope.finalToDate === "NaN-aN-aN 00:00:00"))
            {
                dmDialogueBox.alertBox({
                    title: 'Invalid Date',
                    message: 'Please enter date fields',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }
          
             

             $scope.getMasterData('0', "Master Data", $scope.masDataTable);

             
          // var fromDate = $scope.fromDate;
          // var toDate= $scope.toDate;
           //console.log(fromDate);
           //console.log(toDate);
         // setViewValue($scope.item);
         //console.log($scope.item);
        // $scope.getMasterData();
             //scope.setViewValue(scope.entityValueData);
         }
 
        


        /*************   Funtion to get list of Orgs And Org selection  **************/
        $scope.mainpageload = function () {
            
            $scope.showLoader();
            var data = [{
                    processName: "SPORGID",
                    data: []
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                var orgDetail = parsePlatwareResponse.parse(response);
                $scope.hideLoader();
                for (var i = 0; i < orgDetail.length; i++)
                {
                    if (orgDetail[i].isError == "N")
                    {
                        if (orgDetail[i].processName == 'SPORGID')
                        {
                            $scope.OrgNames.OrgList = orgDetail[i].data;

                            //$scope.showScreenControls.showOrgOptions = true;
                            //$scope.showScreenControls.showOrgOptions = true;
                        }
                        if ($scope.OrgNames.OrgList.length == 1) {
                            $scope.selectOrgs($scope.OrgNames.OrgList[0]);
                            orgIdService.setOrgId(JSON.stringify($scope.OrgNames.OrgList[0]))
                            //$scope.selectOrgs($scope.OrgNames.OrgList[0]["orgid"], $scope.OrgNames.OrgList[0]["orgid"]);
                            // $scope.orgname = $scope.currentOrg.name;
                            $scope.showScreenControls.orgItem = $scope.OrgNames.OrgList[0];
                            // $scope.setPath($scope.orgname);

                        } else {
                            //orgIdService.setOrgId(JSON.stringify($scope.OrgNames.OrgList))
                            //alert($scope.OrgNames.OrgList.length);
                            $scope.showScreenControls.showOrgOptions = true;
                            //alert("response error");

                        }
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Unable to get orgId',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }


                    ////console.log($scope.OrgNames.OrgList);
                }

            }).error(function () {
                $scope.hideLoader();
                $scope.serverError();

            });
        };
        $scope.selectOrgs = function (value) {
            $scope.currentOrg = {
                id: value.orgid,
                name: value.orgid
            };
            $scope.orgName = {};
            $scope.path.fullPath = [];
            $scope.orgName['name'] = $scope.currentOrg.name;
            $scope.orgName['action'] = 'org';
            //$scope.setPath($scope.orgName);
            $scope.showScreenControls.showOrgOptions = false;
            $scope.showScreenControls.showProceedAction = true;
            $scope.showScreenControls.showProceedButtons = true;
            $scope.showScreenControls.optsClass === 'slide-up' ? $scope.showScreenControls.optsClass = 'slide-down' : '';
            $scope.showScreenControls.proceedEntity = false;
        }
        $scope.init = function () {
            $scope.mainpageload();
        }

//        /*********************************** Bread Crumbs******************************************/
//        $scope.pathAction = function (path_action, index) {
//            ////console.log(path_action);
//            switch (path_action) {
//                case "org":
//                    // $scope.showScreenControls.optsClass = 'slide-down';
//                    if ($scope.OrgNames.OrgList.length == 1) {
//                        dmDialogueBox.alertBox({
//                            title: 'Alert',
//                            message: 'Sorry ! there is only one Orgid',
//                            actionlabel: ['Ok']
//                        }).then(function (res) {
//                        });
//                    } else {
//                        // $scope.showScreenControls.showTable = false;
//                        $scope.showScreenControls.showProceedAction = false;
//                        $scope.showScreenControls.showOrgOptions = true;
//                        $scope.showScreenControls.showStaging = false;
//                        $scope.showScreenControls.showStagingTable = false;
//                        $scope.showScreenControls.showMaster = false;
//                        $scope.showScreenControls.showMasterTable = false;
//                        $scope.showScreenControls.showRejectedTable = false;
//                        $scope.showScreenControls.showTable = false;
//                        $scope.showScreenControls.showSlideUpIcon = false;
//                        $scope.showScreenControls.showBatchId = false;
//                        $scope.showScreenControls.showFileUploadResult = false;
//                        $scope.showScreenControls.showfileUpload = false;
//                        $scope.showScreenControls.showRejected = false;
//                        $scope.showScreenControls.showcreateMapping = false;
//                        $scope.showScreenControls.showchangeMapping = false;
//                        $scope.removePath(index);
//                        $scope.showScreenControls.orgItem = '';
//                    }
//                    break;
//                case "action":
//                    $scope.showScreenControls.optsClass = 'slide-down';
//                    $scope.reset();
//                    //$scope.removePath($scope.entityName);
//                    $scope.removePath(index);
//                    break;
//                case "entity":
//                    $scope.showScreenControls.optsClass = 'slide-down';
//                    $scope.removePath(index);
//                    $scope.editEntity();
//                    break;
//            }
//            document.getElementById("fileName").innerHTML = '';
//            document.getElementById("createFileName").innerHTML = '';
//            document.getElementById("changeFileName").innerHTML = '';
//            document.getElementById("UploadFileInput").value = '';
//            $scope.showScreenControls.sheetsObj = {};
//        }

        /****************************Functions Of Actions Of Mapping*************************************/
        $scope.uploadData = function (clicked_value) {


            $scope.isShownFromToDate=false;
            $scope.showSearchBy=false;
            $scope.showScreenControls.showProceedButtons = false;
            $scope.action_name = clicked_value;
            $scope.actionName['name'] = $scope.action_name;
            $scope.actionName['action'] = 'action';
            $scope.setPath($scope.actionName);
            //$scope.setPath($scope.action_name);
            switch ($scope.action_name) {

                case "Search Engine":
                $scope.dataType="search";
                $scope.entityItem = '';
                $scope.showScreenControls.headers = [];
               // $scope.headingShown = "upload";
               $scope.showScreenControls.showProceedAction = false;
               $scope.showScreenControls.proceedEntity = false;
               $scope.showScreenControls.showSearchBy = true;
               $scope.masterEntityItem = '';
               $scope.getentitylist();
               break;






                case "Upload Data":
                $scope.dataType="upload";
                $scope.isShownFromToDate=false;
                $scope.showSearchBy=false;
                    $scope.entityItem = '';
                    $scope.showScreenControls.headers = [];
                    $scope.headingShown = "upload";
                    $scope.getentitylist();
                    $scope.showScreenControls.proceedEntity = true;
                    $scope.templateItem = null;
                    $scope.fileInput = document.getElementById('UploadFileInput');
                   //  console.log($scope.fileInput);
                    break;
                case "Create Mapping":
                $scope.isShownFromToDate=false;
                $scope.showSearchBy=false;
                    $scope.headingShown = "create";
                    $scope.getentitylist();
                    $scope.showScreenControls.proceedEntity = true;
                    $scope.templateItem = null;
                    $scope.showScreenControls.showTemplateOption = false;
                    $scope.fileInput = document.getElementById('createFileInput');
                    break;
                case "Change Mapping":
                $scope.isShownFromToDate=false;
                $scope.showSearchBy=false;
                    $scope.headingShown = "change";
                    $scope.showScreenControls.headers = [];
                    $scope.getentitylist();
                    $scope.showScreenControls.proceedEntity = true;
                    $scope.templateItem = null;
                    $scope.fileInput = document.getElementById('changeFileInput');
                    break;
                case "Staging Data":
                    // $scope.headingShown = "staging";
                    $scope.dataType="staging";
                    $scope.isShownFromToDate=false;
                    $scope.showSearchBy=false;
                    $scope.showScreenControls.showProceedAction = false;
                    $scope.showScreenControls.showStaging = true;
                    $scope.showScreenControls.proceedEntity = true;
                    $scope.stagingEntityItem = '';
                    $scope.getentitylist();


                    //$scope.getStagingData();
                    break;
                case "Master Data":
                $scope.dataType="master";
                $scope.fromDate="";
                $scope.toDate="";
                $scope.fromTime="";
                $scope.toTime="";
                $scope.finalFromDate="";
                $scope.searchValueData="";
                $scope.finalToDate="";
                    $scope.isShownFromToDate=false;
                    $scope.showSearchBy=false;
                    $scope.showScreenControls.showProceedAction = false;
                    $scope.showScreenControls.proceedEntity = false;
                    $scope.showScreenControls.showMaster = true;
                    $scope.masterEntityItem = '';
                    $scope.getentitylist();
                    break;
                case "Rejected Data":
                $scope.isShownFromToDate=false;
                $scope.showSearchBy=false;
                    $scope.showScreenControls.showProceedAction = false;
                    $scope.showScreenControls.proceedEntity = true;
                    $scope.showScreenControls.showRejected = true;
                    $scope.getentitylist();
                    break;
            }
            if ($scope.action_name != "Staging Data" && $scope.action_name == "Rejected Data" || $scope.action_name == "Create Mapping" || $scope.action_name == "Change Mapping" || $scope.action_name == "Upload Data") {
                $scope.fileInput.addEventListener('click', function () {
                    console.log("file selected==============");
                    $scope.fileInput.removeEventListener('change', $scope.readFileForWorker);
                    $scope.fileInput.value = "";
                    $scope.showScreenControls.sheetsObj.selectedSheet = '';
                    $scope.showScreenControls.showBatchId = false;
                    $scope.fileInput.addEventListener('change', $scope.readFileForWorker);
                });
            }
            $scope.showScreenControls.proceedEntity = true;
        }
        $scope.inputClick = function () {
            $scope.fileInput.click();
        }

        /***************************Funtion to Get Entity List And Selected Entity************************************/
        $scope.getentitylist = function () {
            $scope.showLoader('Loading Entities');
            var data = [{
                    processName: "SPENTITYLIST",
                    data: [{
                            x_org_id: $scope.currentOrg.id,
                            type: $scope.dataType
                        }]
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                //console.log(response); ob
                var entityDetail = parsePlatwareResponse.parse(response);
                $scope.hideLoader();
                for (var i = 0; i < entityDetail.length; i++)
                { 
                   // console.log(entityDetail.length);
                    if (entityDetail[i].isError == "N")
                    {
                       
                        if (entityDetail[i].processName == 'SPENTITYLIST')
                        {
                           
                           $scope.entityList = entityDetail[i].data;
                           entityListService.setEntityList($scope.entityList);
                           
                                 }

                        } else {
                        // alert("response erroalert(r");
                        dmDialogueBox.alertBox({
                            title: 'Response Error',
                            message: "Error occured while getting entity",
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }

                    ////console.log($scope.entityList);
                }

            }).error(function () {
                $scope.hideLoader();
                $scope.serverError();

            });
        };
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
                    message: 'Batch id cannot be blank',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
            } else {
                $location.path('/batchData/' + batchId + '/' + $scope.currentEntity.id);

            }

        }
        $scope.setStagingBatchAttribute = function (value) {
            $scope.filePath = "";
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
//            $scope.showUploadType();
            $location.path('/batch/' + $scope.currentEntity.id);

            $scope.$broadcast('switchTab', 'staging data');
        }
        
        $scope.selectEntity = function (value) {

            
           // console.log("*********");
           // console.log(value);
           // $scope.showSearchBy="true";
           console.log("5555%%%%%%%%5555");
           $scope.searchValueData="";
            $scope.filePath = "";
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
            
            if($scope.action_name == "Search Engine") {
                $scope.showSearchBy="true";
            }
           
            $scope.showUploadType();
            if ($scope.action_name == "Upload Data") {
                $scope.templateItem = '';
                $scope.editEntity();
                $scope.getTemplate();
                $scope.getStagingData($scope.action_name);
                //$scope.getMasterData($scope.action_name);/*commented on 8-jan-2017 to avoid master data call when upload is clicked */
                //$scope.getRejectionData($scope.action_name);/*24-jan-2016*/
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
                if(value.isdatecheckenabled=="N")
                {
                    $scope.isShownFromToDate=false;
                    $scope.finalFromDate="";
                    $scope.finalToDate=""; 
                  
                    $scope.getMasterData('0',$scope.action_name, $scope.masterDataTable);
                }
                else if(value.isdatecheckenabled=="Y")
                {
                    $scope.isShownFromToDate=true; 
                   $scope.dateTime=true;
                   // $scope.getMasterDataWithDate();
                    $scope.masDataTable=$scope.masterDataTable; 
                }

                
               
            } else if ($scope.action_name == "Rejected Data") {

                $scope.getRejectionData($scope.action_name, $scope.rejectedDataTable);
            }
        }
        $scope.stagingDataTable = function (data) {
            $scope.stagingTable2Data = data;
        }
        $scope.masterDataTable = function (data) {
            $scope.masterTableData = data;
            $scope.collectiveServerCalls = {
                showServerPagination: true,
                totalRecordCount: data[0]['total_records'],
                batchCount: data[0]['batch_count']
            }
            $scope.showScreenControls.showMasterTable = true;
        }
        $scope.rejectedDataTable = function (data) {
            $scope.rejectedTableData = data;
            $scope.showScreenControls.showRejectedTable = true;
        }
        /***************************Function to Get Template List And Selected Template*************************************/

        $scope.getTemplate = function () {
            $scope.showLoader('Loading Template');

            var data = [{
                    processName: "SPTEMPLETELIST",
                    data: [{
                            x_orgid: $scope.currentOrg.name,
                            x_entityid: $scope.currentEntity.id
                        }]

                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
           //     console.log("*************");
            //    console.log(data);
            //    console.log(response);
                var templateDetail = parsePlatwareResponse.parse(response);
            //    console.log(templateDetail);
                $scope.hideLoader();
              //  console.log(templateDetail);
                for (var i = 0; i < templateDetail.length; i++)
                {
                    if (templateDetail[i].isError == "N")
                    {
                        $scope.templateList = templateDetail[i].data;
                     //   console.log($scope.templateList);
                        if (templateDetail[i].data.length == 1) {
                            $scope.templateItem = $scope.templateList[i];
                       //     console.log($scope.templateItem);
                        }
                        ////console.log($scope.templateList);
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Unable to get template list',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }
                }
            }).error(function (error) {
                $scope.hideLoader();
                $scope.serverError();
            });
        };
        $scope.selectTemplate = function (value) {
        //    console.log(value);
            $scope.currentTemplate = {
                id: value.templateid,
                name: value.filename
            };
            var filterTemplate = $filter('byProp')($scope.templateList, 'templateid', $scope.currentTemplate.id);
          //   console.log(filterTemplate);
            $scope.filePath = filterTemplate[0]['filepath'];
        //    console.log($scope.filePath);
//            $scope.showresult = true;
//            $scope.showMappedHeaders = false;
            if ($scope.action_name == 'Upload Data') {
                $scope.getUpdateTemplateHeaders($scope.setheaders);
                //  $scope.makeRejectionHeaders();
                $scope.showScreenControls.showfileUpload = true;
                $scope.showScreenControls.showFileUploadResult = true;
                $scope.showScreenControls.showFileUploadButton = true;
            } else if ($scope.action_name == 'Change Mapping')
            {
                //alert("hi")
                $scope.getUpdateTemplateHeaders();
                // $scope.changeMappingSection = true;
                $scope.showScreenControls.showFileUploadButton = true;
                $scope.showScreenControls.showchangeMapping = true;
                //document.getElementById("fileName").innerHTML = '';
            }
        };
        /*************************Get Updated Template Headers**********************************/

        $scope.getUpdateTemplateHeaders = function (callback) {
            $scope.showLoader('Loading Headers');
            var data = [{
                    processName: "SPTEMPATTRIBUTEMAPPING",
                    data: [{
                            x_templateid: $scope.currentTemplate.id,
                            x_entityid: $scope.currentEntity.id
                        }]

                }];
             //   console.log("==================");
               // console.log(data);
            ////console.log($scope.showScreenControls.headers);
            PlatwareRequest.callPlatware(data).success(function (response) {
                var updatedTemplateDetail = parsePlatwareResponse.parse(response);
             //   console.log(updatedTemplateDetail);
                $scope.hideLoader();
                // //console.log(updatedTemplateDetail);
                $scope.droppedData = [];
                $scope.excelcolheader = [];
                $scope.attributeNameList = [];
                for (var i = 0; i < updatedTemplateDetail.length; i++)
                {
                    if (updatedTemplateDetail[i].isError == "N")
                    {
                    //  console.log("OOOO");
                        $scope.templateData = updatedTemplateDetail[i].data;
                    //    console.log($scope.templateData);
                        if ($scope.templateData == '') {
                            dmDialogueBox.alertBox({
                                title: 'Template Alert',
                                message: 'Template is Empty',
                                actionlabel: ['Ok']
                            }).then(function (res) {
                            });
                            $scope.showScreenControls.showFileUploadResult = false;
                        } else {
                            $scope.templateData = $filter('orderObjectBy')($scope.templateData, 'attributeid');
                       //     console.log("+++++++++++++");
                         //   console.log($scope.templateData);
                            for (j = 0; j < $scope.templateData.length; j++) {
                           //     console.log("00000000000");
                                var attributeName = $scope.templateData[j]['attributename']
                             //   console.log("...........");
                                $scope.attributeNameList.push(attributeName);
                              //  console.log($scope.attributeNameList);
                                $scope.colheader = $scope.templateData[j]['excelcolumnheader'].trim();
                                
                                $scope.excelcolheader.push($scope.colheader);
                              //  console.log($scope.excelcolheader);
                              //  console.log($scope.excelcolheader.length)
                                var templateheader = {};
                                templateheader['data'] = $scope.templateData[j]['excelcolumnheader'];
                                $scope.droppedData.push(templateheader);
                            }
                            // //console.log($scope.droppedData);
                            // //console.log( $scope.updatedTempDataList);
//                           for(j=0;j<$scope.updatedTempDataList.length;j++){
//                              var tempHeader = $scope.updatedTempDataList[j]['excelcolumnheader']
//                               $scope.updateTemplateMappedHeaders.push(tempHeader);
//                           }
//                           //console.log($scope.updateTemplateMappedHeaders);

                        }
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Response error',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }
                    if (callback) {
                        callback();
                    }
//                    if ($scope.action_name == "Upload Data") {
//                        //$scope.showScreenControls.headers=[];
//                       
//                    }
                }
            }).error(function (error) {
                $scope.hideLoader();
                $scope.serverError();
            });
        }
        $scope.setheaders = function () {
            $scope.showScreenControls.headers = $scope.excelcolheader;
        }


        /***************************** Sliding Icon************;***********************/

        $scope.icontoggle = function () {
            $scope.showScreenControls.optsClass === 'slide-up' ? $scope.showScreenControls.optsClass = 'slide-down' : $scope.showScreenControls.optsClass = 'slide-up';
            $scope.slideIcon === 'fa-chevron-down' ? $scope.slideIcon = 'fa-chevron-up' : $scope.slideIcon = 'fa-chevron-down';
            $scope.$apply();
        };
        /***********************************Read/Parse/Validate  CSV,XLS File***************************************/
        $scope.readFileForWorker = function (e) {
            var file = $scope.fileInput.files[0];
            var textType = /csv.*/;
            $scope.fileName = file.name;
            var file = e.target.files[0];
            var workerData = {
                file: file
            };
            $scope.showLoader('Getting File Data');
            var promise = validateFileData.readFileData(workerData);
            $scope.$apply();
            // console.time("batchTime");
            promise.then(function (data) {
                //console.log(data[0]['errorMessage']);
                if (data[0]['errorMessage'] != '') {
                    $scope.hideLoader();
                    dmDialogueBox.alertBox({
                        title: 'File Error',
                        message: data[0]['errorMessage']
                    });
                    return;
                }

                switch (data[0]['fileType'].toLowerCase()) {
                    case 'xls':
                    case 'xlsx':
                        $scope.showScreenControls.sheetsObj.sheets = data[0]['sheets'];
                        $scope.showScreenControls.sheetsObj.sheetsData = data[0]['fileData'];
                        if ($scope.showScreenControls.sheetsObj.sheets && $scope.showScreenControls.sheetsObj.sheets.length == 1) {
                            $scope.showScreenControls.sheetsObj.selectedSheet = $scope.showScreenControls.sheetsObj.sheets[0];
                            $scope.readSheetData();

                        }
                        $scope.hideLoader();

                        break;
                    case 'csv':
                        $scope.validate(data[0]['fileData']);

                        break;
                    default :
                }
//                dmDialogueBox.alertBox({
//                    title: 'Alert',
//                    message: 'File uploaded successfully.'
//                });
//                $scope.curBatchId = batchDataService.getBatchId();
            });
        };
        $scope.readSheetData = function () {
            if ($scope.showScreenControls.sheetsObj.selectedSheet) {

                var data = $scope.showScreenControls.sheetsObj.sheetsData[$scope.showScreenControls.sheetsObj.selectedSheet];
                $scope.validate(data);
            } else {
                return;
            }
        };
        $scope.getSelectedSheetData = function () {
            if ($scope.showScreenControls.sheetsObj.sheets && $scope.showScreenControls.sheetsObj.sheets.length <= 1) {
                return;
            }
            $scope.readSheetData();
        };
        $scope.validate = function (data) {

            $scope.workerConfig = null;
            if ($scope.action_name == "Create Mapping") {

            } else if ($scope.action_name == "Create Mapping") {

            } else if ($scope.action_name == "Create Mapping") {

            }
            switch ($scope.action_name.toLowerCase()) {
                case "create mapping":
//                    $scope.workerConfig = {
//                        messageCount: 2
//                    };
                case "change mapping":
//                    $scope.workerConfig = {
//                        messageCount: 2
//                    };
                    break;
                case "upload data":
                    $scope.workerConfig = {
                        messageCount: 2
                    };
                    break;
                default:

                    break;
            }
            var templateColumnNames = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
            templateColumnNames = $filter('replaceInArray')(templateColumnNames, /,/g, "^^");
            /* var workerData = {
             key1: data,
             key2: $scope.attributeList,
             key3: templateColumnNames,
             key4: $scope.stagingData,
             key5: $scope.action_name,
             key6: $scope.rejectionData,
             key7: $scope.masterData
             };*/
            var workerData = {
                key1: data,
                key2: $scope.attributeList,
                key3: templateColumnNames,
                key4: [],
                key5: $scope.action_name,
                key6: [],
                key7: []
            }
            ////console.log(workerData);
            var promise = validateFileData.doWork(workerData, $scope.workerConfig);
            // //console.log(promise['$$state'].status);
            $scope.showLoader('Validating File Data');
            promise.then(function (messageData) {
                //console.log('with');
                //console.timeEnd("batchTime");
                //$scope.curBatchId = batchDataService.getBatchId();

                // $scope.hideLoader();
                //$scope.hideLoader()
                var datatype;
                var data;
                switch ($scope.action_name.toLowerCase()) {
                    case "create mapping":
                    case "change mapping":
                        for (var i = 0, max = messageData.length; i < max; i++) {
                            if (messageData[i]['type'].toLowerCase() !== 'tabledata') {
                                data = messageData[i];
                                datatype = data['type'].toLowerCase();
                                handleWorkerData(datatype, data);
                            }
                        }
//                        datatype = messageData['type'].toLowerCase();
//                        data=messageData;
//                        handleWorkerData(datatype,data);
                        break;
                    case "upload data":
                        for (var i = 0, max = messageData.length; i < max; i++) {
                            if (messageData[i]['type'].toLowerCase() !== 'headers') {
                                data = messageData[i];
                                datatype = data['type'].toLowerCase();
                                handleWorkerData(datatype, data);
                            }
                        }
                        break;
                    default:

                        break;
                }
                function handleWorkerData(currentDatatype, currentData) {
                    switch (currentDatatype) {

                        case "headers":
                            if ($scope.action_name == "Create Mapping") {
                                $scope.showScreenControls.headers = currentData['data'];
                                $scope.showScreenControls.createMappingSection = true;
                                $scope.showNotification = true;
                                $scope.showScreenControls.showSubmitButton = true;
                                $scope.showCreateResultSection2 = true;
                                $scope.showCreateResultSection3 = true;
                                // alert($scope.showScreenControls.headers);
//                            $scope.showresult = true;
//                            $scope.showMappingIcons = true;
                                //                            $scope.showMappedHeaders = true;
                            } else if ($scope.action_name == "Change Mapping") {
                                $scope.showScreenControls.headers = currentData['data'];
                                $scope.changeMappingSection = true;
                                $scope.showNotification = true;
                                $scope.showScreenControls.showSubmitButton = true;
                            }
                            break;
                        case "tabledata":
                            ////console.log(data);

                            var finalData;

                            currentData['data'] ? finalData = currentData['data'] : finalData = [];
                            $scope.tableData = finalData;
                            if (finalData.length > 0) {
                                $scope.curBatchId = batchDataService.getBatchId();
                                $scope.showScreenControls.showBatchId = true;
                            } else {
                                $scope.curBatchId = '';
                            }
                            // //console.log($scope.tableData)
                            //console.table($scope.tableData);


                            $scope.showScreenControls.showSlideUpIcon = true;
                            $scope.showScreenControls.showTable = true;
                            data ? $scope.showScreenControls.optsClass = "slide-up" : "";
                            $scope.hideLoader();
                            $scope.$digest();

                            break;
                        case "error":
                            dmDialogueBox.alertBox({
                                title: 'File Alert',
                                message: currentData['message'],
                                actionlabel: ['Ok']
                            }).then(function (res) {
                            });
                            $scope.showScreenControls.showTable = false;
                            $scope.hideLoader();
                            return;
                            //alert(currentData['message']);
                            break;
                    }


                }

            });
        };
        /*********************************  Get Details Of File Attributes *************************************/
        $scope.showUploadType = function () {

            // $scope.showresult = "false";
            var data = [{
                    processName: "SPENTITYATTRIBUTES",
                    data: [{
                            x_entityid: $scope.currentEntity.id
                        }]
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                var entityAtrributeDetail = parsePlatwareResponse.parse(response);
                if (entityAtrributeDetail.length > 0) {
                    var rejectDataHeaders = [];
                    $scope.canUploadFile = true;
                    for (var i = 0; i < entityAtrributeDetail.length; i++)
                    {
                        if (entityAtrributeDetail[i].isError == "N")
                        {
                            $scope.attributeList = entityAtrributeDetail[i].data;
                            $scope.generateFileHeaders();
                            var listLength = $scope.attributeList.length;
                            // //console.log(listLength);
                            for (var j = 0; j < listLength; j++)
                            {
                                var droppedDataObj = {};
                                droppedDataObj['data'] = '';
                                $scope.droppedData.push(droppedDataObj);
                                //$scope.colheader = $scope.attributeList[j]['attributeid'];
                                $scope.attributeId = $scope.attributeList[j]['attributeid'];
                                $scope.mappingAttributeId.push($scope.attributeId);
                                //rejectDataHeaders.push($scope.attributeList[j]['attributename'])
                                $scope.recordId = $scope.attributeList[j]['recordid'];
                                $scope.mappingRecordId.push($scope.recordId);
                                //$scope.excelcolheader.push($scope.colheader);
                                $scope.forbiddengroupId = $scope.attributeList[j]['forbiddengroupid'];
                                $scope.validvaluesgroupid = $scope.attributeList[j]['validvaluesgroupid'];
                                // //console.log($scope.forbiddengroupId);
                            }
                            //$scope.rejectDataHeading = rejectDataHeaders.join('~');
                            ////console.log($scope.rejectDataHeading);
                            $scope.createTemplateAttributeId = $scope.mappingAttributeId.join(",");
                            // $scope.createTemplateRecordId =  $scope.mappingRecordId.join(",");
                            // //console.log($scope.droppedData)
                            //$scope.attributeId = $scope.excelcolheader.join(",");
//                            if ($scope.action_name == "Upload Data") {
//                                $scope.showScreenControls.headers = $scope.excelcolheader;
//                            }
                        } else {
                            dmDialogueBox.alertBox({
                                title: 'Alert',
                                message: 'NO records found',
                                actionlabel: ['Ok']
                            }).then(function (res) {
                            });
                        }
                    }

                }
            }).error(function (error) {
                $scope.hideLoader();
                $scope.serverError();

            });
        }

        $scope.downloadFile = function () {
                if ($scope.filePath.length > 0) {
                if ($scope.filePath.indexOf('webapps') > -1) {
                    var filePath = $scope.filePath.split('webapps');
                    var fileLink = window.location.protocol + "//" + window.location.host + filePath[1];
                    //var fileLink = window.location.protocol + "//" + ip + filePath[1];
                } else {
                    var filePath = $scope.filePath;
                   
                   var fileLink = window.location.protocol + "//" + window.location.host + filePath;
               //var fileLink = "https://172.28.118.10:8443" + filePath ;   // mdm uat url
                 // **** var fileLink="upiuat.adityabirla.bank:9081"+filePath ;  //mdm local
                  var fileLink = "https://172.28.114.17:8443" + filePath ;   //mdm prod url

             //     var fileLink="https://lms.janalakshmi.com/JFS_MDM_FILES/GenericFormat.xlsx";
                     }
                window.open(fileLink, "_blank");
            }
        }


        /*********************************** Drag And Drop**************************************/

        $scope.onDragStart = function (ele) {
            var index = angular.element(ele).scope().$index;
            $scope.dataTransfer = index;
            ////console.log($scope.dataTransfer);
        };
        $scope.onDragEnter = function (ele, evt) {

            evt.preventDefault();
        }
        $scope.onDragOver = function (ele, evt) {
            var index = angular.element(ele).scope().$index;
            $scope.isDrag = index;
            $scope.$apply();
            evt.preventDefault();
            //ele.style.border ="2px solid red";
        }
        $scope.onDrop = function (ele, evt) {
            // //console.log(ele);
            $scope.isDrag = null;
            var index = angular.element(ele).scope().$index;
            $scope.droppedData[index]['data'] = $scope.showScreenControls.headers[$scope.dataTransfer];
            $scope.showScreenControls.headers.splice($scope.dataTransfer, 1);
            // ele.style.border = "none";
            $scope.$apply();
            //  //console.log($scope.droppedData);
            ////console.log(index);
        };
//        /************************** Reset avriables****************************/
//
//        $scope.editEntity = function () {
//            $scope.showScreenControls.showTemplateOption = false;
//            $scope.showScreenControls.showFileUploadResult = false;
//            $scope.showScreenControls.showfileUpload = false;
//            $scope.showScreenControls.showTable = false;
//            $scope.showScreenControls.showSlideUpIcon = false;
//            $scope.showScreenControls.showRejected = false;
//            $scope.showScreenControls.showFileUploadButton = false;
//            $scope.showScreenControls.createMappingSection = false;
//            $scope.showScreenControls.showcreateMapping = false;
//            $scope.showScreenControls.showSubmitButton = false;
//            $scope.showScreenControls.showchangeMapping = false;
//            $scope.showScreenControls.showStagingTable = false;
//            $scope.showScreenControls.showMasterTable = false;
//            $scope.showScreenControls.showRejectedTable = false;
//            $scope.showScreenControls.proceedEntity = true;
//            //document.getElementById("fileName").innerHTML = '';
//        }
//        $scope.reset = function () {
//            $scope.showScreenControls.proceedEntity = false;
//            $scope.showScreenControls.showStagingTable = false;
//            $scope.showScreenControls.showMasterTable = false;
//            $scope.showScreenControls.showRejectedTable = false;
//            $scope.showScreenControls.showcreateMapping = false;
//            $scope.showScreenControls.showTemplateOption = false;
//            $scope.showScreenControls.showProceedAction = true;
//            $scope.showScreenControls.showProceedButtons = true;
//            $scope.showScreenControls.showchangeMapping = false;
//            $scope.showScreenControls.showfileUpload = false;
//            $scope.showScreenControls.showTable = false;
//            $scope.showScreenControls.showRejected = false;
//            $scope.showScreenControls.showFileUploadButton = false;
//            $scope.showScreenControls.showSubmitButton = false;
//            $scope.showScreenControls.showFileUploadResult = false;
//            $scope.showScreenControls.showSlideUpIcon = false;
//            $scope.showScreenControls.showBatchId = false;
//            $scope.showScreenControls.showStaging = false;
//            $scope.showScreenControls.showMaster = false;
//            $scope.showScreenControls.createMappingSection = false;
//            $scope.showScreenControls.headers = [];
//        }

        /************************* Functionality Of Mapping Icons*******************************/
        $scope.mappingIcon = function (icon_name) {
            ////console.log(icon_name);
            switch (icon_name) {
                case "fa-chevron-right":
                    for (var i = 0; i < $scope.droppedData.length; i++) {
                        $scope.showScreenControls.headers[i] = $scope.droppedData[i]['data'];
                        $scope.droppedData[i]['data'] = '';
                    }
                    //$scope.droppedData = [];
                    // //console.log($scope.droppedData);
                    $scope.$apply();
                    break;
                case "fa-chevron-left":

                    for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                        $scope.droppedData[i]['data'] = $scope.showScreenControls.headers[i];
                        // $scope.showScreenControls.headers[i] = '';
                    }
                    $scope.showScreenControls.headers = [];
                    break;
                case "fa-arrow-left":
                    if ($scope.selectedMappedHeaderIndex != null
                            && $scope.selectedFileHeaderIndex != null
                            && $scope.showScreenControls.headers[$scope.selectedFileHeaderIndex] !== '') {
                        $scope.droppedData[ $scope.selectedMappedHeaderIndex]['data'] = $scope.showScreenControls.headers[$scope.selectedFileHeaderIndex];
                        $scope.showScreenControls.headers[$scope.selectedFileHeaderIndex] = '';
                        $scope.selectedMappedHeaderIndex = null;
                        $scope.$apply();
                        $scope.selectedFileHeaderIndex = null;
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Data Mapping Alert',
                            message: 'Sorry! No data to replace..',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }
                    break;
                case "fa-arrow-right":
                    if ($scope.selectedMappedHeaderIndex != null
                            && $scope.selectedFileHeaderIndex != null
                            && $scope.droppedData[ $scope.selectedMappedHeaderIndex]['data'] !== '') {
                        $scope.showScreenControls.headers[$scope.selectedFileHeaderIndex] = $scope.droppedData[ $scope.selectedMappedHeaderIndex]['data'];
                        $scope.droppedData[ $scope.selectedMappedHeaderIndex]['data'] = '';
                        $scope.selectedMappedHeaderIndex = null;
                        $scope.selectedFileHeaderIndex = null;
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Data Mapping Alert',
                            message: 'Sorry! No data to replace..',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                    }
            }
        }

        /****************************************  Submit**Functions  ********************************************/
        $scope.submitTemplateUploadData = function () {
            var submitDataLength = $scope.droppedData.length;
            var uniqueDataLength = $filter('unique')($scope.droppedData, 'data').length;

            var isNotEmpty = $scope.checkForMappedHeaders();
            if (isNotEmpty == false) {
                dmDialogueBox.alertBox({
                    title: 'Alert',
                    message: 'Please map all headers',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
            } else {
                if (submitDataLength != uniqueDataLength) {
                    dmDialogueBox.alertBox({
                        title: 'Alert',
                        message: 'New template headers must have unique value',
                        actionlabel: ['Ok']
                    }).then(function (res) {
                    });
                }
                if (!$scope.templateName) {
                    dmDialogueBox.alertBox({
                        title: 'Name Alert',
                        message: 'Please enter template name',
                        actionlabel: ['Ok']
                    }).then(function (res) {
                    });
                } else
                {
                    var data = [{
                            processName: "CREATENEWTEMPLATE",
                            data: [{
                                    x_orgid: $scope.currentOrg.id,
                                    x_entityid: $scope.currentEntity.id,
                                    x_filename: $scope.templateName,
                                    x_filepath: '',
                                    x_sheetname: $scope.selectSheetName
                                }]
                        }];
                    $scope.showLoader('Creating New Template');
                }
                PlatwareRequest.callPlatware(data).success(function (response) {
                    var createTemplateDetails = parsePlatwareResponse.parse(response);
                    $scope.hideLoader();
                    //  //console.log(createTemplateDetails);
                    if (createTemplateDetails[0].data[0].issuccess == 'Y') {
                        $scope.createTemplateId = createTemplateDetails[0].data[0].template_id || "";
                        if ($scope.createTemplateId.length > 0) {
                            $scope.insertMapping();
                            dmDialogueBox.confirmBox({
                                title: 'Success',
                                message: 'New Template Created Successfully',
                                actionlabel: ['Go To Homepage', 'Upload Data For This Entity']
                            }).then(function (res) {
                                if (!res) {
                                    $scope.reset();
                                    $scope.removePath(1);
                                }
                                if (res) {
                                    $scope.removePath(1);
                                    //$scope.removePath.
                                    //$scope.action_name = "Upload Data";
                                    $scope.editEntity();
                                    //$scope.removePath(0);
                                    $scope.uploadData("Upload Data");
                                }
                            });
                        }
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Name Alert',
                            message: 'Unable to create template at the moment. Please try again',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        //alert("Unable to create template at the moment. Please try again");
                    }
                    // //console.log('$scope.createTemplateId');
                }).error(function (error) {
                    $scope.hideLoader();
                    $scope.serverError();
                });
                //$scope.removePath(1);

            }
        }


        $scope.insertMapping = function () {
//          //  alert();
//            for(i=0;i<$scope.attributeList.length;i++){
//                var entityExcelHeaders = {};
//                //console.log($scope.droppedData[i].data);
//                entityExcelHeaders[$scope.attributeList[i]['attributename']] = $scope.droppedData[i].data;
            //                $scope.entityExcelMapping.push(entityExcelHeaders);
//            }
            for (i = 0; i < $scope.attributeList.length; i++) {
                // //console.log($scope.createTemplateId);
                $scope.newTemplateHeaders = {};
                $scope.newTemplateHeaders ['x_templateid'] = $scope.createTemplateId,
                        $scope.newTemplateHeaders ['x_recordid'] = $scope.mappingRecordId[i],
                        $scope.newTemplateHeaders ['x_excelcolumnheader'] = $scope.droppedData[i].data,
                        $scope.newTemplateHeaders [ 'x_attributeid'] = $scope.mappingAttributeId[i]
                $scope.entityExcelMapping.push($scope.newTemplateHeaders);
            }
            // //console.log($scope.entityExcelMapping);
            var data = [{
                    processName: "INSERTMAPPING",
                    data: $scope.entityExcelMapping
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                var templateMappedHeaders = parsePlatwareResponse.parse(response);
                ////console.log(templateMappedHeaders);
                //$scope.createTemplateId = createTemplateDetails[0].data[0].template_id;
            }).error(function (error) {
                $scope.hideLoader();
                $scope.serverError();
            });
        }
        $scope.submitChangedTemplateData = function () {
            var submitDataLength = $scope.droppedData.length;
            var uniqueDataLength = $filter('unique')($scope.droppedData, 'data').length;
            var isNotEmpty = $scope.checkForMappedHeaders();
            if (isNotEmpty == false) {
                dmDialogueBox.alertBox({
                    title: 'Alert',
                    message: 'Please map all headers',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
            } else {
                if (submitDataLength != uniqueDataLength) {
                    dmDialogueBox.alertBox({
                        title: 'Alert',
                        message: 'Mapped Headers Must have unique value',
                        actionlabel: ['Ok']
                    }).then(function (res) {
                    });
                } else {


                    for (i = 0; i < $scope.attributeList.length; i++) {
                        $scope.changedTemplateHeaders = {};
                        $scope.changedTemplateHeaders ['X_TEMPLATEID'] = $scope.currentTemplate.id,
                                $scope.changedTemplateHeaders ['X_ATTRIBUTEID'] = $scope.mappingAttributeId[i],
                                $scope.changedTemplateHeaders ['X_NEW_COLUMNHEADER'] = $scope.droppedData[i].data
                        $scope.changeMappedHeaders.push($scope.changedTemplateHeaders);
                    }
                    var data = [{
                            processName: "UPDATEMAPPINGDETAILS",
                            data: $scope.changeMappedHeaders
                        }];
                    $scope.showLoader('Changing Headers Mapping');
                    PlatwareRequest.callPlatware(data).success(function (response) {
                        var changedMappedHeadersDetails = parsePlatwareResponse.parse(response);
                        $scope.hideLoader();
                        if (changedMappedHeadersDetails[0].data[0].message == 'Y') {
                            dmDialogueBox.confirmBox({title: 'Success',
                                message: 'Mapping has been changed successfully',
                                actionlabel: ['Go To Homepage', 'Upload Data For This Entity']
                            }).then(function (res) {
                                if (!res) {
                                    $scope.reset();
                                    $scope.removePath(1);
                                }
                                if (res) {
                                    //$scope.removePath.
                                    $scope.removePath(1);
                                    //$scope.action_name = "Upload Data";
                                    $scope.editEntity();
                                    $scope.uploadData("Upload Data");
                                }
                            });
                        } else {
                            dmDialogueBox.alertBox({
                                title: 'Alert',
                                message: 'Mapping is not Changed.Please try again',
                                actionlabel: ['Ok']
                            }).then(function (res) {
                            });
                        }
                    }).error(function (error) {
                        $scope.hideLoader();
                        $scope.serverError();
                    });
                }
            }

        }
        /************************************ Validation Of Records******************************************/

        $scope.validateInvalidRecords = function (data) {
            var validRecords = $filter('byProp')(data, 'isvalid', 'valid');
            var invalidRecords = $filter('byProp')(data, 'isvalid', 'invalid');
            for (var i = 0; i < invalidRecords.length; i++) {
                angular.forEach(invalidRecords[i], function (value, key) {
                    if (Object.prototype.toString.call(value) === "[object String]") {
                        var newValue = value.replace(/,/g, '^^');
                        invalidRecords[i][key] = newValue;
                    }
                });
            }
            ///console.log(invalidRecords)

            var fileData = validRecords.concat(invalidRecords);
            /********27-jan******/
            var templateColumnNames_new = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
            templateColumnNames_new = $filter('replaceInArray')(templateColumnNames_new, /,/g, "^^");
            var string = templateColumnNames_new.join(',');
            /*******27-jan*****/
            /*var string = $scope.showScreenControls.headers.join(',');*///27-jan
            angular.forEach(fileData, function (item) {
                string = string + '\n';
                var temp = [];
                for (var i = 0; i < templateColumnNames_new.length; i++) {
                    var value = item[templateColumnNames_new[i].toLowerCase()]
                    value = value.replace(/,/g, '^^')
                    temp.push(value);
                }
                /*var temp = [];
                 for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                 temp.push(item[$scope.showScreenControls.headers[i].toLowerCase()]);
                 }*///27-jan
                string = string + temp.join(',');
//                 var n=string.lastIndexOf(",");
//                    $scope.dataString=string.substring(0,n) ;
//               // //console.log(dataString)

            });
            $scope.validate(string)

        };
        $scope.truncateStaging = function (data) {
            // alert("truncate")
            var truncate = "y";
            $scope.submitValidRecords(data, truncate);
        }
        $scope.submitRecords = function (data) {
            var truncate = "no";
            $scope.submitValidRecords(data, truncate);
        }
        /******************submit batch records******************************************/
        $scope.submitBatchRecords = function (data) {
            var batchIdArr = [];
            for (var i = 0; i < data.length; i++) {
                batchIdArr.push(data[i]['batch id']);
            }
            if (batchIdArr.length > 0) {
                var batchIdStr = batchIdArr.join('~');
                var data = [
                    {
                        processName: "INSERTINTOMASTER",
                        data: [{
                                x_entityid: $scope.currentEntity.id,
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
                                // //console.log(isMasterDataInsert)
                                var info = '';
                                if (masterDataRes[i].data[0]['info'] && masterDataRes[i].data[0]['info'].length > 0) {
                                    info = masterDataRes[i].data[0]['info'];
                                } else {
                                    info = 'Data has been moved to master successfully';
                                }
                                if (isMasterDataInsert.toLowerCase() == "success") {
                                    dmDialogueBox.alertBox({
                                        title: 'Proceed',
                                        message: info,
                                        actionlabel: []
                                    }).then(function (res) {
                                    });
                                    $scope.showScreenControls.optsClass = 'slide-down';
                                    $scope.reset();
                                    $scope.removePath(1);
                                    $location.path('/mainpage2');
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
        /**********************************************************/
        $scope.submitValidRecords = function (data, isTruncate) {
            //alert(isTruncate);
            //console.table(data)
            var isInvalidData = $filter('byProp')(data, 'isvalid', 'invalid');
            var isValidData = $filter('byProp')(data, 'isvalid', 'valid');
            var totalRecordsLength = isValidData.length + isInvalidData.length;
            function submitOnlyValid() {
                if (isValidData.length > 0) {
                    var enitityId = $scope.currentEntity.id;
                    var batchId = $scope.curBatchId;
                    var attribbuteIds = $filter('extractProperty')(isValidData, 'attributeid');
                    ////console.log(enitityId);
                    ////console.log(JSON.stringify(attribbuteIds))
                    attribbuteIds = attribbuteIds[0].split('~').join(',');
                    var headingSeq = $filter('extractProperty')(isValidData, 'heading');
                    headingSeq = headingSeq[0].split("~");
                    var submitableData;
                    var templateColumnNames = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
                    templateColumnNames = $filter('replaceInArray')(templateColumnNames, /,/g, "^^");
                    //console.table($scope.attributeList);
                    var workerData = {
                        key1: isValidData,
                        key2: attribbuteIds,
                        key3: templateColumnNames, //$scope.attributeNameList,
                        key4: $scope.attributeList
                    };
                    var promise = validateFileData.submitData(workerData);
                    console.log(workerData);
                    //sentReqCount =0;
                    //var sentReqCount = 0;
                    //var currReqCount = 0;
                    // //console.log(promise['$$state'].status);
                    promise.then(function (messageData) {
                        console.log(messageData);
                        if (messageData[0]["type"] == "submitData") {
                            var totalReqCount = Object.keys(messageData[0]['data']).length;
                            var sentReqCount = 0;
                            var currentReqCount = 0;
                            function sendDataToStaging(reqKey, isTruncateOpt) {
                                //sentReqCount =0;
                                // //console.log(messageData[0]['data'])

                                //var recordsLength = responseData.split("~");
                                //recordsLength = recordsLength.length - 1;
                                /*******************/
//                                var currentKey = reqKey;
//                                 var setReqCount = 5;
//                                    var remainReq = totalReqCount - reqKey;
//                                    if(remainReq >setReqCount){
//                                        for(r=reqKey;r<reqKey+5;r++)
//                                        currentKey++;
//                                        //var reqBatch = remainReq/5;
//                                    }else{
//                                        for(r=reqKey;r<remainReq;r++){
//                                           currentKey++;
//                                        }
//                                    }
//                                for(i=reqKey;i<currentKey;i++){
                                /********************/
//                                    if(reqKey == 1){
//                                        isTruncateOpt = isTruncate;
//                                    }else
//                                    {
//                                        isTruncateOpt = "N"
//                                    }
                                var reqSet = 5;
                                //var currentReqCount = 0;
                                for (var i = 1; i <= reqKey; i++) {
                                    currentReqCount++;
                                    var responseData = messageData[0]['data'][currentReqCount];
                                console.log(responseData); 
                           //  responseData=responseData.replace(/~/g,"*");  //done correct code
                           //     console.log(responseData); 

                                    var submitData = [{
                                            processName: "INSERTINTOSTAGING",
                                            data: [{
                                                    x_entityid: enitityId,
                                                    x_valuestring: responseData,
                                                    x_attributeid: attribbuteIds,
                                                    x_is_truncate: isTruncateOpt,
                                                    x_batch_id: batchId,
                                                    x_filename: $scope.fileName
                                                }]
                                        }];
                                    $scope.showLoader("Submitting " + sentReqCount + " of " + totalReqCount + " batches of data");
                                    PlatwareRequest.callPlatware(submitData).success(function (response) {

                                        var submitRes = parsePlatwareResponse.parse(response);

                                        for (var i = 0, max = submitRes.length; i < max; i++) {
                                            //currentKey++;
                                            if (submitRes[i]['isError'] === "N") {
                                                if (submitRes[i]['data'][0]['issuccess']) {
                                                    if (submitRes[i]['data'][0]['issuccess'] && submitRes[i]['data'][0]['issuccess'] == "Y") {
                                                        sentReqCount++;
                                                        //                       //console.log(sentReqCount + "===" + totalReqCount)
                                                        if (sentReqCount == totalReqCount) {
                                                            //getStagingData
                                                            $scope.hideLoader();
                                                            // console.timeEnd("batchTime");
                                                            $scope.showLoader('Data Submitted Successfully and Getting Refresh Staging Data');

                                                            $scope.getStagingData("", function (newStagingData) {
                                                                var fileData = isInvalidData.concat(isValidData);

                                                                var templateColumnNames_new = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
                                                                templateColumnNames_new = $filter('replaceInArray')(templateColumnNames_new, /,/g, "^^");
                                                                var string = templateColumnNames_new.join(',');
                                                                angular.forEach(fileData, function (item) {
                                                                    string = string + '\n';
                                                                    var temp = [];
                                                                    for (var i = 0; i < templateColumnNames_new.length; i++) {
                                                                        var value = item[templateColumnNames_new[i].toLowerCase()]
                                                                        value = value.replace(/,/g, '^^')
                                                                        temp.push(value);
                                                                    }
                                                                    /*for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                                                                     var value = item[$scope.showScreenControls.headers[i].toLowerCase()]
                                                                     value = value.replace(/,/g, '^^')
                                                                     temp.push(value);
                                                                     }*/
                                                                    string = string + temp.join(',');
                                                                });

                                                                var workerData_new = {
                                                                    key1: string,
                                                                    key2: $scope.attributeList,
                                                                    key3: templateColumnNames_new,
                                                                    key4: $scope.stagingData,
                                                                    key5: $scope.action_name,
                                                                    key6: $scope.rejectionData,
                                                                    key7: $scope.masterData
                                                                };
                                                                ////console.log(workerData);
                                                                var promise_new = validateFileData.doWork(workerData_new, $scope.workerConfig);
                                                                //$scope.showLoader('Validating Records');
                                                                promise_new.then(function (messageData) {

                                                                    for (var i = 0, max = messageData.length; i < max; i++) {
                                                                        if (messageData[i]['type'].toLowerCase() == 'tabledata') {
                                                                            var data_new = messageData[i]['data'];
                                                                            //datatype = data['type'].toLowerCase();
                                                                            //handleWorkerData(datatype, data);
                                                                            //var finalData;
                                                                            //currentData['data'] ? finalData = currentData['data'] : finalData = [];
                                                                            //$scope.tableData = data;
                                                                            var newData = $filter('replacePropValue')(data_new, 'isvalid', 'valid', 'submitted');
                                                                            $scope.tableData = newData;
                                                                            //console.table($scope.tableData);
                                                                            $scope.showScreenControls.showSlideUpIcon = true;
                                                                            $scope.showScreenControls.showTable = true;
                                                                            $scope.hideLoader();
                                                                            dmDialogueBox.alertBox({
                                                                                title: 'Submit Alert',
                                                                                message: 'Data Submitted Successfully',
                                                                                actionlabel: ['Ok']
                                                                            }).then(function (res) {
                                                                                // $scope.showScreenControls.showSlideUpIcon = false;

                                                                                $location.path('/batch/' + $scope.currentEntity.id);

                                                                                $scope.$broadcast('switchTab', 'staging data');
                                                                            });
                                                                            //data ? $scope.showScreenControls.optsClass = "slide-up" : "";
                                                                            //$scope.$apply();
                                                                            //break;
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            if (currentReqCount === sentReqCount) {
                                                                var remainReq = totalReqCount - sentReqCount;
                                                                if (remainReq > reqSet) {
                                                                    var sendReqKey = reqSet;
                                                                } else {
                                                                    sendReqKey = remainReq
                                                                }
                                                                sendDataToStaging(sendReqKey, "N");
                                                            }
                                                            //var nextReq = ++reqKey;

                                                        }
                                                    } else {
                                                        dmDialogueBox.alertBox({
                                                            title: 'Submit Alert',
                                                            message: 'error while inserting into staging table',
                                                            actionlabel: ['Ok']
                                                        }).then(function (res) {
                                                        });
                                                        $scope.hideLoader()
                                                    }
                                                }
                                            } else {
                                                //alert error code available in is Error object
                                                dmDialogueBox.alertBox({
                                                    title: 'Submit Alert',
                                                    message: 'error while inserting into staging table',
                                                    actionlabel: ['Ok']
                                                }).then(function (res) {
                                                });
                                                $scope.hideLoader()
                                            }
                                        }
                                        //$scope.hideLoader();
                                    }).error(function (e) {
                                        $scope.hideLoader()
                                        $scope.serverError();
                                    });

                                    //sendDataToStaging(nextReq, "N"); 
                                    /* while (sentReqCount !== totalReqCount) {
                                     ////console.log("1")
                                     if (currReqCount === sentReqCount) {
                                     for (var reqStr in messageData[0]['data']) {
                                     var responseData = messageData[0]['data'][reqStr];
                                     var currentTruncateOpt;
                                     if (reqStr === 1) {
                                     currentTruncateOpt = isTruncate;
                                     } else {
                                     currentTruncateOpt = "n";
                                     }
                                     var submitData = [{
                                     processName: "INSERTINTOSTAGING",
                                     data: [{
                                     x_entityid: enitityId,
                                     x_valuestring: responseData,
                                     x_attributeid: attribbuteIds,
                                     x_is_truncate: currentTruncateOpt
                                     }]
                                     }];
                                     $scope.showLoader();
                                     PlatwareRequest.callPlatware(submitData).success(function (response) {
                                     sentReqCount++;
                                     
                                     var submitRes = parsePlatwareResponse.parse(response);
                                     for (var i = 0, max = submitRes.length; i < max; i++) {
                                     if (submitRes[i]['isError'] === "N") {
                                     if (submitRes[i]['data'][0]['issuccess']) {
                                     if (submitRes[i]['data'][0]['issuccess'] == "Y") {
                                     if (sentReqCount === totalReqCount) {
                                     $scope.hideLoader();
                                     
                                     }
                                     
                                     }
                                     } else {
                                     
                                     //alert("error while saving data");
                                     dmDialogueBox.alertBox({
                                     title: 'Submit Alert',
                                     message: 'error while saving data',
                                     actionlabel: ['Ok']
                                     }).then(function (res) {
                                     });
                                     }
                                     }
                                     }
                                     }).error(function (error) {
                                     $scope.hideLoader();
                                     $scope.serverError();
                                     })
                                     
                                     }
                                     currReqCount++;
                                     }
                                     }*/
                                    //currentReqCount++;
                                }

                            }
                            //  console.time("batchTime")
                            sendDataToStaging(1, isTruncate);
                        }
                    });
                    //var responseData = messageData[0]['data']



                    //for (var v = 0, max = isInvalidData.length; v < max; v++) {

                    //}
                } else {
                    dmDialogueBox.alertBox({
                        title: 'Template Alert',
                        message: 'No valid records to submit',
                        actionlabel: ['Ok']
                    }).then(function (res) {
                    });
                }
            }
            if (isInvalidData.length > 0) {
                dmDialogueBox.confirmBox({
                    title: 'Proceed',
                    message: 'Proceed to submit ' + isValidData.length + ' valid records of ' + totalRecordsLength + ' records',
                    actionlabel: ['Cancel', 'Ok']
                }).then(function (res) {
                    if (res) {
                        submitOnlyValid();
                    }
                });
            } else {
                submitOnlyValid()
            }

        };

        /****************************Get Rejection Data*********************************/
        $scope.getRejectionData = function (action, callback) {
            var currentEntityId = $scope.currentEntity.id;
            var data = [
                {
                    processName: "SPREJECTIONDATA",
                    data: [{
                            x_entityid: currentEntityId
                        }]
                }
            ];
            $scope.showLoader();
            PlatwareRequest.callPlatware(data).success(function (response) {
                var rejectionDataRes = parsePlatwareResponse.parse(response);
                $scope.hideLoader();
                for (var i = 0, max = rejectionDataRes.length; i < max; i++) {
                    if (rejectionDataRes[i]["isError"] == "N") {
                        $scope.rejectionData = rejectionDataRes[i]['data'];
                        if (!callback) {
                            $scope.rejectionData = rejectionDataRes[i]['data'];
                        } else {
                            $scope.rejectionData = rejectionDataRes[i]['data'];
                            callback($scope.rejectionData);
                        }
                        if ($scope.rejectionData.length > 0) {
                            var headings = Object.keys($scope.rejectionData[0]);
                            headings = headings.join("~");
                            $scope.rejectDataHeading = headings;
                            $scope.makeRejectionHeaders();
                            //$scope.rejectionDataHeading=Object.keys($scope.rejectionData[0]);
                        }

                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Data alert',
                            message: 'error while getting rejection data',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        $scope.hideLoader()
                    }
                }
            }).error(function (e) {
                $scope.hideLoader()
                $scope.serverError();
            });
        }
        /*********************Push heading in rejection data******************/
        $scope.makeRejectionHeaders = function () {


            for (var i = 0, max = $scope.rejectionData.length; i < max; i++) {
                $scope.rejectionData[i]['heading'] = $scope.rejectDataHeading;
            }
            ////console.log($scope.rejectionData);
        }
        $scope.makeMasterHeaders = function () {
            for (var i = 0, max = $scope.masterData.length; i < max; i++) {
                $scope.masterData[i]['heading'] = $scope.masterDataHeading;
            }
        }










        /************************ Get Data Of Staging Table***********************************/
        $scope.getMasterData = function (currCall,action, callback) {
            /*if ($scope.currentEntity.showMaster != 'Y') {
             $scope.masterData = '';
             return;
             }*/
            console.log(callback);
            var currCall=currCall||'0';
            var data = [
                {
                    processName: "GETMASTERDATA",
                    data: [{
                            x_start_index: parseInt(currCall) + 1 + '',
                            x_entityid: $scope.currentEntity.id,
                            x_from_date:$scope.finalFromDate,
                            x_to_date:$scope.finalToDate,
                            X_PARAM1 : $scope.dataType,
                            X_PARAM2 : $scope.searchValueData,
                            X_PARAM3 : ''
                        }]
                }
            ];
            $scope.showLoader('Getting Master Table Data');
            PlatwareRequest.callPlatware(data).success(function (response) {
                var masterDataRes = parsePlatwareResponse.parse(response)
               // console.log("==================");
               // console.log(masterDataRes);
                $scope.hideLoader();
             
                // $scope.fromDate="";
                // $scope.toDate="";
                // $scope.fromTime="";
                // $scope.toTime="";
                // $scope.finalFromDate="";
                // $scope.finalToDate="";
                for (var i = 0, max = masterDataRes.length; i < max; i++) {
                        if (masterDataRes[i]["isError"] == "N") {
                            if(masterDataRes[i]["data"] == "")
                            {
                                   dmDialogueBox.alertBox({
                                    title: 'Data alert',
                                    message: 'No data found',
                                    actionlabel: ['Ok']
                                }).then(function (res) {
                                });
                            }
                          if (!callback && currCall) {
                            $scope.masterTableData = masterDataRes[i]['data'];
                       
                            $scope.collectiveServerCalls = {
                                showServerPagination: true,
                                totalRecordCount: $scope.masterData[0]['total_records'],
                                batchCount: $scope.masterData[0]['batch_count']
                            }
                            $scope.showScreenControls.showMasterTable = true;

                        }
                        else if (!callback) {
                            $scope.masterData = masterDataRes[i]['data'];
                        }
                        else {
                            $scope.masterData = masterDataRes[i]['data'];
                            callback($scope.masterData);
                        }
                        if ($scope.masterData.length > 0) {
                            if ($scope.masterData[0].HEADING && $scope.masterData[0].HEADING.length > 0) {
                                $scope.masterDataHeading = $scope.masterData[0].HEADING;
                                //$scope.makeMasterHeaders();
                            } else {
                                var headings = Object.keys($scope.masterData[0]);
                                headings = headings.join("~");
                                $scope.masterDataHeading = headings;
                                $scope.makeMasterHeaders();
                            }
                            //$scope.rejectionDataHeading=Object.keys($scope.rejectionData[0]);
                        }
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Data alert',
                            message: 'error while getting master data',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        $scope.hideLoader()
                    }
                }
            }).error(function (e) {
                $scope.hideLoader();
                $scope.serverError();
            });
        }
        $scope.getStagingData1 = function () {
            var blankId = '';
            $location.path('/batch/' + blankId);
        }
        $scope.getStagingData = function (action, callback) {
            /*if ($scope.currentEntity.showStaging != 'Y') {
             $scope.stagingData = '';
             return;
             }*/
            var currentEntityId = $scope.currentEntity.id;
            var data = [
                {
                    processName: "GETBATCHLIST", //"GETSTAGINGDATA",
                    data: [{
                            x_entityid: currentEntityId
                        }]
                }
            ];
            $scope.showLoader('Getting Staging Data');
            PlatwareRequest.callPlatware(data).success(function (response) {
                var stagingDataRes = parsePlatwareResponse.parse(response)
                $scope.hideLoader();
                for (var i = 0, max = stagingDataRes.length; i < max; i++) {
                    if (stagingDataRes[i]["isError"] == "N") {
                        if (!callback) {
                            $scope.stagingData = stagingDataRes[i]['data'];
                        } else {
                            $scope.stagingData = stagingDataRes[i]['data'];
                            callback($scope.stagingData);
                        }

                        //alert(JSON.stringify($scope.stagingData));
                    } else {
                        dmDialogueBox.alertBox({
                            title: 'Alert',
                            message: 'Error from server side',
                            actionlabel: ['Ok']
                        }).then(function (res) {
                        });
                        callback(null);
                    }
                }
                //console.table(stagingData);
            }).error(function () {
                $scope.hideLoader();
                $scope.serverError();

            });
        };
        /********************************* Staging To Master ***********************************/
        $scope.stagingToMaster = function () {
            var data = [
                {
                    processName: "INSERTINTOMASTER",
                    data: [{
                            x_entityid: $scope.currentEntity.id
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
                            var info = '';
                            if (masterDataRes[i].data[0]['info'] && masterDataRes[i].data[0]['info'].length > 0) {
                                info = masterDataRes[i].data[0]['info'];
                            } else {
                                info = 'Data has been moved to master successfully';
                            }
                            // //console.log(isMasterDataInsert)
                            if (isMasterDataInsert == "success") {
                                dmDialogueBox.alertBox({
                                    title: 'Proceed',
                                    message: info,
                                    actionlabel: []
                                }).then(function (res) {
                                });
                                $scope.showScreenControls.optsClass = 'slide-down';
                                $scope.reset();
                                $scope.removePath(1);
                                $scope.getBatch();
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
        }


        $scope.selectFileHeader = function (index) {
            $scope.selectedFileHeaderIndex = index;
        }
        $scope.selectMappedHeader = function (index) {
            $scope.selectedMappedHeaderIndex = index;
        }
        $scope.checkForMappedHeaders = function () {
            var isNotEmpty = true;
            for (i = 0; i < $scope.droppedData.length; i++) {
                if ($scope.droppedData[i]['data'] == '') {
                    isNotEmpty = false;
                }
            }
            return isNotEmpty;
        }

        $scope.$watch(function () {
            return $scope.entityItem;
        }, function (newValue) {
            if (newValue) {
                $scope.selectEntity($scope.entityItem);
                $scope.showScreenControls.sheetsObj.sheets = [];
                $scope.fileName = '';
            } else {
                $scope.templateList = [];
            }
        });
        $scope.$watch(function () {
            return $scope.stagingEntityItem;
        }, function (newValue) {
            if (newValue) {

                $scope.setStagingBatchAttribute($scope.stagingEntityItem);
            }
        });
        $scope.$watch(function () {
            return $scope.masterEntityItem;
        }, function (newValue) {
            if (newValue) {
                
               // console.log("**********************");
               // if(newValue.isdatecheckenabled == "N"){
                    $scope.selectEntity($scope.masterEntityItem);
                   // setViewValue(newValue);
               // }
            //else if(newValue.isdatecheckenabled == "Y" ){ 
              //  isShownFromToDate=true;}

                
               
            }
        });
        $scope.$watch(function () {
            return $scope.rejectedEntityItem;
        }, function (newValue) {
            if (newValue) {
                $scope.selectEntity($scope.rejectedEntityItem);
            }
        });
        $scope.$watch(function () {
            return $scope.templateItem;
        }, function (newValue) {
            if (newValue) {
                $scope.selectTemplate($scope.templateItem);
            }
        });
        $scope.$watch(function () {
            return $scope.showScreenControls.orgItem;
        }, function (newValue) {
            if (newValue) {
                $scope.selectOrgs($scope.showScreenControls.orgItem);
            }
        });
        $scope.refreshBtn = function (data) {
            // //console.log(data)
            var isInvalidData = $filter('byProp')(data, 'isvalid', 'invalid');
            var isValidData = $filter('byProp')(data, 'isvalid', 'valid');
            $scope.getStagingData("", function (newStagingData) {
                var fileData = isInvalidData.concat(isValidData);
                var string = $scope.showScreenControls.headers.join(',');
                angular.forEach(fileData, function (item) {
                    string = string + '\n';
                    var temp = [];
                    for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                        temp.push(item[$scope.showScreenControls.headers[i].toLowerCase()]);
                    }
                    ////console.log(temp)
                    string = string + temp.join(',');
                });
                var templateColumnNames_new = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
                templateColumnNames_new = $filter('replaceInArray')(templateColumnNames_new, /,/g, "^^");
                ////console.log(templateColumnNames_new)
                var workerData_new = {
                    key1: string,
                    key2: $scope.attributeList,
                    key3: templateColumnNames_new,
                    key4: $scope.stagingData,
                    key5: $scope.action_name,
                    key6: $scope.rejectionData,
                    key7: $scope.masterData

                };
                ////console.log(workerData);
                var promise_new = validateFileData.doWork(workerData_new, $scope.workerConfig);
                $scope.showLoader('Validating Records');
                promise_new.then(function (messageData) {
                    $scope.hideLoader()
                    for (var i = 0, max = messageData.length; i < max; i++) {
                        if (messageData[i]['type'].toLowerCase() == 'tabledata') {

                            var data_new = messageData[i]['data'];
                            //datatype = data['type'].toLowerCase();
                            //handleWorkerData(datatype, data);
                            //var finalData;
                            //currentData['data'] ? finalData = currentData['data'] : finalData = [];
                            //$scope.tableData = data;
                            var newData = $filter('replacePropValue')(data_new, 'isvalid', 'valid', 'submitted');
                            $scope.tableData = newData;

                            //console.table($scope.tableData);
                            $scope.showScreenControls.showSlideUpIcon = true;
                            // $scope.showLoader('gettingTableDAta');
                            $scope.showScreenControls.showTable = true;
                            $scope.$broadcast('switchTab', 'staging data');
                            //data ? $scope.showScreenControls.optsClass = "slide-up" : "";
                            //$scope.$apply();
                            //break;
                        }
                    }
                });
            });
        };
        $scope.refreshMasterBtn = function (data) {
            // //console.log(data)
            var isInvalidData = $filter('byProp')(data, 'isvalid', 'invalid');
            var isValidData = $filter('byProp')(data, 'isvalid', 'valid');
            $scope.getMasterData("", function (newMasterData) {
                var fileData = isInvalidData.concat(isValidData);
                var string = $scope.showScreenControls.headers.join(',');
                angular.forEach(fileData, function (item) {
                    string = string + '\n';
                    var temp = [];
                    for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                        temp.push(item[$scope.showScreenControls.headers[i].toLowerCase()]);
                    }
                    ////console.log(temp)
                    string = string + temp.join(',');
                });
                var templateColumnNames_new = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
                templateColumnNames_new = $filter('replaceInArray')(templateColumnNames_new, /,/g, "^^");
                ////console.log(templateColumnNames_new)
                var workerData_new = {
                    key1: string,
                    key2: $scope.attributeList,
                    key3: templateColumnNames_new,
                    key4: $scope.stagingData,
                    key5: $scope.action_name,
                    key6: $scope.rejectionData,
                    key7: $scope.masterData

                };
                ////console.log(workerData);
                var promise_new = validateFileData.doWork(workerData_new, $scope.workerConfig);
                $scope.showLoader('Validating Records');
                promise_new.then(function (messageData) {
                    $scope.hideLoader()
                    for (var i = 0, max = messageData.length; i < max; i++) {
                        if (messageData[i]['type'].toLowerCase() == 'tabledata') {
                            var data_new = messageData[i]['data'];
                            //datatype = data['type'].toLowerCase();
                            //handleWorkerData(datatype, data);
                            //var finalData;
                            //currentData['data'] ? finalData = currentData['data'] : finalData = [];
                            //$scope.tableData = data;
                            var newData = $filter('replacePropValue')(data_new, 'isvalid', 'valid', 'submitted');
                            $scope.tableData = newData;
                            //console.table($scope.tableData);
                            $scope.showScreenControls.showSlideUpIcon = true;
                            // $scope.showLoader('gettingTableDAta');
                            $scope.showScreenControls.showTable = true;
                            $scope.$broadcast('switchTab', 'master data');
                            //data ? $scope.showScreenControls.optsClass = "slide-up" : "";
                            //$scope.$apply();
                            //break;
                        }
                    }
                });
            });
        };
        $scope.refreshStaging = function (data) {
            $scope.getStagingData($scope.action_name, $scope.stagingDataTable);
        };
        $scope.refreshMaster = function (data) {
            $scope.getMasterData('0',$scope.action_name, $scope.masterDataTable);
        };
        $scope.refreshRejected = function (data) {
            $scope.getRejectionData($scope.action_name, $scope.rejectedDataTable);
        };
        $scope.generateFileHeaders = function () {
            var fileAttributeName = [];
            $scope.attributeList = $filter('orderObjectBy')($scope.attributeList, 'attributeid');
            for (var j = 0; j < $scope.attributeList.length; j++) {
                var attributeName = $scope.attributeList[j]['attributename'].trim();
                fileAttributeName.push(attributeName);
            //    console.log("$scope.attributeList");
            }
            $scope.genratedFileHeaders = fileAttributeName;

        }
        $scope.generateFile = function (anchor) {
            // var columns = $filter('byProp')($scope.columns, 'columnType', 'text')
            // var data = $scope.datasource;
//                if ($scope.dataUniqueKey == 'dmdataindex') {
//                    data = modifyObj.removeKey(data, $scope.dataUniqueKey);
//                }
            var temp = '';

            var string = prepareDwnldData.excelData($scope.genratedFileHeaders, temp, true);
            anchor.target.download = "data.xls";
            var hrefvalue = prepareDwnldData.uri.excel + prepareDwnldData.base64(string);
            anchor.target.href = hrefvalue;

        }
        $scope.excelData = function (headers, data) {
            var string = '<table><tbody><tr>';
            for (var i = 0; i < headers.length; i++) {

                string = string + '<th>' + headers[i]['columnName'] + '</th>';
            }
            string = string + '</tr>'
            for (var i = 0; i < data.length; i++) {
                var invalidReasonobject = data[i].invalidreason;
                string = string + '<tr>';
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j]['columnType'].toLowerCase() != 'select'
                            || headers[j]['columnType'].toLowerCase() != 'button') {
                        if (headers[j]['columnId'] in invalidReasonobject) {
                            string = string + '<td style="background:red">' + data[i][headers[j]['columnId']] + '</td>';
                        } else {
                            string = string + '<td>' + data[i][headers[j]['columnId']] + '</td>';
                        }

                    }
                }
                string = string + '</tr>';
            }
            string = string + '</tbody></table>';
            return string;
        };
        $scope.refreshRejectionData = function (data) {
            var isInvalidData = $filter('byProp')(data, 'isvalid', 'invalid');
            var isValidData = $filter('byProp')(data, 'isvalid', 'valid');
            $scope.getRejectionData("", function () {
                var fileData = isInvalidData.concat(isValidData);
                var string = $scope.showScreenControls.headers.join(',');
                angular.forEach(fileData, function (item) {
                    string = string + '\n';
                    var temp = [];
                    for (var i = 0; i < $scope.showScreenControls.headers.length; i++) {
                        temp.push(item[$scope.showScreenControls.headers[i].toLowerCase()]);
                    }
                    string = string + temp.join(',');
                });
                var templateColumnNames_new = $filter('extractProperty')($scope.templateData, 'excelcolumnheader');
                templateColumnNames_new = $filter('replaceInArray')(templateColumnNames_new, /,/g, "^^");
                var workerData_new = {
                    key1: string,
                    key2: $scope.attributeList,
                    key3: templateColumnNames_new,
                    key4: $scope.stagingData,
                    key5: $scope.action_name,
                    key6: $scope.rejectionData,
                    key7: $scope.masterData

                };
                ////console.log(workerData);
                var promise_new = validateFileData.doWork(workerData_new, $scope.workerConfig);
                $scope.showLoader('Validating Records');
                promise_new.then(function (messageData) {
                    ////console.log('refresh' + messageData)
                    $scope.hideLoader()
                    for (var i = 0, max = messageData.length; i < max; i++) {
                        if (messageData[i]['type'].toLowerCase() == 'tabledata') {
                            var data_new = messageData[i]['data'];
                            //datatype = data['type'].toLowerCase();
                            //handleWorkerData(datatype, data);
                            //var finalData;
                            //currentData['data'] ? finalData = currentData['data'] : finalData = [];
                            //$scope.tableData = data;
                            var newData = $filter('replacePropValue')(data_new, 'isvalid', 'valid', 'submitted');
                            $scope.tableData = newData;
                            //console.table($scope.tableData);
                            $scope.showScreenControls.showSlideUpIcon = true;
                            // $scope.showLoader('gettingTableDAta');
                            $scope.showScreenControls.showTable = true;
                            $scope.$broadcast('switchTab', 'staging data');
                        }
                    }
                });
            });

        }

    }]);
/*******************************  Filters   *************************************/

mainpageModule.filter('byProp', function () {
    return function (collection, keyname, value) {
        ////console.log(JSON.stringify(arguments))

        var output = [], keys = [];
        if (value && value.length > 0) {
            angular.forEach(collection, function (item) {
                item[keyname].toLowerCase() === value.toLowerCase() ? output.push(item) : "";
                //item[keyname] === value ? output.push(item) : "";
            });
//            //console.log(output)
        }

        return output;
    };
});
mainpageModule.filter('filterMyData', function () {
    return function (collection, property1, property2) {
        var output = [];
        angular.forEach(collection, function (data) {
            output.push({'prop1': data[property1], 'prop2': data[property2]});
        });
        return output;
    }
});


