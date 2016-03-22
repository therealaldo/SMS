angular.module('myapp', ['ngRoute', 'firebase']);

angular.module('myapp')
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .when('/lobby', {
    templateUrl: 'views/lobby.html',
    controller: 'LobbyCtrl'
  })
  .when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'ProfileCtrl'
  })
  .when('/contest', {
    templateUrl: 'views/contest.html',
    controller: 'ContestCtrl'
  })
  .otherwise('/');
}]);

angular.module('myapp')
.controller('ContestCtrl', ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });
}]);

angular.module('myapp')
.controller('HomeCtrl', ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
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
      console.log('Logged in as:', authData);
      $location.path('/lobby');
    }).catch(function(error) {
      console.error('Authentication failed:', error);
    });
  }
}]);

angular.module('myapp')
.controller('LobbyCtrl', ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });
}]);

angular.module('myapp')
.controller('ProfileCtrl', ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);
    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });
}]);
