(function (angular){


    function LogsService($http, session){
        
        this.createLog = function(userActivity){
            var logDetails = {
                activity: userActivity
            };

            if(session.getUser() == null){
                logDetails.username = "Unknown User"
            }else{
                logDetails.username = session.getUser();
            }
            
            return $http.post('/api/insertLogs/', logDetails)
                .then(function(res){
                    console.log('Logs status: ' , res.status);
                }).catch(function(err){
                    console.log('Error logging: ' , err);
                });
        };
    }

    LogsService.$inject = ['$http', 'session'];

    angular.module('main').service('logs', LogsService);
})(angular);

