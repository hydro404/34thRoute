import { app, auth, db } from "./config.js";


import {
  getTransactions
} from "./firestore-querries.js";

import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

import {
  getCustomer,
} from "./firestore-querries.js";

const customer = await getCustomer();

const userID = sessionStorage["userID"];
const email = sessionStorage["email"];

const name = document.getElementById("nameProfile");

const emailProfile = document.getElementById("emailProfile");

customer.forEach(async (doc) =>  {
  console.log(doc.id, " => ", doc.data());

  if(userID==doc.id){
    name.innerHTML = doc.data().name;
    emailProfile.innerHTML = email;
  }
});


const storage = await getStorage();
async function imageUrl(id_img){
  console.log(id_img)
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
let trans_data = await getTransactions()
console.log(trans_data.data())



for(let transaction of Object.entries(trans_data.data())){
let modal_temp_str = ''

  for(let trans_item of Object.entries(transaction[1].items)){
    console.log(trans_item[0])
    
  }

    console.log(modal_temp_str);

    if(transaction[1].status=="" || transaction[1].status==null){
      transaction[1].status = "pending";
    }

    let unix_timestamp = transaction[1].data.date
    var unix_date = new Date(unix_timestamp * 1000);
    var year = unix_date.getFullYear();
    var date = unix_date.getDate();
    var month = unix_date.getMonth()+1;
    var date_string = month+"-"+date+"-"+year;
    let template_html = `<td class="py-3"><a class="nav-link-style fw-medium fs-sm" href="#order-details" data-bs-toggle="modal" onclick="updateModal('${transaction[0]}')">${transaction[0]}</a></td>
                    <td class="py-3">${date_string}</td>
                    <td class="py-3"><span class="badge bg-info m-0">${transaction[1].paid}</span></td>
                    <td class="py-3"><span class="badge bg-info m-0">${transaction[1].status}</span></td>
                    <td class="py-3">Php ${transaction[1].data.price}</td>`;

document
    .getElementById("orders_body")
    .insertAdjacentHTML("beforeend", template_html);
}

window.updateModal = async function (src_id) {
  
  document.getElementById("modal-title").innerText= "Order "+src_id;
  let modal_temp_str = ''
console.log(trans_data.data()[src_id].items)
  for(let trans_item of Object.entries(trans_data.data()[src_id].items)){
    let url_img = await imageUrl(trans_item[0])

    let subtotal = trans_item[1].price * trans_item[1].quantity;

    console.log(subtotal);
    let modal_template = `<div class="d-sm-flex justify-content-between mb-4 pb-3 pb-sm-2 border-bottom">
                <div class="d-sm-flex text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto" href="shop-single-v1.html" style="width: 10rem;"><img src="${url_img}" alt="Product"></a>
                  <div class="ps-sm-4 pt-2">
                    <h3 class="product-title fs-base mb-2"><a href="shop-single-v1.html">${trans_item[1].product_name}</a></h3>
                    <div class="fs-sm"><span class="text-muted me-2">Size:</span>8.5</div>
                    <div class="fs-sm"><span class="text-muted me-2">Color:</span>White &amp; Blue</div>
                    <div class="fs-lg text-accent pt-2">Php ${trans_item[1].price}</div>
                  </div>
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Quantity: ${trans_item[1].quantity}</div>
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Subtotal</div>Php ${subtotal}
                </div>
              </div>
              `;
      modal_temp_str += modal_template
    }
  
  document.getElementById("modal-body").innerHTML = modal_temp_str;
};


