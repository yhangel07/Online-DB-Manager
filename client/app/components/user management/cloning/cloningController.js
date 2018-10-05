angular.module("main")
    .controller("CloningCtrl", function($scope, $http){
        var rowCount = 1;

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

        $scope.searchUserByLetter = function(searchFilter){
           // $scope.suggestions = [];

            if(searchFilter.length > 0){
                $http.get('/api/user?searchString=' + searchFilter )
                    .then(function(res){
                        if(res.data !=0 ){
                            $scope.suggestions = res.data;
                            // angular.forEach(res.data, function(response){
                            //     if(!response.is_disabled) $scope.suggestions.push(response.name);
                            // });
                        }
                    }).catch(function(err){
                        console.log(err);
                    });
            }else{
                $scope.suggestions.length = 0;

            }
        };
    });