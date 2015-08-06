$(document).ready(function () {
  
  // ============================================
  // Models
  // ============================================
  function User (username, partner, cohort, photo, requests) {
    this.username = username;
    this.partner = partner; // boolean
    this.cohort = cohort;
    this.photo = photo; // string link
    this.requests = requests; // array of requests
  }
  
  User.prototype.update = function (username, partner, photo, cohort, requests) {
    // update properties
    this.username = username;
    this.partner = partner;
    this.photo = photo;
    this.cohort = cohort;
    this.requests = requests;
    
    cohort.push(this);
  };

  function Group (cohortNumber, members) {
    this.cohortNumber = cohortNumber;
    this.members = members;
  }
  
  // Push username (not user) into group object
  // do not push entire user object bc that would be excessive and redundant 
  Group.prototype.push = function (username) {
    var membersArray = this.members;
    membersArray.push(username);
    this.members = membersArray;
  };
  
  // function Notification (user, type) {
  //   this.user = user;
  //   this.type = type; // type of notification (pair req, accepeted req, etc)
  // }
  
  // Notification.prototype.something = function () {
    
  // };
  
  
  
  function PairRequest (senderId, recipientId) {
    this.senderId = senderId;
    this.recipientId = recipientId;
  }
  
  
  

  // ============================================
  // Firebase 
  // ============================================
  var firebaseRef = new Firebase("https://pair-up.firebaseio.com/");
  var usersRef = firebaseRef.child("users");
  var groupsRef = firebaseRef.child("groups");
  
  // groupsRef.set({
  //   cohort1: {
  //     number: 1,
  //     members: {}
  //   },
  //   cohort2: {
  //     number: 2,
  //     members: {}
  //   }
  // });
  
  usersRef.on('child_added', add);
  
  function add (userSnapshot) {
    // when an item is added to the index, fetch the data
    var user = userSnapshot.val();
    var userKey = userSnapshot.key();
    // display user on list
    displayUser(user, userKey);
  }
  
  function getUsersByCohort (cohortNumber) {
    // not yet implemented or used
    // fetch users by cohort
    displayUser();
  }
  
  
  
  
  // ============================================
  // Show stuff
  // ============================================
  
  function displayUser (user, userKey) {
    // get the unordered list 
    var list = document.getElementById("user-list");
    
    // create li, div, p, button, and img
    var listItem = document.createElement("li");
    var userContainer = document.createElement("div");
    userContainer.className = "user-display-block";
    
    
    // username is <p> so needs text node 
    var username = document.createElement("p");
    username.appendChild(document.createTextNode(user.username));
    
    var img = document.createElement("img");
    img.src = user.photo;
    img.alt = user.username;
    
    var button = document.createElement("button");
    button.id = userKey; // ID is the users unique key
    button.className = "btn btn-default";
    button.innerHTML = "Request Partner";
    // click event - when clicked, send pair request to that user
    button.onclick = function() {
      sendPairRequest(this.id);
    };
    
    // append img <li>, username <p> and button to container <div>
    userContainer.appendChild(img);
    userContainer.appendChild(username);
    userContainer.appendChild(button);
    
    // append to the list item <li>
    listItem.appendChild(userContainer);
    
    // append list item to the <ul>
    list.appendChild(listItem);    
  }
  
  function displayPartnerRequest (partnerName) {
		// partner request display
		var container = document.getElementById("partner-requests");
		var listItem = document.createElement("div");
		listItem.className = "list-group";
		listItem.style.paddingTop = "20px";
		
		var linkContainer = document.createElement("a");
		linkContainer.href = "#";
		linkContainer.className = "list-group-item active";
		
		var requestHeader = document.createElement("h4");
		requestHeader.className = "list-group-item-heading";
		requestHeader.innerHTML = partnerName;
		
		var requestMessage = document.createElement("p");
		requestMessage.className = "list-group-item-text";
		requestMessage.innerHTML = "Wants to be your partner.<br>(Click to pair)";
		
		linkContainer.appendChild(requestHeader);
		linkContainer.appendChild(requestMessage);
		
		listItem.appendChild(linkContainer);
		
		container.appendChild(listItem);    
  }
  
  
  
  
  // ============================================
  // Login
  // ============================================

  var githubLoginButton = document.getElementById('github-login');
  githubLoginButton.onclick = function () {
    githubLogin();
  };
  
  var logoutButton = document.getElementById('logout');
  logoutButton.onclick = function () {
    firebaseRef.unauth();
  };  
  
  // Save user to db
  function saveUser (authData) {
    var user = new User (
      authData.github.username,
      "",
      1,
      "img/ninja-icon-avatar.png",
      {}
    );

    var singleUserRef = usersRef.child(authData.uid);
    singleUserRef.set(user);
  }
  
  // Callback to handle the result of the authentication
  function authHandler (error, authData) {
    if (error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        // fall-back to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        firebaseRef.authWithOAuthRedirect("github", function(error) {
          if (error) {
            console.log("Login Failed!", error);
          }
        });
      }
    } else if (authData) {
      // user authenticated with Firebase
      console.log("Authenticated successfully with payload:", authData);
      
      // if user is new, save user data
      if (isNewUser(authData)) {
        saveUser(authData);
      }
    }
  }
  
  // Github User OAuth login
  function githubLogin () {
    firebaseRef.authWithOAuthPopup("github", authHandler);
  }
  
  // Show info specific to user
  function showDash (authData) {
  	// Check the current user
  	var user = authData;
  	var userRef;
  
  	// If no current user
  	if (!user) {
  		window.location.href = '#/';
  		return;
  	}
  
  	// Load user info
  	userRef = usersRef.child(user.uid);
  	userRef.once('value', function (snap) {
  		var user = snap.val();
  		if (!user) {
  			return;
  		}
  		// show dash info in header/navbar
  		var githubLoginButton = document.getElementById('github-login');
  		var usernameDisplay = document.getElementById("username-display");
  		usernameDisplay.innerHTML = "Welcome, " + "<b>" + user.username + "</b>";
  		githubLoginButton.style.display = "none";
  		
  		// show requests
  		var requestsRef = userRef.child("requests");
  		// if there are any requests
  		if (requestsRef) {
  		  // iterate each request
  		  requestsRef.on("child_added", function (snapshot) {
  		    var request = snapshot.val();
  		    
  		    // grab senders username (not id)
  		    var senderRef = usersRef.child(request.senderId);
  		    var senderUsername;
  		    senderRef.once("value", function (data) {
  		      senderUsername = data.val().username;
  		    });
  		    
  		    displayPartnerRequest(senderUsername); // display the request
  		  });
  		}
  		
  	});
  
  }

  // Check if user is new 
  function isNewUser (authData) {
    var answer; // answer to question: is the user new? 
    var userRef = usersRef.child(authData.uid); // ref to user key in db
    userRef.once('value', function (snapshot) {
      // if (user is null), then yes, user is new
      answer = snapshot.val() === null? true : false;
    });
    return answer;
  }
  
  // Called whenever user state changes
  // Show user-dash if logged in, else remove user-dash info
  function authDataCallback (authData) {
    // if logged in, show dash
    if (authData) { 
      showDash(authData);
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
  		// remove info in header/navbar
  		var githubLoginButton = document.getElementById('github-login');
  		var usernameDisplay = document.getElementById("username-display");
  		usernameDisplay.innerHTML = null;
  		githubLoginButton.style.display = null;
  		
      console.log("User is logged out");
    }
  }
  

  // Called on landing and whenever auth state changes
  firebaseRef.onAuth(authDataCallback); // Whenever auth state changes, call
  
  
  // var authData = firebaseRef.getAuth();
  // if (authData) {
  //   showDash(authData);
  //   console.log("User " + authData.uid + " is logged in with " + authData.provider);
  // } else {
  //   console.log("User is logged out");
  // }

  
  
  
  
  
  
  
  // ============================================
  // Pairing-Request App
  // ============================================

  function sendPairRequest (recipientId) {
    // grab current user
    var currentUserAuthData = firebaseRef.getAuth();
    
    // if user exists
    if (currentUserAuthData) {
      console.log(currentUserAuthData.uid);
      
      // grab recipient user ref
      var recipientUserRef = usersRef.child(recipientId);
      // create pair request
      var request = new PairRequest(currentUserAuthData.uid, recipientId); 
      
      // send pair request - attatch to recipient
      recipientUserRef.child("requests").push(request);
      
      alert("Request sent to: " + recipientId);      
    }
  }
  
  function acceptRequest (requestId) {
    var user1 = requestId.user1;
    var user2 = requestId.user2;
    pair(user1, user2);
  }
  
  function pair (user1, user2) {
    user1.partner = user2;
    user2.partner = user1;
  }
  
  function notify (user, notification) {
    user.notify();
  }

  
  
  
  
  
  
  
  // ============================================
  // Testing
  // ============================================  
  // ### Testing ###
  var cohort1; // cohort - list of users
  // usersRef.set({}); // clear db 
  
  function createTestData (amount) {
    cohort1 = new Group (1, []); 
    
    // create multiple users and add them into a cohort Group
    for (var i = 0; i < amount; i++) {
      var user = new User (
        "User" + i,
        "",
        1,
        "img/ninja-icon-avatar.png",
        {}
      );
      cohort1.push(user.username); // push into cohort Group
      usersRef.child(user.username).set(user); // set user in db 
    }
    
    
    groupsRef.set({
      cohort1,
      cohort2: {
      cohortNumber: 2,
      members: ['jack', 'jill']
      }
    }); // set the groups in db
  }
  createTestData(9);  
  
});





