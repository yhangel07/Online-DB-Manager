angular.module("main")
    .controller("HeaderFooterCtrl", function($scope, auth){

        $scope.logOutApp = function(){
            // auth.logOut().then(function(res){
            //     console.log(res);
            // }).catch(function(err){
            //     console.log(err);
            // });
        }

    });