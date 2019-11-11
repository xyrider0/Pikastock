function AppConfig($stateProvider, $urlRouterProvider){

    var baseState = {
        name: 'base',
        url: '',
        views: {
            'header': {
                templateUrl:"components/core/header/header.html"
                // controller:"headerController"
            },
            'content': {
                template:'<div ui-view></div>'
            },
            'footer': {
                templateUrl:"components/core/footer/footer.html",
                controller:"footerController"
            }
        }
    }

    var blogState = {
        name: 'base.blog',
        url: '/blog',
        templateUrl: "components/recent/recentView.html",
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
        templateUrl: "shared/article/articleView.html",
        controller: 'articleController',
        resolve:{
            article: [function() {
                return $.get('/article/:slug').success(
                    (data) => data.posts[0]
                )
            }]
        }
    }

    var dashboardState = {
        name: 'base.dashboard',
        url: '/dashboard',
        templateUrl: 'components/dashboard/dashboardView.html',
        controller: 'dashboardController'
    }

    var aboutState = {
        name: 'base.about',
        url: '/about',
        template: '<h1> About Section Placeholder </h1>'
    }


    $stateProvider.state(baseState);
    $stateProvider.state(blogState);
    $stateProvider.state(learnState);
    $stateProvider.state(resourcesState);
    $stateProvider.state(specificPost);
    $stateProvider.state(dashboardState);
    $stateProvider.state(aboutState);

    $urlRouterProvider.otherwise('');
};

AppConfig.$inject = ["$stateProvider", "$urlRouterProvide"];

export default AppConfig;
