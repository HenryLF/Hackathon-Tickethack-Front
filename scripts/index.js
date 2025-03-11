const BACK_URL = "http://localhost:3000";
const noTripFoundTMPL = document.getElementById("no-trip-tmpl").content;
const tripTMPL = document.getElementById("trip-tmpl").content;

const searchResultDIV = document.getElementById("search-results");

document.getElementById("search-btn").addEventListener("click", onSearchHandle);

async function onSearchHandle() {
  let trajectQuery = {
    departure: document.getElementById("departure").value,
    arrival: document.getElementById("arrival").value,
    date: document.getElementById("date").value,
  };
  for (key in trajectQuery) {
    trajectQuery[key]
      ? document.getElementById(key).classList.remove("invalid-input")
      : document.getElementById(key).classList.add("invalid-input");
  }

  try {
    let serverResponse = await fetch(BACK_URL + "/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trajectQuery),
    });
    let jsonData = await serverResponse.json();
    jsonData.result && renderSearchResult(jsonData.data);
  } catch (error) {
    renderSearchResult(testData);
  }
}

function renderSearchResult(searchResult) {
  searchResultDIV.innerHTML = "";
  if (searchResult.length == 0) {
    searchResultDIV.appendChild(noTripFoundTMPL.cloneNode(true));
    return;
  }
  searchResult.forEach((trip) => {
    let tripDIV = tripTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    tripDIV.querySelector("#price").textContent = trip.price;
    let time = new Date(trip.date.$date);
    tripDIV.querySelector("#time").textContent = `${time.getHours()}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    tripDIV
      .querySelector("#book-btn")
      .addEventListener("click", addToCartHandle);
    //for now, and before using MongoDB _id for communication i'll "link" the trip data to the div
    //(i feel dirty)
    tripDIV.tripData = trip;
    //later maybe we'll do something like tripDiv.id = trip._id
    searchResultDIV.appendChild(tripDIV);
  });
}

async function addToCartHandle() {
  let bookedTrip = this.parentNode.tripData;
  try {
    let serverResponse = await fetch(BACK_URL + "/trips/cart", {
      method: "POST",
      headers: {
        "Accept-Content": "application/json",
      },
      body: JSON.stringify(bookedTrip),
    });
    let jsonData = await serverResponse.json();
    console.log(jsonData);

    jsonData.result && window.location.assign("./views/cart.html");
  } catch (error) {
    window.location.assign("./views/cart.html");
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
