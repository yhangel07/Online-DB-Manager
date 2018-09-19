angular.module("main")
    .controller("ModalCtrl", function($scope, $http, session){
        $scope.onLoad = function(){
            //$scope.instanceName = '';
            $scope.modalLoader = false;
            $scope.notReadyToConnect = true;
            $scope.errorMessage ='';
        }


        $scope.getInstances = function(){
            $scope.serverDetails = {};
            $scope.serverDetails.instances = [];

            if(typeof($scope.serverNameFromUser) == "undefined" || $scope.serverNameFromUser === null){
                errorServerName();
            }else{
                $scope.serverDetails.server = serverNameCheck($scope.serverNameFromUser);
                $scope.modalLoader = !$scope.modalLoader;  

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
                        $scope.instanceName = $scope.serverDetails.instances[0].name;
                        $scope.modalLoader = !$scope.modalLoader;
                        // $scope.notReadyToConnect = false;
                    }else{
                        errorServerName();
                    }
                    
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                    errorServerName();

                });
            }
            // }
        };

        var errorServerName = function(){
            $scope.modalLoader = false;
            $scope.notReadyToConnect = true;
            $scope.errorMessage = "Enter a Valid Server";
            $('#serverNameFromUser').focus();

        };

        var serverNameCheck = function(serverName){
            if (serverName != '0.0.0.0' && serverName != '255.255.255.255' &&
                serverName.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)) {
                return serverName;
            } else {
                return serverName = serverName.substring(0, serverName.indexOf('.'));
            }
        };

        $scope.setPasswordFromModal = function(newPw){
            session.setPw(newPw);
            $("#getPasswordFromModal").modal("hide");
            $scope.getInstances();
        }

        $scope.connectToServer = function(){

        }

        $('#serverConnectModal').on('hidden.bs.modal', function() { 
            $(this).find('form').trigger('reset');
            $('#ins').find('option').remove().end()
            .append("<option value='' ng-hide='serverDetails.instances'>--Select Instance--</option>").val('');
;


        });


    });