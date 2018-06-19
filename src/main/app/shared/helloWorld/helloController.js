var app = angular.module("helloAng", []);
app.controller("HelloController", function($scope) {
  $scope.message = "Hello, AngularJS";
})