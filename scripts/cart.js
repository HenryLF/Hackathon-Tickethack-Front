const BACK_URL = "http://localhost:3000";

const cartTMPL = document.getElementById("cart-tmpl").content;
const cartContainer = document.getElementById("cart");

window.addEventListener("load", getCartData);

async function getCartData() {
  let serverResponse = await fetch(BACK_URL + "/trips/cart", {
    method: "GET", //just to be suuuuure
  });
  let jsonData = await serverResponse.json();
  console.log(jsonData);
  jsonData.result && renderBookingContent(jsonData.data);
}

function renderBookingContent(cartContent) {
  cartContainer.innerHTML = "";
  let totalPrice = 0;
  for (let trip of cartContent) {
    let tripDIV = cartTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    let time = new Date(trip.date);
    tripDIV.querySelector("#time").textContent = `${time.getHours()}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    tripDIV.querySelector("#price").textContent = trip.price;
    tripDIV
      .querySelector("#delete")
      .addEventListener("click", deleteHandle(trip._id));
    cartContainer.appendChild(tripDIV);
  
    totalPrice += trip.price
  }
  document.getElementById("cart-total").textContent = totalPrice
}

function deleteHandle(id) {
  return async function () {
    let serverResponse = await fetch(BACK_URL + `/trips/cart/${id}`, {
      method: "DELETE",
    });
    let jsonData = await serverResponse.json();
    console.log(jsonData);
    jsonData.result && this.parentNode.parentNode.remove();
  };
}

document
  .getElementById("purchase-btn")
  .addEventListener("click", purchaseHandle);
async function purchaseHandle() {
  let serverResponse = await fetch(BACK_URL + "/trips/purchase", {
    method: "POST",
  });
  let jsonData = await serverResponse.json();
  jsonData.result && window.location.assign("./bookings.html");
}
