angular.module("main")
    .controller("DashboardCtrl", function($scope, $http, session){
        $scope.onload = function(){
            session.setServerStatus('Disconnected');
        }
    });