angular.module("main")
    .controller("CloningCtrl1", function($scope, $http, $timeout, logs){
        $scope.cloningInProgress = false;
        $scope.serverUsers = [];
        $scope.onLoad = function(){
            $http.get('/api/user')
                .then(function(res){
                    angular.forEach(res.data, function(user){
                        if(user.type != 'G')  $scope.serverUsers.push(user.name);
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

            $scope.cloningInProgress = true;


            $http.get('api/createSP')
                .then(function(res){
                    //console.log('SP response: ' + res.data.msg);

                    angular.forEach($scope.usersToCloneTo, function(user){

                        var cloningParameter = {
                            oldUser: $scope.userToClone,
                            newUser: user,
                            iSnew: checkIfIsNew(user),
                            IsSqlaunt: checkIfSqlAunth(user)
                        }

                        $http.post('api/fullCloning', cloningParameter)
                            .then(function(res){
                                toastr.success("Full Cloning Completed for " + user, "Cloning Status", { timeOut: 9500 });
                                logs.createLog('Full Cloning of user ' + user + ' from user ' + $scope.userToClone);
                                $scope.cloningInProgress = false;
                                $scope.resetAll();
                                
                                console.log(res);

                            }).catch(function(err){
                                toastr.danger(err, "Cloning Status");
                                logs.createLog('Error Full Cloning of user ' + user + ' from user ' + $scope.userToClone);
                                $scope.cloningInProgress = false;

                                console.log('ERROR: ' + err);
                            });   
                    });
            }).catch(function(err){
                $scope.cloningInProgress = false;
                console.log('ERROR: ' + JSON.stringify(err));
            });
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