import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

//SIGNIN

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
      const auth = getAuth();

      signInWithEmailAndPassword(auth, userEmail, passWord)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          
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