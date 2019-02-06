(function (angular){

    function AuthService($http, session, logs){

        /**
        *   check Logged In
        *   @returns boolean
        */
        this.isLoggedIn = function isLoggedIn(){
            //return (session.getUser() !== 'null' || session.getUser() !== null);
            return session.getUser() !== 'null';
        }

        /**
        * Log in
        * @param credentials
        * @returns {*|Promise}
        */
        this.logIn = function(credentials){
            return $http.post('/api/login', credentials)
                .then(function(res){
                    var data = res.data;
                    return data;
                    //session.setAccessToken(data.accessToken);
                }).catch(function(err){
                    console.log(err);
                });
        };

        /**
         * Log out
         * @returns {*|Promise}
         */
        this.logOut = function(){
            return $http.get('/api/logout')
                .then(function(res){
                    logs.createLog('Logout');
                    session.destroy();
                });
        };
    }

    AuthService.$inject = ['$http', 'session', 'logs'];

    angular.module("main").service('auth', AuthService);
})(angular);