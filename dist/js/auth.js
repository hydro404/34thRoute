import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import { app, auth, db } from "./config.js";

import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
//SIGNIN

//current user checker
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(user)
    sessionStorage.setItem("userID",user.uid);
    window.location.href = 'food-delivery-single.html'
    // ...
    console.log(uid)
  } else {
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

window.SignGuest = async function SignGuest() {
  const docRef = await addDoc(collection(db, "guests"), {});
  console.log("Document written with ID: ", docRef.id);

  sessionStorage.setItem("userID",docRef.id);
  window.location.href = 'index.html'
};

window.Checkout = async function Checkout() {
  if (sessionStorage['isLoggedIn'] == "true") {
    window.location = "food-delivery-checkout.html";
  }
};

