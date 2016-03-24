angular.module('myapp')
.controller('HomeCtrl', function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
      $scope.user = false;
    }
  });

  $scope.loginFacebook = function() {
    $scope.authObj.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.user = authData.facebook;
      console.log('Logged in as:', authData.facebook);
      var userRef = new Firebase('https://sportwarssms.firebaseio.com/members/' + authData.uid);
      var newUser = $firebaseObject(userRef);
      newUser.$loaded(function(data) {
        console.log(data);
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
          console.log('added data');
        };

        newUser.$save().then(function() {
          console.log('User successfully added');
          $location.path('/lobby');
        }).catch(function() {
          console.log('Adding the user encountered an error');
        });
      });

    }).catch(function(error) {
      console.error('Authentication failed:', error);
    });
  }

});
