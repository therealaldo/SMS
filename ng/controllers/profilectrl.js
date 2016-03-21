angular.module('myapp')
.controller('AccountCtrl', function($scope, $firebaseAuth) {
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
});