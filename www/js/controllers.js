angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  
})

.controller('ParticipantCtrl', function($scope, $stateParams, Participants) {
	console.log($stateParams.participantId)
	Participants.get({personId: $stateParams.participantId}).$promise.then(function(data) {
		console.log(data);
		$scope.participant = data;
    });
})

.controller('AllParticipantsCtrl', function($scope, Participants ) {
  Participants.get().$promise.then(function(data) {
      $scope.participants = data.participants;
    });
  
})

.controller('AddParticipantCtrl', function($scope, Participants) {
	$scope.participantInfo = new Participants();
	$scope.pageState = 'first';
	$scope.nextPage = function(){
		var i = 0;
		$scope.participantInfo.tickets = [];
		for(i; i < $scope.participantInfo.numberOfTickets; i++){
			$scope.participantInfo.tickets.push("");
		}
		$scope.participantInfo.totalDue = $scope.participantInfo.numberOfTickets * 10;
	  $scope.pageState = 'second';
	}
	$scope.back = function(){
		switch($scope.pageState){
			case 'first':
				break;
			case 'second':
				$scope.pageState = 'first';
				break;
			case 'third':
				$scope.pageState = 'second';
				break;
			case 'final':
				$scope.pageState = 'third';
				break;
			default:
				$scope.pageState = 'first';
				break;
		}
	}
	
	$scope.review = function(){
		$scope.pageState = 'third';

	}
	$scope.finish = function(){
		$scope.pageState = 'final';
		console.log($scope.participantInfo)
		$scope.participantInfo.$create(function(data){
			console.log("PASSED")
			console.log(data);
		}, function(err){
			console.log(err);
		});
	}
	
	$scope.startOver = function(){
		$scope.participantInfo = new Participants();
		$scope.pageState = 'first';
		console.log('Test');
	}
  
})



;
