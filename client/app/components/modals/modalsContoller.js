angular.module("main")
    .controller("ModalCtrl", function($scope, $http, session){
        $scope.onLoad = function(){
            //$scope.instanceName = '';
            $scope.modalLoader = false;
            $scope.notReadyToConnect = true;
            $scope.errorMessage ='';
        }

        $scope.serverDetails = {};
        $scope.serverDetails.instances = [];

        $scope.getInstances = function(){
            $scope.modalLoader = !$scope.modalLoader;  
            $scope.serverDetails.server = $scope.serverNameFromUser.substring(0, $scope.serverNameFromUser.indexOf('.'));

            // if(!session.getPw()){
            //     $("#getPasswordFromModal").modal({ backdrop : 'static' },"show");
            // }else{

            $http.post('/api/getInstances', $scope.serverDetails)
                .then(function(obj){
                    if(obj.data != 0){
                        angular.forEach(obj.data, function(response){
                            $scope.serverDetails.instances.push({
                                name: response.instc_name.substring(response.instc_name.indexOf('\\') + 1),
                                port: response.port_number
                            });
                        });
                        console.log($scope.serverDetails);

                        // $scope.instances = obj.data.data;
                        // console.log($scope.instances);
                        $scope.instanceName = $scope.serverDetails.instances[0].name;
                        $scope.modalLoader = !$scope.modalLoader;
                        // $scope.notReadyToConnect = false;
                    }
                    
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                    $scope.modalLoader = !$scope.modalLoader;
                    $scope.notReadyToConnect = true;
                    $scope.errorMessage ="Enter a Valid Server";    

                    $('#serverNameFromUser').focus();
                });
            // }
        };

        $scope.getPort = function(){

        };

        $scope.setPasswordFromModal = function(newPw){
            session.setPw(newPw);
            $("#getPasswordFromModal").modal("hide");
            $scope.getInstances();
        }

        $scope.connectToServer = function(){

        }

        $(window).on('hidden.bs.modal', function() { 
            $scope.modalLoader = false;

        });


    });