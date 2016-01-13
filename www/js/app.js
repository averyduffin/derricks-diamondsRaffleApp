
var ionicApp = angular.module('starter', ['ionic', 'ngResource', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.syncing', 'starter.directives', 'starter.filters']);

ionicApp.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	console.log("WORKED!!!");
	if (window.cordova) {
		console.log('device')
		db = $cordovaSQLite.openDB("raffle.db");
		//db = window.openDatabase("raffle.db", '1', 'my', 1024 * 1024 * 100);
	}else{
		console.log('browser')
		db = window.openDatabase("raffle.db", '1', 'my', 1024 * 1024 * 100); // browser
	}
	
    //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
	createDatabaseTables($cordovaSQLite);
	console.log("table Was created!!!!");
  });
});

ionicApp.config(function($stateProvider, $urlRouterProvider, $resourceProvider, $ionicConfigProvider) {

	$ionicConfigProvider.views.maxCache(0);
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
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
  .state('sync', {
    url: '/sync',
    templateUrl: 'templates/sync.html',
    controller: 'syncParticipant'
  })
  .state('upload', {
    url: '/upload',
    templateUrl: 'templates/upload.html',
    controller: 'uploadParticipant'
  })
  ;
  $urlRouterProvider.otherwise('/sync');
});

/*
 * function creates all the database tables if there isn't an existing table.
 * param: cordovalite, cordova database javascript object that creates the database.
 * return: none
 */
 
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
									checkNum text, \
									isDeleted integer, \
									isUploaded integer, \
									participantsession_id integer, \
									FOREIGN KEY(participantsession_id) REFERENCES session(sessionid) \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS raffleTicket ( \
									raffleticketid integer primary key AUTOINCREMENT,\
									raffleNumber TEXT, \
									raffleTicketparticipant_id integer, \
									FOREIGN KEY(raffleTicketparticipant_id) REFERENCES participant(participantid) \
									)");
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS Sync ( \
									syncid integer primary key AUTOINCREMENT,\
									date text \
									)");
									
	cordovalite.execute(db, "CREATE TABLE IF NOT EXISTS locations ( \
									locid integer primary key AUTOINCREMENT,\
									location text \
									)");
}




