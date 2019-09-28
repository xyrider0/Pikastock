angular.module('App')
    .controller('footerController', [$scope, function($scope){
        $("#sendFeedbackButton").click(function(){
            $("#sendFeedbackButton").hide();
            $("#contact-us").show();
        });

        $("#hideFeedbackButton").click(function(){
            $("#sendFeedbackButton").show();
            $("#contact-us").hide();
        })

        $("#contact-us").hide();
    }]);
