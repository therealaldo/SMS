angular.module('myapp')
.controller('HomeCtrl', function($scope, $firebaseAuth) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
  if (authData) {
    $scope.user = authData.facebook;
    console.log("Logged in as:", authData.uid);
  } else {
    console.log("Logged out");
    $scope.user = false;
  }
});

  $scope.loginFacebook = function() {
    $scope.authObj.$authWithOAuthPopup('facebook').then(function(authData) {
      $scope.user = authData.facebook;
      console.log('Logged in as:', authData);
    }).catch(function(error) {
      console.error('Authentication failed:', error);
    });
  }
});
