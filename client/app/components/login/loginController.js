angular.module("main")
    .controller("LoginCtrl", function($scope, auth, $timeout, $state, session){
        $scope.loginCredentials = [];
        $scope.loading = false;
        $scope.credentials = {};

        $scope.loginFormSubmit = function(){
            $scope.loading = true;

            
            auth.logIn($scope.credentials)
                .then(function(_user){
                    $scope.loading = false;
                    if(_user != 0){
                        angular.forEach(_user, function(response){
                            if(response.IsActive){
                                $timeout(function(){
                                    session.setUser(response.LoginName);
                                    session.setServerStatus('Disconnected');
                                    session.setPw($scope.credentials.password);
                                    $state.go('app.dashboard.mainComponent');
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