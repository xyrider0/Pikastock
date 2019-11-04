let aboutModule = angular.module('App.about', []);

aboutModule.config(['$stateProvider', function($stateProvider){
    var aboutState = {
        name: 'base.about',
        url: '/about',
        template: '<h1> About Section Placeholder </h1>'
    }
    $stateProvider.state(aboutState);
}])

export default aboutModule;