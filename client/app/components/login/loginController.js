angular.module("main")
    .controller("LoginCtrl", function($scope, $http){
        $scope.loginCredentials = [];
        $scope.loading = false;
        // $scope.onLoad = function(){
        //     console.log('Im herer');
        //     $http.get('/api/users/')
        //         .then(function(res){
        //             angular.forEach(res.data.data, function(response){
        //                 loginCredentials.push(response);
        //             });
        //         }).catch(function(err){
        //             console.log(err);
        //         }).finally(function(){
        //             //console.log(loginCredentials);
        //         });
        // }

        
        $scope.loginFormSubmit = function(){
            $scope.loading = true;
            $http.post('/api/login/', {
                username : $scope.login.username,
                password : $scope.login.password
            },{
                headers: { 'Content-Type' : 'application/json' }
            }).then(function(res){
                $scope.loading = false;
                if(res.data.data.length != 0){
                    angular.forEach(res.data.data, function(response){
                        console.log(response);
                        if(response.IsActive){
                            
                        }else{
                            $scope.loginCredentials.message = 'User is inactive. Contact Support.';
                        }
                    });
                }else{
                    $scope.loginCredentials.message = 'Invalid Username or Password';
                    //console.log('Invalid Username or Password');
                }
            }).catch(function(err){
                $scope.loginCredentials.message = err;
                //console.log("Login Error: " + err);
            }).finally(function(){
                //console.log();
            });
            
        }

    });