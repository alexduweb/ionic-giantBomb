// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})

.controller("MyController", function($scope, $http){
    $scope.myData = {};
  $scope.myData.doClick = function(item, event) {

    var responsePromise = $http.get("http://www.giantbomb.com/api/reviews/?api_key=836e68b410df00e6d87b2cb43a5afb2a589026c0&format=json&limit=5");

    responsePromise.success(function(data, status, headers, config) {
      alert("Ajax !");
      $scope.review = data.results;
    });

    responsePromise.error(function(data, status, headers, config) {
      alert("AJAX failed!");
    });
  }
})
