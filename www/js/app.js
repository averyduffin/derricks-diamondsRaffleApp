// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $resourceProvider) {
	//$resourceProvider.defaults.useXDomain = true;
	//delete $resourceProvider.defaults.headers.common['X-Requested-With'];
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

	.state('app.participants', {
      url: '/participants',
      views: {
        'menuContent': {
          templateUrl: 'templates/participants.html',
          controller: 'AllParticipantsCtrl'
        }
      }
    })
	
	.state('app.add', {
      url: '/add',
      views: {
        'menuContent': {
          templateUrl: 'templates/addParticipant.html',
          controller: 'AddParticipantCtrl'
        }
      }
    })
	
  .state('app.single', {
    url: '/participant/:participantId',
    views: {
      'menuContent': {
        templateUrl: 'templates/participant.html',
        controller: 'ParticipantCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/participants');
});
