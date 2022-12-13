import { app, auth, db } from "./config.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = await getStorage();
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

import {
    getCustomer,
} from "./firestore-querries.js";


const customer = await getCustomer();

const userID = sessionStorage["userID"];
const email = sessionStorage["email"];

const nameInput = document.getElementById("fnameInput");
const name = document.getElementById("nameProfile");

const emailProfile = document.getElementById("emailProfile");
const phoneInput = document.getElementById("phoneInput");
const line1Input = document.getElementById("line1Input");
const line2Input = document.getElementById("line2Input");
const cityInput = document.getElementById("cityInput");
const stateInput = document.getElementById("stateInput");
const postalInput = document.getElementById("postalInput");
const landmark = document.getElementById("landmarkInput");

customer.forEach(async (doc) =>  {
  console.log(doc.id, " => ", doc.data());

  if(userID==doc.id){
    nameInput.value = doc.data().name;
    name.innerHTML = doc.data().name;
    emailProfile.innerHTML = email;
    phoneInput.value = doc.data().phone;
    line1Input.value = doc.data().line1;
    line2Input.value = doc.data().line2;
    cityInput.value = doc.data().city;
    stateInput.value = doc.data().state;
    postalInput.value = doc.data().postalcode;
    landmark.value = doc.data().landmark;
  }
});


window.updateDeets = async function updateDeets(id){
    const docRef = doc(db, "customer", id);
        await updateDoc(docRef, {
            name : nameInput.value,
            phone: phoneInput.value,
            line1 : line1Input.value,
            line2 : line2Input.value,
            city : cityInput.value,
            state : stateInput.value,
            postalcode : postalInput.value,
            landmark : landmark.value,
    });

    window.location.reload();
}