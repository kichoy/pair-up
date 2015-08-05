$(document).ready(function () {
  
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
  
  function add (idSnapshot) {
    // when an item is added to the index, fetch the data
    var user = idSnapshot.val();
    
    // display user on list
    displayUser(user);
  }
  
  function getUsersByCohort (cohortNumber) {
    // not yet implemented or used
    // fetch users by cohort
    displayUser();
  }
  
  
  
  
  // ============================================
  // Models
  // ============================================
  function User (username, partner, cohort, photo) {
    this.username = username;
    this.partner = partner; // boolean
    this.cohort = cohort;
    this.photo = photo; // string link
  }
  
  User.prototype.update = function (username, partner, photo, cohort) {
    // update properties
    this.username = username;
    this.partner = partner;
    this.photo = photo;
    this.cohort = cohort;
    
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
        "img/ninja-icon-avatar.png"
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
  
  
  
  
  // ============================================
  // Views
  // ============================================
  function displayUsers (users) {
    
    // get the unordered list 
    var list = document.getElementById("user-list");
    
    for (var i = 0; i < users.length; i++) {
      // create li, div, p, and img
      
      var listItem = document.createElement("li");
      var userContainer = document.createElement("div");
      userContainer.className = "user-display-block";
      
      
      // username is <p> so needs text node 
      var username = document.createElement("p");
      username.appendChild(document.createTextNode(users[i].username));
    
      var img = document.createElement("img");
      img.src = users[i].photo;
      img.alt = users[i].username;
      
      // append img <li> and username <p> to container <div>
      userContainer.appendChild(img);
      userContainer.appendChild(username);
      
      // append to the list item <li>
      listItem.appendChild(userContainer);
    
      // append list item to the <ul>
      list.appendChild(listItem);
    }
  
  }
  
  function displayUser (user) {
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
    button.id = user.username;
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
  
  
  
  
  // ============================================
  // Load users
  // ============================================
  // displayUsers(cohortArray);
  
  
  
  
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
      "img/ninja-icon-avatar.png"
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
  		usernameDisplay.innerHTML = "Welcome, " + user.username;
  		githubLoginButton.style.display = "none";
  	});
  
  }

  // Check if user is new 
  function isNewUser (authData) {
    if (usersRef.child(authData.uid)) {
      return false;
    } else {
      return true;
    }
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
    alert("Request sent to: " + recipientId);
    
    // notification system
    
    // grab user
    var user2 = recipientId; 
    // create notification
    var request = new PairRequest(this.user, user2); 
    // send notification 
    notify(user, request);
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
  
  // User1 (user logged in) sends pair request to User2
  var User1 = {}; // this.user;
  User1.sendPairRequest(User2); // .sendPairRequest notifies User2
  
  // User2 accepts request, pair users
  User2.acceptRequest(request);
  
});





