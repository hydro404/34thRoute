import { app, auth, db } from "./config.js";
import { createTransaction, getCartItems } from "./firestore-querries.js";

const items = sessionStorage.getItem("items_array");

if (items == "{}" || items == null || items == "") {
  window.location.href = "food-delivery-cart.html";
}

window.getDetails = function () {
  let name = $("#fd-name").val();
  let phone = $("#fd-phone").val();
  let email = $("#fd-email").val();
  let delivery_date = $("#fd-date-time").val();
  let rent_start_date = $("#fd-date-time-start").val();
  let rent_end_date = $("#fd-date-time-end").val();
  let line1 = $("#fd-line1").val();
  let line2 = $("#fd-line2").val();
  let city = $("#fd-city").val();
  let state = $("#fd-state").val();
  let postal_code = $("#fd-postal_code").val();
  let landmark = $("#fd-landmark").val();

  if (delivery_date == "") {
    document.getElementById("date_time").style.display = "block";
  }
  if (name != "" && phone != "" && email != "" && delivery_date != "" && line1 != "" && city != "" && state != "" && postal_code != "") {
    createSource(
      name,
      phone,
      email,
      line1,
      line2,
      state,
      postal_code,
      city,
      delivery_date,
      landmark,
      rent_start_date,
      rent_end_date
    );
  }

};

//createSource("BENNY","09455573813","benny@gmail.com","line","line2","state",4510,"tabacpo city")
let cartItems = await getCartItems();
let total_price = 0;

var product_obj = [];

var item_array = [];

if (cartItems.exists()) {
  console.log("Document data:", cartItems.data());

  sessionStorage.setItem("items_array", JSON.stringify(cartItems.data()));

  window.parsed = JSON.parse(sessionStorage.getItem("items_array"));

  for (let item of Object.entries(parsed)) {
    total_price += parseFloat(item[1].price * item[1].quantity);
    product_obj.push({
      [item[0]]: {
        price: item[1].price,
        quantity: item[1].quantity,
      },
    });
  }
  $("#subtotal").html("Php " + total_price);

  $("#total-deliver").html("Php " + (total_price + 20));
}

async function createSource(
  name,
  phone,
  email,
  line1,
  line2,
  state,
  postal_code,
  city,
  delivery_date,
  landmark,
  rent_start_date,
  rent_end_date
) {
  let dropoff_option = "at-door";
  if (document.getElementById("hand-to-me").checked) {
    dropoff_option = "hand-to-me";
  }
  var product_obj = [];
  let total_price = 0;
  let parsed = await getCartItems();
  console.log(parsed);
  Object.entries(parsed.data()).forEach((item, index) => {
    total_price += parseFloat(item[1].price * item[1].quantity);
    product_obj.push({
      [item[0]]: {
        price: item[1].price,
        quantity: item[1].quantity,
      },
    });
  });

  console.log(total_price);
  const userID = sessionStorage.getItem("userID");

  let amount = parseInt(total_price + "00");
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Basic c2tfdGVzdF9vVjVZcU11TDdXbVd2Y0d4RUxXYXZjRms6",
    },

    body: JSON.stringify({
      data: {
        attributes: {
          amount: amount,
          redirect: {
            success: `${window.location.origin}/dist/account-orders.html`,
            failed: `${window.location.origin}/dist/account-orders.html`,
          },
          billing: {
            address: {
              line1: line1,
              line2: line2,
              state: state,
              postal_code: postal_code,
              city: city,
              country: "PH",
            },
            name: name,
            phone: phone,
            email: email,
          },
          type: "gcash",
          currency: "PHP",
          metadata: {
            clientID: userID,
            delivery_date: delivery_date,
            landmark: landmark,
            dropoff_option: dropoff_option,
            rent_start_date: rent_start_date,
            rent_end_date: rent_end_date
          },
        },
      },
    }),
  };
  if (document.getElementById("cash").checked) {
    // hand payment
    // https://www.uuidtools.com/api/generate/v1
    const options1 = {
      method: "GET",
    };

    fetch("https://www.uuidtools.com/api/generate/v1", options1)
      .then((response) => response.json())
      .then(async (response) => {
        console.log(response[0]);
        await createTransaction(
          total_price,
          name,
          phone,
          email,
          line1,
          line2,
          state,
          postal_code,
          city,
          delivery_date,
          landmark,
          dropoff_option,
          response[0],
          Math.floor(new Date().getTime() / 1000),
          'cod',
          rent_start_date,
  rent_end_date
        );

        // console.log(response);
        window.location.href = "account-orders.html";
      })
      .catch((err) => console.error(err));
  } else {
    fetch("https://api.paymongo.com/v1/sources", options)
      .then((response) => response.json())
      .then(async (response) => {
        console.log(response);
        await createTransaction(
          total_price,
          name,
          phone,
          email,
          line1,
          line2,
          state,
          postal_code,
          city,
          delivery_date,
          landmark,
          dropoff_option,
          response.data.id,
          response.data.attributes.created_at,
          'pending',
          rent_start_date,
  rent_end_date
        );

        console.log(response);
        window.location.href = response.data.attributes.redirect.checkout_url;
      })
      .catch((err) => console.error(err));
  }
}
