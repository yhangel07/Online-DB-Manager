(function (angular){
    function apiCallsService($http){
        // this.getServerUser = function(){
        //     return $http.get()
        // }

        this.getDiskSpace = function(){
            return $http.get('/api/drivePhysicalSize');
        };
    
        this.getLogspace = function(){
            return $http.get('/api/getLogSpace');
        };

        this.getMostCPU = function(){
            return $http.get('/api/getMostCPU');
        };
        
        this.getDBinfo = function(){
            return $http.get('/api/getLogSpace');
        };

    }

    apiCallsService.$inject = ['$http'];

    angular.module('main').service('api', apiCallsService);


})(angular);