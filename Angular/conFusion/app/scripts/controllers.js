'use strict';

angular.module('confusionApp').controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.showMenu = false;
  $scope.message = "Loading ...";
  menuFactory.getDishes().query(
      function(response) {
          $scope.dishes = response;
          $scope.showMenu = true;
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

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

}]).controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

  $scope.sendFeedback = function() {
      console.log($scope.feedback);
      if ($scope.feedback.agree && ($scope.feedback.mychannel == "") && !$scope.feedback.mychannel) {
          $scope.invalidChannelSelection = true;
          console.log('incorrect');
      } else {
          $scope.invalidChannelSelection = false;

          feedbackFactory.getFeedback().save($scope.feedback, function(response) {
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
          });

      }
  };

}]).controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

  $scope.showDish = false;
  $scope.message="Loading ...";
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)}).$promise.then(
          function(response){
              $scope.dish = response;
              $scope.showDish = true;
          },

          function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
          }
  );

}]).controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

  $scope.submitComment = function () {

      $scope.comment.date = new Date().toISOString();

      //Not number but string representation of rating added
      //after form submit. This conversion is needed to sort correctly by the rating.
      $scope.comment.rating = parseInt($scope.comment.rating, 10);

      $scope.dish.comments.push($scope.comment);

      menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

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
  $scope.message="Loading ...";

  $scope.showPromotion = false;
  $scope.promotion = menuFactory.getPromotion().get({id:0}).$promise.then(
      function(response){
          $scope.promotion = response;
          $scope.showPromotion = true;
      },
    
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  
  );
  
  $scope.showLeader = false;
  $scope.leader = corporateFactory.getLeaders().get({id:0}).$promise.then(
      function(response){
          $scope.leader = response;
          $scope.showLeader = true;
      },
    
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  
  ); 
  
  $scope.showFeatured = false;
  $scope.featured = menuFactory.getDishes().get({id:0}).$promise.then(
      function(response){
          $scope.featured = response;
          $scope.showFeatured = true;
      },
    
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );
  
}]).controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {
  $scope.message = "Loading ...";
  
  $scope.showLeaders = false;
  $scope.leaders = corporateFactory.getLeaders().query(
      function(response){
          $scope.leaders = response;
          $scope.showLeaders = true;
      },
    
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  
  );  
  
}]);
