
var app = angular.module("App",['modules', 'ui.router', 'ngSanitize', 'autoCompleteModule']);

app.config(function($stateProvider, $urlRouterProvider){
    var dirPath = "../app/components/";

    $urlRouterProvider.otherwise('login');

    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: dirPath + 'login/login.html',
            controller: 'LoginCtrl'
        })
        .state('app',{
            url: '/app',
            template: '<ui-view/>',
            abstract: true,
        })
        .state('app.dashboard', {
            url: '/dashboard',
            views: {
                '': { 
                    templateUrl: dirPath + 'dashboard/dashboard.html',
                    controller: 'DashboardCtrl',
                },
                'navigation@app.dashboard': {
                    templateUrl: dirPath + 'navigation/navigation.html',
                    controller: 'NavCtrl'
                },
                'header@app.dashboard':{
                    templateUrl: dirPath + 'header and footer/header.html',
                    controller: 'HeaderFooterCtrl'
                },
                'footer@app.dashboard':{
                    templateUrl: dirPath + 'header and footer/footer.html',
                    controller: 'HeaderFooterCtrl'
                },
                'cloning@app.dashboard':{
                    templateUrl: dirPath + 'user management/cloning/cloning.html',
                    controller: 'CloningCtrl'
                },
                'modal@app.dashboard':{
                    templateUrl: dirPath + 'modals/modals.html',
                    controller: 'ModalCtrl'
                },
                'disconnected@app.dashboard':{
                    templateUrl: dirPath + 'pages/disconnected.html'
                }
            },
            resolve: {
                checkStatus: function ($state, $q, $rootScope){
                    var deffered = $q.defer();
                    if($rootScope.auth.isLoggedIn()){
                        deffered.resolve();
                    }else{
                        deffered.reject();
                    }
                    return deffered.promise.catch(function(){
                        $state.go('login');
                    });
                }
            }
        });
    
}).run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});