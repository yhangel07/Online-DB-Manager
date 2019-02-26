angular.module("main")
    .controller("CPUCtrl", function($scope, $http, logs, DTOptionsBuilder, DTColumnBuilder, $q){

        $scope.onload = function(){
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

                $http.get('/api/getMostCPU')
                .then(function(obj){
                    console.log(obj.data);
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR CPU: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap().withPaginationType('simple_numbers');

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('ObjectName').withTitle('Object Name'),
                DTColumnBuilder.newColumn('TextData').withTitle('Text Data').renderWith($.fn.dataTable.render.ellipsis(100)),
                DTColumnBuilder.newColumn('DiskReads').withTitle('Disk Reads'),
                DTColumnBuilder.newColumn('MemoryReads').withTitle('Memory Reads'),
                DTColumnBuilder.newColumn('Executions').withTitle('Executions'),
                DTColumnBuilder.newColumn('TotalCPUTime').withTitle('Total CPU Time'),
                DTColumnBuilder.newColumn('AverageCPUTime').withTitle('Avg. CPU Time'),
                DTColumnBuilder.newColumn('DiskWaitAndCPUTime').withTitle('Disk Wait And CPU Time'),
                DTColumnBuilder.newColumn('MemoryWrites').withTitle('Memory Writes'),
                DTColumnBuilder.newColumn('DateCached').withTitle('Date Cached'),
                DTColumnBuilder.newColumn('DatabaseName').withTitle('Database Name'),
                DTColumnBuilder.newColumn('LastExecutionTime').withTitle('Last Execution Time')
            ];
        };


        
    });