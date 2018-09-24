(function (angular){
    
    function sessionService($log, sessionStorage){
        this._user = sessionStorage.getItem('session.user');
        //this._pw = sessionStorage.getItem('session.pw');
        this._serverStatus = sessionStorage.getItem('session.serverStatus');
        this._serverDetails = sessionStorage.getItem('session.serverDetails');

        this.getUser = function(){
            return this._user;
        };

        this.setUser = function(user){
            this._user = user;
            sessionStorage.setItem('session.user', user);
            return this;
        };

        this.getPw = function(){
            return this._pw;
        };

        this.setPw = function(pw){
            this._pw = pw;
            //sessionStorage.setItem('session.pw', pw);
            return this;
        };

        this.destroy = function destroy(){
            this.setUser(null);
            this.setPw(null);
            this.setServerStatus(null);
        };

        this.getServerStatus = function(){
            return this._serverStatus;
        }

        this.setServerStatus = function(serverStatus){
            this._serverStatus = serverStatus;
            sessionStorage.setItem('session.serverStatus', serverStatus);
        };

        this.getServerDetails = function(){
            return this._serverDetails;
        };

        this.setServerDetails = function(serverDetails){
            this._serverDetails = serverDetails;
            sessionStorage.setItem('session.serverDetails', serverDetails);
        };
    }

    sessionService.$inject = ['$log', 'sessionStorage'];

    angular.module("main").service('session', sessionService);

})(angular);
