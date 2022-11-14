import { app, auth, db } from "./config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,setDoc
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

window.addToCart = function (item) {
  console.log("WORKING");
};
const userID = sessionStorage['userID'];
async function getProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    displayProduct(doc.id, doc.data());
  });
}

async function getProduct(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

function displayProduct(id, product_data) {
  let price = product_data.price;
  let name = product_data.product_name;
  let quantity = product_data.quantity;
  let available = product_data.available;

  let template_html = `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter" id = "${id}">
    <div class="card product-card border pb-2"><a class="d-block" href="#quick-view" data-bs-toggle="modal"><img
          class="card-img-top" src="img/food-delivery/restaurants/single/01.jpg" alt="Pizza"></a>
      <div class="card-body pt-1 pb-2">
        <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${name}</a></h3>
        <p class="fs-ms text-muted">Broccoli, Mushrooms, Bell pepper, Corn, Onion, Mozzarella, Parmesan</p>
        <div class="d-flex mb-1">
          <div class="form-check form-option form-check-justified mb-2">
            <input class="form-check-input" type="radio" name="size1" id="s1" checked>
            <label class="form-option-label" for="s1">Small</label>
          </div>
          <div class="form-check form-option form-check-justified mb-2">
            <input class="form-check-input" type="radio" name="size1" id="m1">
            <label class="form-option-label" for="m1">Medium</label>
          </div>
          <div class="form-check form-option form-check-justified mb-2">
            <input class="form-check-input" type="radio" name="size1" id="l1">
            <label class="form-option-label" for="l1">Large</label>
          </div>
        </div>
        <div class="d-flex mb-3">
          <div class="form-check form-option form-check-justified mb-2">
            <input class="form-check-input" type="radio" name="base1" id="standard1" checked>
            <label class="form-option-label" for="standard1">Standard</label>
          </div>
          <div class="form-check form-option form-check-justified mb-2">
            <input class="form-check-input" type="radio" name="base1" id="thin1">
            <label class="form-option-label" for="thin1">Thin</label>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
          <div class="product-price"><span class="text-accent">Php${price}</span></div>
          <button class="btn btn-primary btn-sm" type="button" onclick="addtoCart(this.value)" value="${id}">+<i class="ci-cart fs-base ms-1"></i></button>
        </div>
      </div>
    </div>
  </div>`;

  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}

getProducts();

window.addtoCart = async function addtoCart(value) {
  //const washingtonRef = doc(db, "cart", userID);
  let cart_type = 'cart';
  if(sessionStorage['isAnonymous'] == 'true'){
    cart_type = 'guests'
  }
  const docRef = doc(db, cart_type, userID);
  const docSnap = await getDoc(docRef);
  var bool = false;
  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  //   Object.entries(docSnap.data()).forEach(productID =>{
  //     //if(value===productID){
  //       console.log(productID)
  //       updateDoc(docRef, {
  //         [`${productID[0].quantity}`]: 13,
  //       });
  //     //}
  //   })

  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
    let product_detials = await getProduct(value)
  await updateDoc(docRef, {
    [value]: {
      product_name: product_detials.product_name,
      quantity: product_detials.quantity,
      price: product_detials.price,
    },
  })
    .then(async (vars) => {})
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
};
