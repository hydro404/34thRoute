import { app, auth, db } from "./config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getProducts } from "./firestore-querries.js";

document.getElementById("products_gallery").innerText = "";

window.addToCart = function (item) {
  console.log("WORKING");
};
const userID = sessionStorage["userID"];

const products = await getProducts();

products.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
  displayProduct(doc.id, doc.data());
});

async function getProduct(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
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
  let img = product_data.img;
  let description = product_data.description;

  let details_obj = {
    price: price,
    name: name,
    quantity: quantity,
    available: available,
    img:img,
    description:description
  };

  let template_html = `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter" id = "${id}">
    <div class="card product-card border pb-2">
    <a class="d-block" href="#quick-view" data-bs-toggle="modal" id="modal_${id}" onclick="updateModal(${price},'${name}',${quantity},${available},'${img}','${description}')">
    <img
          class="card-img-top" src="${img}" alt="Photo here"></a>
      <div class="card-body pt-1 pb-2">
        <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${name}</a></h3>
        <p class="fs-ms text-muted">${description}</p>
        <span class="text-accent">Only ${available} left in stock!</span>
        <div class="d-flex align-items-center justify-content-between">
          <div class="product-price"><span class="text-accent">₱ ${price}</span></div>
          <button class="btn btn-primary btn-sm" type="button" onclick="addtoCart(this.value)" value="${id}">+<i class="ci-cart fs-base ms-1"></i></button>
        </div>
      </div>
    </div>
  </div>`;

  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}

window.addtoCart = async function addtoCart(value) {
  //const washingtonRef = doc(db, "cart", userID);
  let cart_type = "cart";
  if (sessionStorage["isAnonymous"] == "true") {
    cart_type = "guests";
  }
  const docRef = doc(db, cart_type, userID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document datas:", Object.entries(docSnap.data()));
    let id_exist = Object.entries(docSnap.data()).find(
      data => data[0] == value
    );
    console.log(id_exist);
    if (id_exist) {
      console.log(true);
      //console.log(productID);
      updateDoc(docRef, {
        [`${value}.quantity`]: increment(1),
      });
    } else {
      let product_details = await getProduct(value);
      await updateDoc(docRef, {
        [value]: {
          product_name: product_details.product_name,
          quantity: product_details.quantity,
          price: product_details.price,
          img: product_details.img,
          description: product_details.description,
        },
      })
        .then(async (vars) => {})
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // ...
        });
    }
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  // let product_details = await getProduct(value);
  // await updateDoc(docRef, {
  //   [value]: {
  //     product_name: product_details.product_name,
  //     //quantity: product_details.quantity,
  //     price: product_details.price,
  //   },
  // })
  //   .then(async (vars) => {})
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     console.log(errorMessage);
  //     // ...
  //   });
};

window.updateModal = function (price, name, quantity, available, img, description) {
  let modal_template = `<div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">${name}</h4>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!-- Product gallery-->
          <div class="col-lg-7 col-md-6 pe-lg-0"><img src="${img}" alt="Pizza" style="padding: 20px; border-radius: 50px;"></div>
          <!-- Product details-->
          <div class="col-lg-5 col-md-6 pt-4 pt-lg-0">
            <div class="product-details pb-1">
              <div class="mb-3">
              <span class="h3 fw-normal text-accent me-1">₱ ${price}</span>
              </div>
              <form class="mb-grid-gutter">
                  <div class="col-6 px-2">
                  </div>
                </div>
                <div class="mb-3 d-flex align-items-center">
                  <select class="form-select me-3" style="width: 5rem;">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button class="btn btn-primary btn-shadow d-block w-100" type="submit"><i
                      class="ci-cart fs-lg me-2"></i>Add to Cart</button>
                </div>
              </form>
              <h5 class="h6 mb-3 pb-3 border-bottom"><i
                  class="ci-announcement text-muted fs-lg align-middle mt-n1 me-2"></i>Only ${available} left in stock!</h5>
              <h6 class="fs-sm mb-2">Ingredients:</h6>
              <p class="fs-sm">Salami, Olives, Bell pepper, Mushrooms, Mozzarella, Parmesan</p>
              <h6 class="fs-sm mb-2">Allergies</h6>
              <p class="fs-sm">Gluten, Dairy</p>
              <h6 class="fs-sm mb-2">Calories</h6>
              <p class="fs-sm mb-0">811</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("quick-view").innerHTML = modal_template;
};
