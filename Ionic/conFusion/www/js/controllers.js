angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  $scope.reservation = {};

  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
      $scope.reservation = {};
    }, 1000);
  };  
})

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate) {

  $scope.baseURL = baseURL;
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
  
  $scope.addFavorite = function (index) {
      console.log("index is " + index);
      favoriteFactory.addToFavorites(index);
      $ionicListDelegate.closeOptionButtons();
  };  

}]).controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.message="Loading ...";
    $scope.shouldShowDelete = false;

    $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Loading...'
    });
  
    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = menuFactory.getDishes().query(
        function (response) {
            $scope.dishes = response;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
            $timeout(function () {
                $ionicLoading.hide();
            }, 1000);
        }
    );
  
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;

    }
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

}]).controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover','$ionicModal', function($scope, $stateParams, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {
  
  $scope.baseURL = baseURL;
  $scope.showDish = false;
  $scope.message="Loading ...";
  
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)}).$promise.then(
          function(response){
              $scope.dish = response;
              $scope.showDish = true;
          },

          function(response) {
              $scope.message = "Error: " + response.status + " " + response.statusText;
          }
  );  
  
  $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.showOptionsPopover = function($event) {
    $scope.popover.show($event);
  };
  
  $scope.closeOptionsPopover = function() {
    $scope.popover.hide();
  };
  
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  
  $scope.addFavorite = function(index) {
    favoriteFactory.addToFavorites(index);
    $scope.closeOptionsPopover();
  };
  
  $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.dishCommentForm = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeDishCommentForm = function() {
    $scope.dishCommentForm.hide();
    $scope.closeOptionsPopover();
  };

  // Open the reserve modal
  $scope.showDishCommentForm = function() {
    $scope.dishCommentForm.show();
  };

  //TODO: Do not like this duplication of code
  $scope.doCreateComment = function() {
    console.log('Creating dish comment', $scope.comment);
    
    $scope.comment.date = new Date().toISOString();
    $scope.comment.rating = parseInt($scope.comment.rating, 10);
    $scope.dish.comments.push($scope.comment);

    menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
    
    $scope.closeDishCommentForm();
    
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

}]).controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {

  $scope.baseURL = baseURL;
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
  
}]).controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
  $scope.baseURL = baseURL;
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
  
}]).filter('favoriteFilter', function () {
    return function (dishes, favorites) {
        var out = [];
        for (var i = 0; i < favorites.length; i++) {
            for (var j = 0; j < dishes.length; j++) {
                if (dishes[j].id === favorites[i].id)
                    out.push(dishes[j]);
            }
        }
        return out;

}});
