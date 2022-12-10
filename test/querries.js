import { app, auth, db } from "./config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteField,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

window.updateTransaction = function (userID, source, status) {
  updateDoc(doc(db, "transactions", userID), {
    [`${source}.paid`]: status,
  });
};
