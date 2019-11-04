let articleModule = angular.module('App.article', []);

articleModule.controller('articleController', ['$scope', function($scope, article){
    $scope.articleTitle = article.title;
    $scope.articleHtml = article.html;
}]);

export default articleModule;