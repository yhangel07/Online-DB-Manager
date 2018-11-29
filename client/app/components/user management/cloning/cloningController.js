angular.module("main")
    .controller("CloningCtrl1", function($scope, $http, $timeout){
        $scope.cloningInProgress = false;
        $scope.serverUsers = [];
        $scope.onLoad = function(){
            $http.get('/api/user')
                .then(function(res){
                    angular.forEach(res.data, function(user){
                        $scope.serverUsers.push(user.name);
                    });
                    //$scope.serverUsers = res.data;
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
            tags: true,
            // tokenSeparators: [',', ' ']
         });

         $scope.resetAll = function(){
            $timeout(function(){
                $('#newUsers').val(null).trigger('change');
                $('#orgUserSelection').val(null).trigger('change');
            });
         };

         $scope.sureToClone = function(orgUser){
            var newUsers = $('#newUsers').val();

            $("#sureCloneModal").modal("show");

            $scope.userToClone = orgUser;
            $scope.usersToCloneTo = newUsers;
         };

         $scope.fullClone = function(){
            $("#sureCloneModal").modal("hide");

            $scope.loginLoading = true;
            var increment = 0.1;
            var count = 0;

            angular.forEach($scope.usersToCloneTo, function(user){
                $scope.loginLoading = count;

                $scope.cloningInProgress = true;


                var cloningParameter = {
                    oldUser: $scope.userToClone,
                    newUser: user,
                    iSnew: checkIfIsNew(user),
                    IsSqlaunt: checkIfSqlAunth(user)
                }

                $http.post('api/fullCloning', cloningParameter)
                    .then(function(res){
                        count = count + increment;
                        toastr.success("Full Cloning Completed for " + user, "Cloning Status", { timeOut: 9500 });

                        $scope.cloningInProgress = false;
                        $scope.resetAll();
                        
                        console.log(res);

                    }).catch(function(err){
                        toastr.danger(err, "Cloning Status");
                        $scope.cloningInProgress = false;

                        console.log('ERROR: ' + err);
                    });
                
            });
            $scope.loginLoading = false;
         };

         var checkIfSqlAunth = function(user){
            if(user.substring(0,2).toUpperCase() == 'AD'){
                return 0; //WinAunth
            }else{
                return 1; //SQLAunth
            }
         };

         var checkIfIsNew = function(user){
            if($scope.serverUsers.indexOf(user) !== -1) {
                return 1; //Existing User
            }else{
                return 0; //New User
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