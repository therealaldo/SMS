angular.module('myapp')
.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'HomeCtrl'
  })
  .otherwise('/');
});
