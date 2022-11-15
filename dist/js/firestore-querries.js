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

const userID = sessionStorage["userID"];

let cart_type = "cart";
if (sessionStorage["isAnonymous"] == "true") {
  cart_type = "guests";
}

const cart_reference = doc(db, cart_type, userID);

export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot;
}

export async function getCartItems() {
  const docSnap = await getDoc(cart_reference);
  return docSnap;
}

export async function updateQuantity(item, value) {
  let updated = JSON.parse(sessionStorage["items_array"]);
  updated[item].quantity = parseInt(value);
  console.log(JSON.parse(sessionStorage["items_array"])[item]);
  updateDoc(cart_reference, {
    [`${item}.quantity`]: value,
  });
  sessionStorage["items_array"] = JSON.stringify(updated);
}

export async function removeCartItem(item) {
  await updateDoc(cart_reference, {
    [item]: deleteField(),
  });
  alert("Removed Item from Cart");
  //location.reload();
}


