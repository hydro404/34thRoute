import { app, auth, db } from "./config.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = await getStorage();

import {
    getCustomer,
} from "./firestore-querries.js";

const customer = await getCustomer();

const userID = sessionStorage["userID"];
const email = sessionStorage["email"];

const nameInput = document.getElementById("fd-name");
const phoneInput = document.getElementById("fd-phone");
const emailProfile = document.getElementById("fd-email");

const line1Input = document.getElementById("fd-line1");
const line2Input = document.getElementById("fd-line2");
const cityInput = document.getElementById("fd-city");
const stateInput = document.getElementById("fd-state");
const postalInput = document.getElementById("fd-postal_code");
const landmark = document.getElementById("fd-landmark");


customer.forEach(async (doc) =>  {
    console.log(doc.id, " => ", doc.data());
  
    if(userID==doc.id){
      emailProfile.value = email;
      nameInput.value = doc.data().name;
      phoneInput.value = doc.data().phone;
      line1Input.value = doc.data().line1;
      line2Input.value = doc.data().line2;
      cityInput.value = doc.data().city;
      stateInput.value = doc.data().state;
      postalInput.value = doc.data().postalcode;
      landmark.value = doc.data().landmark;
    }
  }); 