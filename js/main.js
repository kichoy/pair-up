// fun mess around functionality to button
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