(function (angular){
    
    function sessionService($log, sessionStorage){
        this._user = sessionStorage.getItem('session.user');

        this.getUser = function(){
            return this._user;
        };

        this.setUser = function(user){
            this._user = user;
            console.log(this._user);
            sessionStorage.setItem('session.user', user);
            return this;
        };

        this.destroy = function destroy(){
            this.setUser(null);
        };
    }

    sessionService.$inject = ['$log', 'sessionStorage'];

    angular.module("main").service('session', sessionService);

})(angular);
