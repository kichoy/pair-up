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




// Models
// =================
function User (username, partner, cohort) {
  this.username = username;
  this.partner = partner; // boolean
  this.cohort = cohort;
}

User.prototype.hasPartner = function () {
  return (this.partner);
};

User.prototype.update = function (username, partner, cohort) {

  // update properties
  this.username = username;
  this.partner = partner;
  this.cohort = cohort;
  
  cohort1.push(this);
};

// cohort - list of users
var cohort1 = [];

// list of cohorts
var cohortList = [];
cohortList.push(cohort1);


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
      1
    ));
  }
}

createTestData(5);
