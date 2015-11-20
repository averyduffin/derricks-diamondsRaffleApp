

var ionicAppServices = angular.module('starter.services', []);


/*
 * Object Models
 */
ionicAppServices.factory('Login', function(){
	var Login = function() {
        this.salesRep = "";
		this.location = "";
    }
	Login.prototype.setSalesRep = function(name){
		this.salesRep = name;
	}
	Login.prototype.getSalesRep = function(){
		return this.salesRep;
	}
	Login.prototype.setLocation = function(location){
		this.location = location;
	}
	Login.prototype.getLocation = function(){
		return this.location;
	}
	return Login;
});

ionicAppServices.factory('Participant', function(){
	var Participant = function(){
		this.name = "";
		this.phone = "";
		this.email = "";
		this.address = "";
		this.numberOfTickets = "";
		this.paymentType = "";
		this.totalPaid = "";
		this.tickets = [];
	}
	Participant.prototype.setName = function(name){
		this.name = name;
	}
	Participant.prototype.getName = function(){
		return this.name;
	}
	
	Participant.prototype.setPhone = function(phone){
		this.phone = phone;
	}
	Participant.prototype.getPhone = function(){
		return this.phone;
	}
	
	Participant.prototype.setEmail = function(email){
		this.email = email;
	}
	Participant.prototype.getEmail = function(){
		return this.email;
	}
	
	Participant.prototype.setAddress = function(address){
		this.address = address;
	}
	Participant.prototype.getAddress = function(){
		return this.address;
	}
	
	Participant.prototype.setNumberOfTickets = function(num){
		this.numberOfTickets = num;
	}
	Participant.prototype.getNumberOfTickets = function(){
		return this.numberOfTickets;
	}
	
	Participant.prototype.setPaymentType = function(paymentType){
		this.paymentType = paymentType;
	}
	Participant.prototype.getPaymentType = function(){
		return this.paymentType;
	}
	
	Participant.prototype.setTotalPaid = function(totalPaid){
		this.totalPaid = totalPaid;
	}
	Participant.prototype.getTotalPaid = function(){
		return this.totalPaid;
	}
	return Participant;
	
});

ionicAppServices.factory('Session', function(){
	var Session = function(login){
		this.login = login;
		this.dateTime = new Date().toLocaleString();
	}
	Session.prototype.setLogin = function(login){
		this.login = login;
	}
	Session.prototype.getLogin = function(){
		return this.login;
	}
	Session.prototype.getLocation = function(){
		this.login.getLocation()
	}
	
	Session.prototype.getDateTime = function(){
		return this.dateTime;
	}
	return Session
});

ionicAppServices.factory('RaffleTicket', function(){
	var RaffleTicket = function(){
		this.raffleNumber = "";
	}
	RaffleTicket.prototype.setRaffle = function(raffleNumber){
		this.raffleNumber = raffleNumber;
	}
	RaffleTicket.prototype.getRaffle = function(){
		return this.raffleNumber;
	}
	RaffleTicket.prototype.isNull = function(){
		if(this.raffleNumber == ""){
			return true;
		}
		else{
			return false;
		}
	}
	return RaffleTicket
});

/*
 * Helper functions
 */
 
ionicAppServices.factory('shareSession', function($cordovaSQLite, Session, Login){
	var session = "";
	var session_id = "";
	var session_dateTime = "";
	return {
		setSession: function(ses){
			session = ses;
		},
		getSession: function(){
			return session;
		},
		getSessionLocation: function(){
			return session.getLocation()
		},
		getSessionDateTime: function(){
			if(session_dateTime == ""){
				return session.getDateTime();
			}
			else{
				return session_dateTime;
			}
		},
		saveSession: function(){
			session_dateTime = new Date().toLocaleString();
			var query = "INSERT INTO session (datetime, locationName, sessionlocation_id) VALUES (?, ?, (SELECT locationid from location WHERE locationname= ? ))";
			$cordovaSQLite.execute(db, query, [session_dateTime, session.getLocation(), session.getLocation()]).then(function(res) {
				session_id = res.insertId;
				console.log("INSERT ID -> " + res.insertId);
			}, function (err) {
				console.error(err);
			});
			
			var query = "INSERT INTO loginData (name, loginSession_id) VALUES (?, (SELECT sessionid from session WHERE datetime= ? ))";
			$cordovaSQLite.execute(db, query, [session.getSalesRep(), session_dateTime]).then(function(res) {
			}, function (err) {
				console.error(err);
			});
		},
		getSessionDatabase: function(){
			session = new Session();
			session.setLogin(new Login());
			var query = "SELECT MAX(sessionid) AS sessionid, datetime, sessionlocation_id FROM session";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				console.log(res.rows[0])
				if(res.rows.length > 0) {
					//console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
					session.dateTime = res.rows[0].datetime;
				} else {
					console.log("No results found");
				}
			}, function (err) {
				console.error(err);
			});
		},
		getLocations: function(scope){
			scope.locations = [
				"test",
				"carwash",
				"Nothing",
				"Egypt",
				"houston",
				"Norway",
				"England",
			];
			/*var query = "SELECT locationid, locationname FROM location";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				//if(res.rows.length > 0) {
					//for(var i=0; i < res.rows.length; i++){
						//var loc = {};
						//loc.locationid = res.rows.item(i).locationid;
						//loc.locationname = res.rows.item(i).locationname;
						//scope.locations.push(loc);
					//}
				//} else {
				//	console.log("No results found");
				//}
			}, function (err) {
				console.error(err);
			});*/
		}
	}
	
});

ionicAppServices.factory('shareParticipant', function($cordovaSQLite, shareSession){
	var participant = "";
	return {
		setParticipant: function(part){
			participant = part;
		},
		getParticipant: function(){
			return participant;
		},
		saveToDatabase: function(){
			var dateTime = new Date().toLocaleString();
			var id = ""
			var query = "INSERT INTO participant (name, phone, email, numberOfTickets, paymentType, address, totalPaid, date, participantsession_id) VALUES (?,?,?,?,?,?,?,?,(SELECT sessionid from session WHERE datetime= ? ))";
			$cordovaSQLite.execute(db, query, [participant.name, participant.phone, participant.email, participant.numberOfTickets, participant.paymentType, participant.address, participant.totalPaid, dateTime, shareSession.getSessionDateTime()]).then(function(res) {
				id = res.insertId;
			}, function (err) {
				console.error(err);
			});
			angular.forEach(participant.tickets, function(ticket){
				var query = "INSERT INTO raffleTicket (raffleNumber, raffleTicketparticipant_id) VALUES (?, last_insert_rowid())";
				$cordovaSQLite.execute(db, query, [ticket.getRaffle()]).then(function(res) {
				}, function (err) {
					console.error(err);
				});
			});
		},
	}
});

ionicAppServices.factory('allParticipants', function($cordovaSQLite, Participant){
	return{
		getAllParticipants: function(scope){
			var query = "SELECT participantid, name, phone, email, numberOfTickets, paymentType, address, totalPaid, date, participantsession_id FROM participant";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						var part = new Participant();
						part.name = res.rows.item(i).name;
						part.phone = res.rows.item(i).phone;
						part.email = res.rows.item(i).email;
						part.address = res.rows.item(i).address;
						part.numberOfTickets = res.rows.item(i).numberOfTickets;
						part.paymentType = res.rows.item(i).paymentType;
						part.totalPaid = res.rows.item(i).totalPaid;
						part.date = res.rows.item(i).date;
						part.id = res.rows.item(i).participantid;
						scope.participants.push(part);
					}
					
				} else {
					console.log("No results found");
					scope.participants = [];
				}
			}, function (err) {
				console.error(err);
			});
		},
		getParticipant: function(scope, id){
			var query = "SELECT participantid, name, phone, email, numberOfTickets, paymentType, address, totalPaid, date, participantsession_id FROM participant WHERE participantid = (?)";
			$cordovaSQLite.execute(db, query, [id]).then(function(res) {
				if(res.rows.length > 0) {
					var part = new Participant();
					for(var i=0; i < res.rows.length; i++){
						part.name = res.rows.item(i).name;
						part.phone = res.rows.item(i).phone;
						part.email = res.rows.item(i).email;
						part.address = res.rows.item(i).address;
						part.numberOfTickets = res.rows.item(i).numberOfTickets;
						part.paymentType = res.rows.item(i).paymentType;
						part.totalPaid = res.rows.item(i).totalPaid;
						part.date = res.rows.item(i).date;
						part.id = res.rows.item(i).participantid;
					}
					scope.participant = part;
				} else {
					console.log("No results found");
					scope.participant = new Participant();
				}
			}, function (err) {
				console.error(err);
			});
		}
	}
});
/* 
 * Repo factories
 */
ionicAppServices.factory('ParticipantDatabase', function(){
	var session = "";
	return {
		setSession: function(ses){
			session = ses;
		},
		getSession: function(){
			return session;
		}
	}
	
});



