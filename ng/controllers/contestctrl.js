angular.module('myapp')
.controller('ContestCtrl', function($scope, $firebaseAuth, $location, $routeParams, $firebaseArray) {
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

});
