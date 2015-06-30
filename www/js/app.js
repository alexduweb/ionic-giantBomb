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
      .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('home.list', {
        url: '/list',
        views: {
          'tab-Home': {
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
          }
        }
      })
      .state('home.view', {
        url: '/review/:reviewId',
        views: {
          'tab-Home': {
            templateUrl: 'templates/view.html',
            controller: 'ViewCtrl'
          }
        }
      })
      .state('home.yoloOne', {
        url: '/yoloOne',
        views: {
          'tab-YoloOne': {
            templateUrl: 'templates/yoloOne.html'
          }
        }
      })
      .state('home.yoloTwo', {
        url: '/yoloTwo',
        views: {
          'tab-YoloTwo': {
            templateUrl: 'templates/yoloTwo.html'
          }
        }
      })

    $urlRouterProvider.otherwise("/home/list");
})


// Service qui restransmet le json dans les deux controllers

.factory('ReviewService', ['$http',function($http) {
  
    var reviews = [];
    var baseURL = "http://www.giantbomb.com/api/reviews/?api_key=836e68b410df00e6d87b2cb43a5afb2a589026c0&format=jsonp&sort=publish_date:desc";
    var limit = "&limit=";
    var config = "&json_callback=JSON_CALLBACK";

    return {

      GetReview: function() {

        reviews = [];

        return $http.jsonp(baseURL + limit+5 + config).then(function(response) {

          for (i=0;i<response.data.results.length; i++) {

            reviews.push((response.data.results)[i]);
          }
          return response;
        });
      },

      GetOneReview: function(reviewId) {

        for(i=0; i<reviews.length; i++) {

          if(reviews[i].release.id == reviewId) {

              return reviews[i];
          }
        }
      },

      GetNewReviews: function(offset) {

        return $http.jsonp(baseURL + limit+5 +"&offset="+ offset + config).then(function(response) {

          for (i=0;i<response.data.results.length; i++) {

            reviews.push((response.data.results)[i]);
          }
        
          return response;
        });
      }
    }
  }
])


// Controller qui liste dans la homepage les reviews

.controller('ListCtrl', ['$scope', 'ReviewService', function($scope, ReviewService) {

    $scope.review = [];
    var offset = 0;
    $scope.noMoreItemsAvailable = false;

    $scope.doRefresh = function() {
      ReviewService.GetReview().then(function(review) {
          $scope.review = review.data.results;
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        offset = 5;
      });
    };

    $scope.loadMore = function() {

      var result = offset + 5;

      ReviewService.GetNewReviews(offset).then(function(resp) {

        if ($scope.review.length >= resp.data.number_of_total_results) {

          $scope.noMoreItemsAvailable = true;
        }

        $scope.review = $scope.review.concat(resp.data.results);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

      offset = result;
    }
  }
])

// Controller qui affiche le contenu de la review

.controller('ViewCtrl', ['$scope','$stateParams','ReviewService', function($scope, $stateParams, ReviewService) {

      var reviewId = $stateParams.reviewId;
      $scope.reviewId = ReviewService.GetOneReview(reviewId);
  }
])

.controller('NavCtrl', function($scope, $location) {

  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
})


