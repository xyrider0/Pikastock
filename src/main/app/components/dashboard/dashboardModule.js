let dashboardModule = angular.module('App.dashboard', [])

dashboardModule.controller('dashboardController', ['$scope', function($scope){
    $scope.stock_list = $.get('/stocklist').then((response)=>{
        $scope.stock_list = response.data;
    });
}])

export default dashboardModule;