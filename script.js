const firebaseConfig = {
	apiKey: "AIzaSyBRAQ5m5ixVOFGRpHyOGovApBUYk7tPowk",
	authDomain: "iwpproject-b4c68.firebaseapp.com",
	projectId: "iwpproject-b4c68",
	storageBucket: "iwpproject-b4c68.appspot.com",
	messagingSenderId: "646628849069",
	appId: "1:646628849069:web:807b400f9a6eed7f0fdd24"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const formSignUp = document.querySelector('.sign-up-container form');
const inputsSignUp = document.querySelectorAll('.sign-up-container input');
const formSignIn = document.querySelector('.sign-in-container form');
const inputsSignIn = document.querySelectorAll('.sign-in-container input');

formSignUp.addEventListener('submit', (e) => {
	e.preventDefault();
	console.log("input received");
	signUp();
});

formSignIn.addEventListener('submit', (e) => {
	e.preventDefault();
	console.log("input received");
	signIn();
});

function validateEmail (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
function validatePassword(password){
	if(password <6){
		return false;
	}
	else{
		return true;
	}
}
function validateName(name){
	if(!name){
		return false;
	}
	else{
		return true;
	}
}

function changeWindow(){
	window.location.href ='./main.html';
}

function writeUserData(name, email) {
	db.collection("Users").doc(email).set({
		name : name,
		email: email
	}).then(() => {
		console.log("data written");
		setTimeout(function(){
			//popup.classList.toggle("popupShow");
			window.location.href="./main.html";
		}, 800);
	})
}

function signUp(){
	console.log("signUp called");
	_name= document.getElementById('nameSU').value;
	email= document.getElementById('emailSU').value;
	password= document.getElementById('passwordSU').value;
	
	console.log(_name);
	//console.log(last_name);
	console.log(email);
	//console.log(password);
	
	
	if(validateEmail(email) == false || validatePassword(password) ==false){
		alert("Email or Password in wrong format");
		
		return;
	}
	
	if(validateName(_name) ==false ){
		alert("Name cannot be empty");
		return;
	}
	console.log("auth reached");
	firebase.auth().createUserWithEmailAndPassword(email, password)
	.then((userCredential) => { 
		const user = userCredential.user;
		console.log("auth done");
		writeUserData(_name, email);
	})
	.catch((error) => {
		const errorCode = error.code;
    	const errorMessage = error.message;
		console.log(errorCode);
		alert(errorMessage);
  });
}
function signIn(){
	console.log("signIn called");
	email= document.getElementById('emailSI').value;
	password= document.getElementById('passwordSI').value;

	console.log(email);
	console.log(password);
	
	
	if(validateEmail(email) == false || validatePassword(password) ==false){
		alert("Email or Password in wrong format");
		
		return;
	}

	console.log("auth reached");
	firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    //var user = userCredential.user;
	console.log("Log In success");
	//getUserData(email);
	window.location.href="./main.html";
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
	alert(errorMessage);
	console.log(errorCode);
  });
}