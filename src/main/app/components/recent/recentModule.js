let recentModule = angular.module('App.recent', []);

recentModule.controller('recentController', ['$scope', '$state', function($scope, $state){
    $.get('/posts').then(function(posts){
        console.log(posts);
        $scope.posts = posts;
    })

    $scope.dateGeneration = (ISOString)=>{
        return new Date(Date.parse(ISOString)).toDateString();
    }

    $scope.attachImage = (odd_even)=>{
        var lastCard = $('card-row').last();
        var lastCardImage = $('.card-image').last();

        if(odd_even % 2){
            lastCardImage.appendTo('card-row');
        }
        else{
            lastCardImage.prependTo('card-row');
        }
    }
}]);

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

export default recentModule;
