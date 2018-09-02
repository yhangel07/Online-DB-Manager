angular.module("main")
    .service('ParseService', function($http, $q){

    var CurrentUser = {};

    this.getCurrentUser = function(){
        if(CurrentUser){
            return $q.when(CurrentUser);
        }else{
            return $q.rejected("No User Found");
        }
    }

    this.login = function(credentials){
        return $http.post('/api/login/', {
            username : credentials.username,
            password : credentials.password
            },{
                headers: { 'Content-Type' : 'application/json' }
            }).then(function(res){
                CurrentUser = res.data.data;
                return CurrentUser;
            });
    }
});