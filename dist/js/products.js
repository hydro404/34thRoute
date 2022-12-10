import { app, auth, db } from "./config.js";
import { ref , getStorage, uploadString,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
// Create a root reference
const storage = await getStorage();
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {
  checkAdmin,
  getCartItems,
  getProducts,
  removeCartItem,
} from "./firestore-querries.js";

/*

if (sessionStorage["isAnonymous"] == "true") {
  $("#account-orders").css("display", "none");
}
else{
  $("#account-icon").css("display", "none");
  $("#account-orders").css("display", "block");
}
*/
document.getElementById("products_gallery").innerText = "";

const userID = sessionStorage["userID"];
$("#admin-list-icon").hide();
let admin_stat = await checkAdmin();
if(admin_stat.exists()){
  $("#admin-list-icon").show();
}

const products = await getProducts();

window.refresh = async function refresh(searchCat){

  document.getElementById("products_gallery").innerText = "";
  
  products.forEach(async (doc) =>  {
  
    console.log(doc.id, " => ", doc.data());
    await displayProduct(doc.id, doc.data(), searchCat);
  });

  searchCat = "";
}

products.forEach(async (doc) =>  {
  
  console.log(doc.id, " => ", doc.data());
  await displayProduct(doc.id, doc.data(), "donuts");
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



async function imageUrls(id_img){
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

async function displayProduct(id, product_data, searchCategory) {
  let getUrl = await imageUrls(id)
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
    img: img,
    description: description,
  };

  if(searchCategory==category){

    let template_html = `<div class="col-lg-3 col-md-4 col-sm-6 mb-grid-gutter" id = "${id}">
      <div class="card product-card border pb-2">
      <a class="d-block" href="#quick-view" data-bs-toggle="modal" id="modal_${id}" onclick="updateModal('${id}',${price},'${name}',${quantity},${available},'${getUrl}','${description}')">
      <img
            class="card-img-top" src="${getUrl}" alt="Photo here"></a>
        <div class="card-body pt-1 pb-2">
          <h3 class="product-title fs-md"><a href="#quick-view" data-bs-toggle="modal">${name}</a></h3>
          <p class="fs-ms text-muted">${description}</p>
          <span class="text-accent">Only ${available} left in stock!</span>
          <div class="d-flex align-items-center justify-content-between">
            <div class="product-price"><span class="text-accent">₱ ${price}</span></div>
            <button class="btn btn-primary btn-sm" type="button" onclick="addtoCart(1,this.value)" value="${id}" id="${id}_btn">+<i class="ci-cart fs-base ms-1"></i></button>
          </div>
        </div>
      </div>
    </div>`;

    

    document
      .getElementById("products_gallery")
      .insertAdjacentHTML("beforeend", template_html);

    if(available==0){
        document.getElementById(`${id}_btn`).disabled = true;
        console.log(`${id}_btn`);
    }
  }
}



window.addtoCart = async function addtoCart(quant,value) {
  //const washingtonRef = doc(db, "cart", userID);

  let cart_type = "cart";
  if (sessionStorage["isAnonymous"] == "true") {
    cart_type = "guests";
  }
  const docRef = doc(db, cart_type, userID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document datas:", Object.entries(await docSnap.data()));
    let id_exist = Object.entries(await docSnap.data()).find(
      (data) => data[0] == value
    );
    console.log(id_exist);
    if (id_exist) {
      console.log(true);
      //console.log(productID);
      await updateDoc(docRef, {
        [`${value}.quantity`]: increment(parseInt(quant)),
      });
    } else {
      let product_details = await getProduct(value);
      await updateDoc(docRef, {
        [value]: {
          product_name: product_details.product_name,
          quantity: 1,
          price: product_details.price,
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
    await updateCartDropDown();
    updateTotal();
    
    $('#toggleCart').toggleClass('toggleCartz');
    
    setTimeout(function(){
      $('#toggleCart').toggleClass('toggleCartz');
    }, 2000);

    document.documentElement.scrollTop = 0;
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

window.updateModal = function (id,
  price,
  name,
  quantity,
  available,
  img,
  description
) {
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
                  <select class="form-select me-3" style="width: 5rem;" id="selectQuantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button class="btn btn-primary btn-shadow d-block w-100" onclick="addtoCart(document.getElementById('selectQuantity').value,this.value)" value="${id}"><i
                      class="ci-cart fs-lg me-2"></i>Add to Cart</button>
                </div>
              </form>
              <h5 class="h6 mb-3 pb-3 border-bottom"><i
                  class="ci-announcement text-muted fs-lg align-middle mt-n1 me-2"></i>Only ${available} left in stock!</h5>
              <h6 class="fs-sm mb-2">Description:</h6>
              <p class="fs-sm">${description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById("quick-view").innerHTML = modal_template;
};

window.remove = async function remove(item) {
  let parsed = JSON.parse(sessionStorage.getItem("items_array"));
    await removeCartItem(item);
    console.log(typeof item);
    document.getElementById(item).remove();
    delete parsed[item];
    sessionStorage.setItem("items_array", JSON.stringify(parsed));
    await updateCartDropDown();
    updateTotal();
  
};

window.updateTotal = function () {
  let amount = 0;
  let items_array = JSON.parse(sessionStorage["items_array"]);

  Object.entries(items_array).forEach((item) => {
    let item_total = parseFloat(item[1].price) * parseFloat(item[1].quantity);

    amount += item_total;
  });
  document.getElementById("dropdown_total_price").innerHTML = amount;
};

window.updateCartDropDown = async function () {
  let total_price = 0;
  var product_obj = [];

  var item_array = [];
  let cartItems = await getCartItems();

  if (cartItems.exists()) {
    console.log("Document data:", cartItems.data());

    sessionStorage.setItem("items_array", JSON.stringify(cartItems.data()));

    let parsed = JSON.parse(sessionStorage.getItem("items_array"));
    console.log(parsed);
    $("#total-items").html(Object.keys(parsed).length);
    console.log(Object.keys(parsed).length);

    if (Object.keys(parsed).length === 0) {
      var noItemsonCart = `<div class="container text-center py-5 my-2 my-md-3">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACcCAIAAAB3FTesAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDMxMDBDQzcwRTEyMTFFQTlDN0JDNTAzRUUyMzIxMDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDMxMDBDQzgwRTEyMTFFQTlDN0JDNTAzRUUyMzIxMDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMkIwRDVENDBFMEYxMUVBOUM3QkM1MDNFRTIzMjEwMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MzEwMENDNjBFMTIxMUVBOUM3QkM1MDNFRTIzMjEwMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk3kXrQAABTwSURBVHja7F1ne+LIskZCJCFyTgZjMx5PuOfsPV/u//927j07O8H2jLNJNjnneAuz6/WoWwKEJCRGNTx+5hEgNXpVVW9VV1cT8/lcp8n+CqndAg1gTTSANVGqUNotEFf6g2GvNxiORp1uT4fQG7PFZDGbrBaL2WwkSVIDWDXS7vSarU4bUO0NAOO5jo+6mk0LmO02q93OwF+SIKQbGKGx6G0EQK3Wm7V6E0AVdgajweB22r0ep8tp1wBWkJTKtUKp2mx3xDoh6HQo4A34PBSl1wDeKbSVejZf6PUHUpzcQFHRsD8aDmgA78bR3qfzImotjzYfHoQ9bqcGsHySyRXSuac1P6wnSXCuBgOl14O9hTtMzGaz0RhkMplO1zyJz+NKJWPPZ9AAllIAmMvrdKPVXkmXnA7GzoCABpoAXfQzAC+EUMC1gW8DQVtJzUxG49tUApi2BrCEZvn88hY0j/MO6giP2xHwuYEGExsGPIBxuVovlevTGZ9ap5IHQb9HA1h8qTVa5z9uud6F+DUU9IWDPrPJuM1VwGwXS9X8UxlMBddnErFwLBLQABZTqrXmxdUd17t+rzseC20J7WuZTqfg5nNPJa4PxKOhg2hQA1i0DMbXi2t8JGOgUocxUSguKuCeb+6y7W5PLD3GAwwHu70+MIKlU9kg9J4vPmwS77neiQAP+s8fF9h0o8thP0nFIVqVdAC3D7nHQhn71tvjhM/r2grgQqmayT0NR2OBXl1HuF2Ot6m4PMl0KeR/P50PRyP0eCjgPT6MyTOGp2Ll5j6Lfetf/3VK0+Y1z0Oi572+ywhG91mH59V64y6dVym6F5d3WHRjkaBs6C4fJlBW7FtnP27WPw+JMgtRxleu1NXo3WHY1TrmDkTDgUQsJPNgwBRjMQb1AyUUCLBOpJmryXTa7w/VhS7w2KvbNOZGe1yHB+GdDAkwPkpE0ePgRiFAFwIwWAYRCaG6AL65z80Qq0NbzG9TiR2OCuLsoA+T5bi8eRACsMfl+O3jidftXORRSf0il0qS8H+jwYB9/fkxHKvs9PoqQrc/GJYqNfT4h9Mjbo2fYb21ABnCibh5T+roAA24nwdcX3lmDDCMlT59cwjPMpgs4jlTDhhzJeHA0c5mM3gXHn/WDep21QQwlhUm4xGTER/y5Z9K2XwRIkmr1QIfc9gZgdCORhD41hotuMXBgBdrkEHevUl++vaDdfAhk/evCpk4Ixm4HkR7IPCXfAYYK/AWfAb03O2yoxqsFp4F2lBDuBVtNkdCfuznK9VFmDCeTCBkAE/09eK6Vm8Ku+6nr5eALvwfNApi3/vMI/aT8BihhhrYFoxEIMCbCvgqNs+aTCSaFRddco+YBOFxkjMoQrMQ55d3m2IM6H4+u4K7xH/mv81JIkIgHDj7WJQPYNQTd9XghkF1yoj3BT/FY3VJPea+bYTxAt1vlyx0l4aT6ytgJiMhH8pk+bVINIDBXFuR9Eq3pwINrtWa09mMdZA/rR8J+rDH18T4T93FzfxzOYU/w3FcIpqfaomZTWRoCxtgNfCsSo3txiA0gGiC5ysupz0eDQnDmEt3QdxOO/+DBXwIHVilKhvAVhrhWUoPhYEG1p85zmvxe1Zn8wGJKIe28WDMo7vw0Lx/e7TyuujMP5xzMBzJATAwPdaR8VjpPKvT7aO3e82pwMN4JMZR/ojFmEd3Ad0Pa6AL4nTY9MgsTqPZlgPgBc9CKsQUzrNa7S47M6DXr18DlTgIx2PctvqVbRgOR5y661gX3QVgJGm3sdlfu9ObITRCfIAXPAtR4o6y3XAPef5sjHWj0qqDSDARw2eqz3/cLvUY7j4aEf2tu6dHG40Zpffdbo+Lz4o8Zas6noXWNaLP6EqJRQI8elypNi5v0th6q4109+8RItEK+EEuSylyZYJVbTwLnfm2mE0CzgN6TOiIhywmD/X9+p6LigtAF8SMjBDCvE6np8NVXlJSazDwrD++XQIv2EHakiDms9n8ubo46He7kQBjOp2iZtNkNAi7GugxSRJrVjoI092XEcL9ZMXuXPX0IgNsoRc8i3Wxnc8bwgCq9cbJcYKVmodxTqdsbkJtUW8VCfnBf98+5Fag6xSO7jKlBZH69OfQiCsFJrIPJhf5LItOkZLJsheezBbTv3OUKm5zlXDQ9zaV4HpKwIwH/d5t0N10kOLXxQkgKfIImo/k8BrbuhKfx2U0cJqBjWoiuRM0up0BzCgVYKfDhsaUhE7k1fVAy//vj3Ou9A4YjLOLGzR3trkK7w5gK00rEV277fiQPZe+KGQg2bdqMplug+7nb5c8icM/Mf4rPhYm4FhQSsXVNEL8Am4ax7PA8TgdzDOllVPmenIBInhEbHKKohY1SaOfTTfPAqHV6HLkqrDxMXhiYW0bJuPJZDxdU6nFBxh4Fk1bWj+vkobY3OdxKU2tgaqAs2QhOhyOBesuFl3GSvd6g9mczQBAj9+fJN2801ZYAQvB0ldwNFyl8JIsPkDdsFjl1qILmjQQkDznQRfi3d8+nqSOYlx6XNvcH/cHbAdvNhkZjuBFJoAVW5+FVhqtWW+8Frp/5ZmXSxHxGG/uj9ERgvpa5QQY5VmKrc9iGBoxgMP1eyLxze/+nKs6iPDOH2+ix+jkIPwKI0cCThKAlzyLbfoUOesA5AuNlNYMY8AX8tRmoHNEh/EIJ8Zr6zE8Uujz57Ax8oVJOo58ljLr4A0UhSpxeY2C8vF48oVbd7lqM/gwXk+P0bHpFzPEVlkBfrbSqpk3RKucWp0ufywL8vXiGj8DuGp+l1+P0QIElhRKVfSKPJlLqQBmGATgvkIB9nkwBTo53nrjSrWBpRRrzhHxYMy1JvjFd6CLZfjjT+k0mEZtmjJ5FkRKNmQau1Cs8qS00EJM3Ya1GVz1XH3eW/SArHsAruNxO3YAMJ5nKbU+KxJm69NcN8fO3r+4PWG6+1qw9Vw8c3GgviiPCfg9/DNLUgG8zGexeVZXsVbahfYteypWBhzxUiwafL3cz+NyblpX9RI7HR/GXmvC0WGU68NXt5hF39Gwn/8SEjYTYazshKWS67MS0dA14v++Xz/89vEEY9VNxv/+x2mhWOn3h3a71e91C75uKOAFElCtN8fjqctp49Lgu3Qe5XRwXaPBsDOAcZGScuuzggFvOldg3cROt5fJF0DPsFaaf5nJ+kJRVMDH18iu2erkcf2zkvHIalMqpQarhmctJXV0gB5MZ594ysplkPFkgu22B4+dwUDtEmAV5bNe0k9u3Pwd3F/BDd23l6/n12gtislojK/XFEZCgFWUz3qRt6kEWr02m88/n12tTH1IIV/OrrA2793J4booSDo+XD5L0WXSer3+3UkSPT6ZTD6fXcoZ5k2nU3iqWh1MYisRC6PubzcAo/ks5XdmcTntWFa1LPDeptRmfQGt/fT1so1D1+NybNSuUmoNVhnPWgq4N2z+bz6fn1/epbNPkl69UKp++vJjMBxiLSLWwOwmTNJx1GcBz0Kn2RXojCeTab2Jmd6BwKnWaB0lots0YscKuPn7dB6bB10Sq3+8T23MhCS9Tfh8lkr6Z304PXI78WleiI+/nF9d32bEYtfwMIFh+P3zBRe6FrPpnx/fCNi/QfJ+0Whn3EXa9vRIpxK5us0Uy1WeD/i97lDAK1ibwZ6VKostmHjKMe2M9cPpsV4vRBsl39pOXfksVN4cHYD28Ew8ADzwAqfjdjlcDpuNoVfq2XM77kGj2a41ms3Wik164AE6OY4LHr/kAHPls5Tvhl8EWCtjtYAq85RMwy+CV+6xSFGU1WJe7D4JPtNoIP8qrAdDORqNh8PRYvfKfn/Nhs3g6cMcHX2UYqJn8/m///ONZX82bVuuBIHA9C6dRwsqJBKHjTk6jG6/kk9yDV7ms1i7hQHP8ulUBjAY3lTyAMInYEPY/INYYjQY4tFgUKS2v3JsL2u1sgHuqq3T8Is4HTZ4VaqN/FNJdJgBWuBrkZBvy93O5AYYWwevU7N4PU541ZvtUrlWrTWmHB1u1hfgyQG/x+91ib7RhSwaTKueZ2EFODO8xuNIrdFqNFvNVnej9tF6kmQYGoJGt8su3ap5OQBWbz5rHTEYqIDPDS/dc9FZp9tf1Kb3B/AQjyeT2ey57TZBAJykngReDXbYSptp2sLQlnUmdFUAMHa9oRp51jpBP6qLy4bphJT7uO8Y4OdfblZRfZbIz7cgtwoGIPdUGo/HdhsjeGdK+QBmVJ7PklkA3d+/fl9ueVos1xrNtuCNQWTanMxqVeW84a4knXt6vaFtuVpfuaRl1wDTZrRY/Nex0ptKvcEu8xPca0wmgMEPWel9i4YlEoi10Nn+lfXPOwZYh+ufpWkwVoolzPZNNqHTkfIBjOkH39V4FkbQGnfaYhbcQVNGDUb7lE40nsWWq9s0OvO/zdIYOQHG8CxNiV9LJl+AoAg9vs2GkpRsoweeRdMWVimoKvbdkUFGo/FD5rGI2zwxFglusAP7DgF+dsNsgFutzmzrqRg1E+Zxr9ev1VsQ6WKnpIA8b7lvscwAs3lWq9P996fzXxZgbIee17J9daKsAGMnxVb+yF9W3r1Jbj+NSMoLMIZnaYJBhSDenyT5m28oUYOX+SxJC5r2QBw2JpU8sFhMopyNknn0VqsGMJ8LW2zovsXkoAIAVuqODruSZSdgG2P1uOwCWgurA+BELGw2G381aPXPm6ebTEbBaUiFAozu+eOwM6Kv1NNkByx68djqSbTWrlpvakjsCcA6XHVHT5sY3ieAGbXtUKoBvC3PGo3HO+xTpAEsPsBoJangojJNFAcw8CxUiUXYDEwThQCse94pgXWkVm8qc1sWDWAhgnbRh8i4Um1oeOwJwA47g667SueeNDz2BGCQkJ9dZwREWrYGCRrAkks4hOktcnOX3WiJrSbKBdhAUeEAG+O5br7onjudacCoHmDdYueRMEmwB7DcTkzT430AmCTJN7gm673BoteqFhmLIsTOo8+rmzS2Hli32FbacxANmoxGDScVAwzy+eyqzVHHQxKE3+fxepwQWZE76oKgAbytzGYzwJi/n7rRYGCszw0CDQa9noTXXiW+5nOKotwuu+htlAiFJAhhGGffbxut9q+sbfD0fjg9tphNIp5TKVXKBEF8fHcs1k5EKhWIIK7vMvvDolFJxiMf3h79ypWX7XZXXJtKKe0Xupx2eBVK1cdCufvrlfIYDAZxO2oRSp6kg1C4Um00Wh3sDhV7Ke9PkuJWRxOqmIVdtggcDkeDwXC5AH46m81n+0OjIShY7GDo9zjtzH6yaE0kEm2tnwawJhrAmmgAa7IboZQ/xNlsNhiOxuMJ8EGSXPTUNpvUMb80nkxGI/gzhWEbDNRilx3Z50uUCzDcmnK1AaFwp9sbv+rjQegIk8lgY6xup93jdgrbD0w6gaewVm8tOgB3ehDUvayjhGFTBj1D0w4H4/O4ZHtGlRgmgbJm8oVCqbqyw5KBokIBbywSIJXR+iP3WHwsVFaWowDYfp/rIBqSAWbFAVyq1G8fchu13jEZjalkzIXbnV02abY6N3dZ0NkN6A9BHMYjW25spjKA7zOPoATCvnt4EImGdzMZ9Vgow0Mp7LsBnwdbt7SHAIMGPJUq25zhIBKMb9cXToBkH4sPmcdtzgAuWXDHftWESbnHEj+6YNBI+MfLQsFzl8o1OYddrtT50QV3C8NGi0d/Okm1fpfO7zOL7vb69xn8LwQaAkbMbl+U6yw5arc/AIdXLFWxe4Fe3qaBpspTpwc8/8fNA/62UovNlFwOG01blqFRrz9otbulSg3bQTn/VIKgwOmw7aeJ/v3Ld+zPTsTC4FaxWjudzrL5QhbnsO02RsBW6ALk28UNtsYIeFM8GuJqEZt/Kt+lMQ4bAuX/+dfHPTTR1VoDi+7HdymIf7hsMoS/iYPwaeoQfavV7siwnBzCXCy6wJiOElGeBsCRkO+fH96gGQ8IDp+KlT0EOJPHaOGH0+N1Zka9HmcqiaGg2XxR6mFjL5GMR8GhrPyujbHC4yvPsHcMcL8/RJu+hwJe19reKOj3oK6r3mhNJlPphj2dTmtI6yeALRJaN6i126xRpMJwOBqJbnt2DHCt0cSG/xudBEwi68hcN280JazAbbQ6cAlEfTcbNrgYtPduTewFOzsGGDwZ6whQz01bDtMWM1qI2ZZyNwh02MD2N23WB/QCImDWwU6nt1cAo92ThIUKqMMeSNmXCT25wy5k2A7kxw6Ho70CGM05GwV15jQiga+kPhgdtkngsNnfGk8n4gauOwYY/THC5kvRYErS+F6scxO4M+8VwHo9O14cC9I89FuSzhOjYe5Y0M4TqJmhFjuFk/sDMGrZhMUJrN2nBZt6waa1LdawDSIPe8cA0wj7rdQ27pY1Hk9aLfb9lXSBE6afag/44sb8qIy0BqNp814BjCY0gL/kHksbneQh+4hGpZLO/2Op/qaThsVyDa39EH2+YccAw++hKAq9U+s3YYGQFO2uBZGxuKtsEc9itDFWRB3r62dXwGff3GfZYBCkR+xtG3YMMAT7YWTnRVDHL2fXr/c45wyj+8Oz7zfo8Wg4IPXIY7jqkfMft+v0vp5Op1/Pr9GKs4DfLXpx2e4nG6K4KSPQ4E9ff/ArRLXW+OPbD3QzVuApAZ9b6mF73E6LiW0kZvP557NLUGVeYtWFn4adQJOiHEUR88HFcvXqFr+y3e91+33u1x1YprNZs9kGs8y108PH02MpZs6x3gHgxL7ldjqeZ0GYlzgQ7nOz3S2Va/BjsV9JxiNSNDhQSk3W96t7Hv4MSgk+FW4WUDBgqzxBZyToSyJzD9JJOvuUyRe4w2WKNpvgL9jkwXA4HI15uAg8l5I4QeUU3X05u9pyUzS30/7+7ZHMw768SZcqWxWCQUT328cTQppFD8oqm+UqgllHJK1N5Jfru2xBaD2ofTH5fyxd4b7iCt/v0vn8U2nTb8WjoYNocIfDFlYaHQp4jw9j0sYpCly60mx1MrnCmqoMZjkeC6OpJfkFiDEMm59Cv1ZceCJlWI2h3BYOECOBb4O/WG5iMhrh7kA4pLQ98bq9frFcq9Wb2I2CgC1CROD3uqTYh1JlAC+l0+01mh3W1mgMQ8NtUnI7rX5/CI8mqwGn1WqBxxFNgf3SAGuypWgr/DWANdEA1kSx8v8CDAB6hkJNXdK21wAAAABJRU5ErkJggg==" width="80" class="d-block mx-auto mb-4" alt="Empty cart">
	<p class="cart-empty woocommerce-info">Your cart is currently empty.</p>
	</div>`;
      item_array.push(noItemsonCart);
    } else {
      for(let item of Object.entries(parsed)){
        total_price += parseFloat(item[1].price * item[1].quantity);
        product_obj.push({
          [item[0]]: {
            price: item[1].price,
            quantity: item[1].quantity,
          },
        });

        console.log(total_price);

        let getUrl = await imageUrls(item[0])

        var appendItem = `<div class="widget-cart-item pb-2 border-bottom" id="${item[0]}">
                    <button class="btn-close text-danger" type="button" aria-label="Remove" onclick="remove('${item[0]}')"><span
                        aria-hidden="true">&times;</span></button>
                    <div class="d-flex align-items-center"><a class="d-block" href="#"><img
                          src="${getUrl}" width="64" alt="Pizza"></a>
                      <div class="ps-2">
                        <h6 class="widget-product-title"><a href="#">${item[1].product_name}</a></h6>
                        <div class="widget-product-meta"><span class="text-accent me-2">Php ${item[1].price}.<small>00</small></span><span
                            class="text-muted">x ${item[1].quantity}</span></div>
                      </div>
                    </div>
                  </div>`;
        item_array.push(appendItem);
      };
    }
    $("#dropdown-items-cart").html(item_array);

    $("#dropdown_total_price").html(total_price);
  } else {
    console.log("No such document!");
    var noItemsonCart = `<div class="container text-center py-5 my-2 my-md-3">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACcCAIAAAB3FTesAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDMxMDBDQzcwRTEyMTFFQTlDN0JDNTAzRUUyMzIxMDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDMxMDBDQzgwRTEyMTFFQTlDN0JDNTAzRUUyMzIxMDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMkIwRDVENDBFMEYxMUVBOUM3QkM1MDNFRTIzMjEwMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MzEwMENDNjBFMTIxMUVBOUM3QkM1MDNFRTIzMjEwMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk3kXrQAABTwSURBVHja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" width="80" class="d-block mx-auto mb-4" alt="Empty cart">
	<p class="cart-empty woocommerce-info">Your cart is currently empty.</p>
	</div>`;
    item_array.push(noItemsonCart);
    $("#dropdown-items-cart").html(item_array);
  }
};

updateCartDropDown();
