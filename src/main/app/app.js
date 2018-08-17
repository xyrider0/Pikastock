var routerApp = angular.module('routerApp', ['ui.router'], function(){
    ghost.init({
        clientId: "ghost-frontend",
        clientSecret: "fa26a7f1b444"
    });
})
.filter('to_trusted', ['$sce', function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    };
}]);

routerApp.controller('recentController', function($scope, $state, posts){
    $scope.posts = posts;
});

routerApp.controller('specificPostController', function($scope, singlePost){
    $scope.singlePostTitle = singlePost.title;
    $scope.singlePostHtml = singlePost.html;
});

routerApp.config(function($stateProvider, $urlRouterProvider){

    var homeState = {
        name: 'home',
        url: '/home',
        views:{
            '': {
                templateUrl: "app/components/posts/recentPosts.html",
                controller: 'recentController'
            }
        },
        resolve:{
            posts: function() {
                return $.get(ghost.url.api('posts', {limit: 'all'}))
                .then(function(data){
                   return data.posts;
                });
            }
        }
    }

    var recentState = {
        name: 'recent',
        url: '/recent',
        template: '<h1> Recent Posts Placeholder </h1>'
    }

    var learnState = {
        name: 'learn',
        url: '/learn',
        template: '<h1> Learn Sections Placeholder </h1>'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        template: '<h1> About Section Placeholder </h1>'
    }

    var specificPost = {
        name: 'specificPost',
        url: '/specificPost/:slug',
        templateUrl: "app/components/posts/specificPost.html",
        controller: 'specificPostController',
        resolve:{
            singlePost: function($stateParams) {
                return $.get(ghost.url.api('posts/slug/' + $stateParams.slug))
                .then(function(data){
                    return data.posts[0];
                })
                .fail(function (err){
                  console.log(err);
                });
            }
            //console.log(singlePost);
        }
    }

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state(homeState);
    $stateProvider.state(recentState);
    $stateProvider.state(learnState);
    $stateProvider.state(aboutState);
    $stateProvider.state(specificPost);
});