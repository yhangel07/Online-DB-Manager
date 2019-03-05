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
            }).withBootstrap().withPaginationType('simple_numbers')
                .withOption('scrollX', 'auto')
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
            
            /**
            $scope.dtOptions = {
                fromFnPromise : function(){
                    var defer = $q.defer();
    
                    $http.get('/api/getMostCPU')
                    .then(function(obj){
                        console.log(obj.data);
                        defer.resolve(obj.data);
        
                    }).catch(function(err){
                        console.log('ERROR CPU: ' + err.stack);
                    });
    
                    return defer.promise;
                },
                paginationType: 'simple_numbers',
                responsive: true,
                scrollX: 'auto',
                scrollCollapse: true,
                autoWidth: false,
                integrateBootstrap: true,
                hasOverrideDom: true
            }; */
            
        };

       


        
    });