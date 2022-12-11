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

// const cart_reference = doc(db, cart_type, userID);

export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot;
}

export async function getCartItems() {
  const cart_reference = doc(db, cart_type, userID);
  const docSnap = await getDoc(cart_reference);
  return docSnap;
}

export async function getAllTransactions() {
  const querySnapshot = await getDocs(collection(db, "transactions"));
  return querySnapshot;
}

export async function getTransactions() {
  const trans_reference = doc(db, "transactions", userID);
  const docSnap = await getDoc(trans_reference);
  return docSnap;
}

export async function updateQuantity(item, value) {
  const cart_reference = doc(db, cart_type, userID);
  let updated = JSON.parse(sessionStorage["items_array"]);
  updated[item].quantity = parseInt(value);
  console.log(JSON.parse(sessionStorage["items_array"])[item]);
  updateDoc(cart_reference, {
    [`${item}.quantity`]: value,
  });
  sessionStorage["items_array"] = JSON.stringify(updated);
}

export async function removeCartItem(item) {
  const cart_reference = doc(db, cart_type, userID);
  await updateDoc(cart_reference, {
    [item]: deleteField(),
  });
  //alert("Removed Item from Cart");
  //location.reload();
}

export async function transferGuestData() {

  try {
    let guest_cart_items = await getCartItems();

    console.log(guest_cart_items.data());
    sessionStorage["isAnonymous"] = "false";
    await setDoc(doc(db, "cart", userID), guest_cart_items.data());
  } catch (error) {
    
  }
  
}

export async function createTransaction(
  price,
  name,
  phone,
  email,
  line1,
  line2,
  state,
  postal_code,
  city,
  delivery_date,
  landmark,
  dropoff_option,
  sourceID,
  date,
  pay_status
) {
  let items_cart = await getCartItems();

  price = price + 20;
  let data = {};
  data["items"] = items_cart.data();
  data["data"] = {
    price,
    name,
    phone,
    email,
    line1,
    line2,
    state,
    postal_code,
    city,
    delivery_date,
    landmark,
    landmark,
    dropoff_option,
    date
  };
  data["paid"] = pay_status;
  
  let source_data = { [sourceID]: data };
  await setDoc(doc(db, cart_type, userID), {});
  await updateDoc(doc(db, "transactions", userID), source_data);
}

export async function checkAdmin() {
  
  try {
    const admin_ref = doc(db, "admins", userID);
    const docSnap = await getDoc(admin_ref);
    return docSnap;
  } catch (error) {
    return "error";
  }
}
