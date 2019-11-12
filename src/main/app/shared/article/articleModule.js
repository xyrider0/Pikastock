let articleModule = angular.module('App.article', []);

articleModule.controller('articleController', ['$scope', '$stateParams', function($scope, $stateParams){
    var slug = $stateParams.slug;
    $.get('/article', {slug: slug}).then((post) =>{
        $scope.$apply(function(){
            $scope.articleTitle = post.title;
            $scope.articleHtml = post.html;
        });
    });
}]);

export default articleModule;