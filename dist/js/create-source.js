import { app, auth, db } from "./config.js";
import { createTransaction, getCartItems } from "./firestore-querries.js";

window.getDetails = function (){
  let name = $("#fd-name").val();
  let phone = $("#fd-phone").val();
  let line1 = $("#fd-address").val();
  let state = $("#fd-city").val();
  createSource(name, phone, "benedick@gmail.com", line1, "line2", state, "4511", "tabaco city");
}

//createSource("BENNY","09455573813","benny@gmail.com","line","line2","state",4510,"tabacpo city")

async function createSource (
  name,
  phone,
  email,
  line1,
  line2,
  state,
  postal_code,
  city
) {
  var product_obj = [];
  let total_price = 0;
  let parsed = await getCartItems()
  console.log(parsed)
  Object.entries(parsed.data()).forEach((item, index) => {
      total_price += parseFloat(item[1].price * item[1].quantity);
      product_obj.push({
        [item[0]]: {
          price: item[1].price,
          quantity: item[1].quantity,
        },
      });
    });

  console.log(total_price)
  const userID = sessionStorage.getItem("userID");

  let amount = parseInt(total_price+"00");
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
            success: "https://paymongo-kasmagtech.web.app/account-orders.html",
            failed: "https://paymongo-kasmagtech.web.app/account-orders.html",
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
          },
        },
      },
    }),
  };

  fetch("https://api.paymongo.com/v1/sources", options)
    .then((response) => response.json())
    .then(async (response) => {
      console.log(response);
      await createTransaction(total_price,
        name,
        phone,
        email,
        line1,
        line2,
        state,
        postal_code,
        city,response.data.id,response.data.attributes.created_at
      );

      console.log(response);
      window.location.href = response.data.attributes.redirect.checkout_url;
    })
    .catch((err) => console.error(err));
};
