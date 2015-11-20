
var ionicAppControllers = angular.module('starter.controllers', []);

ionicAppControllers.controller("loginController", function($scope, $state, shareSession, Login){
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
	
});

//NO LONGER USING THIS CONTROLLER
ionicAppControllers.controller("locationController", function($scope, $window, $state, shareSession){
	$scope.login = shareSession.getSession();
	
	//shareSession.getLocations($scope);
	$scope.toSale = function(){
		
		shareSession.setSession($scope.login);
		shareSession.saveSession();
		$state.go('holder', {}, { reload: true });
	}
});

ionicAppControllers.controller("participantInformationController", function($scope, $state,shareSession, shareParticipant, Participant, RaffleTicket){
	shareSession.getSessionDatabase();
	$scope.participant = new Participant();
	$scope.error = false;
    
	$scope.toTickets = function(){
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
			var i = 0;
			for(i; i < $scope.participant.numberOfTickets; i++){
				$scope.participant.tickets.push(new RaffleTicket());
			}
			$scope.participant.totalPaid = $scope.participant.numberOfTickets * 10;
			shareParticipant.setParticipant($scope.participant);
			$state.go('ticketInfo', {}, { reload: true });
		}
	}
});

ionicAppControllers.controller("ticketInfoController", function($scope, $state, shareParticipant){
	$scope.participant = shareParticipant.getParticipant();
	$scope.error = false;
	$scope.toConfirmation = function(){
		if($scope.participant.card == true){
			$scope.participant.paymentType = "Card";
		}
		else if($scope.participant.cash == true){
			$scope.participant.paymentType = "Cash";
		}
		var ticketIsNull = false;
		angular.forEach($scope.participant.tickets, function(ticket){
					if(ticket.isNull()){
						ticketIsNull = true;
					}
		});
		if($scope.participant.paymentType == ""){
			$scope.error = "Please select a payment type.";
		}
		else if(ticketIsNull){
			$scope.error = "You are missing a ticket.";
		}
		else{
			shareParticipant.setParticipant($scope.participant);
			$state.go('confirmation', {}, { reload: true });
		}
	}
});

ionicAppControllers.controller("confirmationController", function($scope, $state, shareParticipant, Participant){
	$scope.participant = shareParticipant.getParticipant();
	$scope.finish = function(){
		shareParticipant.saveToDatabase()
		$state.go('summary', {}, { reload: true });
	}
});

ionicAppControllers.controller("summary", function($scope, $window, $state, shareParticipant, Participant){
	shareParticipant.setParticipant("");
	
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
