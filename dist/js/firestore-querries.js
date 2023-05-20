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

export async function getCustomer() {
  const querySnapshot = await getDocs(collection(db, "customer"));
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
  const item_q = await doc(db, "products", item);

  const dat = await getDoc(item_q);
  console.log("tinaoay");
  let updated = JSON.parse(sessionStorage["items_array"]);
  if (parseInt(dat.data().available) < value) {
    alert("You cannot add more products more than available!");
    $("#quantity_" + item).value = parseInt(dat.data().available);
    window.location.reload();
  } else {
    const cart_reference = doc(db, cart_type, userID);
    
    updated[item].quantity = parseInt(value);
    //console.log(JSON.parse(sessionStorage["items_array"])[item]);
    updateDoc(cart_reference, {
      [`${item}.quantity`]: value,
    });
  }
  
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
  } catch (error) {}
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
  pay_status,
  rent_start_date,
  rent_end_date
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
    date,
    rent_start_date,
  rent_end_date
  };
  data["paid"] = pay_status;

  let source_data = { [sourceID]: data };
  

  try {
    await updateDoc(doc(db, "transactions", userID), source_data);
    await setDoc(doc(db, cart_type, userID), {});
  } catch (error) {
    console.log("failed");
  }
  
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
