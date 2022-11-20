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
import { getProducts} from "./firestore-querries.js";

document.getElementById("products_gallery").innerText = "";

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
  
  let template_html = 
    `<div class="d-sm-flex justify-content-between align-items-center mt-3 mb-4 pb-3 border-bottom" id="${id}">
        <div class="d-block d-sm-flex align-items-center text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="#"><img src="${img}" height="120" width="120"></a>
            <div class="pt-2">
                <h3 class="product-title fs-base mb-2"><a href="#">${name}</a></h3>
                <div class="fs-sm"><span class="text-muted me-2">Description:</span>${description}</div>
                <div class="fs-lg text-accent pt-2" id="Phprice_${id}" value="${price}">Php ${price}.<small>00</small></div>
            </div>
        </div>
        <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start" style="max-width: 9rem;">
            <label class="form-label" for="quantity1">Available</label>
            <input class="form-control" type="number" id="available_${id}" value="${available}" min="1">
        </div>
    </div>`;

  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}
