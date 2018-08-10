var routerApp = angular.module('routerApp', ['ui.router'])
    .filter('to_trusted', ['$sce', function($sce){
        return function(text){
            return $sce.trustAsHtml(text);
        };
    }]);

routerApp.controller('recentController', function($scope){

    $scope.postsHtml = [];
    $scope.posts = [];

    ghost.init({
        clientId: "ghost-frontend",
        clientSecret: "fa26a7f1b444"
    });

    $.get(ghost.url.api('posts', {limit:3})
    ).done(onSuccess).fail(function(err){
    console.log(err);
    });

    function onSuccess(data){
        $scope.postData = data;

        $.each(data.posts, function(i,post){
            $scope.postsHtml.push(post.html);
            $scope.posts.push(post);
        });
    }

});

routerApp.config(function($stateProvider){

    var homeState = {
        name: 'home',
        url: '/home',
        views:{

            '': {templateUrl: "app/components/posts/recentPosts.html",
                controller: 'recentController'}

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

    $stateProvider.state(homeState);
    $stateProvider.state(recentState);
    $stateProvider.state(learnState);
    $stateProvider.state(aboutState);

});