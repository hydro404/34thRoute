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
import {checkAdmin, getProducts} from "./firestore-querries.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference

let admin_stat = await checkAdmin();
if (admin_stat.exists()) {
  // $("#admin-list-icon").show();
}
else{
  window.location.href = "index.html";
}
const storage = getStorage();

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

window.updateAvailable =  async function updateAvailable() {
    products.forEach(async (doc) => {
        let id = doc.id;
        let available = document.getElementById(`available_${id}`).value;
        let nameProduct = document.getElementById(`name_${id}`).value;
        let descriptionProduct = document.getElementById(`description_${id}`).value;
        let priceProduct = document.getElementById(`Phprice_${id}`).value;
        let category = document.getElementById(`category_${id}`).value;
        //console.log(available);
        updateAdmin(id, available, nameProduct, descriptionProduct, priceProduct, category);
    });

    alert("ALL CHANGES ARE SAVED!");
}

async function updateAdmin(id, value, nameProduct, descriptionProduct, priceProduct, category){
    const docRef = doc(db, "products", id);
    updateDoc(docRef, {
        available: value,
        product_name: nameProduct,
        description: descriptionProduct,
        price: priceProduct,
        category: category,
    });
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
    description:description,
    category:category
  };
  let yuarel = await imageUrl(id)
  
  let template_html = 
    `
    <script>
    (function() {
      await imageUrl("${id}")
   
   })();
                
                
              </script>
    <div class="d-sm-flex justify-content-between align-items-center mt-3 mb-4 pb-3 border-bottom" id="${id}">
        <div class="d-block d-sm-flex align-items-center text-center text-sm-start">
        <a class="d-inline-block flex-shrink-0 mx-auto me-sm-4">
        <div class="input-group">
          <div class="image-upload me-5 img">
            <label for="input-file_${id}">
              <img src="./img/upload.png" style="position:absolute; bottom:0px;right:0px;" width="50" class="imgha" >
              <img src="${yuarel}" id="img_${id}" onclick="" height="120" width="120">
            </label>
        </a>
              
            
            
            <input id="input-file_${id}" type="file" onchange="document.getElementById('img_${id}').src = window.URL.createObjectURL(this.files[0]);" style="display: none;" accept="image/jpeg, image/png"/>
            <!--<button id="upload-button" onchange='uploadFile("input-file_${id}")'; > Upload </button>-->
            <button id="upload-button" onclick ='imgLogB64("input-file_${id}","${id}")'> Upload </button>
          </div>

            <div class="pt-2">
              <div class="form-group">
                <div class="mb-2 me-2">Product Name: <input type="text" class="prodRow" id="name_${id}"  value="${name}"></input></div>
                <div class="mb-2 me-2"><span class="text-muted me-2">Description:</span><input type="textarea" class="prodRow" id="description_${id}" value="${description}"></input></div>
              </div>
              <div class="form-group" style="display: flex !important;">
                <div class="mb-2 me-2">Price in ₱ <input type="text" class="prodRow" value="${price}" id="Phprice_${id}"></input></div>
                <div class="mb-2 me-2"><label class="" for="quantity1">Available</label><input class="form-control" type="number" id="available_${id}" value="${available}" min="1"> </div>
              </div>
              <div class="form-group">
                <div class="mb-2 me-2">Category: <input type="text" class="prodRow" id="category_${id}"  value="${category}"></input></div>
              </div>
            </div>
        </div>
    </div>
    `;

  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}
window.toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

window.imgLogB64 = async function (idss,file_id) {
  
   const file = document.getElementById(idss).files[0];
   console.log(await toBase64(file));
   const baseSixFour = await toBase64(file);
   upFilerz(baseSixFour,file_id);
}




window.upFilerz =  async function (base46,filename){ //ano ini ta dae nagagana AHHAHA
  
  const storageRef = ref(storage, 'product-images/'+filename);
  // Create a reference to 'images/mountains.jpg'
  //const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  uploadString(storageRef, base46,'data_url').then((snapshot) => {
  console.log('Uploaded a data_url string!');
  alert("SAKSIS")
}).catch(err=>{console.log(err)});

}  



//upFilerz palan ang muya