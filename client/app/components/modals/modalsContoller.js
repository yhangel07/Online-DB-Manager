angular.module("main")
    .controller("ModalCtrl", function($scope, $http){

        $scope.getInstances = function(){
            $http.get('/api/getInstances')
                .then(function(obj){
                    console.log(obj);
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                });
        }

        $scope.connectToServer = function(){

        }
    });