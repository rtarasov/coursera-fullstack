'use strict';

angular.module('confusionApp').controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

    $scope.showMenu = true;
    $scope.message = "Loading ...";
    $scope.dishes= menuFactory.getDishes().query();
  
    $scope.tab = 1;
    $scope.filtText = '';

    $scope.select = function(setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function(checkTab) {
        return ($scope.tab === checkTab);
    };

}]).controller('ContactController', ['$scope', function($scope) {
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
}]).controller('FeedbackController', ['$scope', function($scope) {
            $scope.sendFeedback = function() {
                console.log($scope.feedback);
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "") && !$scope.feedback.mychannel) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                } else {
                    $scope.invalidChannelSelection = false;
                    //the code like indicated in exercise
                    //$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel = "";

                    //the code that drops data both in the form and preview
                    $scope.feedback.firstName = "";
                    $scope.feedback.lastName = "";
                    $scope.feedback.agree = false;
                    $scope.feedback.email = "";
                    $scope.feedback.tel.number = "";
                    $scope.feedback.tel.areaCode = "";
                    $scope.feedback.comments = "";
                    //

                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
}]).controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.showDish = true;
            $scope.message="Loading ...";
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)});

}]).controller('DishCommentController', ['$scope', function($scope) {

            $scope.submitComment = function () {

                $scope.comment.date = new Date().toISOString();

                //Not number but string representation of rating added
                //after form submit. This conversion is needed to sort correctly by the rating.
                $scope.comment.rating = parseInt($scope.comment.rating, 10);

                $scope.dish.comments.push($scope.comment);

                $scope.commentForm.$setPristine();

                $scope.comment = $scope.initComment();
            };

            $scope.initComment = function () {
              return {
                  rating:5,
                  comment:"",
                  author:"",
                  date:""
              };
            };

            $scope.comment = $scope.initComment();

}]).controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {
  $scope.promotion = menuFactory.getPromotion(0);
  $scope.leader = corporateFactory.getLeader(0);
  
$scope.showFeatured  = true;
$scope.message="Loading ...";
$scope.featured = menuFactory.getDishes().get({id:0});
  
}]).controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
  $scope.leaders = corporateFactory.getLeaders();
}]);
