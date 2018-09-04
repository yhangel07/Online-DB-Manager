(function (angular){

    function sessionStorageServiceFactory($window){
        if($window.sessionStorage){
            return $window.sessionStorage;
        }
        throw new Error('Session storage support is needed');
    }

    sessionStorageServiceFactory.$inject = ['$window'];

    angular.module("main").factory('sessionStorage', sessionStorageServiceFactory);
})(angular);
