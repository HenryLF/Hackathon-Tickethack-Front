const BACK_URL = "http://localhost:3000";

const cartTMPL = document.getElementById("cart-tmpl").content;
const cartContainer = document.getElementById("cart");

window.addEventListener("load", getCartData);

async function getCartData() {
  try {
    let serverResponse = await fetch(BACK_URL + "/cart", {
      method: "GET", //just to be suuuuure
    });
    let jsonData = await serverResponse.json();
    jsonData.result && renderBookingContent(jsonData.data);
  } catch (error) {
    renderBookingContent(testData);
  }
}

function renderBookingContent(cartContent) {
  cartContainer.innerHTML = "";
  cartContent.forEach((trip) => {
    let tripDIV = cartTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    let time = new Date(trip.date.$date);
    tripDIV.querySelector("#time").textContent = `${time.getHours()}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    tripDIV.querySelector("#price").textContent = trip.price;
    tripDIV.querySelector("#delete").addEventListener("click", deleteHandle);

    //for now, and before using MongoDB _id for communication i'll "link" the cart data to the div
    //(i feel dirty)
    tripDIV.tripData = trip;
    //later maybe we'll do something like cartDIV.id = trip._id

    cartContainer.appendChild(tripDIV);
  });
}

async function deleteHandle() {
  try {
    let serverResponse = await fetch(BACK_URL + "/cart", {
      method: "DELETE",
      body: this.parentNode.tripData,
    });
    let jsonData = await serverResponse.json();
    jsonData.result && this.parentNode.remove();
  } catch (error) {
    this.parentNode.remove();
  }
}

document
  .getElementById("purchase-btn")
  .addEventListener("click", purchaseHandle);
async function purchaseHandle() {
  try {
    let serverResponse = await fetch(BACK_URL + "/trips/purchase", {
      method: "POST",
    });
    //En vrai la maintenant je me rend compte qu'on a pas forcement besoin d"envoyer des données au back.
    let jsonData = await serverResponse.json();
    jsonData.result && window.location.assign("./bookings");
  } catch (error) {
    window.location.assign("./bookings.html");
  }
}

const testData = [
  {
    departure: "Pau",
    arrival: "Majorque",
    date: { $date: "2025-03-11T09:53:52.428Z" },
    price: 99,
  },
  {
    departure: "Test",
    arrival: "Tset",
    date: { $date: "2025-03-11T09:57:45.677Z" },
    price: 146,
  },
  {
    departure: "Boud1",
    arrival: "0pom",
    date: { $date: "2025-03-11T10:19:36.198Z" },
    price: 91,
  },
  {
    departure: "TM",
    arrival: "LP",
    date: { $date: "2025-03-11T10:36:07.251Z" },
    price: 143,
  },
];
