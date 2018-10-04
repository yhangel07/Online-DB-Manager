(function (angular){
    
    function sessionService($log, sessionStorage){
        this._user = sessionStorage.getItem('session.user');
        //this._pw = sessionStorage.getItem('session.pw');
        this._serverStatus = sessionStorage.getItem('session.serverStatus');
        this._serverInstance = sessionStorage.getItem('session.serverInstance');
        this._serverName = sessionStorage.getItem('session.serverName');
        this._serverDetails = sessionStorage.getItem('session.serverDetails');
        this._serverSelectedInstance = sessionStorage.getItem('session.selectedInstance');

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

        this.destroyServerSession = function destroyServerSession(){
            this.setServerStatus('Disconnected');
            this.setServerDetails(null);
            this.setServerName(null);
            this.setServerInstance(null, null);
        };

        this.getServerStatus = function(){
            return this._serverStatus;
        }

        this.setServerStatus = function(serverStatus){
            this._serverStatus = serverStatus;
            sessionStorage.setItem('session.serverStatus', serverStatus);
        };

        this.getServerInstance = function(){
            return this._serverInstance;
        };

        this.getSelectedInstance = function(){
            return this._serverSelectedInstance;
        };

        this.setServerInstance = function(serverInstance, selectedInstance){
            this._serverInstance = serverInstance;
            this._serverSelectedInstance = selectedInstance;
            sessionStorage.setItem('session.serverInstance', JSON.stringify(serverInstance));
            sessionStorage.setItem('session.selectedInstance', JSON.stringify(selectedInstance));
        };

        this.getServerName = function(){
            return this._serverName;
        };

        this.setServerName = function(serverName){
            this._serverName = serverName;
            sessionStorage.setItem('session.serverName', serverName);
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
