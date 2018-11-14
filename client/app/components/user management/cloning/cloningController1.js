angular.module("main")
    .controller("CloningCtrl1", function($scope, $http){
        $scope.serverUsers = [];
        $scope.onLoad = function(){
            $http.get('/api/user')
                .then(function(res){
                    $scope.serverUsers = res.data;
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                });
        };

        $(".js-example-basic-single").select2({
            placeholder: "ex. sample_user or ADmc598139",
            allowClear: true
         });
        
         $(".js-example-basic-multiple").select2({
            placeholder: "ex. sample_user or ADmc598139",
            tags: true
         });

         $scope.fullClone = function(orgUser, newUsers){

            angular.forEach(newUsers, function(user){
                var cloningParameter = {
                    oldUser: orgUser,
                    newUser: user.name,
                    //ISnew: ,
                    IsSqlaunt: checkIfSqlAunth(user.name)
                }

                $http.post('api/fullCloning', cloningParameter)
                    .then(function(res){
                        console.log(res);
                    }).catch(function(err){
                        console.log('ERROR: ' + err);
                    });
            });


         };

         var checkIfSqlAunth = function(user){
            if(user.substring(0,2).toUpperCase() == 'AD'){
                return 0;
            }else{
                return 1;
            }
         };
    })
    
    .filter('excludeFrom',function(){
        return function(inputArray,filterCriteria){
          return inputArray.filter(function(item){
            return !filterCriteria || !angular.equals(item,filterCriteria);
          });
        };
      });