import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  deleteField,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDazIb-84bUqX5ujsI5JM56Ri4TDbefOjY",
  authDomain: "paymongo-kasmagtech.firebaseapp.com",
  projectId: "paymongo-kasmagtech",
  storageBucket: "paymongo-kasmagtech.appspot.com",
  messagingSenderId: "629806634695",
  appId: "1:629806634695:web:9aec8da540ce0b2a5510e2",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

export {app,db,auth}