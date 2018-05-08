'use strict';

// Declare app level module which depends on views, and components
var appModule = angular.module('MDM', [
    'ngRoute',
    'RouteData',
    'dmCommonApiModule',
    'MDM.version',
    'MDM.login',
    'MDM.batch',
    'MDM.mainpage2',
    'MDM.batchData',
    'pikaday',
       
]);
appModule.config(['$routeProvider', 'RouteDataProvider','pikadayConfigProvider', function ($routeProvider, RouteDataProvider,pikaday) {
    pikaday.setConfig({
        format: "YYYY/MM/DD",
         yearRange: [1950, 2025]
    });    
    var windowHeight = window.innerHeight;
        windowHeight = windowHeight - ((3 / 100) * windowHeight);
        RouteDataProvider.applyConfig({
            bodyStyle: {
                'background-color': 'white'
            },
            loaderColor: {
                color: '#ec6726'          
                  },
            sectionStyle: {
            }
        });
        $routeProvider.when('/login', {
            RouteData: {
                bodyStyle: {
                    'background': '#ec6726',
                    height: 'auto'
                }
            },
            title: "MDM :: Login",
            templateUrl: 'login/login.html'

        }).when('/mainpage2', {
            RouteData: {
                bodyStyle: {
                    'background': '#ffffff',
                    height: windowHeight + "px"
                },
                sectionStyle: {
                    padding: "3% 0 0 0",
                    height: "40%"
                }
            },
            title: 'MDM :: Home',
            templateUrl: 'mainpage2/mainpage.html'

        }).when('/batch/:entityid', {
            RouteData: {
                bodyStyle: {
                    'background': '#ffffff',
                    height: windowHeight + "px"
                },
                sectionStyle: {
                    padding: "3% 0 0 0",
                    height: "40%"
                }
            },
            title: 'MDM :: Home',
            templateUrl: 'batch/batch.html'

        }).when('/batchData/:batchid/:entityid', {
            RouteData: {
                bodyStyle: {
                    'background': '#ffffff',
                    height: windowHeight + "px"
                },
                sectionStyle: {
                    padding: "3% 0 0 0",
                    height: "40%"
                }
            },
            title: 'MDM :: Home',
            templateUrl: 'uploadedBatch/uploadedBatch.html'

        });
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
appModule.service("sessionDetails", [function () {
        var sessionDetails = {};
        return{
            getDetails: function () {
                return sessionDetails;
            },
            setDetails: function (sessionTimeOut) {
                var timeoutVal = '';
                if (sessionTimeOut && sessionTimeOut.length > 0) {
                    timeoutVal = sessionTimeOut;
                } else {
                    timeoutVal = '20';
                }
                sessionDetails['timeout'] = parseInt(timeoutVal);
            }
        }
    }]);
appModule.run(['$rootScope', '$route', '$location', '$http', 'dmDialogueBox', 'LoginCredsFactory', 'sessionDetails', function($rootScope, $route, $location, $http, dmDialogueBox, LoginCredsFactory, sessionDetails) {
        $rootScope.$on('$routeChangeSuccess', function (events, current) {
           document.title = current.$$route.title;
        });
        String.prototype.hexEncode = function () {
            var hex, i;
            var result = "";
            for (i = 0; i < this.length; i++) {
                hex = this.charCodeAt(i).toString(16);
                result += ("000" + hex).slice(-4);
            }
            return result;
        };
        String.prototype.hexDecode = function () {
            var j;
            var hexes = this.match(/.{1,4}/g) || [];
            var back = "";
            for (j = 0; j < hexes.length; j++) {
                back += String.fromCharCode(parseInt(hexes[j], 16));
            }
            return back;
        };
        var lastDigestRun = new Date().getTime();
        $rootScope.keys = Object.keys;
        $rootScope.$watch(function () {
            var sessionObj = sessionDetails.getDetails();
            var timeoutVal = sessionObj['timeout'];
            var now = new Date().getTime();
            //milliseconds
            if (now - lastDigestRun > timeoutVal * 60000) {
                if ($location.path() !== "/login") {
                    //console.log('session error')
                    //alert("Session expired");
                    dmDialogueBox.alertBox({
                        title: 'Session Error!',
                        message: 'Session expired',
                        actionlabel: ['Ok']
                    }).then(function (res) {
                        //$location.path("/login");
                        if (LoginCredsFactory.getSSO()) {
                            window.close();
                        } else {
                            $location.path('/login');
                        }
                    });
                }
                // return;
                //$location.path("/login");
                // logout here, like delete cookie, navigate to login ...
            }
            lastDigestRun = now;
        });

    }]);

appModule.directive('appheader', function () {

    return{
        restrict: 'E',
        templateUrl: 'templates/appHeader/headertemplate.html',
        scope: {
            username: "=dmUsername"
        },
        link: function (scope, element, attrs) {
            scope.appName = attrs.appname;
        },
        controller: ['$scope', 'LoginCredsFactory', '$location', 'PlatwareRequest', 'dmDialogueBox', '$timeout', '$rootScope',
           function ($scope, LoginCredsFactory, $location, PlatwareRequest, dmDialogueBox, $timeout, $rootScope) {
                var LoginCredentials = LoginCredsFactory.getLoginCreds();
                $scope.showLoader = function (message) {
                    $scope.showMDMLoader = true;
                    $scope.loadingMessage = message || "Loading...";
                }
                $scope.hideLoader = function () {
                    $scope.showMDMLoader = false;
                }
                if (LoginCredentials) {
                    $scope.username = LoginCredentials.userId || '';
                } else {
                    $scope.username = '';
                }
                $scope.logout = function (optionSelected) {
                    switch (optionSelected) {
                        case 'logout':
                            dmDialogueBox.confirmBox({
                                title: 'Confirm',
                                message: 'Do you want to logout?',
                                actionlabel: ['No', 'Yes']
                            }).then(function (res) {
                                if (res) {
                                    // $rootScope.$broadcast('Logout');
                                    $scope.showLoader();
                                    $scope.$parent.removePath(0);
                                    $scope.$parent.reset();

                                    var killSession_req = [
                                        {
                                            processName: "PWKILLALLSESSION",
                                            data: []
                                        }
                                    ];
                                    PlatwareRequest.callPlatware(killSession_req).success(function () {
                                        // $scope.hideLoader();
                                        $timeout(function () {
                                            $location.path('/login');
                                            LoginCredsFactory.clearLoginCreds();
                                        }, 3000);

//                                        LoginCredsFactory.clearLoginCreds();
//                                    $location.path('/login');
                                    }).error(function () {
                                        $scope.hideLoader();
                                    });
//                                    LoginCredsFactory.clearLoginCreds();
//                                    $location.path('/login');
                                }

                            });

                            break;

                    }
                }
                $scope.gotoHome = function () {
                    var url = window.location.href;
                    if (url.indexOf('mainpage2') > -1) {
                        $scope.$parent.removePath(0);
                        $scope.$parent.reset();
                    } else {
                        $scope.$parent.removePath(0);
                        $scope.$parent.reset()
                        $location.path('/mainpage2');
                    }

                }
            }]
    };
});
appModule.factory('LoginCredsFactory', function () {
    var MDM_userId, MDM_password, ssoStatus;
    var storagekey = "storagesecretkey";
    var credentialsObj = {};
    var obj={};
    var obj1={};
    return{
        setLoginCreds: function (userId, password) {
//            userId = userId.toUpperCase();
            MDM_userId = userId;
            MDM_password = password;
            credentialsObj.userId = userId;
            credentialsObj.password = password;
            cryptor.encrypt(userId, storagekey, function (enc_userId) {
                sessionStorage.setItem('MDM_userId', enc_userId);
            });
//            cryptor.encrypt(password, storagekey, function (enc_password) {
//                sessionStorage.setItem('MDM_password', enc_password);
//            });
//            sessionStorage.setItem('MDM_userId', userId);
//            sessionStorage.setItem('MDM_password', password);
        },
        setDecryptedPw: function (password) {
                
                obj.pwrd = password;
            },
            getDecryptedPw: function () {
                return obj;
            },
            setAdflag: function (adFlag) {
                obj1.adFlag = adFlag;
                
            },
            getAdflag: function () {
                return obj1;
            },
        getLoginCreds: function () {
            var isSSO = this.getSSO();
            if (isSSO) {
                credentialsObj.password = "";//credentialsObj.userId;
                if (credentialsObj.userId) {
                    credentialsObj.password = "";//credentialsObj.userId;
                    return credentialsObj;
                } else if (sessionStorage.MDM_userId && sessionStorage.MDM_userId.length > 0) {
                    var isDecrypted = false;
                    var decryptedLoginId = null;
                    var decryptedPassword = null;
                    cryptor.decrypt(sessionStorage.MDM_userId, storagekey, function (userId_dec) {
                        decryptedLoginId = userId_dec;
                    });
                    while (!isDecrypted) {
                        if (decryptedLoginId) {
                            isDecrypted = true;
                        }
                    }
                    credentialsObj.userId = decryptedLoginId;
                    return credentialsObj;
                }
            } else {
                if (credentialsObj.userId && credentialsObj.password) {
                    //credentialsObj.userId = credentialsObj.userId;
                    return credentialsObj;
                } else if (sessionStorage.MDM_userId && sessionStorage.MDM_userId.length > 0) {
                    var isDecrypted = false;
                    var decryptedLoginId = null;
                    var decryptedPassword = null;
                    cryptor.decrypt(sessionStorage.MDM_userId, storagekey, function (userId_dec) {
                        decryptedLoginId = userId_dec;
                    });
                    if (sessionStorage.MDM_password && sessionStorage.MDM_password.length > 0) {
                        cryptor.decrypt(sessionStorage.MDM_password, storagekey, function (pass_dec) {
                            decryptedPassword = pass_dec;
                        });
                    } else {
                        decryptedPassword = "";
                    }
                    while (!isDecrypted) {
                        if (decryptedLoginId && (decryptedPassword || decryptedPassword == "")) {
                            isDecrypted = true;
                        }
                    }
                    credentialsObj.userId = decryptedLoginId;
                    credentialsObj.password = decryptedPassword;//credentialsObj.password;
                    return credentialsObj;
                } else {
                    credentialsObj.userId = "";
                    credentialsObj.password = ""
                    return credentialsObj;
                }
            }

        },
        getSessionLoginId: function () {
            var isDecrypted = false;
            var decryptedLoginId = null;
            if (sessionStorage.MDM_userId) {
                cryptor.decrypt(sessionStorage.MDM_userId, storagekey, function (loginId_dec) {
                    decryptedLoginId = loginId_dec
                });
            } else {
                decryptedLoginId = ''
            }

            while (!isDecrypted) {
                if (decryptedLoginId == null) {

                } else {
                    isDecrypted = true;
                }
            }
            return decryptedLoginId;
            //return sessionStorage.MDM_userId;
        }, setLoginId: function (value) {
            //alert(value)
//            value = value.toUpperCase();
            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID = value;
            credentialsObj.userId = value;
            if (value != '') {
                cryptor.encrypt(value, storagekey, function (loginId_enc) {
                    //console.log(loginId_enc);
                    sessionStorage.setItem('MDM_userId', loginId_enc);
                });
            }
        },
        clearLoginCreds: function () {
            MDM_password = "";
            MDM_userId = "";
            credentialsObj = {};
            sessionStorage.clear();
        },
        setSSO: function (sso) {
            sessionStorage.setItem('ssoStatus', sso);
        },
        getSSO: function () {
            if (sessionStorage.ssoStatus) {
                ssoStatus = sessionStorage.getItem('ssoStatus');
            }
            return ssoStatus;
        }

    };
});


appModule.factory('validateFileData', ['$q', function ($q) {
        var worker
        var defer = null;
        var returnedData = [];
        var workerConfig = {
            messageCount: 1
        };

        return {
            setWorkConfiguration: function (workerConfigParam) {
                workerConfig = workerConfigParam;
                var totalCount = parseInt(workerConfig.messageCount);
                worker.onmessage = function (e) {
                    //console.log(e.data);

                    returnedData.push(e.data);
                    //console.log(returnedData)

                    if (totalCount === 1) {
                        defer.resolve(returnedData);
                    }
                    if (returnedData.length === totalCount) {
                        defer.resolve(returnedData);
                    }
                    if(returnedData.length==1&&returnedData[0].message!=''){
                        defer.resolve(returnedData);
                    }
//                    if(returnedData.length==1&&returnedData[0].message==''){
//                        defer.reject(returnedData)
//                    }
                };
            },
            doWork: function (myData, workConfigArg) {
                workerConfig = {
                    messageCount: 1
                };
                worker = new Worker('doFileDataValidate.js');
                returnedData = [];
                if (workConfigArg) {
                    this.setWorkConfiguration(workConfigArg);
                } else {
                    this.setWorkConfiguration(workerConfig);
                }
                defer = $q.defer();
                //console.log(myData);
                //alert()
                //  defer = $q.defer();
                worker.postMessage(myData); // Send data to our worker. 
                return defer.promise;
            },
            submitData: function (data, workConfigArg) {
                console.log(data);
               // console.log(workConfigArg);
                workerConfig = {
                    messageCount: 1
                };
                worker = new Worker('doFileDataSubmit.js');
                returnedData = [];
                if (workConfigArg) {
                    this.setWorkConfiguration(workConfigArg);
                } else {
                    this.setWorkConfiguration(workerConfig)
                }
                defer = $q.defer();
                //console.log(myData);
                //alert()
                //  defer = $q.defer();
                worker.postMessage(data); // Send data to our worker. 
                return defer.promise;
            },
            readFileData: function (data) {
                workerConfig = {
                    messageCount: 1
                };
                returnedData = [];
                worker = new Worker('readFileNew.js');
                this.setWorkConfiguration(workerConfig);
                defer = $q.defer();
                worker.postMessage(data);
                return  defer.promise;
            },
            downloadFileData: function (data) {
                workerConfig = {
                    messageCount: 1
                };
                returnedData = [];
                worker = new Worker('downloadFile.js');
                this.setWorkConfiguration(workerConfig);
                defer = $q.defer();
                worker.postMessage(data);
                return  defer.promise;
            }
        };
    }]);
appModule.controller('headerCtrl', function () {

});
appModule.controller('mdm_init', ['$scope', '$filter', '$location', 'dmDialogueBox', 'LoginCredsFactory', 'sessionIdService',
   '$rootScope', '$routeParams', function ($scope, $filter, $location, dmDialogueBox, LoginCredsFactory,
        sessionIdService, $rootScope, $routeParams) {
//        $rootScope.$on('Logout', function () {
//            $scope.showLoader();
//        })
    

$scope.isShowSearchBy="";
        $scope.path = {};
        $scope.getPath = [];
        $scope.actionName = {};
        $scope.path.fullPath = [];
        $scope.showScreenControls = {};
        $scope.OrgNames = {};
        $scope.userName = "";
        $scope.showMDMLoader = false;
        $scope.sessionVars = {
            isSessionValid: false,
            isSSO: false
        }
        //$scope.$on('dateDivShown',function(e,date){
            //$scope.isShownFromToDate=date;
          //  $scope.$broadcast('showDateDiv',date);
            //$scope.$broadcast('itemData',item);
        //})

        $scope.$on("MyEventshowSearchBy", function (evt, data) {
            $scope.isShowSearchBy=data;
         });  
        
        $scope.setInitSSO = function (sessionParams) {
            LoginCredsFactory.setSSO($scope.sessionVars.isSSO);
            sessionParams = sessionParams[1];
            sessionParams = sessionParams.split('&');
            var sessionParamsObj = {};
            for (var i = 0, max = sessionParams.length; i < max; i++) {
                var tempParamArr = sessionParams[i].split("=");
                sessionParamsObj[tempParamArr[0]] = tempParamArr[1];
            }
            if (sessionParamsObj["userId"] && sessionParamsObj['userId'].length > 0) {
                LoginCredsFactory.setLoginCreds(sessionParamsObj["userId"], 'tempPassword');
                $scope.sessionVars.isSessionValid = true;
            }
            if (sessionParamsObj['SId'] && sessionParamsObj['SId'].length > 0) {
                // console.log(sessionParamsObj['SId'])
                $scope.sessionVars.isSessionValid = true;
                sessionIdService.setUserSessionId(sessionParamsObj['SId']);
            } else {
                dmDialogueBox.alertBox({
                    title: 'Session Error',
                    message: 'Invalid user session'
                });
                $location.path('/login');
                return;
            }
            $scope.$broadcast('sessionValidateEvent', $scope.sessionVars.isSessionValid);
        };

        $scope.resetSSO = function () {
            var sessionSSO = LoginCredsFactory.getSSO();
            if (sessionSSO && sessionSSO.length > 0) {
                $scope.sessionVars.isSSO = true;
                $scope.sessionVars.isSessionValid = true;
                $scope.$broadcast('sessionValidateEvent', $scope.sessionVars.isSessionValid);
            } else {
                $scope.initWithoutSSO();
            }
        }
        $scope.initWithoutSSO = function () {
            var userDetails = LoginCredsFactory.getLoginCreds() || {};
            if (userDetails.userId && userDetails.userId.length > 0) {
                //$scope.init();
                $scope.sessionVars.isSessionValid = true;
                $scope.$broadcast('sessionValidateEvent', $scope.sessionVars.isSessionValid);
            } else {
                dmDialogueBox.alertBox({
                    title: 'Session Error',
                    message: 'Invalid user session'
                });
                $location.path('/login');
                return;
            }
        }
        $scope.checkSession = function () {

            $scope.sessionVars.isSessionValid = false;
            $scope.sessionVars.isSSO = false;
            var currentURL = window.location.href;

            var userId = "";
            // alert(currentURL)
            if (currentURL.indexOf("?") > -1) {
                var sessionParams = currentURL.split("?");
                window.location.href = sessionParams[0];

                if (sessionParams[1] && sessionParams[1].length > 0) {
                    $scope.sessionVars.isSSO = true;
                    $scope.setInitSSO(sessionParams);
                }
            } else {
                $scope.resetSSO();
            }

            //alert(currentURL)

//            if ($scope.sessionVars.isSSO) {
//                LoginCredsFactory.setSSO($scope.sessionVars.isSSO);
//                sessionParams = sessionParams[1];
//                sessionParams = sessionParams.split('&');
//                var sessionParamsObj = {};
//                for (var i = 0, max = sessionParams.length; i < max; i++) {
//                    var tempParamArr = sessionParams[i].split("=");
//                    sessionParamsObj[tempParamArr[0]] = tempParamArr[1];
//                }
//                if (sessionParamsObj["userId"] && sessionParamsObj['userId'].length > 0) {
//                    LoginCredsFactory.setLoginCreds(sessionParamsObj["userId"], 'tempPassword');
//                    $scope.sessionVars.isSessionValid = true;
//                }
//                if (sessionParamsObj['SId'] && sessionParamsObj['SId'].length > 0) {
//                    console.log(sessionParamsObj['SId'])
//                    sessionIdService.setUserSessionId(sessionParamsObj['SId']);
//                } else {
//                    dmDialogueBox.alertBox({
//                        title: 'Session Error',
//                        message: 'Invalid User Session'
//                    });
//                    $location.path('/login');
//                    return;
//                }
//                //isSessionValid=true;
//                //  alert("hello")
//
//            } else {
//                var userDetails = LoginCredsFactory.getLoginCreds() || {};
//                if (userDetails.userId && userDetails.userId.length > 0) {
//                    //$scope.init();
//                    $scope.sessionVars.isSessionValid = true;
//                } else {
//
//
//                }
//
//            }

        };

        $scope.setPath = function (pathname) {
            var existing = $filter('byProp')($scope.path.fullPath, 'action', pathname.action);
            if (existing.length <= 0) {
                $scope.path.fullPath.push(pathname);
            } else {
                $scope.path.fullPath.pop();
                $scope.path.fullPath.push(pathname);
            }
            // console.log($scope.path.fullPath);
            $scope.getPath = $scope.path.fullPath;
            // alert(JSON.stringify($scope.getPath))
            // console.log($scope.path.fullPath.indexOf(pathname))
            //console.log($scope.getPath);
        };
        /*********************************** Bread Crumbs******************************************/
        $scope.pathAction = function (path_action, index, event) {
            ////console.log(path_action);
            switch (path_action) {
                case "org":
                    // $scope.showScreenControls.optsClass = 'slide-down';
                    if ($scope.OrgNames.OrgList.length == 1) {
                        try {
                            event.defaultPrevented = true;
                        } catch (e) {

                        }

//                        dmDialogueBox.alertBox({
//                            title: 'Alert',
//                            message: 'Sorry ! there is only one Orgid',
//                            actionlabel: ['Ok']
//                        }).then(function (res) {
//                        });
                    } else {
                        // $scope.showScreenControls.showTable = false;
                        $scope.showScreenControls.showSearchBy = false;
                        $scope.showScreenControls.showProceedAction = false;
                        $scope.showScreenControls.showOrgOptions = true;
                        $scope.showScreenControls.showStaging = false;
                        $scope.showScreenControls.showStagingTable = false;
                        $scope.showScreenControls.showMaster = false;
                        $scope.showScreenControls.showMasterTable = false;
                        $scope.showScreenControls.showRejectedTable = false;
                        $scope.showScreenControls.showTable = false;
                        $scope.showScreenControls.showSlideUpIcon = false;
                        $scope.showScreenControls.showBatchId = false;
                        $scope.showScreenControls.showFileUploadResult = false;
                        $scope.showScreenControls.showfileUpload = false;
                        $scope.showScreenControls.showRejected = false;
                        $scope.showScreenControls.showcreateMapping = false;
                        $scope.showScreenControls.showchangeMapping = false;
                        $scope.removePath(index);
                        $scope.showScreenControls.orgItem = '';
                    }
                    break;
                case "action":
                    $scope.showScreenControls.optsClass = 'slide-down';
                    if (window.location.href.indexOf('mainpage2') > -1) {
                        $scope.reset();
                    } else {
                        $location.path('/mainpage2');
                    }
                    //$scope.removePath($scope.entityName);
                    $scope.removePath(index);
                    break;
                case "entity":
                    $scope.showScreenControls.optsClass = 'slide-down';
                    $scope.removePath(index);
                    if (window.location.href.indexOf('mainpage2') > -1) {
                        $scope.editEntity();
                    } 
                    else if(window.location.href.indexOf('mainpage2') == -1)
                    {
                        $scope.editEntity();
                    }
                    
                    else {
                        $location.path('/mainpage2');
                    }

                    break;
                case "batchData":
                    var currentEntityId = $routeParams.entityid;
                    $scope.showScreenControls.optsClass = 'slide-down';
                    $scope.removePath(index);
                  //aa  $location.path('/batch/' + currentEntityId);
                    //================================================//
                    if (window.location.href.indexOf('mainpage2') > -1) {
                        $scope.editEntity();
                        
                    } else {
                        $location.path('/mainpage2');
                    }
                  //============================================//  
                    //$scope.showScreenControls.showBatchTable=false;
                    //$scope.showScreenControls.showStaging = true;
                    break;
                case "batch":
                    $scope.showScreenControls.optsClass = 'slide-down';
                    $scope.removePath(index);
              //================================================//
                    if (window.location.href.indexOf('mainpage2') > -1) {
                        $scope.editEntity();
                       
                    }
                    else if(window.location.href.indexOf('mainpage2') == -1)
                    {
                        $scope.editEntity();
                    }
                    
                    
                    else {
                        $location.path('/mainpage2');
                    }
                  //============================================//  

                    //var batchId = $routeParams.entityid;
                  //aa  $location.path('/mainpage2');
//                    $scope.showScreenControls.showStaging = true;
//                    //$scope.stagingEntityItem = batchId;
//                    $scope.showScreenControls.showProceedAction = false;//
                    //$scope.showScreenControls.showBatchTable=false;
                    //$scope.showScreenControls.showStaging = true;
                    break;
            }
            document.getElementById("fileName").innerHTML = '';
            document.getElementById("createFileName").innerHTML = '';
            document.getElementById("changeFileName").innerHTML = '';
            document.getElementById("UploadFileInput").value = '';
            $scope.showScreenControls.sheetsObj = {};
        }
        /************************** Reset avriables****************************/

        $scope.editEntity = function () {
            //  $scope.fromDate="";
            //      $scope.toDate="";
            //      $scope.fromTime="";
            //      $scope.toTime="";
            //      $scope.finalFromDate="";
            //      $scope.finalToDate="";
            $scope.showScreenControls.showTemplateOption = false;
            //$scope.showScreenControls.showBatchTable=false;
            $scope.showScreenControls.showFileUploadResult = false;
            $scope.showScreenControls.showfileUpload = false;
            $scope.showScreenControls.showTable = false;
            $scope.showScreenControls.showSlideUpIcon = false;
            $scope.showScreenControls.showRejected = false;
            $scope.showScreenControls.showFileUploadButton = false;
            $scope.showScreenControls.createMappingSection = false;
            $scope.showScreenControls.showcreateMapping = false;
            $scope.showScreenControls.showSubmitButton = false;
            $scope.showScreenControls.showchangeMapping = false;
            $scope.showScreenControls.showStagingTable = false;
            $scope.showScreenControls.showMasterTable = false;
            $scope.showScreenControls.showRejectedTable = false;
            $scope.showScreenControls.proceedEntity = true;
            $scope.showScreenControls.showBatchId = false;
            //document.getElementById("fileName").innerHTML = '';
        }
        $scope.reset = function () {
            $scope.showScreenControls.optsClass === 'slide-up' ? $scope.showScreenControls.optsClass = 'slide-down' : '';
            $scope.showScreenControls.proceedEntity = false;
            $scope.showScreenControls.showStagingTable = false;
            $scope.showScreenControls.showMasterTable = false;
            $scope.showScreenControls.showSearchBy = false;
            $scope.showScreenControls.showRejectedTable = false;
            $scope.showScreenControls.showcreateMapping = false;
            $scope.showScreenControls.showTemplateOption = false;
            $scope.showScreenControls.showProceedAction = true;
            $scope.showScreenControls.showProceedButtons = true;
            $scope.showScreenControls.showchangeMapping = false;
            $scope.showScreenControls.showfileUpload = false;
            $scope.showScreenControls.showTable = false;
            $scope.showScreenControls.showRejected = false;
            $scope.showScreenControls.showFileUploadButton = false;
            $scope.showScreenControls.showSubmitButton = false;
            $scope.showScreenControls.showFileUploadResult = false;
            $scope.showScreenControls.showSlideUpIcon = false;
            $scope.showScreenControls.showBatchId = false;
            $scope.showScreenControls.showStaging = false;
            $scope.showScreenControls.showMaster = false;
            $scope.showScreenControls.createMappingSection = false;
            $scope.showScreenControls.headers = [];
        }
        $scope.removePath = function (index) {
            var pathLength = $scope.path.fullPath.length;
            $scope.path.fullPath.splice(index, pathLength);
//            alert($scope.getPath.length)
//            
//        for(var i = 0, len = $scope.getPath.length; i < len; i++) {
//        if ($scope.getPath[i].name == pathname) {
//            var index = i;
//           console.log(index);
//            break;
//        }
//        }
//            $scope.path.fullPath.splice(index, 1);
//            console.log($scope.path.fullPath);
        }
        $scope.serverError = function () {
            dmDialogueBox.alertBox({
                title: 'Server Error',
                message: 'Server not responding',
                actionlabel: ['Ok']
            }).then(function (res) {
            });
        }

        $scope.showLoader = function (message) {
            $scope.showMDMLoader = true;
            $scope.loadingMessage = message || "Loading...";
        }
        $scope.hideLoader = function () {
            $scope.showMDMLoader = false;
        }
    }]);
//appModule.directive('searchlist', function () {
//    return {
//        restrict: "E",
//        scope: {
//            itemaction: '&',
//            buttonaction: '&',
//            themecolor: '@'
//                    //listfilters: '='
//        },
//        templateUrl: 'templates/searchList/searchList.html',
//        link: function (scope, element, attrs) {
//            scope.$watch("isListOpen", function () {
//                if (attrs.itemlist) {
//                    scope.itemlist = JSON.parse(attrs.itemlist);
//                    scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
//                }
//
//            });
//            //scope.textBoxWidth = element[0].children[2].children[0].offsetWidth + "px"
//
//            scope.selectedItem = null;
//            scope.placeholder = attrs.placeholder;
//            scope.itemValue = attrs.itemvalue;
//            scope.itemDescription = attrs.itemdesc;
//            scope.title = attrs.title;
//            if (attrs.actiontitle && attrs.actiontitle.length > 0) {
//                scope.buttonTitle = attrs.actiontitle;
//                scope.isButton = true;
//            } else {
//                scope.isButton = false;
//            }
//            scope.isListOpen = true;
//            scope.showList = function () {
//
//            };
//            scope.hideList = function () {
//
//            };
//            scope.itemClick = function (val, desc) {
//                if (scope.itemaction) {
//                    scope.selectedItem = {
//                        value: val,
//                        name: desc
//                    };
//                    scope.itemaction()(val, desc);
//                }
//
//            };
//            scope.buttonClick = function () {
//                if (scope.buttonaction) {
//                    scope.buttonaction()();
//                }
//            };
//            scope.callOnChange = function () {
//                if (scope.searchlistChange) {
//                    scope.searchlistChange()();
//                }
//            };
//            scope.$watch('selectedItem', function () {
//                scope.callOnChange();
//            });
//
//        },
//        controller: ['$scope', '$filter', function ($scope, $filter) {
//                $scope.searchlistItemHover = {};
//                $scope.getInputBoxWidth = function (elementObj) {
//                    var returnStyle = {
//                        width: ""
//                    };
//                    //angular.element(elementObj).pa
//                };
//                $scope.setHover = function (index) {
//                    $scope.searchlistItemHover[index] = true;
//                };
//                $scope.unsetHover = function (index) {
//                    $scope.searchlistItemHover[index] = false;
//                }
//                $scope.getHoverStyle = function (index) {
//                    var hoverStyle = new Object();
//                    //console.log($scope.searchlistItemHover)
//                    $scope.searchlistItemHover[index] ? hoverStyle = {background: '#' + $scope.themecolor, color: '#ffffff'} : hoverStyle = {background: '#ffffff', color: '#' + $scope.themecolor};
//                    return hoverStyle;
//                };
//            }]
//    }
//});
appModule.service("batchDataService", ["LoginCredsFactory", function (LoginCredsFactory) {
        var sessionBatchId = "";
        return{
            getBatchId: function () {
                //if (sessionBatchId.length <= 0) {
                var currentDateStamp = new Date();
                var currentTime = currentDateStamp.getTime();
                var loginCreds = LoginCredsFactory.getLoginCreds();
                var loginId = loginCreds.userId;
                var currentBatch = loginId + currentTime;
                sessionBatchId = currentBatch;
                //}
                return sessionBatchId;
            }
        }
    }]);
appModule.service("entityListService", ["LoginCredsFactory", function (LoginCredsFactory) {
        var entitityListObj = {};
        return{
            getEntityList: function () {
                return entitityListObj;
            },
            setEntityList: function (dataobj) {
                entitityListObj = dataobj;
               // console.log(entitityListObj);
                
            }
        }
    }])
appModule.service("orgIdService", [function () {
        var orgId;
        return{
            getOrgId: function () {
                orgId = JSON.parse(sessionStorage.getItem('orgId'));
                return orgId;
            },
            setOrgId: function (dataobj) {
                sessionStorage.setItem('orgId', dataobj);
            }
        }
    }])
appModule.service("batchDataService", ["LoginCredsFactory", function (LoginCredsFactory) {
        var sessionBatchId = "";
        return{
            getBatchId: function () {
                //if (sessionBatchId.length <= 0) {
                var currentDateStamp = new Date();
                var currentTime = currentDateStamp.getTime();
                var loginCreds = LoginCredsFactory.getLoginCreds();
                var loginId = loginCreds.userId;
                var currentBatch = loginId + currentTime;
                sessionBatchId = currentBatch;
                //}
                return sessionBatchId;
            }
        }
    }])
appModule.service("sessionIdService", function () {
    var userSessionId = "";
    return{
        getUserSessionId: function () {
            if (userSessionId.length <= 0) {
                if (sessionStorage.MDMUserSessionID) {
                    this.setUserSessionId(sessionStorage.MDMUserSessionID);
                } else {
                    userSessionId = "";
                }
            }
            return userSessionId;
        },
        setUserSessionId: function (value) {
            //sessionStorage.userSessionId=value;
            sessionStorage.setItem("MDMUserSessionID", value);
            userSessionId = value;
            //pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID = value;
        }
    };
});
/*Platware service*/
appModule.service('PlatwareRequest', ['$http', 'LoginCredsFactory', 'sessionIdService', 'dmDialogueBox', function ($http, LoginCredsFactory, sessionIdService, dmDialogueBox) {

        //this.callPlatware=function(data, success, error){
        this.callPlatware = function (data) {
            //PWCutilities.callPlatware(Platware.URL, data, success, error, {},{},{});

//       var onSuccess=function(response){
//        console.log(response);
//        return response;
//    };
//          var onError=function (error){
//          return error;
//    };
            var usersessionid = sessionIdService.getUserSessionId();
            var fp = new Fingerprint();
            var keyPW = null;
            var urlConcat = null;
            //var userSessionId = sessionIdService.getUserSessionId();
            var LoginId = LoginCredsFactory.getSessionLoginId();
            LoginCredsFactory.setLoginId(LoginId);
            var decryptedPw = LoginCredsFactory.getDecryptedPw();
            var getAdFlag=LoginCredsFactory.getAdflag()
            //console.log(userSessionId);
            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_VERSION="LMS"
            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.IMEI_NO = fp.get() + '';//$scope.systemFingerPrint;
            function randomString(length) {
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var result = '';
                for (var i = length; i > 0; --i)
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                return result;
            }
            var randomKey = randomString(16);
            //console.log("random:" + randomKey)
            var reqData = null;
            if (pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID === "") {
                if (LoginId) {
//                    var decryptedLoginId = LoginCredsFactory.getSessionLoginId();
//                    console.log(decryptedLoginId);
//                    LoginCredsFactory.setLoginId(decryptedLoginId);
                } else {
                    //alert("invalid user session, Login again!");
                    dmDialogueBox.alertBox({
                        title: 'Session Error!',
                        message: "invalid user session, login again!",
                        actionlabel: ['Ok']
                    }).then(function (res) {
                        console.log(res)
                    });
                    //LoginCredsFactory.logout();
                    return;
                }
            }
//            if (pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD === "") {
//                if (sessionStorage.MDM_password) {
////                    var decryptedPassword = LoginCredsFactory.getSessionPassword();
////                    LoginCredsFactory.setPassword(decryptedPassword);
//                    var credentialsObj = LoginCredsFactory.getLoginCreds();
//                    LoginCredsFactory.setLoginCreds(credentialsObj.userId, credentialsObj.password);
//                } else {
//                    //alert("invalid user session, Login again!");
//                    dmDialogueBox.alertBox({
//                        title: 'Session Error!',
//                        message: "invalid user session, Login again!",
//                        actionlabel: ['Ok']
//                    }).then(function (res) {
//                        //console.log(res)
//                    });
//                    //LoginCredsFactory.logout();
//                }
//            }

            //   console.log(pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID);
            var isEncryptionCompleted = false;
            var loginData = LoginCredsFactory.getLoginCreds();
            // alert(JSON.stringify(loginData));
            /*            cryptor.encrypt(loginData.userId, randomKey, function (loginId_enc) {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID = loginId_enc;
             cryptor.encrypt(loginData.password, randomKey, function (password_enc) {
             if (data[0].processName == "PWAUTH" || data[0].processName == "SPCHECKLOGIN") {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = password_enc;
             } else {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = "";
             }
             
             cryptor.encrypt(loginData.userId, randomKey, function (userId_enc) {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_ID = userId_enc;
             cryptor.encrypt(userSessionId, randomKey, function (uSessionId_enc) {
             if (data[0].processName == "PWAUTH" || data[0].processName == "SPCHECKLOGIN") {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID = '';
             } else {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID = uSessionId_enc;
             }
             cryptor.encrypt(randomKey, "decimalsecretkey", function (pwSessionId_enc) {
             pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_SESSION_ID = pwSessionId_enc;
             var reqDataDec = PWCutilities.createDataJSON(data);
             console.log(reqDataDec)
             cryptor.encrypt(reqDataDec, randomKey, function (reqDataEnc) {
             keyPW = pwSessionId_enc;
             pwSessionId_enc = pwSessionId_enc.hexEncode();
             urlConcat = "&ID=" + pwSessionId_enc;
             
             reqData = reqDataEnc;
             });
             
             });
             
             });
             
             });
             });
             });
             while (!isEncryptionCompleted) {
             if (reqData == null) {
             
             } else {
             var finalUrl;
             if (data[0].processName === "PWAUTH") {
             finalUrl = pwcProperties.encURL + urlConcat;
             } else {
             finalUrl = pwcProperties.encURL + urlConcat;
             }
             
             var req = {
             method: 'POST',
             url: finalUrl,
             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
             data: reqData,
             withCredentials: false,
             timeout: 180000
             };
             isEncryptionCompleted = true;
             
             return $http(req).success(function (response) {
             }).error(function (error) {
             return error;
             });
             }
             }
             
             */
            if (loginData.userId !== '') {
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID = cryptor.encryptText(loginData.userId, randomKey);
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_ID = cryptor.encryptText(loginData.userId, randomKey);
            } else {
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID = "";
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_ID = "";
            }
            if (data[0].processName == 'PWAUTH') {
                    pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_CLIENT_VERSION = getAdFlag.adFlag;
                } else {
                    pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_CLIENT_VERSION = ''
                }
            if (loginData.password && loginData.password !== '') {
                if (data[0].processName == 'ADAUTH') {
                        pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = cryptor.encryptText(decryptedPw.pwrd, randomKey);
                    }
                    else{
                        pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = cryptor.encryptText(loginData.password, randomKey);
                    }
                //pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = cryptor.encryptText(loginData.password, randomKey);

            } else {
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = '';
            }
            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_SESSION_ID = cryptor.encryptText(randomKey, "decimalsecretkey");
            if (usersessionid) {
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID = cryptor.encryptText(usersessionid, randomKey);
            } else {
                pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.USER_SESSION_ID = "";
            }
            /* When encryption is disabled*/
//            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PASSWORD = loginData.password;
//            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.LOGIN_ID = loginData.userId;
//            pwcProperties.platwareRequest.PWSESSIONRS.PWPROCESSRS.PWHEADER.PW_SESSION_ID = randomKey;
            var reqData = PWCutilities.createDataJSON(data);
         
            var req = {
                method: 'POST',
                url: pwcProperties.URL,
                // responseType: "blob",
                headers: {'Content-Type': 'text/plain'},
                data: JSON.parse(reqData),
                timeout: 180000
            };
            return $http(req);
            console.log(reqData);
            return $http(req).success(function (response) {

                console.log("hi");
                //return response;
            }).error(function (error) {
                //              console.log("hello");    
                return error;
            });
        };

    }]);

/*platware parse response*/
appModule.service('parsePlatwareResponse', ['sessionIdService', '$location', 'dmDialogueBox', 'LoginCredsFactory', function (sessionIdService, $location, dmDialogueBox, LoginCredsFactory) {
        function gotoLogin() {
            if (LoginCredsFactory.getSSO()) {
               $location.path('/login');
            } else {
                $location.path('/login');
            }

            return;
        }
        return{
            parse: function (response) {
                var data = response.PWSESSIONRS;
                var dataArr = [];

                for (var i = 0, max = data.length; i < max; i++) {
                    var userSession = sessionIdService.getUserSessionId();
                    sessionIdService.setUserSessionId(userSession);
                    var processId = data[i].PWPROCESSRS.PWHEADER.IN_PROCESS_ID;
                    var dataObj = {
                        data: "",
                        isError: "",
                        processName: "",
                        "errorCode": ""
                    };
                    if (data[i].PWPROCESSRS.PWERROR === "") {
                        dataObj.isError = "N";
                        dataObj.data = data[i].PWPROCESSRS.PWDATA[processId]["Row"];
                        dataObj.processName = processId.toUpperCase();
                    } else {
                        dataObj.isError = "Y";
                        dataObj.processName = processId.toUpperCase();
                        try {
                            var errorCode = data[i].PWPROCESSRS.PWERROR[processId]["Row"]["MsgID"].toUpperCase();
                            dataObj.errorCode = errorCode;
                            var errorMessage = data[i].PWPROCESSRS.PWERROR[processId]["Row"]["Message"];
                            if (errorCode === "MSESSION" || errorCode === "MAXSESSION") {
                                // alert("session");
                                dataObj.errorCode = errorCode;
                                if (dataObj.processName !== "PWAUTH") {
                                    dmDialogueBox.alertBox({
                                        title: 'Session Error!',
                                        message: errorMessage,
                                        actionlabel: ['Ok']
                                    }).then(function (res) {
                                        gotoLogin();
                                    });
                                    i = max;

                                    break;

                                }
                            } else if (errorCode === "ESESSION" || errorCode === "SESSIONID") {
                                //alert(errorMessage);
                                dmDialogueBox.alertBox({
                                    title: 'Session Error!',
                                    message: errorMessage,
                                    actionlabel: ['Ok']
                                }).then(function (res) {
                                    gotoLogin();

                                });
                                i = max;


                                break;

                            }
                        } catch (e) {

                        }
                        //dataObj.data=data[i].PWPROCESSRS.PWDATA;
                    }
                    dataArr.push(dataObj);
                }
                return dataArr;
            }
        };
    }]);
