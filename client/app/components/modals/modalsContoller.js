angular.module("main")
    .controller("ModalCtrl", function($scope, $http){
        $scope.instanceName = '';
        $scope.instances = {};
        $scope.modalLoader = false;

        $scope.getInstances = function(){
            $scope.modalLoader = true;
            $http.get('/api/getInstances')
                .then(function(obj){
                    $scope.instances = obj.data.data;
                    $scope.instanceName = $scope.instances[0];
                    $scope.modalLoader = false;
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                });
        }

        $scope.connectToServer = function(){

        }
    });