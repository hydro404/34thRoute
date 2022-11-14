import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import { app, auth, db } from "./config.js";

import { addDoc, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
//SIGNIN

//current user checker
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user.isAnonymous)
    if(user.isAnonymous){
      sessionStorage.setItem("isAnonymous","true");
    }
    else{
      sessionStorage.setItem("isAnonymous","false");
    }
    sessionStorage.setItem("userID",user.uid);
    //window.location.href = 'food-delivery-single.html'
    // ...
    console.log(uid)
  } else {
    CreateID();
    // User is signed out
    // ...
  }
});

var form = document.getElementById("signin-tab");
function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);

window.SignIn = function SignIn() {
  const userEmail = document.getElementById("si-email").value;
  const passWord = document.getElementById("si-password").value;
  //console.log(userEmail);
      signInWithEmailAndPassword(auth, userEmail, passWord)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          window.location.reload();
          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          //console.log(errorMessage);
          //console.log(errorCode);
          alert("Error Sign In");
        });
    
};

window.SignUp = function SignUp() {
  const userEmail = document.getElementById("su-email").value;
  const passWord = document.getElementById("su-password").value;
  //console.log(userEmail);
  if (userEmail !== "") {
    if (passWord !== "") {
      createUserWithEmailAndPassword(auth, userEmail, passWord)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    window.location.reload();
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error)
    alert("Error Sign Up");
    // ..
  });
    }
  }
};

window.CreateID = function CreateID() {
  signInAnonymously(auth)
  .then(async(vars) => {
    console.log(vars);
    console.log("VARS written with ID: ", vars.user.uid);

    const docRef = await setDoc(doc(db, "guests", vars.user.uid), {});
    sessionStorage.setItem("userID", vars.user.uid);
    //window.location.href = 'food-delivery-checkout.html'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    // ...
  });
};

window.SignGuest = async function SignGuest() {
  window.location = "food-delivery-checkout.html";
  //kukuruhanon na data
};

window.Checkout = async function Checkout() {
  if (sessionStorage['isLoggedIn'] == "true") {
    window.location = "food-delivery-checkout.html";
  }
};