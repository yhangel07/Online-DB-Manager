var app = angular.module("App",['modules', 'ui.router']);

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
            resolve: {
                resolvedUser: CheckForAuthenticatedUser
            }
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
                }
            }
            ,
            resolve: {
                CurrentUser: function(resolvedUser){
                    return resolvedUser;
                }
            }
        });

        function CheckForAuthenticatedUser(ParseService, $state) {
            return ParseService.getCurrentUser().then(function (_user) {
                // if resolved successfully return a user object that will set
                // the variable `resolvedUser`
                return _user;
            }, function (_error) {
                $state.go('login');
            })
        }



}).run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});