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

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('list', {
        url: '/',
        templateUrl: 'list.html',
        controller: 'ListCtrl'
      })
      .state('view', {
        url: '/review/:reviewId',
        templateUrl: 'view.html',
        controller: 'ViewCtrl'
      })

      $urlRouterProvider.otherwise("/");
})




// Service qui restransmet le json dans les deux controllers

.factory('ReviewService', ['$http',function($http) {
  
    var review = [];

    return {

      GetReview: function() {

        return $http.jsonp("http://www.giantbomb.com/api/reviews/?api_key=836e68b410df00e6d87b2cb43a5afb2a589026c0&format=jsonp&limit=10&json_callback=JSON_CALLBACK").then(function(response) {

          review = response.data.results;
          return response.data.results;
        });
      },

      GetOneReview: function(reviewId) {
          
        for(i=0; i<review.length; i++) {

          if(review[i].release.id == reviewId) {

              
             return review[i];
          }
        }
      }
    }
  }
])


// Controller qui liste dans la homepage les reviews

.controller('ListCtrl', ['$scope', 'ReviewService', function($scope, ReviewService) {

      ReviewService.GetReview().then(function(review) {
          $scope.review = review;
      });
  }
])

// Controller qui affiche le contenu de la review

.controller('ViewCtrl', ['$scope','$stateParams','ReviewService', function($scope, $stateParams, ReviewService) {


      var reviewId = $stateParams.reviewId;
      $scope.reviewId = ReviewService.GetOneReview(reviewId);
  }
])

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

