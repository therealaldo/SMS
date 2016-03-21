angular.module('myapp')
.config(function($routeProvider, $locationProvider) {
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
  .when('/account', {
    templateUrl: 'views/profile.html',
    controller: 'ProfileCtrl'
  })
  .when('/contest', {
    templateUrl: 'views/contest.html',
    controller: 'ContestCtrl'
  })
  .otherwise('/');
});
