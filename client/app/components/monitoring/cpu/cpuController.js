angular.module("main")
    .controller("CPUCtrl", function($scope, $http, logs, DTOptionsBuilder, DTColumnBuilder, $q, api){
        $scope.onload = function(){
            /**
            $scope.highCPU = [];

            $scope.dtOptions = DTOptionsBuilder
                .withPaginationType('simple_numbers')
                .withDisplayLength(2)
                .withBootstrap()
                .withDOM("<'row m-t-lg'<'col-sm-9'i><'col-sm-3'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-9'><'col-sm-3'p>>");

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(1).renderWith($.fn.dataTable.render.ellipsis(50))
            ];

            api.getMostCPU()
                .then(function(obj){
                    $scope.highCPU = obj.data;
                }).catch(function(err){
                    console.log('ERROR CPU: ' + err.stack);
                }); */


            
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

            api.getMostCPU()
                .then(function(obj){
                    console.log(obj.data);
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR CPU: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap().withPaginationType('simple_numbers')
                .withOption('scrollX', 'auto')
                // .withDisplayLength(2)

                .withDOM("<'row m-t-lg'<'col-sm-9'i><'col-sm-3'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-9'><'col-sm-3'p>>");
            

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('ObjectName').withTitle('Object Name'),
                DTColumnBuilder.newColumn('TextData').withTitle('Text Data').renderWith($.fn.dataTable.render.ellipsis(50)),
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