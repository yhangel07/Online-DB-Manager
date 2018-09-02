angular.module("main")
    .controller("LoginCtrl", function($scope, $http, $state, ParseService, $timeout){
        $scope.loginCredentials = [];
        $scope.loading = false;
        $scope.credentials = {};

        $scope.loginFormSubmit = function(){
            $scope.loading = true;

            ParseService.login($scope.credentials)
                .then(function(_user){
                    $scope.loading = false;
                    if(_user != 0){
                        angular.forEach(_user, function(response){
                            console.log(response);
                            if(response.IsActive){
                                $timeout(function(){
                                    $state.go('app.dashboard');
                                }, 2);
                            }else{
                                $scope.loginCredentials.message = 'User is inactive. Contact Support.';
                            }
                        });
                    }else{
                        $scope.loginCredentials.message = 'Invalid Username or Password';
                    }
                }).catch(function(err){
                    $scope.loginCredentials.message = err;
                });   
        }

    });