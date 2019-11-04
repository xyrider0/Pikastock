let recentModule = angular.module('App.recent', []);

recentModule.controller('recentController', ['$scope', '$state', function($scope, $state, posts){
    $scope.posts = posts;

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

export default recentModule;
