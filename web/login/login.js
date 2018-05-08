var loginModule = angular.module("MDM.login", ['ngRoute', 'ngMessages']);
loginModule.controller('loginCtrl', ['$scope', '$location', 'LoginCredsFactory', 'PlatwareRequest', 'parsePlatwareResponse', 'dmDialogueBox', 'sessionDetails', 'sessionIdService', function ($scope, $location, LoginCredsFactory, PlatwareRequest, parsePlatwareResponse, dmDialogueBox, sessionDetails, sessionIdService) {
        $scope.hideLoader();
        $scope.killAllSessionAndLogin = function () {
            //sessionStorage.clear();
            var killAllSession_req = [
                {
                    processName: "PWKILLALLSESSION",
                    data: []
                }
            ];
            PlatwareRequest.callPlatware(killAllSession_req).success(function (response) {
            }).error(function () {
            });
        };
        var doLogin = function () {

            var username = $scope.mdmUsername;
            var password = $scope.mdmPassword;

            var data = [{
                    processName: "PWAUTH",
                    data: []
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
               // console.log("************");
               // console.log(response);
                var mdmUser = parsePlatwareResponse.parse(response);
                //console.log(mdmUser);
                $scope.hideLoader();
                //console.log(mdmUser);
                for (var i = 0; i < mdmUser.length; i++) {
                    if (mdmUser[i].isError == 'N')
                    {

                        if (mdmUser[i].processName == 'PWAUTH')
                        {
                            $scope.loginData = mdmUser[i].data[0]['is_auth'];
                              //var errMessage = JSON.parse(mdmUser[i].data[0]['auth_data']);
                            if ($scope.loginData == "Y") {
                                //LoginCredsFactory.setLoginCreds(username, password);
                                var sessionTimeOut = mdmUser[i].data[0]['session_expire_time_in_min'] || "20";
                                sessionDetails.setDetails(sessionTimeOut);
                                var sessionId = mdmUser[i].data[0]['user_session_id'];
                                sessionIdService.setUserSessionId(sessionId)
                                $location.path('/mainpage2');
                               
                            } else {
                                
                               dmDialogueBox.alertBox({
                                  title: 'Invalid Login',
                                message: 'Please enter correct username and password',
                                actionlabel: ['Ok']
                                }).then(function (res) {
                                });
                            }
                            //var isLoginSuccess = false;
                            //check response and if user is validated then set isLoginSuccess as true
                            //isLoginSuccess = true;
                        }
                    } else {
                        if (mdmUser[i].errorCode === "MSESSION") {
//                                        var confirmMultiSession = confirm("User already logged in, Do want to kill previous session and proceed?");
//                                        if (confirmMultiSession) {
//                                            $scope.killSessionAndLogin();
//                                            $scope.login();
//                                        } else {
//
//                                        }
                            dmDialogueBox.confirmBox({
                                title: 'Session Warning',
                                message: 'User already logged in, Do want to kill previous session and proceed ?',
                                actionlabel: ['No', 'Yes']
                            }).then(function (res) {
                                if (res) {
                                    $scope.showLoader();
                                    $scope.killAllSessionAndLogin();
                                    //$scope.login();
                                    doLogin();
//                                    checkADauth()
                                }
                            });
                        } else if (mdmUser[i].errorCode === "MAXSESSION") {
//                                        var confirmMultiSession = confirm("Maximum logged in users limit reached, Do want to kill all previous session and proceed?");
//                                        if (confirmMultiSession) {
//                                            $scope.killAllSessionAndLogin();
//                                            $scope.login();
//                                        } else {
//
//                                        }
                            dmDialogueBox.confirmBox({
                                title: 'Session Warning',
                                message: 'Maximum logged in users limit reached, Do want to kill all previous session and proceed?',
                                actionlabel: ['No', 'Yes']
                            }).then(function (res) {
                                if (res) {
                                    $scope.killAllSessionAndLogin();
                                    //$scope.login();
                                    doLogin();
//                                    checkADauth()
                                }
                            });
                        } else {
                            //alert("Authentication Failed");
                            dmDialogueBox.alertBox({
                                title: 'Login Error!',
                                message: 'Authentication failed',
                                actionlabel: ['Ok']
                            }).then(function (res) {
                                //console.log(res)
                            });

                        }
                    }
                }
//                if (isLoginSuccess) {
//                    LoginCredsFactory.setLoginCreds(username,password);
//                    $location.path('/mainpage2');
//                }else{
//                    LoginCredsFactory.clearLoginCreds();
//                }
            }
            ).error(function (error) {
                LoginCredsFactory.clearLoginCreds();
                //console.log(error);
                dmDialogueBox.alertBox({
                    title: 'Server Error',
                    message: 'Server not responding',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                $scope.hideLoader();
            });

        };
        var checkADauth = function () {
            var data = [{
                    processName: "ADAUTH",
                    data: []
                }];
            PlatwareRequest.callPlatware(data).success(function (res) {
                var response = res.data;
                var resArr = response.split('~');
                $scope.adAuthFlag = resArr[0];
                LoginCredsFactory.setAdflag($scope.adAuthFlag);
                doLogin();
                //console.log(response)
            }).error(function (err) {
                $scope.hideLoader()
                dmDialogueBox.alertBox({
                    title: 'Oops!!',
                    message: 'Some error occured..Please try again..!!',
                    actionlabel: ['Ok'],
                    iconType: 'error'
                }).then(function (res) {
                });
            })
        }
        $scope.validateLogin = function () {

            // if (!$scope.mdmUsername || !$scope.mdmPassword) {
            //     dmDialogueBox.alertBox({
            //         title: 'Invalid Login',
            //         message: 'Please Enter Username and Password',
            //         actionlabel: ['Ok']
            //     }).then(function (res) {
            //     });
            //     return;
            // }



            if (!$scope.mdmUsername && !$scope.mdmPassword) {
                dmDialogueBox.alertBox({
                    title: 'Invalid Login',
                    message: 'Please enter username and password',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }
            else if(!$scope.mdmUsername && $scope.mdmPassword) {
                dmDialogueBox.alertBox({
                    title: 'Invalid Login',
                    message: 'Please enter username',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }

            else if($scope.mdmUsername && !$scope.mdmPassword) {
                dmDialogueBox.alertBox({
                    title: 'Invalid Login',
                    message: 'Please enter password',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }


            
//            if (!$scope.mdmUsername.match(/^[0-9a-zA-Z]+$/)) {
//                dmDialogueBox.alertBox({
//                    title: 'Invalid Login',
//                    message: 'Please Enter Alphanumeric username',
//                    actionlabel: ['Ok']
//                }).then(function (res) {
//                });
//                return;
//            }
            $scope.showLoader('validating User');
            var username = $scope.mdmUsername;
            var password = $scope.mdmPassword;
            if (username)
            {
                if (password) {
                    var enc_pwrd = sha256(password);
                    LoginCredsFactory.setLoginCreds(username, password)
                    LoginCredsFactory.setDecryptedPw(password);
                    doLogin();
//                     checkADauth();
                }

            } else {
                alert("enter username");
            }
        };
//        $scope.validateLocation = function(){
//            alert();
//        var windowObjectReference;
//        window.sessionStorage.setItem("testItem","hello22");
//            var strWindowFeatures = "fullscreen=yes";
//            windowObjectReference = window.open('http://localhost:8084/MasterDataManagement/#/mainpage2', "_blank", strWindowFeatures);
//
//        }
    }]);
