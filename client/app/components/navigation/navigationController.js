angular.module("main")
    .controller("NavCtrl", function($scope, $location){
        $scope.onload = function (){
            $('#side-menu').metisMenu();
        }

    });