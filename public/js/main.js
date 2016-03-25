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
.controller('ContestCtrl',
["$scope", "$firebaseAuth", "$location", "$routeParams", "$firebaseArray", "$firebaseObject", function($scope, $firebaseAuth, $location, $routeParams, $firebaseArray, $firebaseObject) {
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

      $scope.game = contestData;
      $scope.messages = msgData;
      $scope.newMessage = {};
      $scope.newMessage.username = $scope.user;
      $scope.newMessage.userid = authData.uid;

      var userRef = new Firebase('https://sportwarssms.firebaseio.com/members/' + authData.uid);
      var user = $firebaseObject(userRef);

      user.$loaded(function(data) {
        if(data.badges.champion == false && contestData[0].featured == true) {
          user.badges.champion = true;

          user.$save().then(function(data) {
            $scope.show = true;
          }).catch(function() {
            console.log('Badge was unsuccessfully changed.');
          });
        }
      });

    } else {
      console.log("Logged out");
      $scope.user = false;
      $location.path('/');
    }
  });

  $scope.addMessage = function() {
    msgData.$add($scope.newMessage).then(function() {
      $scope.newMessage.text = '';
    }).catch(function(e) {
      console.log('Error adding message: ', e);
    })
  }

  $scope.closeAlert = function(index) {
    $scope.show = false;
  };

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
.controller('ProfileCtrl', ["$scope", "$firebaseAuth", "$location", "$firebaseObject", function($scope, $firebaseAuth, $location, $firebaseObject) {
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
}]);
