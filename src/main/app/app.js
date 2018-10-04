var routerApp = angular.module('routerApp', ['ui.router'], function(){
    ghost.init({
        clientId: "ghost-frontend",
        clientSecret: "fa26a7f1b444"
    });
})
.filter('to_trusted', ['$sce', function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    };
}]);

routerApp.controller('recentController', function($scope, $state, posts){
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
});

routerApp.controller('baseController', function($scope){

    $scope.marketSegments = [];
    initVariables();
    initCanvas();
    initListeners();

    $scope.set = function($event) {
        $scope.sectorAnchor = $scope.sectorSet;
        $scope.$apply();
        $('#market-sector-header').css("color", $scope.textColor);
        drawCircleMenu($scope.outerRadius, $scope.outerRadius, $scope.ctx, $scope.innerRadius, $scope.outerRadius, $scope.sectorAngle, $scope.angleWidth, $scope.marketSegments, $scope.sectorAngleAnchor);
    }

    $scope.update = ($event)=>{
        if($event == false || typeof $event === 'undefined'){
            var mouse_x = 0;
            var mouse_y = 0;
        }
        else{
            var mouse_x = $event.clientX - $scope.circleMenuCanvas.left;
            var mouse_y = $event.clientY - $scope.circleMenuCanvas.top;
        }

        var angleOffset = $scope.sectorAngleAnchor;
        var mangle = calcAngle($scope.outerRadius, mouse_x, mouse_y);
        var mradius = calcRadius($scope.outerRadius, mouse_x, mouse_y);

        drawCircleMenu(mangle, mradius, $scope.ctx, $scope.innerRadius, $scope.outerRadius, angleOffset, $scope.angleWidth, $scope.marketSegments);
    }

    function initVariables(){
        $scope.marketSegments = ["Health Care", "Finance", "Consumables", "Real Estate", "Utilities", "Energy", "Materials", "Tech"];
        //                    blue     green     grey    pink    yellow    red    brown     purple
        //$scope.selectColor =["#c6dbe2", "#cbe2c6", "#e2c5c5", "pink", "#e2dfc6", "#e2c6c6", "#d3d2d5", "#cec6e2"];
        $scope.selectColor = ["blue", "green", "salmon", 'pink', 'steelblue', 'cyan', 'seagreen', 'skyblue'];
        $scope.outerRadius = 250;
        $scope.innerRadius = $scope.outerRadius * 0.3;
        $scope.angleWidth = 2*Math.PI/$scope.marketSegments.length;
        $scope.sectorSet;
        $scope.sectorAngle;
        $scope.sectorAngleAnchor = $scope.angleWidth/2;
        $scope.sectorAnchor = $scope.marketSegments[$scope.marketSegments.length - 1];
        $scope.raf;
        $scope.eventInProgress = false;
        $scope.innerColor ="silver";
        $scope.textColor;
    }

    function initCanvas(){
        var myCanvas = document.getElementById('circle-menu');
        $scope.circleMenuCanvas = myCanvas.getBoundingClientRect();
        $scope.ctx = myCanvas.getContext('2d');
        $scope.my_gradient=$scope.ctx.createRadialGradient($scope.outerRadius,$scope.outerRadius,0,$scope.outerRadius,$scope.outerRadius,$scope.outerRadius);
        $scope.my_gradient.addColorStop(0,"gray");
        $scope.my_gradient.addColorStop(1,"black");
        window.onresize = function(){
           initCanvas();
        }
    }

    function initListeners(){
        $('#circle-menu').mousemove(function(event){
            event.stopPropagation();
            $scope.update(event);
        });
        $('#circle-menu').click(function(event){
            $scope.set(event);
        })
    }

    function drawAnimatedArcs(canvasContext, canvas, circleRadius, drawRadius, angleWidth){
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.beginPath(circleRadius, circleRadius);
        canvasContext.translate()
    }

    function drawCircleMenu(mangle, mradius, canvasContext, innerRadius, outerRadius, angleOffset, angleWidth, marketSegments, startOffset = -1){
        var angleOffsetStep;
        var angleOffsetStepWidth;
        if(startOffset == -1 || Math.abs(angleOffset - startOffset) < Math.PI/180){
            angleOffsetStep = angleOffset;
        }
        else if(angleOffset > startOffset){
            angleOffsetStep = startOffset;
            $scope.eventInProgress = true;
        }
        else{
            angleOffsetStep = startOffset - (Math.PI * 2);
            $scope.eventInProgress = true;
        }
        angleOffsetStepWidth = (angleOffset - angleOffsetStep)/5;
        if(angleOffsetStepWidth < 0.001){
            angleOffsetStep = angleOffset;
        }

        if(!($scope.eventInProgress && startOffset == -1)){
            var persistentColor;
            for(var i = 0; i < marketSegments.length; i++)
            {
                var startAngle = (i* angleWidth + angleOffsetStep) %(Math.PI * 2);
                var thisAngle = Math.PI*2 - ((i*angleWidth + angleWidth/2) % (Math.PI*2));
                var selectColor = $scope.selectColor;
                var innerColor = $scope.innerColor;
                var color = $scope.my_gradient;
                var textColor = "white";
                if(startAngle >= Math.PI*2 - angleWidth){
                    textColor = selectColor[i];
                    persistentColor = textColor;
                    color = "#555555";
                }
                if(startOffset == -1 && inAngle(mangle, startAngle, angleWidth) && inRadius(mradius, innerRadius, outerRadius)){
                    $scope.sectorAngle = thisAngle;
                    $scope.sectorSet = marketSegments[i];
                    textColor = selectColor[i];
                    $scope.textColor = textColor;
                }
                drawCircleMenuSegment(canvasContext, innerRadius, outerRadius, startAngle, angleWidth, color, marketSegments[i], textColor);
            }
            drawInnerCircle(canvasContext, innerRadius, outerRadius, innerColor);
            canvasContext.save();
            writeInnerLabel(canvasContext, outerRadius);
            canvasContext.restore();
            if((angleOffsetStep + angleOffsetStepWidth)%(Math.PI * 2) < angleOffset && $scope.sectorSet != 'Sector'){
                $scope.raf = window.requestAnimationFrame(function(){drawCircleMenu(mangle, mradius, canvasContext, innerRadius, outerRadius, angleOffset, angleWidth, marketSegments, startOffset + angleOffsetStepWidth)});
                $scope.sectorAngleAnchor = $scope.sectorAngle;
            }
            else{
                window.cancelAnimationFrame($scope.raf);
                $scope.eventInProgress = false;
            }
        }
    }

//    function enlargeCircleMenu(canvasContext, innerRadius, outerRadius, angleWidth, innerColor, outerColor)
//    {
//        drawOuterSegment(canvasContext, outerRadius, -angleWidth/2, angleWidth, outerColor);
//        canvasContext.save();
//        drawInnerCircle(canvasContext, innerRadius, outerRadius, innerColor);
//        canvasContext.restore();
//    }

    function drawCircleMenuSegment(canvasContext, innerRadius, outerRadius, startAngle, angleWidth, color, text, textColor){
        drawOuterSegment(canvasContext, outerRadius, startAngle, angleWidth, color);
        canvasContext.save();
        writeOuterLabel(canvasContext, innerRadius, outerRadius, startAngle, angleWidth, text, textColor);
        canvasContext.restore();
    }

    function drawOuterSegment(canvasContext, outerRadius, startAngle, angleWidth, color){
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.moveTo($scope.outerRadius, $scope.outerRadius);
        canvasContext.arc(outerRadius, outerRadius, outerRadius, startAngle, startAngle + angleWidth, false);
        canvasContext.lineTo(outerRadius, outerRadius);
        canvasContext.fill();
    }

    function writeOuterLabel(canvasContext, innerRadius, outerRadius, startAngle, angleWidth, text, textColor){
        canvasContext.translate(outerRadius, outerRadius);
        let centerAngle = startAngle + angleWidth/2;
        let centerRadius = (innerRadius + outerRadius)/2;
        canvasContext.beginPath();
        canvasContext.font = "20pt Arial";
        canvasContext.fillStyle = textColor;
        canvasContext.textAlign = 'center';
        canvasContext.textBaseline='middle';
        canvasContext.fillText(text, Math.cos(centerAngle)*centerRadius, Math.sin(centerAngle)*centerRadius);
    }

    // Color in Hex
    function drawInnerCircle(canvasContext, innerRadius, outerRadius, color="#f2f2f2"){
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(outerRadius, outerRadius, innerRadius, 0, 2*Math.PI, false);
        canvasContext.fill();
    }

    function writeInnerLabel(canvasContext, outerRadius, text = 'Sector'){
        canvasContext.translate(outerRadius, outerRadius);
        canvasContext.beginPath();
        canvasContext.font = "18pt Calibri";
        canvasContext.fillStyle = 'black';
        canvasContext.textAlign = 'center';
        canvasContext.textBaseline='middle';
        canvasContext.fillText(text, 0, 0);

    }

    function calcRadius(radius, x, y){
        return Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2));
    }

    function calcAngle(radius, x, y){
        return (-Math.atan2(x-radius, y-radius)+Math.PI*2.5)%(Math.PI*2);
    }

    function inAngle(angle, startAngle, angleWidth){
        return ((angle > startAngle  && angle < (startAngle + angleWidth)) ||
               ((angle > startAngle  || angle < (startAngle + angleWidth)%(Math.PI*2)) &&
               startAngle + angleWidth > Math.PI * 2));
    }

    function inRadius(radius, innerRadius, outerRadius){
        return radius <= outerRadius && radius >= innerRadius;
    }
});

routerApp.controller('footerController', function($scope){

    $("#sendFeedbackButton").click(function(){
        $("#sendFeedbackButton").hide();
        $("#contact-us").show();
    });

    $("#hideFeedbackButton").click(function(){
        $("#sendFeedbackButton").show();
        $("#contact-us").hide();
    })

    $("#contact-us").hide();
});


routerApp.controller('specificPostController', function($scope, singlePost){
    $scope.singlePostTitle = singlePost.title;
    $scope.singlePostHtml = singlePost.html;
});

routerApp.config(function($stateProvider, $urlRouterProvider){

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
//                return $.get(ghost.url.api('posts', {include:"post, authors, tags", filter:"authors:eric+tags:tech"}))
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
            //console.log(singlePost);
        }
    }

    $urlRouterProvider.otherwise('/base');

    $stateProvider.state(baseState);
    $stateProvider.state(homeState);
    $stateProvider.state(learnState);
    $stateProvider.state(aboutState);
    $stateProvider.state(resourcesState);
    $stateProvider.state(specificPost);
});