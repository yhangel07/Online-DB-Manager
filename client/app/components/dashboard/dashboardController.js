angular.module("main")
    .controller("DashboardCtrl", function($scope, api, session, DTOptionsBuilder, DTColumnBuilder, $q, $http){

        

        // $scope.$watch(function () {
        //     return session.getServerDetails();
        //  }, function (newVal) {
        //      if(newVal){
        //         $scope.diskSpace();
        //         //$scope.logSpace();
        //         //$scope.highCPU();
        //      }
        //  }, true);

        $scope.callApi = function(){
            $scope.diskSpace();
            $scope.highCPU();
            $scope.longRunning();
            $scope.dbInfo();
        };

        $scope.diskSpace = function(){
            api.getDiskSpace()
                .then(function(obj){
                $scope.drives = obj.data;
                    $scope.driveData = {
                        datasets: [{
                            backgroundColor: [],
                            borderColor: [],
                            data: [],
                            label : 'Used Drive Space'
                        },
                        {
                            backgroundColor: [],
                            borderColor: [],
                            data: [],
                            label : 'Total Drive Space'
                        }],
                        labels : []
                    };

                    angular.forEach(obj.data, function(drive){
                        //console.log(drive);
                        var used = parseFloat(Math.round((drive.totalSpace_GB - drive.freeSpace_GB) * 100) / 100).toFixed(3);

                        $scope.driveData.labels.push('Drive ' + drive.drive + ':');

                        $scope.driveData.datasets[1].data.push(drive.totalSpace_GB);
                        $scope.driveData.datasets[1].backgroundColor.push('rgba(179, 179, 179, 2)');
                        $scope.driveData.datasets[1].borderColor.push('rgba(179, 179, 179, 2)');

                        $scope.driveData.datasets[0].data.push(used);
                        $scope.driveData.datasets[0].backgroundColor.push('rgba(248, 172, 89, 1)');
                        $scope.driveData.datasets[0].borderColor.push('rgba(248, 172, 89, 2)');

                    });

                    $scope.hbarOptions = {
                        categoryPercentage: 0.5,
                        barPercentage: 1.0,
                        scales: {
                            xAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 500,
                                    stepSize: 50
                                }
                            }],
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 500,
                                    stepSize: 50
                                }
                            }]
                        }
                    };

                }).catch(function(err){
                    console.log(err);
                });
        };

        // $scope.logSpace = function(){
        //     api.getLogspace()
        //         .then(function(obj){
        //             $scope.logSpaceData = obj.data;
        //             console.log($scope.logSpaceData);
        //         }).catch(function(err){
        //             console.log("ERROR log space: " + err.stack);
        //         });
        // };

        $scope.highCPU = function(){
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
            }).withBootstrap()
                .withDOM("tr")
                .withDisplayLength(3);
            
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('TextData').withTitle('Text Data').renderWith($.fn.dataTable.render.ellipsis(40)),
                DTColumnBuilder.newColumn('TotalCPUTime').withTitle('CPU Time')
            ];

            $scope.dtInstance = {};
        };

        $scope.longRunning = function(){
            $scope.dtOptionsLong = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

                $http.get('/api/checkLongRunning')
                .then(function(obj){
                    console.log(obj.data);
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR Long Running: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap()
                .withDisplayLength(3)
                .withDOM("tr");


            $scope.dtColumnsLong = [
                DTColumnBuilder.newColumn('QueryName').withTitle('Query Name').renderWith($.fn.dataTable.render.ellipsis(40)),
                DTColumnBuilder.newColumn('AvgElapsedTime').withTitle('Avg Elapsed Time')
            ];

            $scope.dtInstanceLong = {};

        };

        $scope.dbInfo = function(){
            $scope.dtOptionsInfo = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

                api.getDBinfo()
                .then(function(obj){
                    console.log(obj.data);
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR Long Running: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap()
                .withDOM("tr");


            $scope.dtColumnsInfo = [
                DTColumnBuilder.newColumn('Database Name').withTitle('Database Name'),
                DTColumnBuilder.newColumn('DB Size (Mb)').withTitle('DB Size'),
                DTColumnBuilder.newColumn('Log Size (Mb)').withTitle('Log Size'),
                DTColumnBuilder.newColumn('Log Free %').withTitle('Log Free %')

            ];

            $scope.dtInstanceInfo = {};
            
        };
    });