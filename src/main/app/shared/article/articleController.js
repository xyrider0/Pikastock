angular.module('App')
    .controller('specificPostController', function($scope, singlePost){
        $scope.singlePostTitle = singlePost.title;
        $scope.singlePostHtml = singlePost.html;
    });