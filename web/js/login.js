var loginModule = angular.module("MDM.login", ['ngRoute', 'ngMessages']);
loginModule.controller('loginCtrl', ['$scope', '$location', 'LoginCredsFactory', 'PlatwareRequest', 'parsePlatwareResponse', 'dmDialogueBox', function ($scope, $location, LoginCredsFactory, PlatwareRequest, parsePlatwareResponse, dmDialogueBox) {
        var doLogin = function () {
            
            var username = $scope.mdmUsername;
            var password = $scope.mdmPassword;
            var data = [{
                    processName: "SPCHECKLOGIN",
                    data: []
                }];
            PlatwareRequest.callPlatware(data).success(function (response) {
                var mdmUser = parsePlatwareResponse.parse(response);
                $scope.hideLoader();
                //console.log(mdmUser);
                for (var i = 0; i < mdmUser.length; i++) {
                    if (mdmUser[i].isError == 'N')
                    {

                        if (mdmUser[i].processName == 'SPCHECKLOGIN')
                        {
                            $scope.loginData = mdmUser[i].data[0]['message'];
                            if ($scope.loginData == "Y") {
                                LoginCredsFactory.setLoginCreds(username, password);
                                $location.path('/mainpage2');
                            } else {
                                dmDialogueBox.alertBox({
                                    title: 'Invalid Login',
                                    message: 'Please Enter Correct Username and Password',
                                    actionlabel: ['Ok']
                                }).then(function (res) {
                                });
                            }
                            //var isLoginSuccess = false;
                            //check response and if user is validated then set isLoginSuccess as true
                            //isLoginSuccess = true;
                        }
                    }
                }
//                if (isLoginSuccess) {
//                    LoginCredsFactory.setLoginCreds(username,password);
//                    $location.path('/mainpage2');
//                }else{
//                    LoginCredsFactory.clearLoginCreds();
//                }
            }).error(function (error) {
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
        $scope.validateLogin = function () {
            if (!$scope.mdmUsername || !$scope.mdmPassword) {
                dmDialogueBox.alertBox({
                    title: 'Invalid Login',
                    message: 'Please Enter Username and Password',
                    actionlabel: ['Ok']
                }).then(function (res) {
                });
                return;
            }
            $scope.showLoader('validating User');
            var username = $scope.mdmUsername;
            var password = $scope.mdmPassword;
            if (username)
            {
                if (password) {
                    LoginCredsFactory.setLoginCreds(username, password)
                    doLogin();
                }

            }
            else {
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