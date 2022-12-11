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
import {
  getProducts,
  checkAdmin,
  getTransactions,
  getAllTransactions,
} from "./firestore-querries.js";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = getStorage();

let admin_stat = await checkAdmin();
if (admin_stat.exists()) {
  // $("#admin-list-icon").show();
} else {
  window.location.href = "index.html";
}

document.getElementById("products_gallery").innerText = "";

const userID = sessionStorage["userID"];

async function displayTransactions(user_trans_id,trans_id, trans_items, trans_data,status) {
  let total_price = trans_data.price;
  let line1 = trans_data.line1;
  let line2 = trans_data.line2;
  let city = trans_data.city;
  let postal_code = trans_data.postal_code;
  let state = trans_data.state;

  let delivery_date = trans_data.delivery_date;
  let dropoff_option = trans_data.dropoff_option;
  let email = trans_data.email;
  let landmark = trans_data.landmark;
  let name = trans_data.name;
  let phone = trans_data.phone;
  
  let address = `${line1} ${line2} ${city},${state}, ${postal_code}`;
  let items_template = "";
  for (let item of Object.entries(trans_items)) {
    items_template += `
                <div class="mb-2"><span class="text-muted me-2">&nbsp&nbsp&nbsp&nbsp&nbsp${item[1].product_name}<br><span id="" value="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspQuantity: ${item[1].quantity}<br></span><span id="" value="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPrice: ${item[1].price}</span></div>`;
  }
  console.log(total_price);

  var template_html = `
  <div class="d-sm-flex justify-content-between align-items-center mt-3 mb-4 pb-3 border-bottom" id="${trans_id}">
        <div class="d-block d-sm-flex align-items-center text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="#">
        </a><div class="input-group"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="#">


          </a>

            <div class="pt-2">
              <div class="form-group">
                <div class="mb-2">Order ID: <span id="" value="">${trans_id}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Items:</span><span id="" value=""></span></div>
                ${items_template}
                <div class="mb-2"><span class="text-muted me-2">Receiver: </span><span id="" value="">${name}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Address:</span><span id="" value="">${address}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Phone:</span><span id="" value="">${phone}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Email:</span><span id="" value="">${email}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Delivery Date:</span><span id="" value="">${delivery_date}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Drop off option:</span><span id="" value="">${dropoff_option}</span></div>
                
                <div class="mb-2"><span class="text-muted me-2">Landmark:</span><span id="" value="">${landmark}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Delivery Status:</span><span id="" value="">${status}</span></div>
                <div class="mb-2"><span class="text-muted me-2">Price:</span><span id="" value="">${total_price}</span></div>
              </div>
              
            <button class="btn btn-primary" onclick="changeStatus('${user_trans_id}','${trans_id}','out-for-delivery')">OUT FOR DELIVERY</button>
            <button class="btn btn-success" onclick="changeStatus('${user_trans_id}','${trans_id}','delivered')">DELIVERED</button>
        </div>
    </div>
    </div></div>
  `;
  document
    .getElementById("products_gallery")
    .insertAdjacentHTML("beforeend", template_html);
}

const transactions = await getAllTransactions();

transactions.forEach(async (trans_doc) => {
  console.log("ID", trans_doc.id);
  let user_trans_id = trans_doc.id;

  // displayProduct(doc.id, doc.data());

  for (let transaction_data of Object.entries(trans_doc.data())) {
    // console.log(transaction_data[1]);

    if (
      transaction_data[1].paid == "paid" ||
      transaction_data[1].paid == "cod"
    ) {
      displayTransactions(
        user_trans_id,
        transaction_data[0],
        transaction_data[1].items,
        transaction_data[1].data,
        transaction_data[1].status
      );
    }
      
    // Object.entries(transaction_data[1]).forEach(tdd => {
    //   console.log(tdd)
    // })
  }
});

window.changeStatus = async function (user_id, trans_id, status) {
  const docRef = doc(db, "transactions", user_id);
  await updateDoc(docRef, { [trans_id + ".status"]: status }).then(()=>{
    alert(`Changed ${trans_id} status to ${status}`)

    window.location.reload()
  });
};
