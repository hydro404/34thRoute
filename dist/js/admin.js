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
import {getProducts} from "./firestore-querries.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
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
        //console.log(available);
        updateAdmin(id, available, nameProduct, descriptionProduct, priceProduct);
    });

    alert("ALL CHANGES ARE SAVED!");
}

async function updateAdmin(id, value, nameProduct, descriptionProduct, priceProduct){
    const docRef = doc(db, "products", id);
    updateDoc(docRef, {
        available: value,
        product_name: nameProduct,
        description: descriptionProduct,
        price: priceProduct,
    });
}

async function displayProduct(id, product_data) {
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
  let yuarel = await imageUrl(id)
  
  let template_html = 
    `
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"></path>
              </svg>
              <img src="${yuarel}" id="img_${id}" onclick="" height="120" width="120"></a>
              
            </label>
            
            <input id="input-file_${id}" type="file" onchange="document.getElementById('img_${id}').src = window.URL.createObjectURL(this.files[0]);" style="display: none;" accept="image/jpeg, image/png"/>
            <!--<button id="upload-button" onchange='uploadFile("input-file_${id}")'; > Upload </button>-->
            <button id="upload-button" onclick ='imgLogB64("input-file_${id}","${id}")'> Upload </button>
          </div>

            <div class="pt-2">
              <div class="form-group">
                <span class=" mb-2">Product Name: <input type="text" class="prodRow" id="name_${id}"  value="${name}"></input></span>
                <div class="fs-sm"><span class="text-muted me-2">Description:</span><input type="textarea" class="prodRow" id="description_${id}" value="${description}"></input></div>
                <div class="fs-lg text-accent pt-2">Php <input type="text" class="prodRow" value="${price}" id="Phprice_${id}"></input></div>
              </div>
            </div>
        </div>
        <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start" style="max-width: 9rem;">
            <label class="form-label" for="quantity1">Available</label>
            <input class="form-control" type="number" id="available_${id}" value="${available}" min="1">
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