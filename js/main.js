function changeText() {
	var text = document.getElementById('slogan').innerHTML;
	if (text == "Who else needs a partner?") {
		document.getElementById('slogan').innerHTML = "Partner found: **** ******";
		document.getElementById('find-button').value = "New Partner";
	} else {
		document.getElementById('slogan').innerHTML = "Who else needs a partner?";
		document.getElementById('find-button').value = "I do!";
	}
}