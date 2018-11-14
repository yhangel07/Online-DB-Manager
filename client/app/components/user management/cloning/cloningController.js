angular.module("main")
    .controller("CloningCtrl", function($scope, $http){
        var rowCount = 1;
        $scope.originalUser = null;
        $scope.mirrorUser = null;

        $scope.inputsInMirror = [
            {
                name: 'inputMirror' + rowCount
            }
        ];
        
        $scope.addInputInMirror = function (){
            rowCount++;
            $scope.inputsInMirror.push({
                name: 'inputMirror' + rowCount
            });
        };

        var that = this;
        that.copyFromUser = null;
        that.copyToUser = null;
        that.loadingFrom = false;
        that.loadingTo = false;

        that.autoCompleteOptionsFromUser = {
            minimumChars: 1,
            noMatchTemplate: "<span>No User found match '{{entry.searchText}}'. Enter a valid user</span>",
            data: function (searchText) {
                that.loadingFrom = true;
                return $http.get('/api/user?searchString=' + searchText )
                .then(function(res){

                    var filteredUsers = _.filter(res.data, function(user){
                        return user.name;
                    });
                    that.loadingFrom = false;

                    return _.map(filteredUsers, 'name');

                }).catch(function(err){
                    console.log(err);
                });
            },
            itemSelected: function(selectedUser){
                $scope.originalUser = selectedUser.item;
            }
        };

        that.autoCompleteOptionsToUser = {
            minimumChars: 1,
            noMatchTemplate: "<span ng-click='userNotFound(entry.searchText)'>'{{entry.searchText}}' is not found. Click here to create user.</span>",
            data: function (searchText) {
                that.loadingTo = true;
                return $http.get('/api/user?searchString=' + searchText )
                .then(function(res){

                    var filteredUsers = _.filter(res.data, function(user){
                        return user.name != $scope.originalUser;
                    });
                    that.loadingTo = false;

                    return _.map(filteredUsers, 'name');

                }).catch(function(err){
                    console.log(err);
                });
            },
            itemSelected: function(selectedUser){
                $scope.mirrorUser = selectedUser.item;
            }
        };

        $scope.userNotFound = function(newUser){
            console.log(newUser);
        };

        $scope.resetSelectionOrg = function(){
            $scope.originalUser = null;
        };

        $scope.resetSelectionMirror = function(){
            $scope.mirrorUser = null;
        };

        $scope.fullClone = function(){
            console.log($scope.originalUser);
            console.log($scope.mirrorUser);
            var checkTypeAunt = 1;

            if( $scope.mirrorUser.substring(0, 2).toUpperCase() + $scope.mirrorUser.substring(2, 1) === 'AD\\'){
                checkTypeAunt = 0;
            }

            var cloningParameters = {
                orgUser: $scope.originalUser,
                newUser: $scope.mirrorUser,
                typeAunt: checkTypeAunt
            };

            $http.post('/api/fullCloning', cloningParameters)
                .then(function(res){
                    console.log(res);
                }).catch(function(err){
                    console.log('ERROR: ' + err);
                })
        };
    });