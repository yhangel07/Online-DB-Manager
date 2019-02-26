angular.module("main")
    .controller("longRunningCtrl", function($scope, $http, logs, DTOptionsBuilder, DTColumnBuilder, $q){

        $scope.onload = function(){
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

                $http.get('/api/checkLongRunning')
                .then(function(obj){
                    console.log(obj.data);
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR Long Running: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap().withPaginationType('simple_numbers');

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('QueryName').withTitle('Query Name').renderWith($.fn.dataTable.render.ellipsis(100)),
                DTColumnBuilder.newColumn('ExecutionCount').withTitle('Execution Count'),
                DTColumnBuilder.newColumn('MaxElapsedTime').withTitle('Max Elapsed Time'),
                DTColumnBuilder.newColumn('AvgElapsedTime').withTitle('Avg Elapsed Time'),
                DTColumnBuilder.newColumn('LogCreatedOn').withTitle('Log Created On'),
                DTColumnBuilder.newColumn('FrequencyPerSec').withTitle('Frequency per Sec')

            ];
        };


        
    });