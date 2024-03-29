import { app, auth, db } from "./config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getProducts, checkAdmin } from "./firestore-querries.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = getStorage();

let admin_stat = await checkAdmin();
if (admin_stat.exists()) {
  // $("#admin-list-icon").show();
} else {
  window.location.href = "index.html";
}

async function imageUrl(id_img){
  let retUrl = await getDownloadURL(ref(storage, 'product-images/'+id_img))
  .then((url) => {
    //const img = document.getElementById("img_"+id_img);
    //img.setAttribute('src', url);
    console.log(url)
    return url;
  })
  .catch((error) => {
    // Handle any errors
  });
  return retUrl
}


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


window.deleteAdmin = async function deleteAdmin(id){
    await deleteDoc(doc(db, "products", id));
    alert("Delete Item: "+id);
    document.getElementById(id).remove();
}

async function displayProduct(id, product_data) {
  let price = product_data.price;
  let name = product_data.product_name;
  let quantity = product_data.quantity;
  let available = product_data.available;
  let img = product_data.img;
  let description = product_data.description;
  let category = product_data.category;

  let details_obj = {
    price: price,
    name: name,
    quantity: quantity,
    available: available,
    img:img,
    description:description
  };
  let yuarel = await imageUrl(id)
  
  let template_html = `
    <script>
    (function() {
      await imageUrl("${id}")
   
   })();
                
                
              </script>
    <div class="d-sm-flex justify-content-between align-items-center mt-3 mb-4 pb-3 border-bottom" id="${id}">
        <div class="d-block d-sm-flex align-items-center text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="#">
        <div class="input-group">


          <div class="image-upload me-5 img">
            <label for="input-file_${id}">
              <img src="${yuarel}" id="img_${id}" onclick="" height="120" width="120"></a>
              
            </label>
            <!--<button id="upload-button" onchange='uploadFile("input-file_${id}")'; > Upload </button>-->
          </div>

            <div class="pt-2">

              <div class="form-group">
                <div class="mb-2">Product Name: <span id="name_${id}" value="${name}">${name}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Description:</span><span id="description_${id}" value="${description}">${description}</span></div>
              </div>
              <div class="form-group" style="display: flex !important;">
                <div class="mb-2 me-2">Price: <span value="${price}" id="Phprice_${id}">₱${price}</span></div>
                <div class="mb-2 me-2"><label class="" for="quantity1">Available:</label><span id="available_${id}" value="${available}" min="1">${available} </span</div>
              </div>
              <div class="form-group">
              <div class="mb-2">Category: <span id="category_${id}" value="${name}">${category}</span></div>
              </div>
            </div>
            <button class="btn btn-primary" onclick="deleteAdmin('${id}')">DELETE</button>
        </div>
    </div>
    `;

  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}



//upFilerz palan ang muya