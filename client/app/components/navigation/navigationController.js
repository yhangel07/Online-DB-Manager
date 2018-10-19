function compile(element){
    var el = angular.element(element);    
    $scope = el.scope();
      $injector = el.injector();
      $injector.invoke(function($compile){
         $compile(el)($scope)
      })     
  }
  
  function disabledMenu(status){
      var el = document.getElementById("userMgmt");
      el.setAttribute("aria-disabled", status);
      compile(el);
  }

angular.module("main")
    .controller("NavCtrl", function($scope, $state, session, $http){

        $scope.onload = function (){
            if(session.getServerDetails() == 'null'){
                disabledMenu(true);
            }else{
                disabledMenu(false);
            }

            $scope.$state = $state; //TODO if need pa
            //$scope.serverProperties.name = session.getServerDetails();
            /**
            $http.get("/api/server")
                .then(function(obj){
                    console.log(obj);
                    if(obj.data.code === '1001'){
                        toastr.warning( obj.data.message, 'Server Warning:');
                    }else if(obj.data.code === '1717'){
                        $scope.serverProperties.name = obj.data.data[0].server_name,
                        $scope.serverProperties.status = "Connected";
                        toastr.success($scope.serverProperties.name, 'Connected to Server:');
                    }else{
                        toastr.error('Check Server Status', 'ERROR IN CONNECTION');
                    }
                })
                .catch(function(err){
                    console.log('ERROR: ' + JSON.stringify(err));
                });
                */
        }
    });