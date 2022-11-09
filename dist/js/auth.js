import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

//SIGNIN
const auth = getAuth();

//current user checker
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
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
  if (userEmail !== "") {
    if (passWord !== "") {
      

      signInWithEmailAndPassword(auth, userEmail, passWord)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          sessionStorage.setItem("userID",user.uid);
          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          //console.log(errorMessage);
          //console.log(errorCode);
        });
    }
  }
};

/*createUserWithEmailAndPassword(auth, userEmail, passWord)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
    // ..
  });
*/