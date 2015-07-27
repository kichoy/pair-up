// Animation
// =================
function changeText() {
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




// Initialize
// =================
var app = { model:{}, view:{}, controller:{} }; 




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

// cohort - list of users
var cohort1 = [];

// list of cohorts
var cohortList = [];
cohortList.push(cohort1);

// ### Use object instead of array? ###
// // List of students in a cohort
// function UserList (cohort, userList) {
//   this.cohort = cohort; // number
//   this.userList = userList; // array
// }

// UserList.prototype.update = function (userList) {
//   this.userList = userList;
// };


// Testing
// create user list (aka cohort)
function createTestData (amount) {
  for (var i = 0; i < amount; i++) {
    cohort1.push(new User(
      "User" + i,
      false,
      1,
      "https://icons.iconarchive.com/icons/seanau/user/128/Thief-icon.png"
    ));
  }
}

createTestData(15);




// View
// =================
app.view.displayUsers = function (users) {
  
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



