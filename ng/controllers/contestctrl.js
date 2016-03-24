angular.module('myapp')
.controller('ContestCtrl',
function($scope, $firebaseAuth, $location, $routeParams, $firebaseArray, $firebaseObject) {
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

      var userRef = new Firebase('https://sportwarssms.firebaseio.com/members/' + authData.uid);
      var user = $firebaseObject(userRef);

      user.$loaded(function(data) {
        if(data.badges.champion == false && contestData[0].featured == true) {
          console.log(data.badges);
          user.badges.champion = true;

          user.$save().then(function(data) {
            console.log('Badge was successfully changed.');
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
      console.log('Message successfully added');
      $scope.newMessage.text = '';
    }).catch(function(e) {
      console.log('Error adding message: ', e);
    })
  }

  $scope.closeAlert = function(index) {
    $scope.show = false;
  };

});
