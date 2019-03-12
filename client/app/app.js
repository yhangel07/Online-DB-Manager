
var app = angular.module("App",['modules', 'ui.router', 'ngSanitize', 'angular-ladda', 'tc.chartjs', 'datatables', 'ngResource', 'datatables.bootstrap']);

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
            resolve: {
                appState: function ($state, $q, $rootScope){
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
        })
        .state('app.dashboard', {
            url: '/dashboard',
            abstract: true,
            views: {
                '': { 
                    templateUrl: dirPath + 'dashboard/dashboard.html',
                    controller: 'MainCtrl'
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
                'modal@app.dashboard':{
                    templateUrl: dirPath + 'modals/modals.html',
                    controller: 'ModalCtrl'
                }
                // ,'cloningTrial@app.dashboard':{
                //     templateUrl: dirPath + 'user management/cloning/cloning.html',
                //     controller: 'CloningCtrl1'
                // } //TODO remove after dev
            },
            resolve: {
                parentState: function ($state, $q, $rootScope){
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
        }).state('app.dashboard.dashboard-view', {
            url: '',
            templateUrl: dirPath + 'dashboard/dashboard-view.html',
            resolve: {
                childState: function ($state, $q, $rootScope){

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
            },
            //abstract: true,
            controller: 'DashboardCtrl'
            
        }).state('app.dashboard.cloning', {
            templateUrl: dirPath + 'user management/cloning/cloning.html',
            controller: 'CloningCtrl1'
        }).state('app.dashboard.newUser', {
            templateUrl: dirPath + 'user management/newUser/newUser.html',
            controller: ''
        }).state('app.dashboard.provisioning', {
                templateUrl: dirPath + 'user management/provisioning/provisioning.html',
                controller: ''
        }).state('app.dashboard.databaseMonitoring', {
            templateUrl: dirPath + 'monitoring/monitoring.html',
            controller: 'MonitoringCtrl'
        }).state('app.dashboard.cpu', {
            templateUrl: dirPath + 'monitoring/cpu/cpu.html',
            controller: 'CPUCtrl'
        }).state('app.dashboard.longRunning', {
            templateUrl: dirPath + 'monitoring/long running/longRunning.html',
            controller: 'longRunningCtrl'
        });
    
}).run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})

      
.config(function (laddaProvider) { });