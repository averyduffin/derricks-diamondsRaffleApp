/*
 * This file is used for each controller. Most of the business logic shouldn't be here in this controller.
 * Each controller should manipulate the scope and return back data to the view.
 */

var ionicAppControllers = angular.module('starter.controllers', []);

ionicAppControllers.controller("loginController", function($scope, UploadCounter, $state, shareSession, Login){
	$scope.error = false;
	$scope.login = new Login();
	$scope.locations = [];
	$scope.selectedValue = "Select a location";
	shareSession.getLocations($scope);
	$scope.loginAction = function(){
		$scope.login.setLocation($scope.selectedValue)
		if($scope.login.getSalesRep() == ""){
			$scope.error = "Please insert name in name field";
		}
		else if($scope.login.getLocation() == "Select a location"){
			$scope.error = "Please select a location";
		}
		else{
			shareSession.setSession($scope.login);
			shareSession.saveSession();
			$state.go('holder', {}, { reload: true });
		}
	}
	
	//used for fancy-selector 
	$scope.val =  {single: null, multiple: null};
	
	//tracks number of uploaded values
	UploadCounter.counterSet($scope);
});

ionicAppControllers.controller("participantInformationController", function($scope, $state, UploadCounter, shareSession, shareParticipant, Participant, RaffleTicket){
	//This reads the session database
	shareSession.getSessionDatabase();
	//create new participant to be populated in the form
	//$scope.participant = new Participant();
	$scope.participant = shareParticipant.getParticipant();
	
	if($scope.participant == ""){
		$scope.participant = new Participant();
	}
	$scope.error = false;
	//Set upload counter to the scope. Not currently being used.
	UploadCounter.counterSet($scope);
	
	//function is changes state after the form is filled out
	$scope.toTickets = function(){
		//error checking
		if($scope.participant.name == ""){
			$scope.error = "Please insert your full name in Full Name field";
		}
		else if($scope.participant.phone == ""){
			$scope.error = "Please insert your phone number in Phone Number field";
		}
		else if($scope.participant.email == ""){
			$scope.error = "Please insert your email in Email field";
		}
		else if($scope.participant.numberOfTickets == ""){
			$scope.error = "Please insert your number of tickets in Number Of Tickets field";
		}
		else{
			$scope.participant.address = $scope.participant.street + " " + $scope.participant.city + " " + $scope.participant.state + " " + $scope.participant.zip;
			
			var i = $scope.participant.tickets.length;
			
			
			for(i; i < $scope.participant.numberOfTickets; i++){
				$scope.participant.tickets.push(new RaffleTicket());
			}
			
			if($scope.participant.numberOfTickets < $scope.participant.tickets.length){
				var j = 0;
				$scope.participant.tickets = [];
				for(j; j < $scope.participant.numberOfTickets; j++){
					$scope.participant.tickets.push(new RaffleTicket());
				}
			}
			/*
			 * Calculate ticket price 
			 * every 5 tickets cost 40$ instead of 50$
			 */
			var discountedCost = Math.floor($scope.participant.numberOfTickets/5) * 40;
			var cost = ($scope.participant.numberOfTickets % 5) * 10;
			
			$scope.participant.totalPaid = discountedCost + cost;
			shareParticipant.setParticipant($scope.participant);
			$state.go('ticketInfo', {}, { reload: true });
		}
	}
});

ionicAppControllers.controller("ticketInfoController", function($scope, $state,UploadCounter, shareParticipant){
	//get participant filled out in the previous form
	$scope.participant = shareParticipant.getParticipant();
	$scope.error = false;
	//Set upload counter to the scope. Not currently being used.
	UploadCounter.counterSet($scope);
	
	//Go back to previous screen and state
	$scope.goBack = function(){
		$state.go('holder', {}, { reload: false });
	}
	//change state to confirmation page
	$scope.toConfirmation = function(){
		
		if($scope.participant.card == true){
			$scope.participant.paymentType = "Card";
		}
		else if($scope.participant.cash == true){
			$scope.participant.paymentType = "Cash";
		}
		else if($scope.participant.check == true){
			$scope.participant.paymentType = "Check";
		}
		//check that all tickets have been entered into the form
		var ticketIsNull = false;
		angular.forEach($scope.participant.tickets, function(ticket){
					if(ticket.isNull()){
						ticketIsNull = true;
					}
		});
		
		//form error checking
		if($scope.participant.paymentType == ""){
			$scope.error = "Please select a payment type.";
		}
		else if(ticketIsNull){
			$scope.error = "You are missing a ticket.";
		}
		else if($scope.participant.paymentType == "Check" && $scope.participant.checkNum == ""){
			$scope.error = "Please enter the check number.";
		}
		else{
			$scope.error = false;
			shareParticipant.setParticipant($scope.participant);
			$state.go('confirmation', {}, { reload: true });
		}
	}
});

ionicAppControllers.controller("confirmationController", function($scope, $state,UploadCounter, shareParticipant, Participant){
	$scope.goBack = function(){
		$state.go('ticketInfo', {}, { reload: false });
	}
	
	//get participant
	$scope.participant = shareParticipant.getParticipant();
	
	//Set upload counter to the scope. Not currently being used.
	UploadCounter.counterSet($scope);
	
	//change state to finished state
	$scope.finish = function(){
		
		shareParticipant.saveToDatabase()
		$state.go('summary', {}, { reload: true });
	}
});

ionicAppControllers.controller("summary", function($scope, $window, $state, UploadCounter,UploadCounter,  shareParticipant, Participant){
	//Reset Participant
	shareParticipant.setParticipant("");
	
	//Set upload counter to the scope. Not currently being used.
	UploadCounter.counterSet($scope);
	
	//State change move back to first page
	$scope.startOver = function(){
		
		$state.go('holder', {}, { reload: true });

	}
});

ionicAppControllers.controller("viewParticipants", function($scope, allParticipants){
	$scope.participants = [];
	 allParticipants.getAllParticipants($scope);
});

ionicAppControllers.controller("viewParticipant", function($scope, $stateParams, allParticipants, Participant){
	 allParticipants.getParticipant($scope, $stateParams.id);
});



ionicAppControllers.controller("syncParticipant", function($scope, $state, $cordovaNetwork, uploadToCloud ){
	$scope.syncTexts = "Syncing with cloud...";
	console.log("INSIDE CONTROLLER");
	ionic.Platform.ready(function () {
		console.log("HERE")
		var isOnline=true;
		//var isOnline = $cordovaNetwork.isOnline()
		
		console.log(isOnline);
		if(isOnline){
			uploadToCloud($scope, function(){
				console.log("FIRED")
				$state.go('login', {}, { reload: true });
			});
		} 
		else{
			$scope.syncTexts = "Not online";
			console.log("Not online")
			$state.go('login', {}, { reload: true });
		}
		
	}, false);	
});

ionicAppControllers.controller("uploadParticipant", function($scope, $state, $cordovaNetwork, uploadToCloud ){
	$scope.isSpin = true;
	$scope.syncTexts = "Syncing with cloud...";

	ionic.Platform.ready(function () {
		var isOnline=true;
		//var isOnline = $cordovaNetwork.isOnline()
		
		console.log(isOnline);
		if(isOnline){
			uploadToCloud($scope, function(){
				console.log("FIRED")
				//$scope.isSpin = false;
				//$state.go('login', {}, { reload: true });
			});
		} 
		else{
			$scope.syncTexts = "Not online";
			console.log("Not online")
			//$scope.isSpin = 0;
			//$state.go('login', {}, { reload: true });
		}
		
	}, false);	
});





















