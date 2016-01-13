

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
		this.checkNum = "";
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
		saveLocation: function(locName){
			var query = "INSERT INTO locations (location) VALUES (?)";
			$cordovaSQLite.execute(db, query, [locName]).then(function(res) {
				id = res.insertId;
			}, function (err) {
				console.error(err);
			});
		},
		getLocations: function(scope){
			var query = "SELECT * FROM locations";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						var resLocation = {
							id: res.rows.item(i).locid,
							text: res.rows.item(i).location,
							checked: false, 
							icon: null
						}
						scope.locations.push(resLocation);
					}
				} else {
					console.log("No results found");
					scope.locations = []
				}
			}, function (err) {
				console.error(err);
			});
			/*scope.locations = [{id: 1, text: 'USA', checked: false, icon: null}, 
								{id: 2, text: 'France', checked: false, icon: null}, 
								{id : 3, text: 'Japan', checked: true, icon: null},
								{id : 3, text: 'Norway', checked: true, icon: null},
								{id : 3, text: 'Egypt', checked: true, icon: null},
								{id : 3, text: 'Houston', checked: true, icon: null}];*/
								
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
			var query = "INSERT INTO participant (name, phone, email, numberOfTickets, paymentType, address, totalPaid, date, checkNum, isDeleted, isUploaded, participantsession_id) VALUES (?,?,?,?,?,?,?,?,?,0,0,(SELECT sessionid from session WHERE datetime= ? ))";
			$cordovaSQLite.execute(db, query, [participant.name, participant.phone, participant.email, participant.numberOfTickets, participant.paymentType, participant.address, participant.totalPaid, dateTime, participant.checkNum, shareSession.getSessionDateTime()]).then(function(res) {
				id = res.insertId;
			}, function (err) {
				console.error(err);
			});
			angular.forEach(participant.tickets, function(ticket){
				var query = "INSERT INTO raffleTicket (raffleNumber, raffleTicketparticipant_id) VALUES (?, (SELECT participantid from participant WHERE date= ? ))";
				$cordovaSQLite.execute(db, query, [ticket.getRaffle(), dateTime]).then(function(res) {
				}, function (err) {
					console.error(err);
				});
			});
		},
	}
});

ionicAppServices.factory('allParticipants', function($cordovaSQLite, Participant, Session, Login){
	return{
		getAllParticipants: function(scope){
			var query = "SELECT * FROM participant";
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
						part.isDeleted = res.rows.item(i).isDeleted;
						part.isUploaded = res.rows.item(i).isUploaded;
						part.checkNum = res.rows.item(i).checkNum;
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
		getAllParticpantsNotUploaded: function(callback, error){
			/*check participants to see if there are participants that need uploaded*/
			var scope = {};
			scope.participants = [];
			var query = "SELECT * FROM participant WHERE isUploaded = 0";
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
						part.isDeleted = res.rows.item(i).isDeleted;
						part.isUploaded = res.rows.item(i).isUploaded;
						part.checkNum = res.rows.item(i).checkNum;
						scope.participants.push(part);
					}
					callback(scope.participants);
				} else {
					console.log("No results found");
					scope.participants = [];
					error();
				}
			}, function (err) {
				console.error(err);
				error();
			});
		},
		getRaffleTickets: function(participantId, callback){
			var scope = {};
			var tickets = []
			var query4 = "SELECT raffleticketid, raffleNumber, raffleTicketparticipant_id  FROM raffleTicket WHERE raffleTicketparticipant_id = ( ? )";
			$cordovaSQLite.execute(db, query4, [participantId]).then(function(res) {
				if(res.rows.length > 0) {
					
					for(var i=0; i < res.rows.length; i++){
						var ticket = {};
						ticket.raffleticketid = res.rows.item(i).raffleticketid;
						ticket.raffleNumber = res.rows.item(i).raffleNumber;
						ticket.raffleTicketparticipant_id = res.rows.item(i).raffleTicketparticipant_id;
						tickets.push(ticket)
					}
					scope.tickets = tickets;
					callback(scope.tickets);
				} else {
					console.log("No results found");
					scope.tickets = tickets;
				}
			}, function (err) {
				console.error(err);
			});
		},
		getSessionInformation: function(participantId, callback){
			var scope = {};
			var ses = new Session(new Login());
			var query2 = "SELECT sessionid, datetime, locationName, sessionlocation_id FROM session WHERE sessionid = ((SELECT participantsession_id from participant WHERE participantid= ? ))";
			$cordovaSQLite.execute(db, query2, [participantId]).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						ses.sessionid = res.rows.item(i).sessionid;
						ses.dateTime = res.rows.item(i).datetime;
						ses.login.location = res.rows.item(i).locationName;
						ses.sessionlocation_id = res.rows.item(i).sessionlocation_id;
					}
					scope.ses = ses;
				} else {
					console.log("No results found");
					scope.ses = new Session(new Login());
				}
			}, function (err) {
				console.error(err);
			});
			
			var query3 = "SELECT loginid, name, loginSession_id FROM loginData WHERE loginSession_id = ((SELECT participantsession_id from participant WHERE participantid= ? ))";
			$cordovaSQLite.execute(db, query3, [participantId]).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						ses.login.loginid = res.rows.item(i).loginid;
						ses.login.salesRep = res.rows.item(i).name;
						ses.login.loginSession_id = res.rows.item(i).loginSession_id;
					}
					scope.ses = ses;
					callback(scope.ses);
				} else {
					console.log("No results found");
					scope.ses = new Session(new Login());
				}
			}, function (err) {
				console.error(err);
			});
		},
		getLatestSyncTime: function(callback, er){
			var query = "SELECT MAX(syncid) AS syncid, date FROM Sync";
			$cordovaSQLite.execute(db, query, [participantId]).then(function(res) {
				if(res.rows.length > 0) {
					var dateTime = "";
					for(var i=0; i < res.rows.length; i++){
						dateTime = res.rows.item(i).date;
					}
					callback(dateTime);
				} else {
					console.log("No results found");
					er("No results found");
				}
			}, function (err) {
				console.error(err);
			});
		},
		setLatestSyncTime: function(callback, er){
			var query = "INSERT INTO participant (date) VALUES (?)";
			$cordovaSQLite.execute(db, query, [new Date().toLocaleString()]).then(function(res) {
				id = res.insertId;
				callback(id);
			}, function (err) {
				console.error(err);
				er(err);
			});
		},
		setUploaded : function(id, callback){
			var query = "UPDATE participant SET isUploaded = 1 WHERE participantid = (?)";
			$cordovaSQLite.execute(db, query, [id]).then(function(res) {
				callback();
			}, function (err) {
				console.error(err);
				er(err);
			});
		},
		getParticipant: function(scope, id){
			var query = "SELECT * FROM participant WHERE participantid = (?)";
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
						part.checkNum = res.rows.item(i).checkNum;
					}
					scope.participant = part;
				} else {
					console.log("No results found");
					scope.participant = new Participant();
				}
			}, function (err) {
				console.error(err);
			});
			var ses = new Session(new Login());
			var query2 = "SELECT sessionid, datetime, locationName, sessionlocation_id FROM session WHERE sessionid = ((SELECT participantsession_id from participant WHERE participantid= ? ))";
			$cordovaSQLite.execute(db, query2, [id]).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						ses.sessionid = res.rows.item(i).sessionid;
						ses.dateTime = res.rows.item(i).datetime;
						ses.login.location = res.rows.item(i).locationName;
						ses.sessionlocation_id = res.rows.item(i).sessionlocation_id;
					}
					scope.ses = ses;
				} else {
					console.log("No results found");
					scope.ses = new Session(new Login());
				}
			}, function (err) {
				console.error(err);
			});
			
			var query3 = "SELECT loginid, name, loginSession_id FROM loginData WHERE loginSession_id = ((SELECT participantsession_id from participant WHERE participantid= ? ))";
			$cordovaSQLite.execute(db, query3, [id]).then(function(res) {
				if(res.rows.length > 0) {
					for(var i=0; i < res.rows.length; i++){
						ses.login.loginid = res.rows.item(i).loginid;
						ses.login.salesRep = res.rows.item(i).name;
						ses.login.loginSession_id = res.rows.item(i).loginSession_id;
					}
					scope.ses = ses;
				} else {
					console.log("No results found");
					scope.ses = new Session(new Login());
				}
			}, function (err) {
				console.error(err);
			});
			
			var query4 = "SELECT raffleticketid, raffleNumber, raffleTicketparticipant_id  FROM raffleTicket WHERE raffleTicketparticipant_id = ( ? )";
			$cordovaSQLite.execute(db, query4, [id]).then(function(res) {
				if(res.rows.length > 0) {
					var tickets = []
					for(var i=0; i < res.rows.length; i++){
						tickets.push(res.rows.item(i).raffleNumber)
					}
					scope.tickets = tickets;
					
				} else {
					console.log("No results found");
					scope.tickets = [];
				}
			}, function (err) {
				console.error(err);
			});
			
		}
	}
});
/* 
 * Restful Service Connections
 */
 
 //This looks like a mess (it is) but all of the service calls are nested within each other. They are called within there callbacks.
 //its KRAZY! If problems arise with data not being uploaded correctly to the website this might be the first place to check.
 ionicAppServices.factory('uploadToCloud', function(allParticipants, CloudConnectParticipants, CloudConnectTickets){
	 /* uses scope variables. probably not good practice. 
		 Also one value displays whats going on to the userAgent
		 that value is scope.syncTexts
		 */
	 var uploadAll = function(scope, callback){
			scope.numParticipants = '';
			 allParticipants.getAllParticpantsNotUploaded(function(participants){
				 scope.numParticipants = participants.length;
				 scope.syncTexts = "Found " + scope.numParticipants + " sales needing to be uploaded...";
				 angular.forEach(participants, function(participant){
					 allParticipants.getRaffleTickets(participant.id, function(tickets){
						  allParticipants.getSessionInformation(participant.id, function(session){
								console.log(participant);
							  participant.salesRep = session.login.salesRep;
							  participant.location = session.login.location;
							  var CloudConnect = new CloudConnectParticipants(participant);
							  CloudConnect.$save(function(data){
								  console.log("LOGING DATA")
								  var numTickets = tickets.length;
								  console.log(tickets);
								  
								  angular.forEach(tickets, function(tic){
									  tic.participantid = data.insertedId;
									  var CloudTickets = new CloudConnectTickets(tic);
									  CloudTickets.$save(function(data){
										  numTickets = numTickets -1;
										  console.log("Sent");
										  if(numTickets == 0){
												allParticipants.setUploaded(participant.id, function(){
													scope.numParticipants = scope.numParticipants - 1;
													
												});
										  }
									  });
								  });


							  }, function(err){
								  scope.syncTexts = "An error occured: Possible reason, no internet connectivity.";
								  console.error(err);
							  });
							  //
						  });
						  
					 });
				 });
			 },
			 function(){
				scope.syncTexts = "All participants are synced";
				console.log("No Participants found")
				callback();
			 });
			 scope.$watch('numParticipants', function(newValue, oldValue){
				if(newValue == 0){
					scope.syncTexts = "Done Uploading"
					callback();
				}
			 });
	 }
	 
	 
	 return	 uploadAll;
		 
});


//Used but not visible to user
ionicAppServices.factory('UploadCounter', function($cordovaSQLite){
	var counter = 0;
	var getCounter = function(){
		console.log(counter);
		return counter;
	}
	var counterSet = function(scope){
			var query = "SELECT count(participantid) FROM participant WHERE isUploaded = 0";
			$cordovaSQLite.execute(db, query, []).then(function(res) {
				if(res.rows.length > 0) {
					counter = res.rows.item(0)["count(participantid)"];
					console.log(counter);
					scope.count = counter;
				} else {
					console.log("No results found");
					scope.count = 0;
				}
			}, function (err) {
				console.error(err);
				scope.count = 0;
			});
		}
	
	return {
		getCounter: getCounter,
		counterSet: counterSet
	}
	
});

/*
 * Webservices connection objects
 */ 
ionicAppServices.factory("CloudConnectParticipants", function($resource){
	return $resource('http://www.derricksanddiamonds.org/api/index.php/participants');
});

ionicAppServices.factory("CloudConnectTickets", function($resource){
	return $resource('http://www.derricksanddiamonds.org/api/index.php/tickets');
});


