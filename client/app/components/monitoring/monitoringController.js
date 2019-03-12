angular.module("main")
    .controller("MonitoringCtrl", function($scope, $http, api){

        $scope.onload = function(){

           // $http.get('/api/drivePhysicalSize')
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
                        console.log(drive);
                        var used = parseFloat(Math.round((drive.totalSpace_GB - drive.freeSpace_GB) * 100) / 100).toFixed(3);

                        $scope.driveData.labels.push('Drive ' + drive.drive + ':');

                        $scope.driveData.datasets[1].data.push(drive.totalSpace_GB);
                        $scope.driveData.datasets[1].backgroundColor.push('rgba(179, 179, 179, 2)');
                        $scope.driveData.datasets[1].borderColor.push('rgba(179, 179, 179, 2)');

                        $scope.driveData.datasets[0].data.push(used);
                        $scope.driveData.datasets[0].backgroundColor.push('rgba(248, 172, 89, 1)');
                        $scope.driveData.datasets[0].borderColor.push('rgba(248, 172, 89, 2)');

                        
                        /**
                        var driveData = {
                            labels: [
                                        'Used',
                                        'Free'
                                    ],
                            datasets: [{
                                    data: [used, drive.freeSpace_GB],
                                    backgroundColor: [
                                                        'rgba(179, 179, 179, 1)',
                                                        'rgba(248, 172, 89, 0.2)'
                                                    ],
                                    borderColor: [
                                                    'rgba(179, 179, 179, 1)',
                                                    'rgba(248, 172, 89, 1)'
                                                ],
                            }]
                        };

                        drive.driveData = driveData;
                        drive.percentage = ((drive.freeSpace_GB / drive.totalSpace_GB ) * 100).toFixed(2);

                        $scope.pieOptions = {
                                responsive: true
                        };
                        */
                        

                    });

                    /** bar chart */
                    $scope.barOptions = {
                        categoryPercentage: 0.5,
                        barPercentage: 1.0,
                        scales: {
                            xAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 500,
                                    stepSize: 50
                                }
                            }],
                            yAxes: [{
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 500,
                                    stepSize: 50
                                }
                            }]
                        }
                    };

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

        /*
        var instantiateChart = function(pieData, pieName){
            console.log('This: ', pieName);
            var id = "'" + pieName + "'";
            var pieCharts = {};
            var ctx = document.getElementById(id).getContext('2d');

            pieCharts[pieName] = new Chart(ctx, {
                type: 'pie',
                data: pieData,
                options: {
                    responsive: true
                }
            });
        } */
    });