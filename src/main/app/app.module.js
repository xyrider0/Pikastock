angular.module('App', ['ui.router'])
    .config(function(){
        ghost.init({
            clientId: "ghost-frontend",
            clientSecret: "fa26a7f1b444"
        });
    })
    .filter('to_trusted', ['$sce', function($sce){
        return function(text){
            return $sce.trustAsHtml(text);
        };
    }])
    .run(function() {
        console.log('Finished loading dependencies and configuring modules')
    });


