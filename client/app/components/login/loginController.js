angular.module("main")
    .controller("LoginCtrl", function($scope){
        var loginCredentials = [];

        $scope.loginFormSubmit = function(){
            loginCredentials = {
                username : $scope.login.username,
                password : $scope.login.password
            }

            console.log(loginCredentials);
            
        }
    });