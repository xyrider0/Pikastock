function AppConfig($stateProvider, $urlRouterProvider){

    var baseState = {
        name: 'base',
        url: '',
        views: {
            'header': {
                templateUrl:"app/components/core/header/header.html"
                // controller:"headerController"
            },
            'content': {
                template:'<div ui-view></div>'
            },
            'footer': {
                templateUrl:"app/components/core/footer/footer.html",
                controller:"footerController"
            }
        }
    }

    var homeState = {
        name: 'base.home',
        url: '/home',
        templateUrl: "app/components/recent/recentView.html",
        controller: 'recentController'
    }

    var learnState = {
        name: 'base.learn',
        url: '/learn',
        template: '<h1> Learn Sections Placeholder </h1>'
    }

    var resourcesState = {
        name: 'base.resources',
        url: '/resources',
        template: '<h1> Resources Section Placeholder </h1>'
    }

    var specificPost = {
        name: 'base.article',
        url: '/article/:slug',
        templateUrl: "app/shared/article/articleView.html",
        controller: 'articleController',
        resolve:{
            article: [function() {
                return $.get('/article/:slug').success(
                    (data) => data.posts[0]
                )
            }]
        }
    }


    $stateProvider.state(baseState);
    $stateProvider.state(homeState);
    $stateProvider.state(learnState);
    $stateProvider.state(resourcesState);
    $stateProvider.state(specificPost);

    $urlRouterProvider.otherwise('/home');
};

AppConfig.$inject = ["$stateProvider", "$urlRouterProvide"];

export default AppConfig;
