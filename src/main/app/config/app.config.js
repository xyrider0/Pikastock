function AppConfig($stateProvider, $urlRouterProvider){
    
    ghost.init({
        clientId: "ghost-frontend",
        // clientSecret: "fa26a7f1b444",
        clientSecret: "53b841cbb53d"
    })

    var baseState = {
        name: 'base',
        url: '',
        views: {
            'header': {
                templateUrl:"app/components/core/header/header.html"
                // controller:"headerController"
            },
            'content': {
                template:'<div ui-view>Test</div>'
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
        controller: 'recentController',
        resolve:{
            posts: function() {
                return $.get(ghost.url.api('posts', {include:"post, authors, tags", filter:"authors:eric"})).then(
                    (data) => data.posts
                );
            }
        }
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
        //controller: 'articleController',
        resolve:{
            article: ['$stateParams', function($stateParams) {
                return $.get(ghost.url.api('posts/slug/' + $stateParams.slug)).then(
                    (articles) => articles.posts[0],
                    (err) => $state.go('base.home')
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
