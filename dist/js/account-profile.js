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

  
customer.forEach(async (doc) =>  {
  console.log(doc.id, " => ", doc.data());

  if(userID==doc.id){
    document.getElementById("fnameInput").value = doc.data().name;
  }
});