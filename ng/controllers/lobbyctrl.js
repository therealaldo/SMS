angular.module('myapp')
.controller('LobbyCtrl', function($scope, $firebaseAuth, $location, $firebaseArray) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  var contestRef = new Firebase('https://sportwarssms.firebaseio.com/contests');
  var contestList = $firebaseArray(contestRef);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);

      $scope.list = contestList;
      console.log($scope.list);
    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });


});
