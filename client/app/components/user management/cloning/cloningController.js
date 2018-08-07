angular.module("main")
    .controller("CloningCtrl", function($scope){
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
        }

    });