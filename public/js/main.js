angular.module('myapp', ['ngRoute', 'firebase']);

angular.module('myapp')
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'HomeCtrl'
  })
  .otherwise('/');
}]);

angular.module('myapp')
.controller('HomeCtrl', ["$scope", "$firebaseAuth", function($scope, $firebaseAuth) {
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
}]);
