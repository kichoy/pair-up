$(document).ready(function () {
  
  
  // Firebase
  // =================
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
  
  function getCohort (cohortNumber) {
    // fetch users by cohort
  }
  
  
  // Animation
  // =================
  function changeText () {
    var sloganObj = document.getElementById('slogan');
    var findButton = document.getElementById('find-button');
    if (sloganObj.innerHTML == "Do you want us to pair you? (Random)") {
      sloganObj.innerHTML = "Partner found: **** ******";
      findButton.value = "New Partner";
    } else {
      sloganObj.innerHTML = "Do you want us to pair you? (Random)";
      findButton.value = "Yes, I'm looking for a partner!";
    }
  }
  
  
  
  
  // Models
  // =================
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
  usersRef.set({}); // clear db 
  
  // create user list (aka cohort)
  function createTestData (amount) {
    cohort1 = new Group (1, []); 
    
    for (var i = 0; i < amount; i++) {
      var user = new User (
        "User" + i,
        "",
        1,
        "https://icons.iconarchive.com/icons/seanau/user/128/Thief-icon.png"
      );
      cohort1.push(user.username);
      usersRef.child(user.username).set(user); // create user object
      console.log(user);
    }
    
    groupsRef.set({
      cohort1,
      cohort2: {
        cohortNumber: 2,
        members: ['jack', 'jill']
      }
    }); // sets group object with array of usernames
  }
  createTestData(5);
  
  
  
  
  // View
  // =================
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
  
  };
  
  function displayUser (user) {
    // get the unordered list 
    var list = document.getElementById("user-list");
    
    // create li, div, p, and img
    var listItem = document.createElement("li");
    var userContainer = document.createElement("div");
    userContainer.className = "user-display-block";
    
    
    // username is <p> so needs text node 
    var username = document.createElement("p");
    username.appendChild(document.createTextNode(user.username));
  
    var img = document.createElement("img");
    img.src = user.photo;
    img.alt = user.username;
    
    // append img <li> and username <p> to container <div>
    userContainer.appendChild(img);
    userContainer.appendChild(username);
    
    // append to the list item <li>
    listItem.appendChild(userContainer);
  
    // append list item to the <ul>
    list.appendChild(listItem);    
  }
  
  
  
  
  // Load users
  // =================
  // app.view.displayUsers(cohortArray);
  
});



