/*
var app = angular.module('PikasstockApp', ['ngRoute']);

app.controller("PostCtrl", ['$scope', function($scope)
{
    $scope.ghostVerification = {
        clientID: "ghost-frontend",
        clientSecret: "53b841cbb53d"
    };

    $scope.posts = $.get(ghost.url.api('posts', {limit:3}))
    .done(onSuccess)
    .fail(function(err){
        $scope.postTitles.append('<li> Nothing Received </li>');
        console.log(err);
    });

    function onSuccess(data){
        $.each(data.posts, function(i, post){
            $scope.postTitles.append('<li>' + post.title + '</li>');
        });
    }
}]);*/
