angular.module("main")
    .controller("appLogsCtrl", function($scope, $filter, logs, DTOptionsBuilder, DTColumnBuilder, $q){

        $scope.onload = function(){
                       
            $scope.logsDTOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();

                logs.getLogs()
                .then(function(obj){
                    defer.resolve(obj.data);
    
                }).catch(function(err){
                    console.log('ERROR Logs: ' + err.stack);
                });

                return defer.promise;
            }).withBootstrap().withPaginationType('simple_numbers')
            .withDOM("<'row m-t-lg'<'col-sm-9'i><'col-sm-3 text-right'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-6'><'col-sm-6 text-right'p>>");

            
            var myDateFormat = {
                angularjs: 'dd/MM/yyyy',        // My date format in angularjs way
                momentjs: 'DD/MM/YYYY'   // The same date format in momentjs way
            }

            var myTimeFormat = {
                angularjs: 'HH:mm:ss',
                momentjs: 'h:mm:ss'
            }
            
            // Setting "Ultimate Date / Time sorting" plugin with momentjs format
            //jQuery.fn.dataTable.moment(myDateFormat.momentjs);
            
            // DTColumnBuilder.newColumn('StartDate')
            //     .renderWith(function(data, type, full) {
            //         return this.$filter('date')(data, myDateFormat.angularjs);   // Angularjs date filter
            //     });

            $scope.logsDTColumns = [
                DTColumnBuilder.newColumn('LoginName').withTitle('Name').renderWith($.fn.dataTable.render.ellipsis(100)),
                DTColumnBuilder.newColumn('activity').withTitle('Application Activity'),
                DTColumnBuilder.newColumn('date_time').withTitle('Date').renderWith(function(data, type, full) {
                    return $filter('date')(data, myDateFormat.angularjs);   // Angularjs date filter
                }),
                DTColumnBuilder.newColumn('date_time').withTitle('Time').renderWith(function(data, type, full) {
                    return $filter('date')(data, myTimeFormat.angularjs);   // Angularjs time filter
                })

            ];
        };


        
    });