class FooterCtrl{
    constructor($scope){
        $('#contact-us').hide()
    }

    // $("#sendFeedbackButton").click(function(){
    //     $("#sendFeedbackButton").hide();
    //     $("#contact-us").show();
    // });

    // $("#hideFeedbackButton").click(function(){
    //     $("#sendFeedbackButton").show();
    //     $("#contact-us").hide();
    // })

    // $("#contact-us").hide();

    toggleFeedback(){
        $("#sendFeedbackButton").show();
        $("#contact-us").hide();
    }
}

FooterCtrl.$inject = ['$scope'];

export default FooterCtrl;