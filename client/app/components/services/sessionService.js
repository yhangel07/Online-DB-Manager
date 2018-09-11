(function (angular){
    
    function sessionService($log, sessionStorage){
        this._user = sessionStorage.getItem('session.user');

        this.getUser = function(){
            return this._user;
        };

        this.setUser = function(user){
            this._user = user;
            sessionStorage.setItem('session.user', user);
            return this;
        };

        this.destroy = function destroy(){
            this.setUser(null);
            this.setPw(null);
        };

        this.getPw = function(){
            return this._pw;
        };

        this.setPw = function(pw){
            this._pw = pw;
            return this;
        };

    }

    sessionService.$inject = ['$log', 'sessionStorage'];

    angular.module("main").service('session', sessionService);

})(angular);
