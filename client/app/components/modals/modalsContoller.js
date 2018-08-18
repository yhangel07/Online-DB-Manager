angular.module("main")
    .controller("ModalCtrl", function($scope, $http){
        $scope.instanceName = '';
        $scope.instances = {};
        $scope.modalLoader = false;
        $scope.notReadyToConnect = true;
        $scope.errorMessage ='';

        $scope.getInstances = function(){
            if($scope.serverNameFromUser){
                $scope.modalLoader = !$scope.modalLoader;  
                $http.post('/api/getInstances', { serverName: $scope.serverNameFromUser })
                .then(function(obj){
                    $scope.instances = obj.data.data;
                    $scope.instanceName = $scope.instances[0];
                    $scope.modalLoader = !$scope.modalLoader;
                    $scope.notReadyToConnect = false;
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                    $scope.modalLoader = !$scope.modalLoader;
                    $scope.notReadyToConnect = true;
                    $scope.errorMessage ="Enter a Valid Server";    

                    $('#serverNameFromUser').focus();
                });
            }
        }

        $scope.connectToServer = function(){

        }
    });