// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic', 'ngResource', 'ngCordova', 'starter.controllers', 'starter.services']);

ionicApp.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	console.log("WORKED!!!");
	if (window.cordova) {
		console.log('device')
		//db = $cordovaSQLite.openDB("raffle.db");
		db = window.openDatabase("raffle.db", '1', 'my', 1024 * 1024 * 100);
	}else{
		console.log('browser')
		db = window.openDatabase("raffle.db", '1', 'my', 1024 * 1024 * 100); // browser
	}
	
    //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
	createDatabaseTables($cordovaSQLite);
	console.log("table Was created!!!!");

	/*var query = "INSERT INTO location (locationname) VALUES (?)";
	locations = 
	[
		"test",
		"carwash",
		"Nothing",
		"Egypt",
		"houston",
		"Norway",
		"England",
	]
	angular.forEach(locations, function(loc) {
		$cordovaSQLite.execute(db, query, [loc]).then(function(res) {
		}, function (err) {
			console.error(err);
		});
	});*/
  });
});

ionicApp.config(function($stateProvider, $urlRouterProvider, $resourceProvider, $ionicConfigProvider) {
	//$resourceProvider.defaults.useXDomain = true;
	//delete $resourceProvider.defaults.headers.common['X-Requested-With'];
	$ionicConfigProvider.views.maxCache(0);
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
  })
  .state('location', {
    url: '/location',
    templateUrl: 'templates/location.html',
    controller: 'locationController'
  })
  
  .state('holder', {
    url: '/holder',
    templateUrl: 'templates/holderInformation.html',
    controller: 'participantInformationController'
  })
  .state('ticketInfo', {
    url: '/ticketInfo',
    templateUrl: 'templates/ticketInfo.html',
    controller: 'ticketInfoController'
  })
  .state('confirmation', {
    url: '/confirmation',
    templateUrl: 'templates/confirmation.html',
    controller: 'confirmationController'
  })
  .state('summary', {
    url: '/summary',
    templateUrl: 'templates/saleSummary.html',
    controller: 'summary'
  })
  .state('all', {
    url: '/all',
    templateUrl: 'templates/all.html',
    controller: 'viewParticipants'
  })
  .state('part', {
    url: '/part/:id',
    templateUrl: 'templates/part.html',
    controller: 'viewParticipant'
  })
  ;
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

function createDatabaseTables(cordovalite){
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS location (\
									locationid integer primary key AUTOINCREMENT,\
									locationname TEXT \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS session (\
									sessionid integer primary key AUTOINCREMENT, \
									datetime TEXT, \
									locationName TEXT, \
									sessionlocation_id integer, \
									FOREIGN KEY(sessionlocation_id) REFERENCES location(locationid) \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS loginData (\
									loginid integer primary key AUTOINCREMENT, \
									name text, \
									loginSession_id integer, \
									FOREIGN KEY(loginSession_id) REFERENCES session(sessionid) \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS participant ( \
									participantid integer primary key AUTOINCREMENT, \
									name text, \
									phone text, \
									email text, \
									numberOfTickets integer, \
									paymentType text, \
									address text, \
									totalPaid integer, \
									date text, \
									participantsession_id integer, \
									FOREIGN KEY(participantsession_id) REFERENCES session(sessionid) \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS raffleTicket ( \
									raffleticketid integer primary key AUTOINCREMENT,\
									raffleNumber TEXT, \
									raffleTicketparticipant_id integer, \
									FOREIGN KEY(raffleTicketparticipant_id) REFERENCES participant(participantid) \
									)");
}




