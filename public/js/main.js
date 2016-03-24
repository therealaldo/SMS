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
  .when('/contest/:id', {
    templateUrl: 'views/contest.html',
    controller: 'ContestCtrl'
  })
  .otherwise('/');
}]);

angular.module('myapp')
.controller('ContestCtrl', ["$scope", "$firebaseAuth", "$location", "$routeParams", "$firebaseArray", function($scope, $firebaseAuth, $location, $routeParams, $firebaseArray) {
  var ref = new Firebase('https://sportwarssms.firebaseio.com');
  $scope.authObj = $firebaseAuth(ref);

  var id = $routeParams.id;
  var specificRef = new Firebase('https://sportwarssms.firebaseio.com/contests/' + id);
  var contestData = $firebaseArray(specificRef);

  var msgRef = new Firebase('https://sportwarssms.firebaseio.com/contests/' + id + '/messages');
  var msgData = $firebaseArray(msgRef);

  $scope.authObj.$onAuth(function(authData) {
    if (authData) {
      $scope.user = authData.facebook.displayName;
      console.log("Logged in as:", authData.uid);

      $scope.game = contestData;
      $scope.messages = msgData;
      $scope.newMessage = {};
      $scope.newMessage.username = $scope.user;
      $scope.newMessage.userid = authData.uid;

    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });

  $scope.addMessage = function() {
    msgData.$add($scope.newMessage).then(function() {
      console.log('Message successfully added');
      $scope.newMessage.text = '';
    }).catch(function(e) {
      console.log('Error adding message: ', e);
    })
  }

}]);

angular.module('myapp').directive('ngScrollBottom', ['$timeout', function($timeout) {
  return {
    scope: {
      ngScrollBottom: '='
    },
    link: function($scope, $element) {
      $element = $element[0];
      $scope.$watchCollection('ngScrollBottom', function(newValue) {
        if(newValue) {
          $timeout(function() {
            $element.scrollTop = $element.scrollHeight;
          }, 0);
        }
      });
    }
  }
}]);

angular.module('myapp')
.controller('HomeCtrl', ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
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
      newUser.name = $scope.user.displayName;
      newUser.$save().then(function() {
        console.log('User successfully added');
        $location.path('/lobby');
      }).catch(function() {
        console.log('Adding the user encountered an error');
      });
    }).catch(function(error) {
      console.error('Authentication failed:', error);
    });
  }

}]);

angular.module('myapp')
.controller('LobbyCtrl', ["$scope", "$firebaseAuth", "$location", "$firebaseArray", function($scope, $firebaseAuth, $location, $firebaseArray) {
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
