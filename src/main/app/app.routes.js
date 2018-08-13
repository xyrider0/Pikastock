routerApp.config(function($stateProvider){

    var homeState = {
        name: 'home',
        url: '/home',
        views:{

            '': {templateUrl: "app/components/posts/recentPosts.html",
                controller: 'recentController'}

        }
    }

    var recentState = {
        name: 'recent',
        url: '/recent',
        template: '<h1> Recent Posts Placeholder </h1>'
    }

    var learnState = {
        name: 'learn',
        url: '/learn',
        template: '<h1> Learn Sections Placeholder </h1>'
    }

    var aboutState = {
        name: 'about',
        url: '/about',
        template: '<h1> About Section Placeholder </h1>'
    }

    $stateProvider.state(homeState);
    $stateProvider.state(recentState);
    $stateProvider.state(learnState);
    $stateProvider.state(aboutState);
});