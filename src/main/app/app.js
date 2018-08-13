var routerApp = angular.module('routerApp', ['ui.router'])
    .filter('to_trusted', ['$sce', function($sce){
        return function(text){
            return $sce.trustAsHtml(text);
        };
    }]);

routerApp.controller('recentController', function($scope, $state){

    $scope.postsHtml = [];
    $scope.posts = [];
    $scope.ghostTitle = 'None';

    ghost.init({
        clientId: "ghost-frontend",
        clientSecret: "fa26a7f1b444"
    });

    $.get(ghost.url.api('posts', {limit:10})
    ).done(onSuccess).fail(function(err){
    console.log(err);
    });

    function onSuccess(data){
        $scope.postData = data;

        $.each(data.posts, function(i,post){
            $scope.postsHtml.push(post.html);
            $scope.posts.push(post);
        });
    };

    function goToPost(){
        $state.go('specificPost',{
            title: $scope.title
        })
    }
});

routerApp.controller('specificPostController', function($scope, singlePost){
    $scope.singlePostTitle = singlePost.title;
    $scope.singlePostHtml = singlePost.html;
//    console.log($stateParams.title);
//
//    $.get(ghost.url.api('posts', {title: $stateParams.title}))
//    .done(function(data){
//        $scope.singlePost=data.posts[0].html;
//        $scope.$applyAsync();
//    });
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

    var specificPost = {
        name: 'specificPost',
        url: '/specificPost:title',
        templateUrl: "app/components/posts/specificPost.html",
        controller: 'specificPostController',
        resolve:{
            singlePost: function($stateParams) {
                return $.get(ghost.url.api('posts', {title: $stateParams.title}))
                .then(function(data){
                    return data.posts[0];
                });
            }
            //console.log(singlePost);
        }
    }

    $stateProvider.state(homeState);
    $stateProvider.state(recentState);
    $stateProvider.state(learnState);
    $stateProvider.state(aboutState);
    $stateProvider.state(specificPost);
});

//function PostService($http, postTitle){
//    function getPostHtml(inputTitle){
//        return $.get(ghost.url.api('posts', {title: inputTitle}))
//        .done(function(data){
//            return data.posts[0].html;
//        })
//    }
//    return {
//        postHtml: getPostHtml(postTitle);
//    };
//}