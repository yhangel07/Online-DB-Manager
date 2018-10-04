angular.module("main")
    .controller("DashboardCtrl", function($scope, $http, session){
        $scope.onload = function(){
            $http.get('/api/checkServer')
                .then(function(res){
                    console.log(res);
                }).catch(function(err){
                    console.log(err);
                    toastr.warning(err.data.msg, "Server status");
                    session.destroyServerSession();
                });
        }
    });