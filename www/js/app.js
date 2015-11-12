// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;


angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'ngResource', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	if (window.cordova) {
		console.log('device')
		//db = $cordovaSQLite.openDB({ name: "my.db" }); //device
		db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100);
	}else{
		console.log('browser')
		db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
	}
	//db = $cordovaSQLite.openDB("my.db");
	$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
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
	.state('app.test', {
      url: '/test',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'ExampleController'
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
