angular.module('myapp')
.controller('HomeCtrl', function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
    } else {
      $scope.user = false;
    }
  });

  $scope.loginFacebook = function() {
    $scope.authObj.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.user = authData.facebook;

      var userRef = new Firebase('https://sportwarssms.firebaseio.com/members/' + authData.uid);
      var newUser = $firebaseObject(userRef);
      newUser.$loaded(function(data) {
        if(data.badges == null) {
          newUser.name = $scope.user.displayName;
          newUser.badges = {
            'referralstar': false,
            'closer': false,
            'champion': false,
            'fatwallet': false,
            'registry': false,
            'underdog': false
          };
        };

        newUser.$save().then(function() {
          // User was successfully added to the database, logged in, and taken to the lobby
          $location.path('/lobby');
        }).catch(function() {
          // User create failed error catch
          $scope.show = true;
          $location.path('/');
        });
      });

    }).catch(function(error) {
      // Authentication failed error catch
      $scope.show = true;
      $location.path('/');
    });
  };

  $scope.closeAlert = function(index) {
    $scope.show = false;
  };

});
