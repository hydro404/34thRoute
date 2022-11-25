window.createSource = function () {

    let amount = $('#').val();
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
          amount: 10000,
          redirect: {
            success:
              "https://paymongo-kasmagtech.web.app/food-delivery-single.html",
            failed:
              "https://paymongo-kasmagtech.web.app/food-delivery-cart.html",
          },
          billing: {
            address: {
              line1: "LINE1",
              line2: "LINE2",
              state: "Albay",
              postal_code: "4510",
              city: "Malilipot",
              country: "PH",
            },
            name: "CUSTOMER_NAME",
            phone: "09455574813",
            email: "benedick.binlayo@gmail.com",
          },
          type: "gcash",
          currency: "PHP",
          metadata:{
            clientID:"asdadsd"
          }
        },
      },
    }),
  };

  fetch("https://api.paymongo.com/v1/sources", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
};
