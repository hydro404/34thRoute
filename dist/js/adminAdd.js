import { app, auth, db } from "./config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getProducts } from "./firestore-querries.js";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = getStorage();


window.addAvailable = async function addAvailable() {
    let available = document.getElementById("itemAvail").value;
    let nameProduct = document.getElementById("itemName").value;
    let descriptionProduct = document.getElementById("itemDesc").value;
    let priceProduct = document.getElementById("itemPrice").value;
    let category = document.getElementById("itemCat").value;
    //console.log(available);
    addAdmin(available, nameProduct, descriptionProduct, priceProduct, category);

  
};

async function addAdmin(
  value,
  nameProduct,
  descriptionProduct,
  priceProduct,
  itemCategory
) {
  const docCollect = collection(db, "products");
  let prod_id = await addDoc(docCollect, {
    available: parseInt(value),
    product_name: nameProduct,
    description: descriptionProduct,
    price: parseInt(priceProduct),
    category: itemCategory,
    quantity: 1,

  });
  imgLogB64("itemImage", prod_id.id);
}

window.toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

window.imgLogB64 = async function (idss, file_id) {
  const file = document.getElementById(idss).files[0];
  console.log(await toBase64(file));
  const baseSixFour = await toBase64(file);
  upFilerz(baseSixFour, file_id);
};

window.upFilerz = async function (base46, filename) {
  //ano ini ta dae nagagana AHHAHA

  const storageRef = ref(storage, "product-images/" + filename);
  // Create a reference to 'images/mountains.jpg'
  //const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
  uploadString(storageRef, base46, "data_url")
    .then((snapshot) => {
      console.log("Uploaded a data_url string!");
      alert("SAKSIS");
    })
    .catch((err) => {
      console.log(err);
    });
};

//upFilerz palan ang muya
