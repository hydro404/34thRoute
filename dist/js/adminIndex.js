import { app, auth, db } from "./config.js";

import { checkAdmin, getProducts } from "./firestore-querries.js";

let admin_stat = await checkAdmin();

try {
  if (admin_stat.exists()) {
    // $("#admin-list-icon").show();
  } else {
    window.location.href = "index.html";
  }
} catch (error) {
  window.location.href = "index.html";
}
