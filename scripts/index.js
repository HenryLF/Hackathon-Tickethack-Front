const BACK_URL = "http://localhost:3000";
const noTripFoundTMPL = document.getElementById("no-trip-tmpl").content;
const tripTMPL = document.getElementById("trip-tmpl").content;

const searchResultDIV = document.getElementById("search-results");

document.getElementById("search-btn").addEventListener("click", onSearchHandle);

function onSearchHandle() {
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
  let searchResult = fetch(BACK_URL + "/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trajectQuery),
  }).then((r) => r.json());
  renderSearchResult(searchResult);
}

function renderSearchResult(arr) {
  searchResultDIV.innerHTML = "";
  if (arr.length == 0) {
    searchResultDIV.appendChild(noTripFoundTMPL.cloneNode(true));
    return;
  }
  arr.forEach((trip) => {
    let tripDIV = tripTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    tripDIV.querySelector("#price").textContent = trip.price;
    let time = new Date(trip.date.$date);
    tripDIV.querySelector(
      "#time"
    ).textContent = `${time.getHours()}:${time.getMinutes()}`;
    searchResultDIV.appendChild(tripDIV);
  });
}
