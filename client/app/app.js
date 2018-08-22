var app = angular.module("App",['modules', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
    var dirPath = "../app/components/";

    $urlRouterProvider.otherwise('login');

    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: dirPath + 'login/login.html'
        })

        .state('dashboard', {
            url: '/dashboard',
            views: {
                '': { templateUrl: dirPath + 'dashboard/dashboard.html'},

                'navigation@dashboard': {
                    templateUrl: dirPath + 'navigation/navigation.html',
                    controller: 'NavCtrl'
                },
                'header@dashboard':{
                    templateUrl: dirPath + 'header and footer/header.html',
                    controller: 'HeaderFooterCtrl'
                },
                'footer@dashboard':{
                    templateUrl: dirPath + 'header and footer/footer.html',
                    controller: 'HeaderFooterCtrl'
                },
                'cloning@dashboard':{
                    templateUrl: dirPath + 'user management/cloning/cloning.html',
                    controller: 'CloningCtrl'
                },
                'modal@dashboard':{
                    templateUrl: dirPath + 'modals/modals.html',
                    controller: 'ModalCtrl'
                }
            }
        });


});