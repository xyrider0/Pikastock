angular.module('App')
    .config([$stateProvider, $urlRouterProvider, function($stateProvider, $urlRouterProvider){
        var baseState = {
            name: 'base',
            url: '/base',
            views: {
                'header': {
                    templateUrl:"app/layout/header.html",
                    controller:"baseController"
                },
                'content': {
                    template:"<div ui-view></div>"
                },
                'footer': {
                    templateUrl:"app/layout/footer.html",
                    controller:"footerController"
                }
            }
        }

        var homeState = {
            name: 'base.home',
            url: '/home',
            views:{
                '': {
                    templateUrl: "app/components/posts/recentPosts.html",
                    controller: 'recentController'
                }
            },
            resolve:{
                posts: function() {
                    return $.get(ghost.url.api('posts', {include:"post, authors, tags", filter:"authors:eric"}))
                    .then(function(data){
                        console.log(data);
                       return data.posts;
                    });
                }
            }
        }

        var learnState = {
            name: 'base.learn',
            url: '/learn',
            template: '<h1> Learn Sections Placeholder </h1>'
        }

        var aboutState = {
            name: 'base.about',
            url: '/about',
            template: '<h1> About Section Placeholder </h1>'
        }

        var resourcesState = {
            name: 'base.resources',
            url: '/resources',
            template: '<h1> Resources Section Placeholder </h1>'
        }


        var specificPost = {
            name: 'base.specificPost',
            url: '/specificPost/:slug',
            templateUrl: "app/components/posts/specificPost.html",
            controller: 'specificPostController',
            resolve:{
                singlePost: function($stateParams) {
                    return $.get(ghost.url.api('posts/slug/' + $stateParams.slug))
                    .then(function(data){
                        return data.posts[0];
                    })
                    .fail(function (err){
                      console.log(err);
                    });
                }
            }
        }

        $urlRouterProvider.otherwise('/base');

        $stateProvider.state(baseState);
        $stateProvider.state(homeState);
        $stateProvider.state(learnState);
        $stateProvider.state(aboutState);
        $stateProvider.state(resourcesState);
        $stateProvider.state(specificPost);
    }]);
