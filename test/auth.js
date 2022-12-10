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

function SignIn() {
  const userEmail = "benedick.binlayo@gmail.com";
  const passWord = "password";
  //console.log(userEmail);
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
      alert("Error Sign In");
    });
}

SignIn();
