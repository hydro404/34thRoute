import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInAnonymously,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import { app, auth, db } from "./config.js";

import {
  addDoc,
  collection,
  setDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

//SIGNIN
//current user checker
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user.isAnonymous);
    if (user.isAnonymous) {
      sessionStorage.setItem("isAnonymous", "true");
        $("#account-icon").css("display", "block");
        // $("#account-orders").css("display", "block");
        // $("#account-orders").attr("href", "guest-orders.html");
    } else {
      sessionStorage.setItem("isAnonymous", "false");
      $("#account-icon").css("display", "none");
      $("#account-orders").css("display", "block");
    }
    sessionStorage.setItem("userID", user.uid);
    //window.location.href = 'food-delivery-single.html'
    // ...
    console.log(uid);
    $("#order-today").css("pointer-events", "auto");
  } else {
    CreateID();
    // User is signed out
    // ...
  }
});

import { transferGuestData } from "./firestore-querries.js";

try {
  var form = document.getElementById("signin-tab");
  function handleForm(event) {
    event.preventDefault();
  }
  form.addEventListener("submit", handleForm);
} catch (error) {
  
}


window.SignIn = function SignIn() {
  const userEmail = document.getElementById("si-email").value;
  const passWord = document.getElementById("si-password").value;
  //console.log(userEmail);
  signInWithEmailAndPassword(auth, userEmail, passWord)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.location.href = "food-delivery-single.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //console.log(errorMessage);
      //console.log(errorCode);
      alert("Error Sign In");
    });
};

window.deleteID = async function deleteID(userID) {
  await deleteDoc(doc(db, "guests", userID));
};

window.SignUp = async function SignUp() {
  const userEmail = document.getElementById("su-email").value;
  const passWord = document.getElementById("su-password").value;
  //console.log(userEmail);
  if (userEmail !== "") {
    if (passWord !== "") {
      const credential = EmailAuthProvider.credential(userEmail, passWord);
      //isAnonymous false = no modal sa checkout
      const auth = getAuth();
      linkWithCredential(auth.currentUser, credential)
        .then(async (usercred) => {
          const user = usercred.user;
          console.log("Anonymous account successfully upgraded", user);
          try {
            await transferGuestData();
          } catch (error) {
            const userID = sessionStorage["userID"];
            sessionStorage["isAnonymous"] = "false";
            await setDoc(doc(db, "cart", userID), {});
          }
          
          deleteID(user.uid);
          window.location.reload();
        })
        .catch((error) => {
          console.log("Error upgrading anonymous account", error);
        });
      //     createUserWithEmailAndPassword(auth, userEmail, passWord)
      // .then((userCredential) => {
      //   // Signed in
      //   const user = userCredential.user;
      //   console.log(user);
      //   window.location.reload();
      //   // ...
      // })
      // .catch((error) => {
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      //   console.log(error)
      //   alert("Error Sign Up");
      //   // ..
      // });
    }
  }
};



window.CreateID = function CreateID() {
  signInAnonymously(auth)
    .then(async (vars) => {
      console.log(vars);
      await setDoc(doc(db, "transactions", vars.user.uid), {});
      await setDoc(doc(db, "guests", vars.user.uid), {});
      console.log("VARS written with ID: ", vars.user.uid);
      
      sessionStorage.setItem("userID", vars.user.uid);
      $('#order-today').css('pointer-events',"auto");
      //window.location.href = 'food-delivery-checkout.html'
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
};

window.SignGuest = async function SignGuest() {
  window.location = "food-delivery-checkout.html";
  //kukuruhanon na data
};

window.Checkout = async function Checkout() {
  if (sessionStorage["isLoggedIn"] == "true") {
    window.location = "food-delivery-checkout.html";
  }
};

window.SignOut = async function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "index.html"
    })
    .catch((error) => {
      // An error happened.
    });
};
