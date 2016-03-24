angular.module('myapp')
.controller('ProfileCtrl', function($scope, $firebaseAuth, $location, $firebaseObject) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);

      var userRef = new Firebase('https://sportwarssms.firebaseio.com/members/' + authData.uid);
      var user = $firebaseObject(userRef);

      user.$loaded(function(data) {
        $scope.badges = data.badges;
        console.log($scope.badges);
      });
    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });
});
