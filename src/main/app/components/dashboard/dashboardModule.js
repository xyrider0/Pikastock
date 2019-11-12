let dashboardModule = angular.module('App.dashboard', [])

dashboardModule.controller('dashboardController', ['$scope', function($scope){
    $.get('/stocklist').then((response)=>{
        $scope.$apply(()=>{
            $scope.stock_list = response;
        });
    });

    $scope.addStock = function(){
        
    };
}])

export default dashboardModule;